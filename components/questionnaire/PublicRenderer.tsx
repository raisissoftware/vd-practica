"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Star,
    Mail,
    User,
    Phone,
    Sparkles,
    TrendingUp,
    Loader2,
    AlertCircle,
    Building2,
    Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { evaluateQuestionnaireVisibility } from "@/lib/conditional-logic/evaluator";
import { RuleGroup, LogicOperator } from "@/lib/conditional-logic/types";
import { QuestionWrapper } from "./QuestionWrapper";

export interface QuestionData {
    id: string;
    type: "TEXT" | "TEXTAREA" | "NUMERIC" | "PHONE" | "DATE" | "RATING" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
    text: string;
    options: string[] | null;
    required: boolean;
    order: number;
    ruleGroups: RuleGroup[];
    ruleGroupsOperator?: LogicOperator;
}

export interface QuestionnaireData {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    questions: QuestionData[];
}

interface PublicRendererProps {
    data: QuestionnaireData;
    simulationMode?: boolean;
    simulationAnswers?: Record<string, any>;
    onSimulationStateChange?: (answers: Record<string, any>, visibility: Record<string, boolean>) => void;
    onResetTrigger?: number; // Increment this to trigger reset from parent
}

export default function PublicRenderer({
    data,
    simulationMode = false,
    simulationAnswers,
    onSimulationStateChange,
    onResetTrigger = 0,
}: PublicRendererProps) {
    const [step, setStep] = useState<"start" | number | "lead" | "result">("start");
    const [localAnswers, setLocalAnswers] = useState<Record<string, any>>({});
    const answers = simulationMode && simulationAnswers ? simulationAnswers : localAnswers;

    const setAnswers = (update: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => {
        if (simulationMode && onSimulationStateChange) {
            const next = typeof update === "function" ? update(answers) : update;
            const nextVisibility = evaluateQuestionnaireVisibility(questions, next);
            onSimulationStateChange(next, nextVisibility);
        } else {
            setLocalAnswers(update);
        }
    };

    const [sessionId, setSessionId] = useState<string>(null || "");
    const [leadName, setLeadName] = useState("");
    const [leadEmail, setLeadEmail] = useState("");
    const [leadPhone, setLeadPhone] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [report, setReport] = useState<{
        score: number;
        level: string;
        title: string;
        description: string;
        recommendations: string[];
    } | null>(null);

    const prevStepRef = useRef<typeof step>("start");

    // Generate Session ID on mount
    useEffect(() => {
        let id = sessionStorage.getItem(`session_${data.id}`);
        if (!id) {
            id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem(`session_${data.id}`, id);
        }
        setSessionId(id);
    }, [data.id]);

    const questions = data.questions;

    // Check for pre-filled answer from landing page teaser on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const prefilled = sessionStorage.getItem("prefilled_first_answer");
            if (prefilled && questions && questions.length > 0) {
                const firstQuestion = questions.find((q) => q.order === 1);
                if (firstQuestion) {
                    setLocalAnswers((prev) => {
                        const newAnswers = { ...prev, [firstQuestion.id]: prefilled };
                        // Evaluate next visible step index
                        const nextVisibility = evaluateQuestionnaireVisibility(questions, newAnswers);
                        const nextVisibleIndex = questions.findIndex((item, idx) => idx > 0 && nextVisibility[item.id] !== false);
                        if (nextVisibleIndex !== -1) {
                            setStep(nextVisibleIndex);
                        } else {
                            setStep("lead");
                        }
                        return newAnswers;
                    });
                }
                sessionStorage.removeItem("prefilled_first_answer");
            }
        }
    }, [questions]);

    // Evaluate dynamic visibility
    const visibility = evaluateQuestionnaireVisibility(questions, answers);
    const visibleQuestions = questions.filter((q) => visibility[q.id] !== false);

    // Handle resets from outer scope
    useEffect(() => {
        if (onResetTrigger > 0) {
            handleReset();
        }
    }, [onResetTrigger]);

    // Log shown / hidden / branch transition events on step changes
    useEffect(() => {
        if (!sessionId || simulationMode) return;

        const logAnalytics = async (eventType: string, payload: any) => {
            try {
                await fetch(`/api/questionnaires/${data.id}/analytics`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        eventType,
                        sessionId,
                        ...payload,
                    }),
                });
            } catch (err) {
                console.error("Failed to log analytics:", err);
            }
        };

        if (typeof step === "number") {
            const q = questions[step];

            // Determine if this step is showing because of a rule
            let triggeredRuleGroupId: string | undefined;
            if (q.ruleGroups && q.ruleGroups.length > 0) {
                // Find which group triggered it
                const activeGroup = q.ruleGroups.find((g) => {
                    const results = g.conditions.map((c) => {
                        const ans = answers[c.sourceQuestionId];
                        if (ans === undefined || ans === null || ans === "") return false;
                        // evaluateCondition inline comparison
                        return String(ans).toLowerCase().includes(String(c.value).toLowerCase());
                    });
                    return g.logicOperator === "AND" ? results.every(Boolean) : results.some(Boolean);
                });
                triggeredRuleGroupId = activeGroup?.id;
            }

            logAnalytics("QUESTION_SHOWN", {
                questionId: q.id,
                ruleGroupId: triggeredRuleGroupId,
            });

            // If transition from another question, log branch taken
            const prevStep = prevStepRef.current;
            if (typeof prevStep === "number" && prevStep !== step && triggeredRuleGroupId) {
                logAnalytics("BRANCH_TAKEN", {
                    questionId: q.id,
                    ruleGroupId: triggeredRuleGroupId,
                    metadata: { fromQuestionId: questions[prevStep].id },
                });
            }
        }

        // Update step ref
        prevStepRef.current = step;
    }, [step, sessionId, simulationMode, data.id, questions, answers]);

    // Track abandonment
    useEffect(() => {
        if (!sessionId || simulationMode) return;

        const handleBeforeUnload = () => {
            if (step !== "result" && step !== "start") {
                const totalVisible = visibleQuestions.length;
                const currentIdx = typeof step === "number" ? visibleQuestions.findIndex((q) => q.id === questions[step].id) : 0;
                const pct = totalVisible > 0 ? Math.round((currentIdx / totalVisible) * 100) : 0;
                const lastQId = typeof step === "number" ? questions[step].id : null;

                navigator.sendBeacon(
                    `/api/questionnaires/${data.id}/analytics`,
                    JSON.stringify({
                        eventType: "QUESTIONNAIRE_ABANDONED",
                        questionId: lastQId,
                        sessionId,
                        metadata: { completedPercent: pct },
                    })
                );
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [step, visibleQuestions, questions, sessionId, simulationMode, data.id]);

    const handleNext = () => {
        if (typeof step === "number") {
            // Validate current
            const q = questions[step];
            if (q.required) {
                const ans = answers[q.id];
                if (ans === undefined || ans === null || ans === "" || (Array.isArray(ans) && ans.length === 0)) {
                    setValidationError("Acest răspuns este obligatoriu pentru a continua.");
                    return;
                }
            }

            const nextVisibleIndex = questions.findIndex((item, idx) => idx > step && visibility[item.id] !== false);
            if (nextVisibleIndex === -1) {
                setStep("lead");
            } else {
                setStep(nextVisibleIndex);
            }
        }
    };

    const handleBack = () => {
        if (step === "lead") {
            // Go to last visible question
            const lastVisibleIdx = [...questions].map((q, idx) => ({ q, idx })).reverse().find((item) => visibility[item.q.id] !== false);
            setStep(lastVisibleIdx ? lastVisibleIdx.idx : "start");
        } else if (typeof step === "number") {
            const prevVisibleIdx = [...questions].map((q, idx) => ({ q, idx })).reverse().find((item) => item.idx < step && visibility[item.q.id] !== false);
            if (prevVisibleIdx) {
                setStep(prevVisibleIdx.idx);
            } else {
                setStep("start");
            }
        }
    };

    const handleSingleChoiceSelect = (questionId: string, option: string, index: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
        setValidationError(null);
    };

    const handleMultipleChoiceToggle = (questionId: string, option: string) => {
        const current = answers[questionId] || [];
        let next: string[];
        if (current.includes(option)) {
            next = current.filter((v: string) => v !== option);
        } else {
            next = [...current, option];
        }
        setAnswers((prev) => ({ ...prev, [questionId]: next }));
        setValidationError(null);
    };

    const handleSubmitLead = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!leadName.trim()) {
            setValidationError("Numele complet este obligatoriu.");
            return;
        }
        if (!leadEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail)) {
            setValidationError("Vă rugăm să introduceți o adresă de email validă.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/chestionar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: leadName,
                    email: leadEmail,
                    phone: leadPhone,
                    source: data.slug,
                    questionnaireId: data.id,
                    responses: answers,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "A apărut o eroare la salvare.");
            }

            const result = await response.json();
            setReport(result);
            setStep("result");
            toast.success("Datele tale au fost trimise cu succes!");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Eroare la procesarea chestionarului. Încearcă din nou.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setAnswers({});
        setLeadName("");
        setLeadEmail("");
        setLeadPhone("");
        setReport(null);
        setValidationError(null);
        setStep("start");
    };

    // Progress percentage
    const totalVisibleCount = visibleQuestions.length;
    const currentVisibleIndex = typeof step === "number" ? visibleQuestions.findIndex((q) => q.id === questions[step].id) : step === "lead" ? totalVisibleCount : 0;
    const progressPercent = totalVisibleCount > 0 ? Math.round((currentVisibleIndex / totalVisibleCount) * 100) : 0;

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
            {/* Background Premium Glows */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className={cn(
                    "absolute -left-10 top-1/4 h-[350px] w-[350px] rounded-full blur-[100px] transition-colors duration-500",
                    step === "start" ? "bg-blue-500/10 dark:bg-blue-500/5" : "bg-zinc-500/10 dark:bg-zinc-500/5"
                )} />
                <div className={cn(
                    "absolute -right-10 top-1/2 h-[400px] w-[400px] rounded-full blur-[120px] transition-colors duration-500",
                    step === "start" ? "bg-cyan-500/10 dark:bg-cyan-500/5" : "bg-slate-500/10 dark:bg-slate-500/5"
                )} />
            </div>

            {/* START STEP VIEW */}
            {step === "start" && (
                <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-border md:p-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                            Evaluare gratuită
                        </div>
                        <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-5xl bg-gradient-to-r from-foreground via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            {data.title}
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                            {data.description || "Află care este nivelul actual de digitalizare al companiei tale."}
                        </p>
                        <Button
                            onClick={() => {
                                const firstVisible = questions.findIndex((q) => visibility[q.id] !== false);
                                setStep(firstVisible !== -1 ? firstVisible : "lead");
                            }}
                            size="lg"
                            className="mt-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:opacity-95 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                            Începe Chestionarul
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )}

            {/* QUESTIONS FLOW VIEW */}
            {typeof step === "number" && (
                <div className="relative rounded-3xl border border-border/50 bg-background/50 p-6 shadow-2xl backdrop-blur-xl md:p-10 transition-all duration-500">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="rounded-full px-3 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Înapoi
                        </Button>
                        <div className="flex-1 max-w-[200px] text-right">
                            <span className="text-xs font-bold text-muted-foreground">
                                Progres: {progressPercent}%
                            </span>
                            <Progress value={progressPercent} className="h-1.5 mt-1 bg-muted" />
                        </div>
                    </div>

                    {validationError && (
                        <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-500 animate-in shake duration-300">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    <QuestionWrapper visible={true}>
                        <div className="min-h-[160px] flex flex-col justify-center">
                            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                                {questions[step].type === "TEXT" && "Răspuns Text Scurt"}
                                {questions[step].type === "TEXTAREA" && "Răspuns Text Lung"}
                                {questions[step].type === "NUMERIC" && "Răspuns Numeric"}
                                {questions[step].type === "PHONE" && "Număr de Telefon"}
                                {questions[step].type === "DATE" && "Dată calendaristică"}
                                {questions[step].type === "RATING" && "Evaluare pe Scară"}
                                {questions[step].type === "SINGLE_CHOICE" && "Selecție Unică"}
                                {questions[step].type === "MULTIPLE_CHOICE" && "Selecție Multiplă (Alege opțiuni)"}
                                {questions[step].required && <span className="ml-1 text-rose-500">*Obligatorie</span>}
                            </span>
                            <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight">
                                {questions[step].text}
                            </h2>
                        </div>

                        <div className="mt-8">
                            {/* SHORT TEXT / PHONE / NUMERIC / DATE OPTION */}
                            {["TEXT", "NUMERIC", "PHONE", "DATE"].includes(questions[step].type) && (
                                <Input
                                    type={questions[step].type === "NUMERIC" ? "number" : questions[step].type === "PHONE" ? "tel" : questions[step].type === "DATE" ? "date" : "text"}
                                    placeholder={questions[step].type === "DATE" ? "" : "Scrie răspunsul tău aici..."}
                                    value={answers[questions[step].id] || ""}
                                    onChange={(e) => {
                                        setAnswers((prev) => ({ ...prev, [questions[step].id]: e.target.value }));
                                        setValidationError(null);
                                    }}
                                    className="h-12 rounded-xl bg-card/25 border-input/60 focus:ring-zinc-500 focus-visible:ring-zinc-500 focus:border-zinc-500 transition-all text-base"
                                />
                            )}

                            {/* TEXTAREA OPTION */}
                            {questions[step].type === "TEXTAREA" && (
                                <Textarea
                                    placeholder="Scrie răspunsul tău detaliat aici..."
                                    value={answers[questions[step].id] || ""}
                                    onChange={(e) => {
                                        setAnswers((prev) => ({ ...prev, [questions[step].id]: e.target.value }));
                                        setValidationError(null);
                                    }}
                                    className="min-h-[120px] rounded-2xl bg-card/25 border-input/60 focus:ring-zinc-500 focus-visible:ring-zinc-500 focus:border-zinc-500 transition-all text-base"
                                />
                            )}

                            {/* RATING OPTION */}
                            {questions[step].type === "RATING" && (
                                <div className="flex justify-center gap-4 py-4">
                                    {[1, 2, 3, 4, 5].map((val) => {
                                        const currentRating = answers[questions[step].id];
                                        const isSelected = currentRating !== undefined && val <= currentRating;
                                        return (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => {
                                                    setAnswers((prev) => ({ ...prev, [questions[step].id]: val }));
                                                    setValidationError(null);
                                                }}
                                                className={cn(
                                                    "group relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300",
                                                    isSelected
                                                        ? "border-amber-400 bg-amber-400/10 text-amber-500 shadow-md scale-105"
                                                        : "border-border bg-card/20 text-muted-foreground hover:border-zinc-400/40 hover:text-zinc-500/80 hover:scale-105"
                                                )}
                                            >
                                                <Star className={cn("h-6 w-6 transition-all", isSelected ? "fill-amber-400 text-amber-400" : "text-muted-foreground/60 group-hover:text-zinc-500/80")} />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* SINGLE CHOICE */}
                            {questions[step].type === "SINGLE_CHOICE" && (questions[step].options?.length ?? 0) > 0 && (
                                <div className="grid gap-3">
                                    {questions[step].options!.map((opt) => {
                                        const isSelected = answers[questions[step].id] === opt;
                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => handleSingleChoiceSelect(questions[step].id, opt, step as number)}
                                                className={cn(
                                                    "flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition-all duration-200",
                                                    isSelected
                                                        ? "border-zinc-800 bg-zinc-900 text-zinc-50 dark:border-zinc-200 dark:bg-zinc-100 dark:text-zinc-900 shadow-md scale-[1.01]"
                                                        : "border-border bg-card/20 text-foreground hover:bg-card/40 hover:border-zinc-400/40"
                                                )}
                                            >
                                                <span>{opt}</span>
                                                <div className={cn("flex h-5 w-5 items-center justify-center rounded-full border transition-all", isSelected ? "border-zinc-50 bg-zinc-50 text-zinc-900 dark:border-zinc-900 dark:bg-zinc-900 dark:text-zinc-50" : "border-muted-foreground/40")}>
                                                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* MULTIPLE CHOICE */}
                            {questions[step].type === "MULTIPLE_CHOICE" && (questions[step].options?.length ?? 0) > 0 && (
                                <div className="grid gap-3">
                                    {questions[step].options!.map((opt) => {
                                        const isSelected = (answers[questions[step].id] || []).includes(opt);
                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => handleMultipleChoiceToggle(questions[step].id, opt)}
                                                className={cn(
                                                    "flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition-all duration-200",
                                                    isSelected
                                                        ? "border-zinc-800 bg-zinc-900 text-zinc-50 dark:border-zinc-200 dark:bg-zinc-100 dark:text-zinc-900 shadow-md scale-[1.01]"
                                                        : "border-border bg-card/20 text-foreground hover:bg-card/40 hover:border-zinc-400/40"
                                                )}
                                            >
                                                <span>{opt}</span>
                                                <div className={cn("flex h-5 w-5 items-center justify-center rounded-md border transition-all", isSelected ? "border-zinc-50 bg-zinc-50 text-zinc-900 dark:border-zinc-900 dark:bg-zinc-900 dark:text-zinc-50" : "border-muted-foreground/40")}>
                                                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end border-t border-border/40 pt-6 mt-8">
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="rounded-full px-6 font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-md"
                            >
                                {step === questions.length - 1 ? "Continuă spre contact" : "Înainte"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </QuestionWrapper>
                </div>
            )}

            {/* LEAD CAPTURE STEP VIEW */}
            {step === "lead" && (
                <div className="relative rounded-3xl border border-border/50 bg-background/50 p-6 shadow-2xl backdrop-blur-xl md:p-10 transition-all duration-500">
                    <div className="text-center max-w-md mx-auto mb-8">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-500/10 text-zinc-500 dark:bg-zinc-400/10 dark:text-zinc-400 mb-4">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                            Aproape gata!
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            Introdu datele tale de contact pentru a genera raportul tău personalizat de maturitate digitală și a-ți stoca răspunsurile.
                        </p>
                    </div>

                    {validationError && (
                        <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-500">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmitLead} className="space-y-5 max-w-md mx-auto">
                        <div className="space-y-1.5">
                            <label htmlFor="lead-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Nume Complet <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground/60" />
                                <Input
                                    id="lead-name"
                                    type="text"
                                    placeholder="ex: Andrei Popescu"
                                    className="h-11 pl-11 rounded-xl bg-card/20 border-input/60 focus:ring-zinc-500 focus-visible:ring-zinc-500 focus:border-zinc-500"
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="lead-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Adresă de Email <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground/60" />
                                <Input
                                    id="lead-email"
                                    type="email"
                                    placeholder="ex: andrei@companie.ro"
                                    className="h-11 pl-11 rounded-xl bg-card/20 border-input/60 focus:ring-zinc-500 focus-visible:ring-zinc-500 focus:border-zinc-500"
                                    value={leadEmail}
                                    onChange={(e) => setLeadEmail(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="lead-phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Număr de Telefon <span className="text-muted-foreground/75">(Opțional)</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground/60" />
                                <Input
                                    id="lead-phone"
                                    type="tel"
                                    placeholder="ex: 0712 345 678"
                                    className="h-11 pl-11 rounded-xl bg-card/20 border-input/60 focus:ring-zinc-500 focus-visible:ring-zinc-500 focus:border-zinc-500"
                                    value={leadPhone}
                                    onChange={(e) => setLeadPhone(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 border-t border-border/40 pt-6 mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                className="rounded-full px-6 font-semibold"
                                disabled={isSubmitting}
                            >
                                Înapoi
                            </Button>

                            <Button
                                type="submit"
                                className="flex-1 rounded-full h-11 font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-md"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Se calculează raportul...
                                    </>
                                ) : (
                                    <>
                                        Generează Raportul
                                        <Check className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* RESULTS / REPORT STEP VIEW */}
            {step === "result" && report && (
                <div className="relative rounded-3xl border border-border/50 bg-background/50 p-6 shadow-2xl backdrop-blur-xl md:p-10 transition-all duration-500">
                    <div className="flex flex-col items-center text-center">
                        {/* Score Gauge */}
                        <div className="relative flex h-36 w-36 items-center justify-center mb-6">
                            <svg className="absolute h-full w-full transform -rotate-90">
                                <circle cx="72" cy="72" r="64" className="stroke-muted fill-none" strokeWidth="8" />
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="64"
                                    className={cn(
                                        "stroke-current fill-none transition-all duration-1000 ease-out",
                                        report.score <= 35 && "text-rose-500",
                                        report.score > 35 && report.score <= 70 && "text-amber-500",
                                        report.score > 70 && "text-emerald-500"
                                    )}
                                    strokeWidth="10"
                                    strokeDasharray={2 * Math.PI * 64}
                                    strokeDashoffset={2 * Math.PI * 64 * (1 - report.score / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-extrabold tracking-tight text-foreground">{report.score}%</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Maturitate</span>
                            </div>
                        </div>

                        <div className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold shadow-sm border mb-4",
                            report.score <= 35 && "border-rose-500/20 bg-rose-500/10 text-rose-600",
                            report.score > 35 && report.score <= 70 && "border-amber-500/20 bg-amber-500/10 text-amber-600",
                            report.score > 70 && "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                        )}>
                            <TrendingUp className="h-3.5 w-3.5" />
                            {report.level}
                        </div>

                        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">{report.title}</h2>
                        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">{report.description}</p>

                        {/* Recommendations */}
                        <div className="mt-8 w-full border-t border-border/40 pt-8 text-left">
                            <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground mb-4">
                                <Sparkles className="h-5 w-5 text-zinc-500" />
                                Recomandări Personalizate pentru Compania Ta:
                            </h3>
                            <div className="grid gap-3">
                                {report.recommendations.map((rec, idx) => (
                                    <div key={idx} className="flex gap-4 items-start rounded-2xl border bg-card/20 p-4 transition-colors hover:bg-card/30">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-500/10 text-zinc-600 font-bold text-xs">
                                            {idx + 1}
                                        </div>
                                        <p className="text-sm leading-relaxed text-foreground/90">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Cards */}
                        <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
                            <div className="flex flex-col items-center rounded-2xl border bg-zinc-500/[0.02] border-zinc-500/20 p-6">
                                <Calendar className="h-6 w-6 text-zinc-500 mb-3" />
                                <h4 className="font-semibold text-foreground text-sm">Consultanță Gratuită</h4>
                                <p className="text-xs text-muted-foreground text-center mt-1">Stabilește o discuție de 15 min cu un specialist în digitalizare.</p>
                                <a href="/contact" className="mt-4 w-full flex justify-center">
                                    <Button size="sm" className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-50 font-semibold w-full">Programează Apel</Button>
                                </a>
                            </div>

                            <div className="flex flex-col items-center rounded-2xl border bg-zinc-500/[0.02] border-zinc-500/20 p-6">
                                <Building2 className="h-6 w-6 text-zinc-500 mb-3" />
                                <h4 className="font-semibold text-foreground text-sm">Servicii Personalizate</h4>
                                <p className="text-xs text-muted-foreground text-center mt-1">Explorează cum putem construi automatizări adaptate 100%.</p>
                                <a href="/servicii" className="mt-4 w-full flex justify-center">
                                    <Button size="sm" variant="outline" className="rounded-full font-semibold border-zinc-500/30 hover:bg-zinc-500/5 text-zinc-700 w-full">Vezi Servicii</Button>
                                </a>
                            </div>
                        </div>

                        <Button variant="link" onClick={handleReset} className="mt-8 text-xs text-muted-foreground hover:text-zinc-600 font-semibold">
                            Repornește Chestionarul (Testeză din nou)
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}