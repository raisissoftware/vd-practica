import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  href: string;
  linkLabel: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const services: Service[] = [
  {
    icon: (
      <svg className="size-6 text-sky-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Chestionare Dinamice",
    description: "Construim chestionare inteligente cu logică condiționată, adaptate în timp real la răspunsurile utilizatorilor. Colectăm date clare, structurate, direct acționabile.",
    features: ["Logică condiționată avansată", "Branding personalizat", "Dashboard analytics în timp real"],
    href: "#chestionare",
    linkLabel: "Află mai multe despre chestionare",
  },
  {
    icon: (
      <svg className="size-6 text-sky-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Strategie Digitală",
    description: "Evaluăm maturitatea digitală a companiei și construim un plan de transformare pas cu pas, adaptat la dimensiunea și obiectivele afacerii tale.",
    features: ["Audit digital complet", "Roadmap personalizat", "KPI și metrici de progres"],
    href: "#strategie",
    linkLabel: "Explorează serviciile de strategie",
  },
  {
    icon: (
      <svg className="size-6 text-sky-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Management Lead-uri & CRM",
    description: "Capturăm, urmărim și gestionăm lead-urile direct din chestionarele publice și landing pages, printr-un dashboard centralizat și securizat.",
    features: ["Rutare automată lead-uri", "Tracking conversii", "Integrare CRM existent"],
    href: "#crm",
    linkLabel: "Vezi modulul CRM",
  },
  {
    icon: (
      <svg className="size-6 text-sky-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Securitate Enterprise",
    description: "Construită pe infrastructură modernă Next.js cu PostgreSQL, autentificare sigură, verificare în doi pași și conformitate strictă GDPR.",
    features: ["Auth & 2FA incluse", "Control acces bazat pe roluri", "Conformitate GDPR completă"],
    href: "#securitate",
    linkLabel: "Detalii despre securitate",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border bg-background p-8 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-sky-500/30">
      {/* Icon */}
      <div className="mb-6 flex size-12 items-center justify-center rounded-xl border bg-sky-500/10 transition-colors group-hover:bg-sky-500/15">
        {service.icon}
      </div>

      {/* Title + description */}
      <h3 className="text-lg font-semibold text-foreground mb-3">{service.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{service.description}</p>

      {/* Feature list */}
      <ul className="flex flex-col gap-2 mb-8">
        {service.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="size-4 shrink-0 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143z" clipRule="evenodd"/>
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {/* Link */}
      <div className="mt-auto">
        <Link
          href={service.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors"
        >
          {service.linkLabel}
          <svg className="size-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-950 px-8 py-16 lg:px-16">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_30%_50%,rgba(14,165,233,0.12)_0%,transparent_70%)]" />

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — text */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-white lg:text-4xl">
            Gata să digitalizezi?
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Solicită o consultație pentru a discuta nevoile tale specifice. Experții noștri te vor ghida prin capabilitățile platformei și soluțiile potrivite pentru tine.
          </p>

          {/* Trust points */}
          <ul className="flex flex-col gap-4 mt-2">
            <li className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20">
                <svg className="size-4 text-sky-400" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Securitate Enterprise</div>
                <div className="text-xs text-slate-400 mt-0.5">Auth, 2FA și conformitate GDPR incluse.</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20">
                <svg className="size-4 text-sky-400" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Implementare Rapidă</div>
                <div className="text-xs text-slate-400 mt-0.5">Chestionarele tale live în minute, nu săptămâni.</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Right — form card */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm p-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Prenume</label>
              <input
                type="text"
                placeholder="Ion"
                className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Nume</label>
              <input
                type="text"
                placeholder="Popescu"
                className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Email de serviciu</label>
            <input
              type="email"
              placeholder="ion@compania.ro"
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Companie</label>
            <input
              type="text"
              placeholder="Acme SRL"
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Cum te putem ajuta?</label>
            <textarea
              rows={3}
              placeholder="Spune-ne despre obiectivele tale de digitalizare..."
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex items-start gap-2 mb-6">
            <input
              type="checkbox"
              id="gdpr"
              className="mt-0.5 size-4 rounded border-slate-600 accent-sky-500"
            />
            <label htmlFor="gdpr" className="text-xs text-slate-400 leading-relaxed">
              Sunt de acord cu{" "}
              <Link href="/privacy" className="text-sky-400 hover:underline">Politica de confidențialitate</Link>
              {" "}și îmi dau acordul ca vreaudigitalizare.eu să stocheze datele mele pentru a răspunde solicitării.
            </label>
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
          >
            Solicită consultație
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <div className="relative">
      {/* ── Hero ── */}
      <section className="relative py-20 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(14,165,233,0.07)_0%,transparent_70%)]" />

        <div className="container max-w-4xl mx-auto px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-500 mb-8">
            <span className="size-1.5 rounded-full bg-sky-500" />
            Serviciile noastre principale
          </div>

          <h1 className="font-urban text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[56px] mb-6 leading-tight">
            Servicii de Digitalizare{" "}
            <span className="text-sky-500">Construite pentru Creștere</span>
          </h1>

          <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed mb-10">
            Explorează suita noastră completă de instrumente de transformare digitală — de la chestionare inteligente la strategie și implementare, oferim infrastructura pentru viitorul tău digital.
          </p>

          <Link
            href="#servicii"
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2"
            )}
          >
            Explorează soluțiile
            <Icons.arrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section id="servicii" className="py-16">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">Capabilități Digitale de Bază</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Module puternice proiectate să se integreze perfect în operațiunile tale de business.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ── */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-6">
          <CtaSection />
        </div>
      </section>
    </div>
  );
}
