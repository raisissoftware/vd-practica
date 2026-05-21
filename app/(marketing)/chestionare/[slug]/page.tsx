import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PublicRenderer from "@/components/questionnaire/PublicRenderer";
import type { Metadata } from "next";

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const q = await prisma.questionnaire.findUnique({ where: { slug } });
  if (!q) return { title: "Chestionar | VreauDigitalizare" };
  return {
    title: `${q.title} | VreauDigitalizare`,
    description:
      q.description ??
      "Completează chestionarul și primești recomandări personalizate.",
  };
}

async function getQuestionnaire(slug: string) {
  const questionnaire = await prisma.questionnaire.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          ruleGroups: {
            include: { conditions: true },
          },
        },
      },
    },
  });

  if (!questionnaire) return null;

  return {
    id: questionnaire.id,
    slug: questionnaire.slug,
    title: questionnaire.title,
    description: questionnaire.description,
    questions: questionnaire.questions.map((q) => ({
      id: q.id,
      type: q.type as "TEXT" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "RATING",
      text: q.text,
      options: q.options ? (q.options as unknown as string[]) : null,
      required: q.required,
      order: q.order,
      ruleGroups: q.ruleGroups.map((g) => ({
        id: g.id,
        questionId: g.questionId,
        logicOperator: g.logicOperator as "AND" | "OR",
        conditions: g.conditions.map((c) => ({
          id: c.id,
          ruleGroupId: c.ruleGroupId,
          sourceQuestionId: c.sourceQuestionId,
          operator: c.operator as any,
          value: c.value,
          valueSecondary: c.valueSecondary,
        })),
      })),
    })),
  };
}

export default async function ChestionarSlugPage({ params }: Props) {
  const { slug } = await params;
  const data = await getQuestionnaire(slug);

  if (!data) notFound();

  return (
    <>
      {/* Subtle top divider glow */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

      {/* Questionnaire renderer */}
      <div className="relative min-h-[80vh] flex items-center justify-center py-12 overflow-hidden">
        {/* Background glows */}
        <div className="absolute -left-40 top-1/4 h-[400px] w-[400px] rounded-full bg-sky-500/5 blur-[120px] -z-10" />
        <div className="absolute -right-40 bottom-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[120px] -z-10" />

        <PublicRenderer data={data} />
      </div>
    </>
  );
}
