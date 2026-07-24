import { INTRO_QUESTION, SECTIONS } from "./questions";
import type { StoredResponse } from "./db";

export type OptionCount = {
  option: string;
  count: number;
  pct: number;
};

export type ItemAggregation = {
  itemId: string;
  label: string;
  sectionId: string;
  sectionTitle: string;
  note?: string;
  expected?: string[];
  watch?: string[];
  totalAnswered: number;
  counts: OptionCount[];
};

function buildCounts(
  responses: StoredResponse[],
  itemId: string
): { totalAnswered: number; counts: OptionCount[] } {
  const tally = new Map<string, number>();
  let totalAnswered = 0;

  for (const response of responses) {
    const value = response.answers[itemId];
    if (!value) continue;
    totalAnswered += 1;
    tally.set(value, (tally.get(value) ?? 0) + 1);
  }

  const counts: OptionCount[] = Array.from(tally.entries())
    .map(([option, count]) => ({
      option,
      count,
      pct: totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return { totalAnswered, counts };
}

export function aggregateIntro(responses: StoredResponse[]): ItemAggregation {
  const { totalAnswered, counts } = buildCounts(responses, INTRO_QUESTION.id);
  return {
    itemId: INTRO_QUESTION.id,
    label: INTRO_QUESTION.label,
    sectionId: "intro",
    sectionTitle: "About you",
    totalAnswered,
    counts,
  };
}

export function aggregateAll(responses: StoredResponse[]): ItemAggregation[] {
  const results: ItemAggregation[] = [aggregateIntro(responses)];

  for (const section of SECTIONS) {
    for (const item of section.items) {
      const { totalAnswered, counts } = buildCounts(responses, item.id);
      results.push({
        itemId: item.id,
        label: item.label,
        sectionId: section.id,
        sectionTitle: section.title,
        note: item.note,
        expected: item.expected,
        watch: item.watch,
        totalAnswered,
        counts,
      });
    }
  }

  return results;
}
