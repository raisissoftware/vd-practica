import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export const metadata = {
  title: "Admin Dashboard – VreauDigitalizare",
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalQuestionnaires,
    publishedQuestionnaires,
    totalLeads,
    recentLeads,
    recentQuestionnaires,
    topQuestionnaires,
    leadsBySource,
    leadsByDay,
  ] = await Promise.all([
    prisma.questionnaire.count(),
    prisma.questionnaire.count({ where: { status: "PUBLISHED" } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.questionnaire.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, title: true, createdAt: true, status: true },
    }),
    prisma.questionnaire.findMany({
      orderBy: { leads: { _count: "desc" } },
      take: 4,
      select: {
        id: true,
        title: true,
        slug: true,
        _count: { select: { leads: true } },
      },
    }),
    // Source breakdown for donut chart
    prisma.lead.groupBy({
      by: ["source"],
      _count: { source: true, _all: true },
      orderBy: { _count: { source: "desc" } },
      take: 5,
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    // Leads per day (last 30 days) for area chart
    prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT
        DATE("createdAt")::text AS date,
        COUNT(*)::bigint AS count
      FROM leads
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `,
  ]);

  // Build daily series
  const dailyMap = new Map<string, number>();
  for (const row of leadsByDay) {
    dailyMap.set(row.date, Number(row.count));
  }

  const dailySeries: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailySeries.push({ date: key, count: dailyMap.get(key) ?? 0 });
  }

  return (
    <AdminDashboardClient
      stats={{ totalQuestionnaires, publishedQuestionnaires, totalLeads, recentLeads }}
      recentQuestionnaires={recentQuestionnaires}
      topQuestionnaires={topQuestionnaires}
      dailySeries={dailySeries}
      leadsBySource={leadsBySource.map((s) => ({
        source: s.source ?? "direct",
        count: s._count._all ?? 0,
      }))}
    />
  );
}
