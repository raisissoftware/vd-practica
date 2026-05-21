import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminLeadsClient } from "@/components/admin/admin-leads-client";

export const metadata = { title: "Leads Admin – VreauDigitalizare" };

export default async function AdminLeadsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      questionnaire: { select: { title: true, slug: true } },
    },
  });

  return <AdminLeadsClient initialLeads={leads} />;
}
