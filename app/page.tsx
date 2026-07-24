import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
          Groupr Food Survey
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
          Help us group groceries the way you'd expect
        </h1>
        <p className="mt-4 text-neutral-600">
          We're setting up how food is grouped in the Groupr app, and we'd love your
          help. We'll show you a grocery item and ask where you'd look for it. There
          are no wrong answers &mdash; just pick where you'd naturally go.
        </p>
        <p className="mt-4 text-neutral-600">This takes about 8 minutes. Thank you!</p>
        <Link
          href="/survey"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-base font-medium text-white transition hover:bg-brand-700"
        >
          Start the survey
        </Link>
      </div>
    </main>
  );
}
