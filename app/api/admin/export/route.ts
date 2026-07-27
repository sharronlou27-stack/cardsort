import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { getAllResponses } from "@/lib/db";
import { ALL_ITEM_IDS, INTRO_QUESTION, SECTIONS } from "@/lib/questions";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(_req: NextRequest) {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const labelById: Record<string, string> = { [INTRO_QUESTION.id]: INTRO_QUESTION.label };
  for (const section of SECTIONS) {
    for (const item of section.items) labelById[item.id] = item.label;
  }

  const responses = await getAllResponses();
  const header = ["id", "created_at", "user_agent", ...ALL_ITEM_IDS.map((id) => labelById[id])];

  const rows = responses.map((r) => [
    String(r.id),
    r.createdAt,
    r.userAgent ?? "",
    ...ALL_ITEM_IDS.map((id) => r.answers[id] ?? ""),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="groupr-card-sort-responses.csv"`,
    },
  });
}
