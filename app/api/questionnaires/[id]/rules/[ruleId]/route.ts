import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { validateQuestionnaireRules } from "@/lib/conditional-logic/validator";

const conditionSchema = z.object({
  sourceQuestionId: z.string({ required_error: "Întrebarea sursă este obligatorie" }),
  operator: z.enum([
    "EQUALS",
    "NOT_EQUALS",
    "CONTAINS",
    "NOT_CONTAINS",
    "IS_EMPTY",
    "IS_NOT_EMPTY",
    "GT",
    "LT",
    "BETWEEN",
    "INCLUDES",
    "EXCLUDES",
  ]),
  value: z.string().optional().nullable(),
  valueSecondary: z.string().optional().nullable(),
});

const updateRuleGroupSchema = z.object({
  logicOperator: z.enum(["AND", "OR"]),
  conditions: z.array(conditionSchema).min(1, "Trebuie adăugată cel puțin o condiție"),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; ruleId: string } }
) {
  try {
    const body = await req.json();
    const parsed = updateRuleGroupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          errors: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
            code: i.code,
          })),
        },
        { status: 422 }
      );
    }

    const { logicOperator, conditions } = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch current rule group
      const currentGroup = await tx.conditionalRuleGroup.findUnique({
        where: { id: params.ruleId },
      });

      if (!currentGroup) {
        throw new Error("RULE_NOT_FOUND");
      }

      // 2. Fetch all questions
      const questions = await tx.question.findMany({
        where: { questionnaireId: params.id },
        orderBy: { order: "asc" },
      });

      // 3. Fetch all other rule groups
      const otherGroups = await tx.conditionalRuleGroup.findMany({
        where: {
          id: { not: params.ruleId },
          question: {
            questionnaireId: params.id,
          },
        },
        include: {
          conditions: true,
        },
      });

      // 4. Validate dry-run in-memory
      const mockUpdatedGroup = {
        questionId: currentGroup.questionId,
        logicOperator,
        conditions: conditions.map((c) => ({
          ruleGroupId: params.ruleId,
          sourceQuestionId: c.sourceQuestionId,
          operator: c.operator,
          value: c.value,
          valueSecondary: c.valueSecondary,
        })),
      };

      const allGroupsForValidation = [...otherGroups, mockUpdatedGroup];
      const validationErrors = validateQuestionnaireRules(questions, allGroupsForValidation);

      if (validationErrors.length > 0) {
        throw new Error(JSON.stringify(validationErrors));
      }

      // 5. Apply changes: delete old conditions and create new ones
      await tx.condition.deleteMany({
        where: { ruleGroupId: params.ruleId },
      });

      const updatedGroup = await tx.conditionalRuleGroup.update({
        where: { id: params.ruleId },
        data: {
          logicOperator,
          conditions: {
            create: conditions.map((c) => ({
              sourceQuestionId: c.sourceQuestionId,
              operator: c.operator,
              value: c.value,
              valueSecondary: c.valueSecondary,
            })),
          },
        },
        include: {
          conditions: true,
        },
      });

      return updatedGroup;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "RULE_NOT_FOUND") {
      return NextResponse.json({ error: "Regula nu a fost găsită." }, { status: 404 });
    }

    try {
      const parsedErrors = JSON.parse(error.message);
      if (Array.isArray(parsedErrors)) {
        return NextResponse.json({ errors: parsedErrors }, { status: 422 });
      }
    } catch (_) {}

    console.error("PUT Rule error:", error);
    return NextResponse.json({ error: "Eroare internă la actualizarea regulii." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; ruleId: string } }
) {
  try {
    const group = await prisma.conditionalRuleGroup.findUnique({
      where: { id: params.ruleId },
    });

    if (!group) {
      return NextResponse.json({ error: "Regula nu a fost găsită." }, { status: 404 });
    }

    // Cascade delete of conditions is handled in Prisma/PostgreSQL schema,
    // but we can explicitly delete it inside transaction
    await prisma.$transaction([
      prisma.condition.deleteMany({
        where: { ruleGroupId: params.ruleId },
      }),
      prisma.conditionalRuleGroup.delete({
        where: { id: params.ruleId },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Rule error:", error);
    return NextResponse.json({ error: "Eroare internă la ștergerea regulii." }, { status: 500 });
  }
}
