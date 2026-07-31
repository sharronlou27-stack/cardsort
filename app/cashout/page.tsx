"use client";

import Link from "next/link";
import { useState } from "react";

type View = "select" | "cashapp-success" | "credit-success";

const AVAILABLE_BALANCE = 86.0;
const CREDIT_BONUS_RATE = 0.1;

function formatUSD(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-groupr-inkFaint transition hover:bg-groupr-surface2 hover:text-groupr-ink"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M1 1L15 15M15 1L1 15"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function CheckBadge() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-groupr-good/10">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <circle cx="15" cy="15" r="15" fill="var(--good)" />
        <path
          d="M9 15.5L13 19.5L21 11"
          stroke="var(--surface)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function PayoutOption({
  onClick,
  icon,
  label,
  description,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-groupr-line bg-groupr-surface px-4 py-4 text-left transition hover:border-groupr-accent hover:bg-groupr-accentSoft/40"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-groupr-onAccent">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[15px] font-bold text-groupr-ink">{label}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-groupr-inkMuted">{description}</p>
      </div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-groupr-inkFaint"
      >
        <path
          d="M6.75 3.75L12 9L6.75 14.25"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function CashOutPage() {
  const [view, setView] = useState<View>("select");
  const creditBonus = AVAILABLE_BALANCE * CREDIT_BONUS_RATE;
  const creditTotal = AVAILABLE_BALANCE + creditBonus;

  return (
    <main className="min-h-screen bg-groupr-bg">
      {/* Mock ambassador dashboard sitting behind the pop up */}
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="font-display text-xs font-bold uppercase tracking-wider text-groupr-accentStrong">
          Ambassador dashboard
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold text-groupr-ink">
          Your bingo progress
        </h1>
        <div className="mt-6 rounded-[20px] border border-groupr-line bg-groupr-surface p-9 shadow-groupr">
          <p className="text-[13px] font-bold uppercase tracking-wider text-groupr-inkFaint">
            Available to cash out
          </p>
          <p className="mt-2 font-display text-4xl font-bold text-groupr-ink">
            {formatUSD(AVAILABLE_BALANCE)}
          </p>
          <p className="mt-2 text-[15px] text-groupr-inkMuted">
            Earned from referrals across your shareable bingo card.
          </p>
          {view === "select" && (
            <button
              type="button"
              onClick={() => setView("select")}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-groupr-accent px-6 py-3 font-display text-base font-bold text-groupr-onAccent transition hover:bg-groupr-accentStrong"
            >
              Cash out
            </button>
          )}
        </div>
        <Link
          href="/"
          className="mt-6 inline-block text-[14px] font-bold text-groupr-accentStrong hover:text-groupr-accent"
        >
          ← Back to home
        </Link>
      </div>

      {/* Cash out pop up */}
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-groupr-onAccent/50 backdrop-blur-sm sm:items-center sm:p-6">
        <div className="relative w-full max-w-md rounded-t-[28px] border border-groupr-line bg-groupr-surface p-8 shadow-groupr sm:rounded-[28px]">
          {view === "select" && (
            <CloseButton onClick={() => setView("select")} />
          )}

          {view === "select" && (
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-wider text-groupr-accentStrong">
                Ambassador payout
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-groupr-ink">
                Cash out your earnings
              </h2>
              <p className="mt-3 text-[15px] text-groupr-inkMuted">
                You have{" "}
                <span className="font-bold text-groupr-ink">
                  {formatUSD(AVAILABLE_BALANCE)}
                </span>{" "}
                ready to go. Choose how you&rsquo;d like to get paid.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <PayoutOption
                  onClick={() => setView("cashapp-success")}
                  label="Cash App"
                  description="Instant transfer to your linked Cash App account."
                  icon={
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path
                        d="M11 3.5C7.6 3.5 5 5.9 5 9c0 2.3 1.4 3.6 3.6 4.4l1 .35c1.2.42 1.6.8 1.6 1.5 0 .8-.7 1.3-1.9 1.3-1.2 0-2-.5-2.3-1.5H4.5c.3 2.1 1.8 3.5 4.1 3.85V20h2v-1.05c2.6-.3 4.3-1.8 4.3-4.05 0-2.15-1.2-3.35-3.7-4.2l-1-.35C9 9.95 8.5 9.6 8.5 8.9c0-.75.65-1.2 1.75-1.2 1.05 0 1.75.45 2 1.3h2.5C14.5 6.9 13.1 5.6 11 5.3V4h-2v1.3"
                        stroke="var(--surface)"
                        strokeWidth="0.4"
                        fill="var(--surface)"
                      />
                    </svg>
                  }
                />
                <PayoutOption
                  onClick={() => setView("credit-success")}
                  label="Groupr Credit"
                  description={`Add to your Groupr balance and get a ${Math.round(
                    CREDIT_BONUS_RATE * 100
                  )}% bonus.`}
                  icon={
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path
                        d="M4 10.5L10.5 4l6.7.8.8 6.7L11.5 18a1.5 1.5 0 0 1-2.1 0L4 12.6a1.5 1.5 0 0 1 0-2.1Z"
                        stroke="var(--surface)"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                      <circle cx="14" cy="8" r="1.3" fill="var(--surface)" />
                    </svg>
                  }
                />
              </div>

              <p className="mt-6 text-center text-[12px] text-groupr-inkFaint">
                Payouts typically arrive within 1&ndash;3 business days.
              </p>
            </div>
          )}

          {view === "cashapp-success" && (
            <div className="text-center">
              <CheckBadge />
              <h2 className="mt-5 font-display text-2xl font-bold text-groupr-ink">
                You&rsquo;re all set!
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-groupr-inkMuted">
                <span className="font-bold text-groupr-ink">
                  {formatUSD(AVAILABLE_BALANCE)}
                </span>{" "}
                is on its way to your Cash App account. It usually shows up within
                1&ndash;3 business days.
              </p>
              <div className="mt-6 rounded-2xl bg-groupr-surface2 px-4 py-3 text-[13px] text-groupr-inkMuted">
                Confirmation #CO-{Math.floor(10000 + Math.random() * 89999)}
              </div>
              <button
                type="button"
                onClick={() => setView("select")}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-groupr-accent px-6 py-3 font-display text-base font-bold text-groupr-onAccent transition hover:bg-groupr-accentStrong"
              >
                Done
              </button>
            </div>
          )}

          {view === "credit-success" && (
            <div className="text-center">
              <CheckBadge />
              <h2 className="mt-5 font-display text-2xl font-bold text-groupr-ink">
                Credit applied!
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-groupr-inkMuted">
                <span className="font-bold text-groupr-ink">
                  {formatUSD(creditTotal)}
                </span>{" "}
                in Groupr Credit has been added to your account &mdash;{" "}
                {formatUSD(AVAILABLE_BALANCE)} plus a {formatUSD(creditBonus)} bonus.
              </p>
              <div className="mt-6 rounded-2xl bg-groupr-surface2 px-4 py-3 text-[13px] text-groupr-inkMuted">
                New Groupr Credit balance:{" "}
                <span className="font-bold text-groupr-ink">{formatUSD(creditTotal)}</span>
              </div>
              <button
                type="button"
                onClick={() => setView("select")}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-groupr-accent px-6 py-3 font-display text-base font-bold text-groupr-onAccent transition hover:bg-groupr-accentStrong"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
