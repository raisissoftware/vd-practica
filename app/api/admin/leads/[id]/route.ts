import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// GET /api/admin/leads/[id] — lead detail with all answers
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN")
    return new Response("Unauthorized", { status: 401 });

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      questionnaire: {
        select: { id: true, title: true, slug: true },
      },
      answers: {
        include: {
          question: {
            select: { id: true, text: true, type: true, order: true },
          },
        },
        orderBy: { question: { order: "asc" } },
      },
    },
  });

  if (!lead) return new Response("Lead not found", { status: 404 });

  return NextResponse.json({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    score: lead.score,
    level: lead.level,
    aiReport: lead.aiReport,
    createdAt: lead.createdAt,
    questionnaire: lead.questionnaire,
    answers: lead.answers.map((a) => ({
      id: a.id,
      questionId: a.questionId,
      questionText: a.question.text,
      questionType: a.question.type,
      questionOrder: a.question.order,
      answer: (() => {
        try {
          return JSON.parse(a.answer);
        } catch {
          return a.answer;
        }
      })(),
    })),
  });
}

// DELETE /api/admin/leads/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN")
    return new Response("Unauthorized", { status: 401 });

  await prisma.lead.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
