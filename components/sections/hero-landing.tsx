"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { ClipboardCheck, Compass, Rocket, Sparkles, ArrowRight } from "lucide-react";

const PROCESS_STEPS = [
  {
    id: "01",
    label: "EVALUARE",
    icon: ClipboardCheck,
    description: "Completezi un chestionar de 10 minute și afli exact unde se află compania ta din punct de vedere digital.",
  },
  {
    id: "02",
    label: "STRATEGIE",
    icon: Compass,
    description: "Construim împreună un plan de transformare personalizat, clar și fără jargon tehnic.",
  },
  {
    id: "03",
    label: "IMPLEMENTARE",
    icon: Rocket,
    description: "Soluții digitale scalabile, sigure și performante — integrate pas cu pas în afacerea ta.",
  },
] as const;

// Animated Counter Utility
function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.abs(Math.floor(totalMiliseconds / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function HeroLanding() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
        delay: custom * 0.15,
      },
    }),
  };

  // Mouse Glow Spotlight Effect for Cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    currentTarget.style.setProperty("--mouse-x", `${clientX - left}px`);
    currentTarget.style.setProperty("--mouse-y", `${clientY - top}px`);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden py-16 lg:py-24 bg-slate-50/30 dark:bg-zinc-950/20">
      {/* Premium Ambient Background Mesh Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Animated main glowing spot */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-10%] right-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-500/10 via-transparent to-pink-500/5 blur-3xl opacity-80"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] left-[5%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-500/5 via-transparent to-indigo-500/10 blur-3xl opacity-75"
        />
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* COLOANA STÂNGĂ: Text and Branding */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col gap-6 md:gap-8"
          >
            {/* Tag/Badge */}
            <motion.div variants={textVariants} className="flex">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-50/50 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-950/40 dark:text-indigo-400">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-indigo-500"></span>
                </span>
                Partenerul Tău de Transformare Digitală
              </div>
            </motion.div>

            {/* Massive Cinematic Heading */}
            <motion.h1
              variants={textVariants}
              className="font-urban font-black tracking-tight leading-[1.05] text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-balance text-slate-900 dark:text-zinc-50"
            >
              DIGITALIZĂM <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-400 bg-clip-text text-transparent drop-shadow-sm font-extrabold">
                AFACEREA TA.
              </span>
            </motion.h1>

            {/* Premium Description Paragraph */}
            <motion.p
              variants={textVariants}
              className="max-w-xl text-slate-500 text-base sm:text-lg md:text-xl leading-relaxed text-balance dark:text-zinc-400"
            >
              Evaluăm maturitatea digitală a IMM-urilor în 10 minute și construim împreună un plan de acțiune personalizat, eficient și fără jargon tehnic.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={textVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2"
            >
              <Link
                href="#chestionar"
                prefetch={true}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "relative group bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold px-8 h-12 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 overflow-hidden transition-all duration-300"
                )}
              >
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2"
                >
                  <span>Începe evaluarea gratuită</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </motion.span>
              </Link>
              <Link
                href="#servicii"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:text-zinc-300 h-12 px-6 transition-all font-semibold"
                )}
              >
                Serviciile Noastre
              </Link>
            </motion.div>

            {/* Statistics Counters */}
            <motion.div
              variants={textVariants}
              className="grid grid-cols-3 gap-4 md:gap-12 pt-8 mt-4 border-t border-slate-200/50 dark:border-zinc-800/50"
            >
              <div className="flex flex-col">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
                  <Counter value={240} />+
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase mt-1 tracking-wider">Companii</div>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
                  <Counter value={94} />%
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase mt-1 tracking-wider">Satisfacție</div>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
                  <Counter value={3} />x
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase mt-1 tracking-wider">Eficiență</div>
              </div>
            </motion.div>
          </motion.div>

          {/* COLOANA DREAPTĂ: Premium Process Floating Cards */}
          <div className="lg:col-span-5 relative flex flex-col justify-center min-h-[480px]">
            {/* Behind blur decor */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-blue-500/5 blur-3xl rounded-full pointer-events-none" />

            <div className="relative space-y-6">
              {/* Central connection line */}
              <div className="absolute left-[38px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-600 via-blue-400 to-transparent opacity-20 hidden sm:block" />

              {PROCESS_STEPS.map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    onMouseMove={handleMouseMove}
                    className="group relative flex items-start gap-4 sm:gap-6 rounded-2xl border border-slate-200/50 bg-white/40 p-6 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white hover:border-indigo-500/25 dark:border-zinc-800/40 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/60 dark:hover:border-indigo-400/25 overflow-hidden"
                  >
                    {/* Spotlight Glow */}
                    <div
                      className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(350px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(99,102,241,0.06),transparent_80%)]"
                    />

                    {/* Timeline Node */}
                    <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-300 hidden sm:flex">
                      <IconComp className="size-6" />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-5 items-center justify-center rounded bg-indigo-600/10 px-2 text-[10px] font-black text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400">
                          {step.id}
                        </span>
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                          {step.label}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}