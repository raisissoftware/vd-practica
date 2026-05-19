"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Play, Settings, RefreshCw, Eye } from "lucide-react";
import ConditionalRuleBuilder from "@/components/questionnaire/ConditionalRuleBuilder";
import PublicRenderer, { QuestionnaireData } from "@/components/questionnaire/PublicRenderer";
import PreviewSimulationPanel from "@/components/questionnaire/PreviewSimulationPanel";

interface RulesDashboardClientProps {
  questionnaire: QuestionnaireData;
}

export default function RulesDashboardClient({ questionnaire }: RulesDashboardClientProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  
  // Simulation states
  const [simulationAnswers, setSimulationAnswers] = useState<Record<string, any>>({});
  const [simulationVisibility, setSimulationVisibility] = useState<Record<string, boolean>>({});
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleSimulationStateChange = (answers: Record<string, any>, visibility: Record<string, boolean>) => {
    setSimulationAnswers(answers);
    setSimulationVisibility(visibility);
  };

  const handleResetSimulation = () => {
    setResetTrigger((prev) => prev + 1);
    setSimulationAnswers({});
    setSimulationVisibility({});
  };

  return (
    <Tabs defaultValue="editor" className="w-full space-y-6">
      <TabsList className="bg-muted/60 p-1 rounded-full grid w-full max-w-[400px] grid-cols-2">
        <TabsTrigger value="editor" className="rounded-full font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configurator Reguli
        </TabsTrigger>
        <TabsTrigger value="simulator" className="rounded-full font-semibold flex items-center gap-2">
          <Play className="h-4 w-4" />
          Simulare Live
        </TabsTrigger>
      </TabsList>

      {/* 1. RULE CONFIGURATOR TAB */}
      <TabsContent value="editor" className="space-y-4 outline-none">
        <div className="grid gap-6">
          {questionnaire.questions.map((q) => {
            const hasRules = q.ruleGroups && q.ruleGroups.length > 0;
            const isExpanded = activeQuestionId === q.id;

            return (
              <Card 
                key={q.id} 
                className={`border transition-all duration-300 rounded-2xl overflow-hidden ${
                  isExpanded 
                    ? "border-blue-500/40 shadow-md shadow-blue-500/[0.02]" 
                    : "border-border/60 hover:border-border"
                }`}
              >
                <CardHeader className="py-4 px-6 flex flex-row items-center justify-between space-y-0 bg-muted/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded-md">
                        Întrebarea {q.order}
                      </span>
                      <span className="text-xs text-zinc-500 font-semibold">{q.type}</span>
                      {hasRules && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] rounded-lg font-bold">
                          <GitBranch className="h-3 w-3 mr-1" />
                          Reguli Active
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base font-bold text-foreground line-clamp-1">
                      {q.text}
                    </CardTitle>
                  </div>
                  
                  <button
                    onClick={() => setActiveQuestionId(isExpanded ? null : q.id)}
                    className="text-xs font-bold rounded-full px-4 py-1.5 border border-border/80 hover:bg-muted text-foreground transition-colors"
                  >
                    {isExpanded ? "Ascunde" : "Editează Reguli"}
                  </button>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="p-6 border-t border-border/40 bg-card/10">
                    <ConditionalRuleBuilder
                      questionnaireId={questionnaire.id}
                      questionId={q.id}
                      questions={questionnaire.questions}
                      onSaveSuccess={() => {
                        // We could trigger a router refresh, but for now local notification is handled by child component
                      }}
                    />
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </TabsContent>

      {/* 2. LIVE SIMULATOR TAB */}
      <TabsContent value="simulator" className="outline-none">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch min-h-[600px]">
          {/* Active Renderer frame */}
          <div className="flex-1 rounded-3xl border border-border/60 bg-muted/10 p-6 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <Eye className="h-4 w-4 text-blue-500" />
              Vizualizare Publică (Simulată)
            </div>

            <div className="w-full max-w-2xl bg-background border border-border/80 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-muted/40 h-8 border-b border-border/40 flex items-center px-4 gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="text-[10px] text-muted-foreground font-semibold ml-2 select-none">
                  localhost:3000/chestionar
                </span>
              </div>
              <div className="p-4 overflow-y-auto max-h-[580px]">
                <PublicRenderer
                  data={questionnaire}
                  simulationMode={true}
                  simulationAnswers={simulationAnswers}
                  onSimulationStateChange={handleSimulationStateChange}
                  onResetTrigger={resetTrigger}
                />
              </div>
            </div>
          </div>

          {/* Simulation debugging sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <PreviewSimulationPanel
              questions={questionnaire.questions}
              answers={simulationAnswers}
              visibility={simulationVisibility}
              onReset={handleResetSimulation}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
