"use client";

import React, { useState } from "react";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AssessmentCta() {
  const [selected, setSelected] = useState<number | null>(1);

  return (
    <section className="bg-[#0a0f1e] text-white py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Copy */}
          <div className="max-w-2xl">
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Află în 10 minute unde se află compania ta
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Completează gratuit chestionarul nostru de evaluare a maturității digitale. Fără obligații. Fără limbaj tehnic complicat. Doar o radiografie clară a proceselor tale de afaceri.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Raport PDF personalizat cu soluții clare",
                "Scor exact calculat pe baza la 10 categorii",
                "Comparație cu alte companii din industrie"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mr-3 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/chestionare/evaluare-maturitate-digitala"
              className="inline-flex h-14 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-bold text-white shadow-xl shadow-blue-900/20 transition-colors hover:bg-blue-700 hover:scale-105 active:scale-95 duration-200"
            >
              Începe evaluarea gratuită <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Right Side: Mock UI Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-3xl blur-xl opacity-20" />
            <div className="relative bg-[#131b2f] border border-slate-800 rounded-3xl p-8 shadow-2xl">
              
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Progres evaluare
                </span>
                <span className="text-xs font-bold text-blue-400">20%</span>
              </div>
              
              <div className="w-full bg-slate-800 rounded-full h-1.5 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-1.5 rounded-full w-[20%]" />
              </div>

              <h3 className="text-xl font-bold mb-6 text-white leading-snug">
                Cât timp alocă echipa ta zilnic pentru task-uri manuale și introducere de date?
              </h3>

              <div className="space-y-3">
                {[
                  "Mai puțin de 1 oră",
                  "Între 1 și 3 ore",
                  "Mai mult de 3 ore",
                  "Nu știu exact"
                ].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelected(idx)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border text-left text-sm font-semibold transition-all duration-200",
                      selected === idx
                        ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(37,99,255,0.2)]"
                        : "border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                    )}
                  >
                    {option}
                    <div className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                      selected === idx ? "border-blue-500 bg-blue-500" : "border-slate-600"
                    )}>
                      {selected === idx && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
