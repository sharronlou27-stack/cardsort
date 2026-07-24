import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-neutral-200">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Thank you for helping us out!
        </h1>
        <p className="mt-3 text-neutral-600">
          Your answers have been recorded. We really appreciate you taking the time.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
