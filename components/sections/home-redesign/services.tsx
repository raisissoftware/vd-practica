"use client";

import React from "react";
import { ArrowRight, BarChart3, Cloud, Code2, Cpu, LineChart, ShieldCheck } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    title: "Evaluare Digitală",
    description: "Analizăm procesele actuale și identificăm blocajele.",
    benefit: "Află exact ce poți automatiza și cât timp vei economisi zilnic.",
    icon: LineChart,
    href: "/servicii/evaluare",
  },
  {
    title: "Dezvoltare Software",
    description: "Creăm aplicații custom pentru nevoile companiei tale.",
    benefit: "Platforme scalabile care cresc odată cu afacerea ta.",
    icon: Code2,
    href: "/servicii/dezvoltare",
  },
  {
    title: "Automatizări Fluxuri",
    description: "Eliminăm munca manuală repetitivă din companie.",
    benefit: "Scădem costurile operaționale și riscul erorilor umane.",
    icon: Cpu,
    href: "/servicii/automatizari",
  },
  {
    title: "Migrare Cloud",
    description: "Mutăm infrastructura ta în siguranță în cloud.",
    benefit: "Acces rapid la date de oriunde, cu securitate maximă.",
    icon: Cloud,
    href: "/servicii/cloud",
  },
  {
    title: "Securitate Cibernetică",
    description: "Protejăm datele sensibile ale clienților și firmei.",
    benefit: "Zero downtime și siguranță totală împotriva atacurilor.",
    icon: ShieldCheck,
    href: "/servicii/securitate",
  },
  {
    title: "Analiză de Date (BI)",
    description: "Transformăm datele tale în decizii strategice.",
    benefit: "Rapoarte în timp real pentru management eficient.",
    icon: BarChart3,
    href: "/servicii/analiza-date",
  },
];

export function ServicesGrid() {
  return (
    <section id="servicii" className="py-20 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Ce facem concret
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              De la auditul inițial până la implementarea soluțiilor, suntem partenerul tău tehnologic pe termen lung.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, idx) => (
            <div 
              key={idx}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/20 p-8 transition-all hover:bg-card/40 hover:border-blue-500/30"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <service.icon className="h-6 w-6" />
              </div>
              
              <h3 className="mb-3 font-heading text-xl font-bold">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 transition-all group-hover:opacity-0 group-hover:-translate-y-2 duration-300">
                {service.description}
              </p>
              
              {/* Hover Reveal Benefit */}
              <div className="absolute inset-x-8 top-[140px] opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <p className="text-sm font-medium text-blue-400">
                  {service.benefit}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-border/50">
                <Link 
                  href={service.href}
                  className="inline-flex items-center text-sm font-semibold text-foreground transition-colors hover:text-blue-500"
                >
                  Află mai mult <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
