import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminQuestionnairesClient } from "@/components/admin/admin-questionnaires-client";

export const metadata = {
  title: "Chestionare Admin – VreauDigitalizare",
};

export default async function AdminQuestionnairesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const questionnaires = await prisma.questionnaire.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      status: true,
      category: true,
      estimatedMinutes: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { leads: true, questions: true } },
    },
  });

  // Shape data to match client interface
  const data = questionnaires.map((q) => ({
    id: q.id,
    slug: q.slug,
    title: q.title,
    description: q.description,
    status: q.status,
    category: q.category,
    estimatedMinutes: q.estimatedMinutes,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
    _count: { leads: q._count.leads },
    _questionCount: q._count.questions,
  }));

  return <AdminQuestionnairesClient initialData={data} />;
}
