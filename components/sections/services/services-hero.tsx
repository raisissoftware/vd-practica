"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ServicesHero() {
  const scrollToServices = () => {
    document.getElementById("servicii-principale")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background elegant gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(37,99,255,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_40%_at_80%_20%,rgba(6,214,160,0.03)_0%,transparent_60%)]" />

      <div className="container max-w-5xl mx-auto px-4 md:px-6 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400"
        >
          <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          SERVICIILE NOASTRE PRINCIPALE
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mx-auto max-w-4xl font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-foreground"
        >
          Servicii de Digitalizare{" "}
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Construite pentru Creștere
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-10"
        >
          Explorează suita noastră completă de instrumente de transformare digitală — de la chestionare inteligente la strategie și implementare, oferim infrastructura pentru viitorul tău digital.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <button
            onClick={scrollToServices}
            className="group inline-flex h-14 items-center justify-center rounded-full bg-slate-900 dark:bg-white px-8 text-base font-bold text-white dark:text-slate-900 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_4px_14px_0_rgba(0,0,0,0.1)] transition-all hover:bg-slate-800 dark:hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:translate-y-0"
          >
            Explorează soluțiile 
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
