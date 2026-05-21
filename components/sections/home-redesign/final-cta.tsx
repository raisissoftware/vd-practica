"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 md:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-teal-500 p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          
          {/* Decorative shapes */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Fă primul pas spre digitalizare
          </h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Nu lăsa concurența să te depășească. Află exact ce poți automatiza și începe să scalezi eficient, cu costuri controlate.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chestionare/evaluare-maturitate-digitala"
              className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-bold text-blue-600 shadow-xl transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 duration-200"
            >
              Începe evaluarea <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <button
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40"
            >
              <MessageSquare className="mr-2 h-5 w-5" /> Contactează-ne
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
