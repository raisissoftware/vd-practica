import { prisma } from "@/lib/db";
import QuestionnairesList from "@/components/questionnaire/QuestionnairesList";
import type { QuestionnaireCardData } from "@/components/questionnaire/QuestionnaireCard";

export const metadata = {
  title: "Chestionare de Digitalizare | VreauDigitalizare",
  description:
    "Explorează chestionarele noastre de evaluare digitală și descoperă nivelul de maturitate digitală al companiei tale. Răspunsuri personalizate în câteva minute.",
};

export const revalidate = 60;

async function getPublishedQuestionnaires(): Promise<QuestionnaireCardData[]> {
  const questionnaires = await prisma.questionnaire.findMany({
    where: { status: "PUBLISHED" },
    include: {
      questions: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return questionnaires.map((q) => ({
    id: q.id,
    slug: q.slug,
    title: q.title,
    description: q.description,
    category: null, // Category field to be added to schema later
    estimatedMinutes: Math.max(3, Math.ceil(q.questions.length * 1.2)),
    questionCount: q.questions.length,
  }));
}

export default async function ChestionarePage() {
  const questionnaires = await getPublishedQuestionnaires();

  return (
    <>
      {/* ── Hero header ── */}
      <section className="relative py-16 text-center overflow-hidden border-b border-border/50">
        {/* Radial glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(14,165,233,0.07)_0%,transparent_70%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-500 mb-6">
            <span className="size-1.5 rounded-full bg-sky-500 animate-pulse" />
            Evaluări Gratuite
          </div>

          <h1 className="font-urban text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 leading-tight">
            Chestionare de{" "}
            <span className="text-sky-500">maturitate digitală</span>
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-base leading-relaxed">
            Evaluează-ți nivelul de digitalizare în câteva minute și primești
            recomandări personalizate pentru compania ta.
          </p>

          {/* Stats row */}
          <div className="mt-10 inline-flex items-center divide-x divide-border/60 rounded-2xl border border-border/60 bg-background/60 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-3 text-center">
              <p className="text-2xl font-bold text-foreground">{questionnaires.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Chestionare</p>
            </div>
            <div className="px-6 py-3 text-center">
              <p className="text-2xl font-bold text-foreground">3–10</p>
              <p className="text-xs text-muted-foreground mt-0.5">Minute / evaluare</p>
            </div>
            <div className="px-6 py-3 text-center">
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Gratuit</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Questionnaires grid + sidebar ── */}
      <QuestionnairesList questionnaires={questionnaires} />

    </>
  );
}
