"use client";

import React from "react";
import { motion } from "framer-motion";

const LOGOS = [
  "Acme Corp", "TechNova", "GlobalSys", "InnovateRO", "DataFlow",
  "CloudSync", "NextGen", "SmartSolutions", "AlphaLogix", "PioneerSystems"
];

export function SocialProofBar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-y border-slate-200/50 bg-slate-50/20 py-8 overflow-hidden relative dark:border-zinc-800/40 dark:bg-zinc-950/20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8 mb-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
          Companii care au încredere în noi
        </p>
      </div>
      
      {/* Marquee container */}
      <div className="flex w-full overflow-hidden">
        <div className="flex w-max animate-marquee space-x-12 px-12 md:space-x-24 md:px-24">
          {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-center font-urban text-lg font-black text-slate-400/50 dark:text-zinc-650 grayscale transition-all duration-300 hover:grayscale-0 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
      
      {/* Gradients for fade effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80" />
    </motion.section>
  );
}
