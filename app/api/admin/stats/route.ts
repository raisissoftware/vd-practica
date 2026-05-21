import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const [
    totalQuestionnaires,
    publishedQuestionnaires,
    totalLeads,
    recentLeads,
    questionnaires,
  ] = await Promise.all([
    prisma.questionnaire.count(),
    prisma.questionnaire.count({ where: { status: "PUBLISHED" } }),
    prisma.lead.count(),
    // Leads in the last 30 days
    prisma.lead.count({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
    // Last 5 questionnaires for recent activity
    prisma.questionnaire.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, createdAt: true, status: true },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalQuestionnaires,
      publishedQuestionnaires,
      totalLeads,
      recentLeads,
    },
    recentQuestionnaires: questionnaires,
  });
}
