"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { INTRO_QUESTION, SECTIONS, type Section } from "@/lib/questions";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type Step = { kind: "intro" } | { kind: "section"; index: number };

export default function SurveyPage() {
  const router = useRouter();
  const steps = useMemo<Step[]>(
    () => [
      { kind: "intro" },
      ...SECTIONS.map((_, index) => ({ kind: "section" as const, index })),
    ],
    []
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const binOrderRef = useRef<Record<string, string[]>>({});
  function binsFor(section: Section): string[] {
    if (!section.shuffle) return section.options;
    if (!binOrderRef.current[section.id]) {
      binOrderRef.current[section.id] = shuffle(section.options);
    }
    return binOrderRef.current[section.id];
  }

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const section = step.kind === "section" ? SECTIONS[step.index] : null;

  function sectionComplete(): boolean {
    if (!section) return true;
    return section.items.every((item) => Boolean(answers[item.id]));
  }

  function setAnswer(itemId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  }

  function removeAnswer(itemId: string) {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }

  function toggleSelectCard(itemId: string) {
    setSelectedCard((prev) => (prev === itemId ? null : itemId));
  }

  function placeSelectedCard(category: string) {
    setSelectedCard((prev) => {
      if (prev) setAnswer(prev, category);
      return null;
    });
  }

  function startCardDrag(e: React.PointerEvent<HTMLDivElement>, itemId: string, label: string) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    let moved = false;
    let lastBin: HTMLElement | null = null;

    const ghost = document.createElement("div");
    ghost.textContent = label;
    Object.assign(ghost.style, {
      position: "fixed",
      zIndex: "999",
      pointerEvents: "none",
      background: "var(--surface)",
      border: "1px solid var(--accent)",
      borderRadius: "9px",
      padding: "9px 13px",
      fontSize: "13.5px",
      fontWeight: "700",
      fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
      boxShadow: "0 14px 28px -10px rgba(0,0,0,0.4)",
      color: "var(--text)",
      left: `${startX}px`,
      top: `${startY}px`,
      transform: "translate(-50%, -50%) rotate(-3deg)",
    } satisfies Partial<CSSStyleDeclaration>);
    document.body.appendChild(ghost);

    const cardEl = e.currentTarget;
    cardEl.classList.add("opacity-30");

    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      if (!moved) return;
      ev.preventDefault();
      ghost.style.left = `${ev.clientX}px`;
      ghost.style.top = `${ev.clientY}px`;
      const elUnder = document.elementFromPoint(ev.clientX, ev.clientY);
      const bin = elUnder ? (elUnder as HTMLElement).closest<HTMLElement>("[data-bin]") : null;
      if (bin !== lastBin) {
        lastBin?.classList.remove("bin-drag-over");
        bin?.classList.add("bin-drag-over");
        lastBin = bin;
      }
    }

    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      ghost.remove();
      cardEl.classList.remove("opacity-30");
      lastBin?.classList.remove("bin-drag-over");

      if (moved && lastBin) {
        const category = lastBin.getAttribute("data-bin");
        if (category) setAnswer(itemId, category);
        setSelectedCard(null);
      } else if (!moved) {
        toggleSelectCard(itemId);
      }
    }

    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  }

  async function handleContinue() {
    if (!isLastStep) {
      setSelectedCard(null);
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
    } catch {
      setError("Something went wrong submitting your answers. Please try again.");
      setSubmitting(false);
    }
  }

  function handleBack() {
    setSelectedCard(null);
    setStepIndex((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const progressPct = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <main className="mx-auto min-h-[calc(100vh-57px)] max-w-2xl px-6 py-10">
      <div className="mb-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-groupr-line">
          <div
            className="h-full rounded-full bg-groupr-accent transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 font-display text-xs font-bold tabular-nums text-groupr-inkFaint">
          Step {stepIndex + 1} of {steps.length}
        </p>
      </div>

      <div className="rounded-[20px] border border-groupr-line bg-groupr-surface p-8 shadow-groupr">
        {step.kind === "intro" ? (
          <IntroStep value={answers[INTRO_QUESTION.id]} onChange={setAnswer} />
        ) : (
          <SectionStep
            section={section!}
            answers={answers}
            bins={binsFor(section!)}
            selectedCard={selectedCard}
            onStartDrag={startCardDrag}
            onToggleSelect={toggleSelectCard}
            onPlaceSelected={placeSelectedCard}
            onRemove={removeAnswer}
            onCancelPick={() => setSelectedCard(null)}
          />
        )}

        {error && <p className="mt-6 text-sm text-groupr-danger">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0 || submitting}
            className={`font-display text-sm font-bold text-groupr-inkMuted ${
              stepIndex === 0 ? "invisible" : ""
            }`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!sectionComplete() || submitting}
            className="rounded-lg bg-groupr-accent px-6 py-2.5 font-display text-sm font-bold text-groupr-onAccent transition hover:bg-groupr-accentStrong disabled:cursor-not-allowed disabled:bg-groupr-inkFaint disabled:text-groupr-surface"
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
      <p className="font-display text-xs font-bold uppercase tracking-wider text-groupr-accentStrong">
        A quick question about you (optional)
      </p>
      <h2 className="mt-2 font-display text-xl font-bold text-groupr-ink">
        {INTRO_QUESTION.label}
      </h2>
      <div className="mt-5 space-y-2">
        {INTRO_QUESTION.options.map((option) => {
          const checked = value === option;
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                checked
                  ? "border-groupr-accent bg-groupr-accentSoft font-semibold text-groupr-accentStrong"
                  : "border-groupr-line text-groupr-ink hover:border-groupr-inkFaint"
              }`}
            >
              <input
                type="radio"
                name={INTRO_QUESTION.id}
                checked={checked}
                onChange={() => onChange(INTRO_QUESTION.id, option)}
                className="h-4 w-4 accent-groupr-accent"
              />
              {option}
            </label>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-groupr-inkFaint">
        You can skip this and press Continue if you&rsquo;d rather not answer.
      </p>
    </div>
  );
}

function SectionStep({
  section,
  answers,
  bins,
  selectedCard,
  onStartDrag,
  onToggleSelect,
  onPlaceSelected,
  onRemove,
  onCancelPick,
}: {
  section: Section;
  answers: Record<string, string>;
  bins: string[];
  selectedCard: string | null;
  onStartDrag: (e: React.PointerEvent<HTMLDivElement>, itemId: string, label: string) => void;
  onToggleSelect: (itemId: string) => void;
  onPlaceSelected: (category: string) => void;
  onRemove: (itemId: string) => void;
  onCancelPick: () => void;
}) {
  const unplaced = section.items.filter((item) => !answers[item.id]);
  const pickedItem = selectedCard
    ? section.items.find((item) => item.id === selectedCard)
    : undefined;

  return (
    <div>
      <p className="font-display text-xs font-bold uppercase tracking-wider text-groupr-accentStrong">
        Part {section.part}
      </p>
      <h2 className="mt-2 font-display text-xl font-bold text-groupr-ink">{section.title}</h2>
      <p className="mt-2 text-sm text-groupr-inkMuted">{section.description}</p>

      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-groupr-inkMuted">
            Cards to sort
          </span>
          <span className="text-xs tabular-nums text-groupr-inkFaint">{unplaced.length} left</span>
        </div>
        <div className="flex min-h-[52px] flex-wrap gap-2 rounded-xl border border-dashed border-groupr-line bg-groupr-surface2 p-2.5">
          {unplaced.length === 0 ? (
            <p className="p-1.5 text-sm text-groupr-inkFaint">
              All set &mdash; everything below has a home.
            </p>
          ) : (
            unplaced.map((item) => (
              <div
                key={item.id}
                onPointerDown={(e) => onStartDrag(e, item.id, item.label)}
                tabIndex={0}
                role="button"
                aria-pressed={selectedCard === item.id}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleSelect(item.id);
                  }
                }}
                className={`select-none rounded-[9px] border px-3.5 py-2 font-display text-[13.5px] font-bold text-groupr-ink shadow-sm transition ${
                  selectedCard === item.id
                    ? "border-groupr-accent ring-2 ring-groupr-accentSoft"
                    : "border-groupr-line"
                }`}
                style={{ touchAction: "none", cursor: "grab", background: "var(--surface)" }}
              >
                {item.label}
              </div>
            ))
          )}
        </div>
      </div>

      {pickedItem ? (
        <div className="mt-3.5 flex items-center gap-2 rounded-lg bg-groupr-accentSoft px-3.5 py-2 font-display text-sm font-bold text-groupr-accentStrong">
          <span>Placing &ldquo;{pickedItem.label}&rdquo; &mdash; tap a category below</span>
          <button
            type="button"
            onClick={onCancelPick}
            className="ml-auto rounded px-2 py-0.5 text-groupr-accentStrong hover:bg-black/5"
          >
            Cancel
          </button>
        </div>
      ) : (
        <p className="mb-1 mt-3 text-sm text-groupr-inkFaint">
          Drag a card into a category, or tap a card then tap a category.
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {bins.map((category) => {
          const itemsInBin = section.items.filter((item) => answers[item.id] === category);
          return (
            <div
              key={category}
              data-bin={category}
              tabIndex={0}
              role="button"
              onClick={() => {
                if (selectedCard) onPlaceSelected(category);
              }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && selectedCard) {
                  e.preventDefault();
                  onPlaceSelected(category);
                }
              }}
              className={`flex min-h-[80px] flex-col gap-1.5 rounded-xl border p-2.5 transition ${
                itemsInBin.length ? "border-groupr-line" : "border-dashed border-groupr-line"
              } ${selectedCard ? "cursor-pointer" : ""}`}
            >
              <div
                className={`font-display text-xs font-bold ${
                  itemsInBin.length ? "text-groupr-ink" : "text-groupr-inkMuted"
                }`}
              >
                {category}
              </div>
              {itemsInBin.length > 0 && (
                <div className="flex flex-col gap-1">
                  {itemsInBin.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-1.5 rounded-md bg-groupr-accentSoft px-2 py-1 font-display text-[12.5px] font-bold text-groupr-accentStrong"
                    >
                      <span>{item.label}</span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(item.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            onRemove(item.id);
                          }
                        }}
                        className="cursor-pointer px-0.5 opacity-60 hover:opacity-100"
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
