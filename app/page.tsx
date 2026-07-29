import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <div className="rounded-[20px] border border-groupr-line bg-groupr-surface p-9 shadow-groupr sm:p-10">
        <p className="font-display text-xs font-bold uppercase tracking-wider text-groupr-accentStrong">
          Groupr food survey
        </p>
        <h1 className="mt-3 font-display text-[clamp(28px,6vw,42px)] font-bold leading-[1.12] tracking-tight text-groupr-ink">
          Help us understand how you&rsquo;d organize groceries.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-groupr-inkMuted">
          We&rsquo;re setting up how food is grouped in the Groupr app. We&rsquo;ll show
          you a grocery item as a card &mdash; drag it into the section where you&rsquo;d
          look for it first. There are no wrong answers.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-groupr-inkMuted">
          Takes about 8 minutes. Thank you!
        </p>
        <Link
          href="/survey"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-groupr-accent px-6 py-3 font-display text-base font-bold text-groupr-onAccent transition hover:bg-groupr-accentStrong"
        >
          Start the survey
        </Link>
        <Link
          href="/ambassador-bingo"
          className="mt-4 inline-flex items-center justify-center text-sm font-semibold text-groupr-inkMuted underline-offset-4 transition hover:text-groupr-ink hover:underline"
        >
          View Ambassador Bingo &rarr;
        </Link>
      </div>
    </main>
  );
}
