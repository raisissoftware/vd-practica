import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// POST /api/admin/questionnaires/[id]/duplicate
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN")
    return new Response("Unauthorized", { status: 401 });

  const source = await prisma.questionnaire.findUnique({
    where: { id: params.id },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!source)
    return new Response("Questionnaire not found", { status: 404 });

  // Generate unique slug
  const baseSlug = `${source.slug}-copy`;
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.questionnaire.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const copy = await prisma.$transaction(async (tx) => {
    const newQ = await tx.questionnaire.create({
      data: {
        title: `${source.title} (Copie)`,
        slug,
        description: source.description,
        status: "DRAFT",
        category: source.category,
        estimatedMinutes: source.estimatedMinutes,
      },
    });

    if (source.questions.length > 0) {
      await tx.question.createMany({
        data: source.questions.map((q) => ({
          questionnaireId: newQ.id,
          type: q.type,
          text: q.text,
          options: q.options ?? undefined,
          validations: q.validations ?? undefined,
          required: q.required,
          order: q.order,
        })),
      });
    }

    return tx.questionnaire.findUniqueOrThrow({
      where: { id: newQ.id },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { leads: true } },
      },
    });
  });

  return NextResponse.json(copy, { status: 201 });
}
