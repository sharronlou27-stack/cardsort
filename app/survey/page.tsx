"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { INTRO_QUESTION, SECTIONS } from "@/lib/questions";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type Step =
  | { kind: "intro" }
  | { kind: "section"; sectionIndex: number };

export default function SurveyPage() {
  const router = useRouter();
  const steps = useMemo<Step[]>(
    () => [
      { kind: "intro" },
      ...SECTIONS.map((_, sectionIndex) => ({ kind: "section" as const, sectionIndex })),
    ],
    []
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shuffle each item's options once, up front, so order stays stable while navigating.
  const shuffledOptionsByItem = useRef<Record<string, string[]>>({}).current;
  for (const section of SECTIONS) {
    if (!section.shuffle) continue;
    for (const item of section.items) {
      if (!shuffledOptionsByItem[item.id]) {
        shuffledOptionsByItem[item.id] = shuffle(section.options);
      }
    }
  }

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  function setAnswer(itemId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  }

  function currentSectionIsComplete(): boolean {
    if (step.kind !== "section") return true;
    const section = SECTIONS[step.sectionIndex];
    return section.items.every((item) => Boolean(answers[item.id]));
  }

  async function handleContinue() {
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Submission failed");
      router.push("/thank-you");
    } catch (err) {
      setError("Something went wrong submitting your answers. Please try again.");
      setSubmitting(false);
    }
  }

  function handleBack() {
    setStepIndex((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const progressPct = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <div className="mb-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-medium text-neutral-500">
          Step {stepIndex + 1} of {steps.length}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
        {step.kind === "intro" ? (
          <IntroStep value={answers[INTRO_QUESTION.id]} onChange={setAnswer} />
        ) : (
          <SectionStep
            section={SECTIONS[step.sectionIndex]}
            answers={answers}
            shuffledOptionsByItem={shuffledOptionsByItem}
            onChange={setAnswer}
          />
        )}

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0 || submitting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 disabled:opacity-0"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!currentSectionIsComplete() || submitting}
            className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {submitting ? "Submitting…" : isLastStep ? "Submit" : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}

function IntroStep({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (itemId: string, value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
        A quick question about you (optional)
      </p>
      <h2 className="mt-2 text-xl font-semibold text-neutral-900">
        {INTRO_QUESTION.label}
      </h2>
      <div className="mt-5 space-y-2">
        {INTRO_QUESTION.options.map((option) => (
          <OptionRadio
            key={option}
            name={INTRO_QUESTION.id}
            option={option}
            checked={value === option}
            onSelect={() => onChange(INTRO_QUESTION.id, option)}
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-neutral-400">
        You can skip this and press Continue if you'd rather not answer.
      </p>
    </div>
  );
}

function SectionStep({
  section,
  answers,
  shuffledOptionsByItem,
  onChange,
}: {
  section: (typeof SECTIONS)[number];
  answers: Record<string, string>;
  shuffledOptionsByItem: Record<string, string[]>;
  onChange: (itemId: string, value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
        {section.part === 1 ? "Part 1" : "Part 2"}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-neutral-900">{section.title}</h2>
      <p className="mt-2 text-sm text-neutral-500">{section.description}</p>

      <div className="mt-6 space-y-8">
        {section.items.map((item) => {
          const options = shuffledOptionsByItem[item.id] ?? section.options;
          return (
            <div key={item.id}>
              <p className="font-medium text-neutral-800">{item.label}</p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {options.map((option) => (
                  <OptionRadio
                    key={option}
                    name={item.id}
                    option={option}
                    checked={answers[item.id] === option}
                    onSelect={() => onChange(item.id, option)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OptionRadio({
  name,
  option,
  checked,
  onSelect,
}: {
  name: string;
  option: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
        checked
          ? "border-brand-600 bg-brand-50 text-brand-700"
          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="h-4 w-4 accent-brand-600"
      />
      {option}
    </label>
  );
}
