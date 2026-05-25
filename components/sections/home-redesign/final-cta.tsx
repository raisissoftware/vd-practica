"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-zinc-950 relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 p-10 md:p-20 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Decorative ambient spots inside card */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="font-urban text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-none">
            Fă primul pas spre digitalizare
          </h2>
          
          <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-semibold">
            Nu lăsa concurența să te depășească. Află exact ce poți automatiza și începe să scalezi eficient, cu costuri controlate.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chestionare/evaluare-maturitate-digitala"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-xs font-bold text-indigo-600 shadow-xl transition-all hover:bg-slate-50 hover:scale-[1.03] active:scale-[0.98] duration-200"
            >
              Începe evaluarea <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40 hover:scale-[1.03] active:scale-[0.98]"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Contactează-ne
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
