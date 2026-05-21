"use client";

import React from "react";
import { ClipboardCheck, Rocket, Wrench } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Evaluare & Audit",
    description: "Completăm împreună chestionarul de maturitate digitală. Identificăm problemele și unde poți salva bani și timp.",
    timeframe: "1-2 săptămâni",
  },
  {
    number: "02",
    icon: Wrench,
    title: "Strategie & Arhitectură",
    description: "Propunem soluțiile tehnice potrivite (CRM, ERP, automatizări) și planul detaliat de acțiune cu ROI clar.",
    timeframe: "2-4 săptămâni",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Implementare",
    description: "Dezvoltăm, integrăm și testăm soluțiile. Echipa ta primește training complet pentru utilizarea noilor sisteme.",
    timeframe: "1-3 luni",
  },
];

export function HowItWorksTimeline() {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative grain/noise pattern overlay if needed, handled globally but can add a specific gradient here */}
      <div className="absolute inset-0 bg-blue-500/[0.02] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 md:px-8 relative">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-6">
            3 pași până la transformare digitală
          </h2>
          <p className="text-lg text-muted-foreground">
            Digitalizarea este procesul prin care tehnologia devine inima companiei tale. Iată cum lucrăm împreună, transparent și eficient.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-0 right-0 hidden lg:block h-[1px] bg-border" />
          
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Number & Icon node */}
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-8 border-background bg-card shadow-sm mb-6">
                  <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {step.number}
                  </div>
                  <step.icon className="h-8 w-8 text-blue-500" />
                </div>
                
                {/* Badge */}
                <div className="mb-4 inline-flex items-center rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                  Durată: {step.timeframe}
                </div>
                
                <h3 className="mb-3 font-heading text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
