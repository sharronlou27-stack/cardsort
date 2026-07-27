import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-57px)] max-w-2xl flex-col justify-center px-6 py-16">
      <div className="rounded-[20px] border border-groupr-line bg-groupr-surface p-9 text-center shadow-groupr">
        <h1 className="font-display text-2xl font-bold text-groupr-ink">
          Thank you for helping us out!
        </h1>
        <p className="mt-3 text-[15px] text-groupr-inkMuted">
          Your answers have been recorded. We really appreciate you taking the time.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center font-display text-sm font-bold text-groupr-accentStrong hover:text-groupr-accent"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
