import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

const PROCESS_STEPS = [
  {
    id: "01",
    label: "EVALUARE",
    iconName: "clipboard",
    description: "Completezi un chestionar de 10 minute și afli exact unde se află compania ta din punct de vedere digital.",
  },
  {
    id: "02",
    label: "STRATEGIE",
    iconName: "map",
    description: "Construim împreună un plan de transformare personalizat, clar și fără jargon tehnic.",
  },
  {
    id: "03",
    label: "IMPLEMENTARE",
    iconName: "rocket",
    description: "Soluții digitale scalabile, sigure și performante — integrate pas cu pas în afacerea ta.",
  },
] as const;

const StepIcon = ({ name }: { name: string }) => {
  const baseClasses = "size-5 text-blue-600 dark:text-sky-400";

  switch (name) {
    case "clipboard":
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "map":
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "rocket":
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return <Icons.arrowRight className={baseClasses} />;
  }
};

export default function HeroLanding() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden py-20 lg:py-0">

      {/* Fundal decorativ mai curat */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(14,165,233,0.06)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">

          {/* COLOANA STÂNGĂ: Conținut Text */}
          <div className="flex flex-col gap-8 lg:pr-8">

            {/* Badge - mai finuț, stilizat */}
            <div className="flex">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-50/50 px-4 py-1.5 text-sm font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-sky-500"></span>
                </span>
                Agenție de transformare digitală
              </div>
            </div>

            {/* Titlu Principal cu Gradient puternic */}
            <h1 className="font-urban font-extrabold tracking-tight leading-[1.1] text-5xl sm:text-6xl lg:text-[76px] text-balance">
              DIGITALIZĂM <br />
              <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent drop-shadow-sm">
                AFACEREA TA.
              </span>
            </h1>

            {/* Subtitlu */}
            <p className="max-w-xl text-muted-foreground text-lg sm:text-xl leading-relaxed text-balance">
              Evaluăm maturitatea digitală a companiei tale în 10 minute și construim împreună planul de transformare potrivit — pas cu pas, fără jargon tehnic.
            </p>

            {/* Butoane Acțiune */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <Link
                href="#chestionar"
                prefetch={true}
                className={cn(
                  buttonVariants({ size: "lg", rounded: "full" }),
                  "gap-2 group w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
                )}
              >
                <span>Începe evaluarea gratuită</span>
                <Icons.arrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#cum-functioneaza"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg", rounded: "full" }),
                  "w-full sm:w-auto px-6 border-muted-foreground/20 hover:bg-muted/50 transition-colors"
                )}
              >
                Cum funcționează
              </Link>
            </div>

            {/* Statistici (Social Proof) - Aliniate și curate */}
            <div className="flex items-center gap-8 md:gap-14 pt-8 mt-4 border-t border-border/50">
              <StatBlock value="240" suffix="+" label="Companii evaluate" />
              <StatBlock value="94" suffix="%" label="Rată de satisfacție" />
              <StatBlock value="3" suffix="x" label="Eficiență câștigată" />
            </div>

          </div>

          {/* COLOANA DREAPTĂ: Timeline Proces */}
          <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">

            {/* Pata de lumină din spatele cardurilor */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/5 to-blue-500/5 blur-3xl rounded-full -z-10" />

            <div className="relative space-y-6">
              {/* Linia continuă a timeline-ului */}
              <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-600 via-sky-400 to-transparent opacity-20 hidden sm:block" aria-hidden="true" />

              {PROCESS_STEPS.map((step, index) => (
                <div key={step.id} className="relative flex items-start gap-4 sm:gap-6 group">

                  {/* Iconița de pe timeline */}
                  <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-[3px] border-background bg-sky-50 shadow-sm transition-colors group-hover:border-sky-100 dark:bg-sky-500/10 dark:group-hover:border-sky-500/30 hidden sm:flex">
                    <StepIcon name={step.iconName} />
                  </div>

                  {/* Cardul propriu-zis */}
                  <div className="flex-1 rounded-2xl border bg-background/60 p-6 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-background hover:border-sky-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-blue-600/10 text-xs font-bold text-blue-600 dark:bg-sky-400/10 dark:text-sky-400">
                        {step.id}
                      </span>
                      <h3 className="text-sm font-bold tracking-widest text-foreground uppercase">
                        {step.label}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// SUB-COMPONENTĂ UTIlITARĂ
function StatBlock({ value, suffix, label }: { value: string; suffix: string; label: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-1">
        <span className="font-urban text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {value}
        </span>
        <span className="text-2xl font-extrabold text-blue-600 dark:text-sky-400">
          {suffix}
        </span>
      </div>
      <div className="text-sm text-muted-foreground mt-1 font-medium">{label}</div>
    </div>
  );
}