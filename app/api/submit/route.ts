import { NextRequest, NextResponse } from "next/server";
import { insertResponse } from "@/lib/db";
import { ALL_ITEM_IDS, INTRO_QUESTION } from "@/lib/questions";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const answers = (body as { answers?: unknown })?.answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return NextResponse.json({ error: "Missing answers" }, { status: 400 });
  }

  const answersRecord = answers as Record<string, unknown>;
  const requiredIds = ALL_ITEM_IDS.filter((id) => id !== INTRO_QUESTION.id);
  const missing = requiredIds.filter(
    (id) => typeof answersRecord[id] !== "string" || !answersRecord[id]
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Survey is incomplete", missing },
      { status: 400 }
    );
  }

  const cleanAnswers: Record<string, string> = {};
  for (const id of ALL_ITEM_IDS) {
    const value = answersRecord[id];
    if (typeof value === "string") cleanAnswers[id] = value;
  }

  const userAgent = req.headers.get("user-agent");
  const id = await insertResponse(cleanAnswers, userAgent);

  return NextResponse.json({ ok: true, id });
}
