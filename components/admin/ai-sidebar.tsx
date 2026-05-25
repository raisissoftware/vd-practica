"use client";

import { useState } from "react";
import { Sparkles, Loader2, Send, List, AlignLeft, Tag, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useCompletion } from "@ai-sdk/react";

export function AiSidebar({
  currentContent,
  onUpdateContent,
  onUpdateTitle,
  onUpdateExcerpt,
  prompt,
  setPrompt,
}: {
  currentContent: string;
  onUpdateContent: (c: string) => void;
  onUpdateTitle?: (t: string) => void;
  onUpdateExcerpt?: (e: string) => void;
  prompt: string;
  setPrompt: (p: string) => void;
}) {

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/admin/ai/generate",
    onError: (err) => {
      toast.error("Eroare la generarea AI.");
      console.error(err);
    },
    onFinish: (prompt, completion) => {
      toast.success("Generare completă.");
    },
  });

  const getSystemPrompt = (baseContext: string) => {
    return baseContext;
  };

  const handleAction = async (actionPrompt: string, systemPromptBase: string) => {
    try {
      await complete(actionPrompt, {
        body: {
          contextText: currentContent,
          systemPrompt: getSystemPrompt(systemPromptBase),
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOutline = () => {
    handleAction(
      "Generează un rezumat și structură cu puncte cheie (outline) pentru acest articol.",
      "Ești un asistent AI expert în structurarea articolelor. Returnezi doar codul HTML al structurii (h2, h3, ul, li)."
    );
  };

  const handleParagraph = () => {
    handleAction(
      "Rescrie și extinde următorul text într-un paragraf detaliat.",
      "Ești un asistent AI expert în copywriting. Returnezi doar codul HTML (p)."
    );
  };

  const handleMetaTags = () => {
    handleAction(
      "Generează cele mai bune Meta Title și Meta Description SEO pentru acest text.",
      "Returnează sugestia ta cu titluri bold, fără introduceri."
    );
  };

  const handleProofread = () => {
    handleAction(
      "Corectează gramatical și ortografic acest text. Nu adăuga idei noi, doar corectează.",
      "Ești un proofreader expert. Returnează doar textul curat în HTML."
    );
  };

  const handleCustomPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    await complete(prompt, {
      body: {
        contextText: currentContent,
        systemPrompt: getSystemPrompt("Ești un asistent AI pentru un CMS. Returnează conținut HTML curat pe baza instrucțiunii utilizatorului."),
      },
    });
    setPrompt("");
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-xl overflow-hidden rounded-[20px] border border-slate-200">
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-md">
            <Sparkles className="size-4 text-white" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">AI Content Assistant</h3>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <span className="text-lg">⋯</span>
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="space-y-6">
          
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Generate Content</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleOutline}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group disabled:opacity-50"
              >
                <List className="size-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-700">Outline</span>
              </button>
              <button
                onClick={handleParagraph}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group disabled:opacity-50"
              >
                <AlignLeft className="size-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-700">Paragraph</span>
              </button>
              <button
                onClick={handleMetaTags}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group disabled:opacity-50"
              >
                <Tag className="size-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-700">Meta Tags</span>
              </button>
              <button
                onClick={handleProofread}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group disabled:opacity-50"
              >
                <CheckCircle className="size-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-700">Proofread</span>
              </button>
            </div>
          </div>

          {/* Live Completion Area */}
          {completion && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 relative">
              <h4 className="text-xs font-bold text-indigo-800 mb-2 flex items-center gap-1.5">
                {isLoading && <Loader2 className="size-3.5 animate-spin" />}
                Rezultat:
              </h4>
              <div 
                className="prose prose-sm max-w-none text-slate-700 mb-4 max-h-48 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: completion }} 
              />
              {!isLoading && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-indigo-100">
                  <button 
                    onClick={() => {
                      onUpdateContent(completion);
                      toast.success("Conținut înlocuit!");
                    }}
                    className="flex-1 rounded-lg bg-white border border-indigo-200 py-1.5 text-[11px] font-bold text-indigo-700 shadow-sm hover:bg-indigo-50 transition-colors"
                  >
                    Înlocuiește
                  </button>
                  <button 
                    onClick={() => {
                      onUpdateContent(currentContent + "\n<br/>\n" + completion);
                      toast.success("Adăugat la final!");
                    }}
                    className="flex-1 rounded-lg bg-indigo-600 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    Inserează
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <form onSubmit={handleCustomPrompt} className="relative bg-white rounded-xl shadow-sm border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 overflow-hidden">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to write or rewrite something..."
            className="w-full resize-none bg-transparent px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCustomPrompt(e as any);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute bottom-2 right-2 rounded-lg bg-indigo-500 p-2 text-white hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>}
          </button>
        </form>
      </div>
    </div>
  );
}
