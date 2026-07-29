"use client";

import { useMemo, useState } from "react";
import {
  AMBASSADOR_CODE,
  BINGO_COLUMNS,
  BOARD_COMPLETE_BONUS,
  CREDIT_CAP,
  PROGRESS_TRACK_LENGTH,
  rewardsInBoardOrder,
  totalEarned,
  type BingoReward,
} from "@/lib/bingo";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 15V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.6} />
      <path d="M9.6 9.3a2.4 2.4 0 114 1.9c-.7.6-1.6 1-1.6 2.1" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={12} cy={16.6} r={0.9} fill="currentColor" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x={9} y={9} width={11} height={11} rx={2} stroke="currentColor" strokeWidth={1.8} />
      <path d="M5 15V6a2 2 0 012-2h9" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 4V5z" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx={8.5} cy={9.5} r={1} fill="currentColor" />
      <circle cx={12} cy={9.5} r={1} fill="currentColor" />
      <circle cx={15.5} cy={9.5} r={1} fill="currentColor" />
    </svg>
  );
}

const STATUS_PILL_CLASSES: Record<BingoReward["status"], string> = {
  won: "bg-[#0b3d2e] text-white",
  not_started: "bg-[#efece0] text-[#8f8b74]",
  free: "bg-[#e2efd8] text-[#0b3d2e]",
};

const STATUS_LABEL: Record<BingoReward["status"], string> = {
  won: "WON",
  not_started: "NOT STARTED",
  free: "FREE",
};

export default function AmbassadorBingoPage() {
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("B1");
  const [rewardsExpanded, setRewardsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const ordered = useMemo(() => rewardsInBoardOrder(), []);
  const selected = ordered.find((r) => r.id === selectedId) ?? null;
  const earned = useMemo(() => totalEarned(), []);

  function selectReward(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
    setRewardsExpanded(true);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(AMBASSADOR_CODE);
    } catch {
      // clipboard unavailable — silently ignore, the code is still shown on screen
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function textNeighbor() {
    const body = encodeURIComponent(
      `Use my Groupr ambassador code ${AMBASSADOR_CODE} when you order — it helps us both out!`
    );
    window.location.href = `sms:?&body=${body}`;
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ambassador Bingo",
          text: `Use my Groupr ambassador code ${AMBASSADOR_CODE} when you order — it helps us both out!`,
        });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
    } else {
      copyCode();
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7ea] pb-16">
      <div className="mx-auto max-w-md px-5 pt-8">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-[26px] font-bold leading-tight text-[#0b3d2e]">
            Ambassador Bingo
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-[#0b3d2e] px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-95"
            >
              <ShareIcon />
              Share code
            </button>
            <button
              aria-label="Help"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0b3d2e] bg-[#c3d59a] text-[#0b3d2e]"
            >
              <HelpIcon />
            </button>
          </div>
        </div>

        <div className="mt-7 flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8f8b74]">
            Total earned
          </p>
          <p className="whitespace-nowrap text-sm text-[#8f8b74]">Up to ${CREDIT_CAP} in credit</p>
        </div>
        <p className="font-display text-[42px] font-bold leading-none text-[#0b3d2e]">${earned}</p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 gap-1.5">
            {Array.from({ length: PROGRESS_TRACK_LENGTH }).map((_, i) => (
              <span key={i} className="h-1.5 flex-1 rounded-full bg-[#e3ddc4]" />
            ))}
          </div>
          <span className="whitespace-nowrap text-sm font-medium text-[#6b6b5a]">
            Board +${BOARD_COMPLETE_BONUS}
          </span>
        </div>

        <div className="mt-6 rounded-[28px] border border-[#e6e1c8] bg-[#f4f0df] p-4">
          <div className="grid grid-cols-5 gap-2.5">
            {BINGO_COLUMNS.map((col) => (
              <div key={col} className="text-center font-display text-lg font-bold text-[#c9922f]">
                {col}
              </div>
            ))}
            {ordered.map((r) => {
              const isSelected = r.id === selectedId;
              return (
                <button
                  key={r.id}
                  onClick={() => selectReward(r.id)}
                  aria-pressed={isSelected}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl border transition ${
                    r.status === "won"
                      ? "border-[#0b3d2e] bg-[#0b3d2e] text-white"
                      : r.status === "free"
                        ? "border-[#dbe7cd] bg-[#e6f0da] text-[#0b3d2e]"
                        : "border-[#e6e1c8] bg-white text-[#0b3d2e]"
                  } ${isSelected ? "ring-2 ring-[#2f9e6b] ring-offset-2 ring-offset-[#f4f0df]" : ""}`}
                >
                  {r.status !== "free" && (
                    <span
                      className={`absolute left-2 top-1.5 text-[10px] font-medium ${
                        r.status === "won" ? "text-white/70" : "text-[#a9a48d]"
                      }`}
                    >
                      {r.id}
                    </span>
                  )}
                  {r.status === "won" ? (
                    <CheckIcon />
                  ) : r.status === "free" ? (
                    <span className="text-2xl" role="img" aria-label="Free space">
                      🥕
                    </span>
                  ) : (
                    <span className="text-lg font-bold">${r.amount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selected && (
          <div className="mt-6">
            <button
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-1 text-sm font-medium text-[#6b6b5a]"
            >
              <BackArrowIcon />
              Back
            </button>

            <div className="mt-3 flex items-start justify-between gap-3 rounded-2xl border border-[#e6e1c8] bg-white p-4">
              <div className="min-w-0">
                <p className="font-display text-lg font-bold text-[#0b3d2e]">{selected.title}</p>
                <p className="mt-1 text-sm text-[#8f8b74]">{selected.description}</p>
              </div>
              {selected.status !== "free" && (
                <span className="whitespace-nowrap rounded-full bg-[#e2efd8] px-3 py-1 text-sm font-bold text-[#2f7a4f]">
                  +${selected.amount}
                </span>
              )}
            </div>

            <button
              onClick={() => setRewardsExpanded((v) => !v)}
              className="mt-5 flex w-full items-center justify-between text-left"
            >
              <span className="font-display text-lg font-bold text-[#0b3d2e]">All rewards</span>
              <ChevronIcon open={rewardsExpanded} />
            </button>

            {rewardsExpanded && (
              <ul className="mt-3 space-y-3">
                {ordered.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => selectReward(r.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border bg-white p-3 text-left transition ${
                        r.id === selectedId ? "border-[#2f9e6b] ring-1 ring-[#2f9e6b]" : "border-[#e6e1c8]"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          r.status === "won"
                            ? "bg-[#0b3d2e] text-white"
                            : r.status === "free"
                              ? "bg-[#e6f0da] text-[#0b3d2e]"
                              : "bg-[#efece0] text-[#a9a48d]"
                        }`}
                      >
                        {r.status !== "free" ? r.id : ""}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[15px] font-bold text-[#0b3d2e]">
                          {r.title}
                        </span>
                        <span className="block truncate text-sm text-[#8f8b74]">{r.description}</span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1">
                        <span className="rounded-full bg-[#e2efd8] px-2.5 py-0.5 text-xs font-bold text-[#2f7a4f]">
                          {r.status === "free" ? "—" : `+$${r.amount}`}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_PILL_CLASSES[r.status]}`}
                        >
                          {STATUS_LABEL[r.status]}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {shareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-[28px] bg-[#faf7ea] px-6 pb-8 pt-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-[#d8d2b8]" />
            <h2 className="font-display text-2xl font-bold text-[#0b3d2e]">Share your code</h2>
            <p className="mt-2 text-[15px] text-[#6b6b5a]">
              Every order a neighbor places with your code lights up a square.
            </p>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-dashed border-[#d8d2b8] px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#a9a48d]">Your code</p>
                <p className="font-display text-2xl font-bold tracking-wide text-[#0b3d2e]">
                  {AMBASSADOR_CODE}
                </p>
              </div>
              <button
                onClick={copyCode}
                className="whitespace-nowrap rounded-full bg-[#0b3d2e] px-5 py-2.5 text-sm font-bold text-white transition active:scale-95"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <button
                onClick={copyCode}
                className="flex flex-col items-center gap-2 rounded-2xl border border-[#e6e1c8] py-4 text-[#0b3d2e]"
              >
                <CopyIcon />
                <span className="text-sm font-semibold">{copied ? "Copied" : "Copy code"}</span>
              </button>
              <button
                onClick={textNeighbor}
                className="flex flex-col items-center gap-2 rounded-2xl border border-[#e6e1c8] py-4 text-[#0b3d2e]"
              >
                <MessageIcon />
                <span className="text-sm font-semibold">Text a neighbor</span>
              </button>
              <button
                onClick={nativeShare}
                className="flex flex-col items-center gap-2 rounded-2xl border border-[#e6e1c8] py-4 text-[#0b3d2e]"
              >
                <ShareIcon className="h-5 w-5" />
                <span className="text-sm font-semibold">Share...</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
