"use client";

import React from "react";

const LOGOS = [
  "Acme Corp", "TechNova", "GlobalSys", "InnovateRO", "DataFlow",
  "CloudSync", "NextGen", "SmartSolutions", "AlphaLogix", "PioneerSystems"
];

export function SocialProofBar() {
  return (
    <section className="border-y border-border/40 bg-card/20 py-8 overflow-hidden relative">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Companii care ne-au ales
        </p>
      </div>
      
      {/* Marquee container */}
      <div className="flex w-full overflow-hidden">
        <div className="flex w-max animate-marquee space-x-12 px-12 md:space-x-24 md:px-24">
          {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-center font-heading text-xl font-bold text-muted-foreground/40 grayscale transition-all duration-300 hover:grayscale-0 hover:text-foreground/80"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
      
      {/* Gradients for fade effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent" />
    </section>
  );
}
