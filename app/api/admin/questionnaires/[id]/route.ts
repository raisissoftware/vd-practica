import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// PATCH /api/admin/questionnaires/[id] — update/publish
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return new Response("Unauthorized", { status: 401 });

  const body = await req.json();

  // Check slug uniqueness if changing
  if (body.slug) {
    const existing = await prisma.questionnaire.findFirst({
      where: { slug: body.slug, NOT: { id: params.id } },
    });
    if (existing) return new Response("Slug already exists", { status: 409 });
  }

  const questionnaire = await prisma.questionnaire.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.estimatedMinutes !== undefined && { estimatedMinutes: body.estimatedMinutes }),
    },
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
    },
  });

  return NextResponse.json(questionnaire);
}


// DELETE /api/admin/questionnaires/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return new Response("Unauthorized", { status: 401 });

  await prisma.questionnaire.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
