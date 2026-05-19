import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { validateQuestionnaireRules } from "@/lib/conditional-logic/validator";

const conditionSchema = z.object({
  sourceQuestionId: z.string(),
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

const validateRulesSchema = z.array(
  z.object({
    id: z.string().optional(),
    questionId: z.string(),
    logicOperator: z.enum(["AND", "OR"]),
    conditions: z.array(conditionSchema),
  })
);

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = validateRulesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          valid: false,
          errors: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
            code: "SCHEMA_VALIDATION_ERROR",
          })),
        },
        { status: 422 }
      );
    }

    const inputRuleGroups = parsed.data;

    // Fetch questions to run order validations
    const questions = await prisma.question.findMany({
      where: { questionnaireId: params.id },
      orderBy: { order: "asc" },
    });

    // Map input to standard validation interface
    const ruleGroupsToValidate = inputRuleGroups.map((g) => ({
      questionId: g.questionId,
      logicOperator: g.logicOperator,
      conditions: g.conditions.map((c) => ({
        ruleGroupId: g.id || "temp",
        sourceQuestionId: c.sourceQuestionId,
        operator: c.operator,
        value: c.value,
        valueSecondary: c.valueSecondary,
      })),
    }));

    const validationErrors = validateQuestionnaireRules(questions, ruleGroupsToValidate);

    if (validationErrors.length > 0) {
      return NextResponse.json({
        valid: false,
        errors: validationErrors,
      });
    }

    return NextResponse.json({
      valid: true,
      errors: [],
    });
  } catch (error) {
    console.error("Validate Rules error:", error);
    return NextResponse.json(
      { error: "Eroare internă la validarea regulilor." },
      { status: 500 }
    );
  }
}
