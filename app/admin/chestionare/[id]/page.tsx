import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import RulesDashboardClient from "./RulesDashboardClient";

interface AdminQuestionnairePageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0;

export default async function AdminQuestionnairePage({
  params,
}: AdminQuestionnairePageProps) {
  // Find questionnaire by ID or slug
  const questionnaire = await prisma.questionnaire.findFirst({
    where: {
      OR: [
        { id: params.id },
        { slug: params.id }
      ]
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          ruleGroups: {
            include: {
              conditions: true
            }
          }
        }
      },
    },
  });

  if (!questionnaire) {
    notFound();
  }

  // Format questions for UI use
  const formattedQuestions = questionnaire.questions.map((q) => ({
    id: q.id,
    type: q.type as "TEXT" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "RATING",
    text: q.text,
    options: q.options ? (q.options as any as string[]) : null,
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
  }));

  const serializedQuestionnaire = {
    id: questionnaire.id,
    slug: questionnaire.slug,
    title: questionnaire.title,
    description: questionnaire.description,
    questions: formattedQuestions,
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent inline-block">
          Configurator Reguli Chestionar
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestionează regulile de vizibilitate condiționată și testează-le în timp real folosind simulatorul integrat.
        </p>
      </div>

      <RulesDashboardClient questionnaire={serializedQuestionnaire} />
    </div>
  );
}
