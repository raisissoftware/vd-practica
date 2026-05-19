import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const events = await prisma.questionnaireAnalyticsEvent.findMany({
      where: { questionnaireId: params.id },
      orderBy: { createdAt: "asc" },
    });

    // 1. Branch hit counts
    const branchHitCounts: Record<string, number> = {};
    const branchEvents = events.filter((e) => e.eventType === "BRANCH_TAKEN");
    for (const event of branchEvents) {
      if (event.ruleGroupId) {
        branchHitCounts[event.ruleGroupId] = (branchHitCounts[event.ruleGroupId] || 0) + 1;
      }
    }

    // 2. Abandonment count per question
    const abandonmentCounts: Record<string, number> = {};
    const abandonmentEvents = events.filter((e) => e.eventType === "QUESTIONNAIRE_ABANDONED");
    for (const event of abandonmentEvents) {
      if (event.questionId) {
        abandonmentCounts[event.questionId] = (abandonmentCounts[event.questionId] || 0) + 1;
      }
    }

    // 3. Question shown counts
    const questionShownCounts: Record<string, number> = {};
    const shownEvents = events.filter((e) => e.eventType === "QUESTION_SHOWN");
    for (const event of shownEvents) {
      if (event.questionId) {
        questionShownCounts[event.questionId] = (questionShownCounts[event.questionId] || 0) + 1;
      }
    }

    // 4. Trace common paths (ordered transitions per session)
    const sessionsMap = new Map<string, Array<{ questionId: string | null; type: string }>>();
    for (const event of events) {
      if (!sessionsMap.has(event.sessionId)) {
        sessionsMap.set(event.sessionId, []);
      }
      sessionsMap.get(event.sessionId)!.push({
        questionId: event.questionId,
        type: event.eventType,
      });
    }

    const pathFrequencies: Record<string, number> = {};
    sessionsMap.forEach((transitions) => {
      // Create a simplified path string, e.g. "q1 -> q2 -> q4"
      const path = transitions
        .filter((t) => t.type === "QUESTION_SHOWN" || t.type === "BRANCH_TAKEN")
        .map((t) => t.questionId)
        .filter(Boolean)
        .join(" -> ");

      if (path) {
        pathFrequencies[path] = (pathFrequencies[path] || 0) + 1;
      }
    });

    const commonPaths = Object.entries(pathFrequencies)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      branchHitCounts,
      abandonmentCounts,
      questionShownCounts,
      commonPaths,
    });
  } catch (error) {
    console.error("GET Analytics error:", error);
    return NextResponse.json(
      { error: "Eroare internă la preluarea datelor analitice." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { eventType, questionId, ruleGroupId, sessionId, metadata } = body;

    if (!eventType || !sessionId) {
      return NextResponse.json({ error: "Date incomplete pentru logare." }, { status: 400 });
    }

    const event = await prisma.questionnaireAnalyticsEvent.create({
      data: {
        eventType,
        questionnaireId: params.id,
        questionId,
        ruleGroupId,
        sessionId,
        metadata,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST Analytics error:", error);
    return NextResponse.json(
      { error: "Eroare internă la salvarea logului de analiză." },
      { status: 500 }
    );
  }
}
