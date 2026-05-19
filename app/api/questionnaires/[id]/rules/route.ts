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

const createRuleGroupSchema = z.object({
  questionId: z.string({ required_error: "Întrebarea țintă este obligatorie" }),
  logicOperator: z.enum(["AND", "OR"]),
  conditions: z.array(conditionSchema).min(1, "Trebuie adăugată cel puțin o condiție"),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ruleGroups = await prisma.conditionalRuleGroup.findMany({
      where: {
        question: {
          questionnaireId: params.id,
        },
      },
      include: {
        conditions: true,
      },
    });

    return NextResponse.json(ruleGroups);
  } catch (error) {
    console.error("GET Rules error:", error);
    return NextResponse.json({ error: "Eroare la preluarea regulilor." }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = createRuleGroupSchema.safeParse(body);

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

    const { questionId, logicOperator, conditions } = parsed.data;

    // Run within a transaction to guarantee consistency and perform dynamic validations
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch questions to verify order
      const questions = await tx.question.findMany({
        where: { questionnaireId: params.id },
        orderBy: { order: "asc" },
      });

      // 2. Fetch existing rule groups to check for cycles
      const existingGroups = await tx.conditionalRuleGroup.findMany({
        where: {
          question: {
            questionnaireId: params.id,
          },
        },
        include: {
          conditions: true,
        },
      });

      // 3. Perform dry-run validation with the new group appended
      const mockNewGroup = {
        questionId,
        logicOperator,
        conditions: conditions.map((c) => ({
          ruleGroupId: "mock",
          sourceQuestionId: c.sourceQuestionId,
          operator: c.operator,
          value: c.value,
          valueSecondary: c.valueSecondary,
        })),
      };

      const allGroupsForValidation = [...existingGroups, mockNewGroup];
      const validationErrors = validateQuestionnaireRules(questions, allGroupsForValidation);

      if (validationErrors.length > 0) {
        throw new Error(JSON.stringify(validationErrors));
      }

      // 4. Persistence
      const ruleGroup = await tx.conditionalRuleGroup.create({
        data: {
          questionId,
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

      return ruleGroup;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    // If it is our validation error thrown inside transaction
    try {
      const parsedErrors = JSON.parse(error.message);
      if (Array.isArray(parsedErrors)) {
        return NextResponse.json({ errors: parsedErrors }, { status: 422 });
      }
    } catch (_) {}

    console.error("POST Rules error:", error);
    return NextResponse.json({ error: "Eroare internă la salvarea regulii." }, { status: 500 });
  }
}
