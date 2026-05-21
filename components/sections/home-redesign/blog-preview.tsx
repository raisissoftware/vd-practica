"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const ARTICLES = [
  {
    title: "Cum să îți alegi primul sistem ERP pentru afacerea ta",
    category: "Ghiduri",
    excerpt: "Ghid complet pentru companiile cu 10-50 de angajați care vor să renunțe la haosul din Excel-uri.",
    readTime: "5 min",
    href: "/blog/alegere-sistem-erp",
    date: "12 Oct 2023",
  },
  {
    title: "Top 3 procese pe care le poți automatiza chiar azi",
    category: "Automatizări",
    excerpt: "De la facturare până la comunicarea cu clienții, află ce poți delega tehnologiei cu costuri minime.",
    readTime: "3 min",
    href: "/blog/procese-automatizare-azi",
    date: "05 Nov 2023",
  },
  {
    title: "Securitatea cibernetică pentru IMM-uri: Măsuri esențiale",
    category: "Securitate",
    excerpt: "Protejează-ți baza de date și evită atacurile ransomware cu aceste bune practici implementabile rapid.",
    readTime: "7 min",
    href: "/blog/securitate-imm",
    date: "20 Noi 2023",
  },
];

export function BlogPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Ultimele resurse
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Articole, ghiduri și studii de caz despre cum să îți crești afacerea folosind tehnologia.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 group"
          >
            Vezi toate articolele <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article, idx) => (
            <Link 
              key={idx} 
              href={article.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/10 transition-all hover:bg-card/40 hover:shadow-lg hover:border-border"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {article.category}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" /> {article.readTime}
                  </div>
                </div>
                
                <h3 className="mb-3 font-heading text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{article.date}</span>
                  <span className="inline-flex items-center text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Citește <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
