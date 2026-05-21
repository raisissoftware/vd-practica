"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  Rocket,
  Copy,
  Link2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Type,
  AlignLeft,
  CheckSquare,
  List,
  Star,
  ToggleLeft,
  Hash,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionType =
  | "TEXT"
  | "TEXTAREA"
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "DROPDOWN"
  | "RATING"
  | "YES_NO"
  | "NUMERIC"
  | "EMAIL"
  | "PHONE"
  | "DATE";

interface Validations {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  regex?: string;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[] | null;
  validations: Validations | null;
  required: boolean;
  order: number;
}

interface Questionnaire {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string;
  category: string | null;
  estimatedMinutes: number | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { leads: number };
  _questionCount?: number;
}

interface Props {
  initialData: Questionnaire[];
}

// ─── Question type config ─────────────────────────────────────────────────────

const QUESTION_TYPES: { value: QuestionType; label: string; icon: React.ElementType; hasOptions: boolean }[] = [
  { value: "TEXT", label: "Text scurt", icon: Type, hasOptions: false },
  { value: "TEXTAREA", label: "Text lung", icon: AlignLeft, hasOptions: false },
  { value: "SINGLE_CHOICE", label: "Alegere unică", icon: CheckSquare, hasOptions: true },
  { value: "MULTIPLE_CHOICE", label: "Alegere multiplă", icon: List, hasOptions: true },
  { value: "DROPDOWN", label: "Dropdown", icon: ChevronDown, hasOptions: true },
  { value: "RATING", label: "Rating (1-5)", icon: Star, hasOptions: false },
  { value: "YES_NO", label: "Da / Nu", icon: ToggleLeft, hasOptions: false },
  { value: "NUMERIC", label: "Numeric", icon: Hash, hasOptions: false },
  { value: "EMAIL", label: "Email", icon: Mail, hasOptions: false },
  { value: "PHONE", label: "Telefon", icon: Phone, hasOptions: false },
  { value: "DATE", label: "Dată", icon: Calendar, hasOptions: false },
];

function getTypeConfig(type: QuestionType) {
  return QUESTION_TYPES.find((t) => t.value === type) ?? QUESTION_TYPES[0];
}

// ─── Create/Edit Modal ────────────────────────────────────────────────────────

function QuestionnaireModal({
  questionnaire,
  onClose,
  onSaved,
}: {
  questionnaire?: Questionnaire | null;
  onClose: () => void;
  onSaved: (q: Questionnaire) => void;
}) {
  const [title, setTitle] = useState(questionnaire?.title ?? "");
  const [slug, setSlug] = useState(questionnaire?.slug ?? "");
  const [description, setDescription] = useState(questionnaire?.description ?? "");
  const [category, setCategory] = useState(questionnaire?.category ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    questionnaire?.estimatedMinutes?.toString() ?? ""
  );
  const [loading, setLoading] = useState(false);

  const autoSlug = (t: string) =>
    t.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!questionnaire) setSlug(autoSlug(v));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Titlul și slug-ul sunt obligatorii.");
      return;
    }
    setLoading(true);
    try {
      const method = questionnaire ? "PATCH" : "POST";
      const url = questionnaire
        ? `/api/admin/questionnaires/${questionnaire.id}`
        : "/api/admin/questionnaires";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          category: category.trim() || null,
          estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : null,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        toast.error(err || "Eroare la salvare.");
        return;
      }

      const saved = await res.json();
      toast.success(questionnaire ? "Chestionar actualizat!" : "Chestionar creat!");
      onSaved(saved);
      onClose();
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <X className="size-5" />
        </button>
        <h2 className="mb-5 text-[17px] font-bold text-slate-900">
          {questionnaire ? "Editează Chestionar" : "Chestionar Nou"}
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Titlu *</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Evaluare Maturitate Digitală"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Slug (URL) *</label>
            <input
              value={slug}
              onChange={(e) => setSlug(autoSlug(e.target.value))}
              placeholder="evaluare-maturitate-digitala"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Accesibil la: /chestionare/{slug || "..."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Categorie</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Digital Readiness"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Timp estimat (min)</label>
              <input
                type="number"
                min={1}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                placeholder="5"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Descriere <span className="font-normal normal-case">(opțional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Scurtă descriere..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-1 flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Se salvează..." : questionnaire ? "Salvează Modificările" : "Crează Chestionar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Question Editor Panel ─────────────────────────────────────────────────────

function QuestionEditor({
  question,
  onChange,
  onDelete,
}: {
  question: Question;
  onChange: (updated: Question) => void;
  onDelete: () => void;
}) {
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const typeConfig = getTypeConfig(question.type);

  const updateField = (field: keyof Question, value: any) => {
    onChange({ ...question, [field]: value });
  };

  const addOption = () => {
    const opts = question.options ?? [];
    onChange({ ...question, options: [...opts, `Opțiunea ${opts.length + 1}`] });
  };

  const updateOption = (idx: number, val: string) => {
    const opts = [...(question.options ?? [])];
    opts[idx] = val;
    onChange({ ...question, options: opts });
  };

  const removeOption = (idx: number) => {
    const opts = (question.options ?? []).filter((_, i) => i !== idx);
    onChange({ ...question, options: opts });
  };

  const moveOption = (idx: number, dir: -1 | 1) => {
    const opts = [...(question.options ?? [])];
    const swap = idx + dir;
    if (swap < 0 || swap >= opts.length) return;
    [opts[idx], opts[swap]] = [opts[swap], opts[idx]];
    onChange({ ...question, options: opts });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Type selector */}
      <div className="relative">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tip întrebare</label>
        <button
          onClick={() => setShowTypeMenu((v) => !v)}
          className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 hover:border-indigo-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            <typeConfig.icon className="size-4 text-indigo-500" />
            {typeConfig.label}
          </span>
          <ChevronDown className="size-4 text-slate-400" />
        </button>
        {showTypeMenu && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-xl border border-slate-100 bg-white shadow-xl">
            <div className="grid grid-cols-2 gap-0.5 p-2">
              {QUESTION_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => {
                      updateField("type", t.value);
                      if (!t.hasOptions) updateField("options", null);
                      else if (!question.options?.length)
                        onChange({ ...question, type: t.value, options: ["Opțiunea 1", "Opțiunea 2"] });
                      setShowTypeMenu(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors",
                      question.type === t.value
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Icon className="size-3.5 flex-shrink-0" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Question text */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Textul întrebării *</label>
        <textarea
          value={question.text}
          onChange={(e) => updateField("text", e.target.value)}
          rows={2}
          placeholder="Scrie întrebarea ta..."
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
        />
      </div>

      {/* Options (for choice types) */}
      {typeConfig.hasOptions && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Opțiuni de răspuns
          </label>
          <div className="flex flex-col gap-1.5">
            {(question.options ?? []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveOption(idx, -1)}
                    disabled={idx === 0}
                    className="p-0.5 text-slate-300 hover:text-slate-500 disabled:opacity-30"
                  >
                    <ChevronUp className="size-3" />
                  </button>
                  <button
                    onClick={() => moveOption(idx, 1)}
                    disabled={idx === (question.options?.length ?? 0) - 1}
                    className="p-0.5 text-slate-300 hover:text-slate-500 disabled:opacity-30"
                  >
                    <ChevronDown className="size-3" />
                  </button>
                </div>
                <input
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Opțiunea ${idx + 1}`}
                  className="flex-1 h-8 rounded-md border border-slate-200 px-2.5 text-xs text-slate-700 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-500/15"
                />
                <button
                  onClick={() => removeOption(idx)}
                  className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="mt-1 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <Plus className="size-3.5" /> Adaugă opțiune
            </button>
          </div>
        </div>
      )}

      {/* Validations */}
      <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Validări</p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => updateField("required", e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-700">Câmp obligatoriu</span>
          </label>
          {(question.type === "TEXT" || question.type === "TEXTAREA") && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[10px] text-slate-500">Lungime min.</label>
                <input
                  type="number"
                  min={0}
                  value={question.validations?.minLength ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...question,
                      validations: {
                        ...question.validations,
                        minLength: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="h-7 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-slate-500">Lungime max.</label>
                <input
                  type="number"
                  min={0}
                  value={question.validations?.maxLength ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...question,
                      validations: {
                        ...question.validations,
                        maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="h-7 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-indigo-300"
                />
              </div>
            </div>
          )}
          {question.type === "NUMERIC" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[10px] text-slate-500">Valoare min.</label>
                <input
                  type="number"
                  value={question.validations?.minValue ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...question,
                      validations: {
                        ...question.validations,
                        minValue: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="h-7 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-slate-500">Valoare max.</label>
                <input
                  type="number"
                  value={question.validations?.maxValue ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...question,
                      validations: {
                        ...question.validations,
                        maxValue: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="h-7 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-indigo-300"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
      >
        <Trash2 className="size-3.5" /> Șterge întrebarea
      </button>
    </div>
  );
}

// ─── Question Builder (full page view) ────────────────────────────────────────

function QuestionnaireBuilder({
  questionnaire,
  onBack,
}: {
  questionnaire: Questionnaire;
  onBack: () => void;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [addTypeMenuOpen, setAddTypeMenuOpen] = useState(false);

  const counterRef = useRef(0);
  const newId = () => `new_${Date.now()}_${counterRef.current++}`;

  // Load questions on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/questionnaires/${questionnaire.id}/questions`);
        if (!cancelled && res.ok) {
          const data = await res.json();
          setQuestions(data);
          if (data.length > 0) setSelectedIdx(0);
        }
      } catch {
        if (!cancelled) toast.error("Eroare la încărcarea întrebărilor.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [questionnaire.id]);

  const addQuestion = (type: QuestionType) => {
    const typeConf = getTypeConfig(type);
    const newQ: Question = {
      id: newId(),
      type,
      text: "",
      options: typeConf.hasOptions ? ["Opțiunea 1", "Opțiunea 2"] : null,
      validations: null,
      required: false,
      order: questions.length,
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    setSelectedIdx(updated.length - 1);
    setDirty(true);
    setAddTypeMenuOpen(false);
  };

  const updateQuestion = useCallback((idx: number, updated: Question) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[idx] = updated;
      return next;
    });
    setDirty(true);
  }, []);

  const deleteQuestion = (idx: number) => {
    setQuestions((prev) => {
      const next = prev.filter((_, i) => i !== idx).map((q, i) => ({ ...q, order: i }));
      return next;
    });
    setSelectedIdx((prev) => {
      if (prev === null) return null;
      if (prev >= idx) return Math.max(0, prev - 1);
      return prev;
    });
    setDirty(true);
  };

  const moveQuestion = (from: number, to: number) => {
    if (to < 0 || to >= questions.length) return;
    const updated = [...questions];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    const reordered = updated.map((q, i) => ({ ...q, order: i }));
    setQuestions(reordered);
    setSelectedIdx(to);
    setDirty(true);
  };

  const handleSave = async () => {
    // Validate
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        toast.error(`Întrebarea #${i + 1} nu are text.`);
        setSelectedIdx(i);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/questionnaires/${questionnaire.id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });

      if (!res.ok) {
        toast.error("Eroare la salvare.");
        return;
      }

      const saved = await res.json();
      setQuestions(saved.map((q: any) => ({
        ...q,
        options: q.options ?? null,
        validations: q.validations ?? null,
      })));
      setDirty(false);
      toast.success("Întrebările au fost salvate!");
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="size-4" /> Înapoi
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <h1 className="text-[15px] font-bold text-slate-900">{questionnaire.title}</h1>
            <p className="text-[11px] text-slate-400">
              {questions.length} {questions.length === 1 ? "întrebare" : "întrebări"}
              {dirty && <span className="ml-2 text-amber-500">● Nesalvat</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/chestionare/${questionnaire.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Eye className="size-3.5" /> Previzualizare
          </a>
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            {saving ? "Se salvează..." : "Salvează"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Questions list */}
        <div className="flex w-[280px] flex-shrink-0 flex-col border-r border-slate-100 bg-slate-50">
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-200" />
                ))}
              </div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <div className="text-3xl">📝</div>
                <p className="text-[12px] font-medium text-slate-500">Nicio întrebare încă</p>
                <p className="text-[11px] text-slate-400">Adaugă prima întrebare mai jos</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {questions.map((q, idx) => {
                  const typeConf = getTypeConfig(q.type);
                  const Icon = typeConf.icon;
                  return (
                    <div
                      key={q.id}
                      onClick={() => setSelectedIdx(idx)}
                      draggable
                      onDragStart={() => setDragIdx(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIdx !== null && dragIdx !== idx) {
                          moveQuestion(dragIdx, idx);
                        }
                        setDragIdx(null);
                      }}
                      className={cn(
                        "group flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-all",
                        selectedIdx === idx
                          ? "border-indigo-200 bg-white shadow-sm"
                          : "border-transparent hover:border-slate-200 hover:bg-white"
                      )}
                    >
                      <GripVertical className="mt-0.5 size-3.5 flex-shrink-0 text-slate-300 cursor-grab" />
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-indigo-50">
                        <Icon className="size-3 text-indigo-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          "line-clamp-2 text-[12px] leading-tight",
                          q.text ? "font-medium text-slate-700" : "text-slate-400 italic"
                        )}>
                          {q.text || "Întrebare fără text..."}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          #{idx + 1} · {typeConf.label}
                          {q.required && " · *obligatoriu"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveQuestion(idx, idx - 1); }}
                          disabled={idx === 0}
                          className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                        >
                          <ChevronUp className="size-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveQuestion(idx, idx + 1); }}
                          disabled={idx === questions.length - 1}
                          className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                        >
                          <ChevronDown className="size-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add question */}
          <div className="relative border-t border-slate-200 p-3">
            <button
              onClick={() => setAddTypeMenuOpen((v) => !v)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 py-2.5 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              <Plus className="size-3.5" /> Adaugă Întrebare
            </button>
            {addTypeMenuOpen && (
              <div className="absolute bottom-full left-3 right-3 z-50 mb-1 rounded-xl border border-slate-100 bg-white p-2 shadow-xl">
                <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Alege tipul</p>
                <div className="grid grid-cols-2 gap-0.5">
                  {QUESTION_TYPES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.value}
                        onClick={() => addQuestion(t.value)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left"
                      >
                        <Icon className="size-3.5 text-indigo-400 flex-shrink-0" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Question editor */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedIdx !== null && questions[selectedIdx] ? (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                  {selectedIdx + 1}
                </span>
                <span className="text-[13px] font-semibold text-slate-700">Editează întrebarea</span>
              </div>
              <QuestionEditor
                question={questions[selectedIdx]}
                onChange={(updated) => updateQuestion(selectedIdx, updated)}
                onDelete={() => deleteQuestion(selectedIdx)}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="text-5xl">👈</div>
              <p className="text-[14px] font-semibold text-slate-600">
                {questions.length === 0
                  ? "Adaugă prima întrebare din panoul stâng"
                  : "Selectează o întrebare din stânga pentru a o edita"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdminQuestionnairesClient({ initialData }: Props) {
  const router = useRouter();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(initialData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingQ, setEditingQ] = useState<Questionnaire | null>(null);
  const [builderQ, setBuilderQ] = useState<Questionnaire | null>(null);
  const [isPending, startTransition] = useTransition();

  // If builder is open, show builder view
  if (builderQ) {
    return (
      <div className="h-full">
        <QuestionnaireBuilder
          questionnaire={builderQ}
          onBack={() => {
            setBuilderQ(null);
            startTransition(() => router.refresh());
          }}
        />
      </div>
    );
  }

  const filtered = questionnaires.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || q.status.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: questionnaires.length,
    published: questionnaires.filter((q) => q.status === "PUBLISHED").length,
    draft: questionnaires.filter((q) => q.status === "DRAFT").length,
  };

  const handlePublish = async (id: string, status: "PUBLISHED" | "DRAFT") => {
    const res = await fetch(`/api/admin/questionnaires/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setQuestionnaires((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status } : q))
      );
      toast.success(status === "PUBLISHED" ? "Chestionar publicat!" : "Chestionar mutat în draft.");
    } else {
      toast.error("Eroare la actualizare.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ești sigur că vrei să ștergi acest chestionar? Toate datele asociate vor fi pierdute.")) return;
    const res = await fetch(`/api/admin/questionnaires/${id}`, { method: "DELETE" });
    if (res.ok) {
      setQuestionnaires((prev) => prev.filter((q) => q.id !== id));
      toast.success("Chestionar șters.");
    } else {
      toast.error("Eroare la ștergere.");
    }
  };

  const handleDuplicate = async (id: string) => {
    const res = await fetch(`/api/admin/questionnaires/${id}/duplicate`, { method: "POST" });
    if (res.ok) {
      const copy = await res.json();
      setQuestionnaires((prev) => [copy, ...prev]);
      toast.success("Chestionar duplicat!");
    } else {
      toast.error("Eroare la duplicare.");
    }
  };

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/chestionare/${slug}`);
    toast.success("Link copiat!");
  };

  const handleModalSaved = (saved: any) => {
    if (editingQ) {
      setQuestionnaires((prev) =>
        prev.map((q) => (q.id === saved.id ? { ...q, ...saved } : q))
      );
    } else {
      setQuestionnaires((prev) => [{ ...saved, _count: { leads: 0 } }, ...prev]);
    }
    setEditingQ(null);
  };

  return (
    <div className="min-h-full p-7" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {(showModal || editingQ) && (
        <QuestionnaireModal
          questionnaire={editingQ}
          onClose={() => { setShowModal(false); setEditingQ(null); }}
          onSaved={handleModalSaved}
        />
      )}

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900">Chestionare</h1>
          <p className="text-[12px] text-slate-400">{questionnaires.length} chestionare total</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <Search className="size-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută chestionare..."
              className="w-44 bg-transparent text-[13px] text-slate-500 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex items-center gap-4">
        <button
          onClick={() => { setEditingQ(null); setShowModal(true); }}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="size-3.5" /> Chestionar Nou
        </button>

        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
                filter === f
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {f === "all" ? "Toate" : f === "published" ? "Publicate" : "Draft"}
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                filter === f ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-500"
              )}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white py-20 text-center shadow-sm">
          <div className="text-5xl">📋</div>
          <h3 className="text-[17px] font-bold text-slate-900">Niciun chestionar</h3>
          <p className="text-[13px] text-slate-400">
            {search ? "Niciun rezultat pentru căutarea ta." : "Apasă \"Chestionar Nou\" pentru a crea primul."}
          </p>
          {!search && (
            <button
              onClick={() => { setEditingQ(null); setShowModal(true); }}
              className="mt-1 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="size-3.5" /> Chestionar Nou
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Titlu", "Întrebări", "Leads", "Status", "Creat", "Acțiuni"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-[13px] text-slate-900">{q.title}</p>
                    {q.description && (
                      <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-1">{q.description}</p>
                    )}
                    <p className="mt-0.5 font-mono text-[10px] text-slate-300">/chestionare/{q.slug}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-slate-600">
                      {q._questionCount ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[15px] font-bold text-indigo-600">{q._count.leads}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      q.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}>
                      {q.status === "PUBLISHED" ? "✓ Publicat" : "⏸ Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[12px] text-slate-400">
                    {new Date(q.createdAt).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => setBuilderQ(q)}
                        title="Editează întrebări"
                        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Pencil className="size-3" /> Întrebări
                      </button>
                      <button
                        onClick={() => setEditingQ(q)}
                        title="Editează detalii"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        <Settings className="size-3.5" />
                      </button>
                      {q.status !== "PUBLISHED" ? (
                        <button
                          onClick={() => handlePublish(q.id, "PUBLISHED")}
                          title="Publică"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Rocket className="size-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(q.id, "DRAFT")}
                          title="Mută în Draft"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                        >
                          <EyeOff className="size-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDuplicate(q.id)}
                        title="Duplică"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        <Copy className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyLink(q.slug)}
                        title="Copiază link"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        <Link2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        title="Șterge"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// We need Settings icon too
function Settings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
