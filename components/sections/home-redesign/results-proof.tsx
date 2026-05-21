"use client";

import React from "react";
import { Quote } from "lucide-react";

const METRICS = [
  { value: "-60%", label: "Timp pierdut manual", desc: "în medie după prima lună de implementare" },
  { value: "3x", label: "Viteză procese interne", desc: "datorită automatizărilor și integrărilor" },
  { value: "6 luni", label: "Recuperare investiție", desc: "ROI clar calculat în faza de strategie" },
];

const TESTIMONIALS = [
  {
    quote: "Aplicația personalizată ne-a permis să renunțăm complet la Excel-uri. Acum toată echipa știe în timp real statusul comenzilor.",
    name: "Alexandru M.",
    role: "CEO",
    company: "Producție Mobilier",
    initials: "AM",
  },
  {
    quote: "Nu credeam că digitalizarea poate fi atât de nedureroasă. Evaluarea inițială ne-a deschis ochii, iar implementarea a mers impecabil.",
    name: "Diana T.",
    role: "Director Operațional",
    company: "Logistică & Transport",
    initials: "DT",
  },
  {
    quote: "Recomand cu încredere. Am automatizat fluxul de emitere facturi și rapoarte zilnice. Am salvat 20 de ore pe săptămână din munca contabilei.",
    name: "Mihai C.",
    role: "Fondator",
    company: "E-commerce IT",
    initials: "MC",
  },
];

export function ResultsAndProof() {
  return (
    <section className="py-24 bg-card/10 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Ce obțin companiile după digitalizare
          </h2>
          <p className="text-muted-foreground text-lg">
            Nu vindem doar tehnologie. Livrăm rezultate de business măsurabile care se reflectă direct în profit și eficiență.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {METRICS.map((metric, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-border/50 shadow-sm">
              <span className="text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-500 mb-3 tracking-tighter">
                {metric.value}
              </span>
              <span className="text-lg font-bold text-foreground mb-2">{metric.label}</span>
              <span className="text-sm text-muted-foreground">{metric.desc}</span>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        {TESTIMONIALS.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((test, idx) => (
              <div key={idx} className="relative flex flex-col p-8 rounded-2xl bg-background border border-border/50 shadow-sm transition-hover hover:border-blue-500/30">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-500/10 rotate-180" />
                <p className="text-foreground/80 leading-relaxed mb-8 flex-1 italic">
                  "{test.quote}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 font-bold text-lg">
                    {test.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{test.name}</p>
                    <p className="text-xs text-muted-foreground">{test.role}, {test.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
