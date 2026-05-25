"use client";

import React from "react";
import { ClipboardCheck, Rocket, Wrench } from "lucide-react";
import { motion } from "framer-motion";

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
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15
      }
    }
  };

  return (
    <section className="py-24 md:py-36 bg-white dark:bg-zinc-950 relative overflow-hidden">
      {/* Subtle details */}
      <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative">
        {/* Title Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Procesul Nostru
            </span>
            <h2 className="mt-3 font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-zinc-50 leading-none">
              3 pași până la transformare
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-500 dark:text-zinc-400 leading-relaxed text-balance">
              Digitalizarea este procesul prin care tehnologia devine inima companiei tale. Iată cum lucrăm împreună, transparent și eficient.
            </p>
          </motion.div>
        </div>

        {/* Steps container */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-0 right-0 hidden lg:block h-[2px] bg-slate-100 dark:bg-zinc-850" />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-12 lg:grid-cols-3 lg:gap-8"
          >
            {STEPS.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative flex flex-col items-center lg:items-start text-center lg:text-left group"
                >
                  {/* Number & Icon node */}
                  <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-white dark:border-zinc-950 bg-slate-50 dark:bg-zinc-900 shadow-md mb-6 transition-transform duration-300 group-hover:scale-105">
                    <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm shadow-indigo-600/20">
                      {step.number}
                    </div>
                    <IconComp className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  
                  {/* Timeframe Badge */}
                  <div className="mb-4 inline-flex items-center rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-[11px] font-bold text-teal-700 dark:text-teal-400">
                    Durată: {step.timeframe}
                  </div>
                  
                  <h3 className="mb-3 font-urban text-xl font-extrabold text-slate-900 dark:text-zinc-50">{step.title}</h3>
                  <p className="text-slate-555 dark:text-zinc-400 text-sm leading-relaxed max-w-sm font-medium">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
