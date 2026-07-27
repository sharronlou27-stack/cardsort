import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { getAllResponses, getResponseCount } from "@/lib/db";
import { aggregateAll, type ItemAggregation } from "@/lib/aggregate";
import { ALL_ITEM_IDS, INTRO_QUESTION, SECTIONS } from "@/lib/questions";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const authed = isValidSessionToken(token);

  if (!authed) {
    return <LoginScreen showError={searchParams.error === "1"} />;
  }

  const responses = await getAllResponses();
  const aggregations = aggregateAll(responses);
  const totalResponses = await getResponseCount();

  const labelById: Record<string, string> = { [INTRO_QUESTION.id]: INTRO_QUESTION.label };
  for (const section of SECTIONS) {
    for (const item of section.items) labelById[item.id] = item.label;
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Groupr Card Sort — Results
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {totalResponses} response{totalResponses === 1 ? "" : "s"} collected
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Export CSV
          </a>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Log out
            </button>
          </form>
        </div>
      </div>

      {totalResponses === 0 ? (
        <p className="mt-10 rounded-xl bg-white p-6 text-sm text-neutral-500 ring-1 ring-neutral-200">
          No responses yet. Share the survey link to start collecting answers.
        </p>
      ) : (
        <>
          <section className="mt-8">
            <ItemCard aggregation={aggregations[0]} />
          </section>

          {SECTIONS.map((section) => (
            <section key={section.id} className="mt-10">
              <h2 className="text-lg font-semibold text-neutral-900">{section.title}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {aggregations
                  .filter((a) => a.sectionId === section.id)
                  .map((agg) => (
                    <ItemCard key={agg.itemId} aggregation={agg} />
                  ))}
              </div>
            </section>
          ))}

          <section className="mt-12">
            <h2 className="text-lg font-semibold text-neutral-900">Raw responses</h2>
            <div className="mt-4 overflow-x-auto rounded-xl bg-white ring-1 ring-neutral-200">
              <table className="min-w-full divide-y divide-neutral-200 text-sm">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-neutral-500">
                      ID
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-neutral-500">
                      Submitted
                    </th>
                    {ALL_ITEM_IDS.map((id) => (
                      <th
                        key={id}
                        className="whitespace-nowrap px-3 py-2 text-left font-medium text-neutral-500"
                      >
                        {labelById[id]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {responses.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap px-3 py-2 text-neutral-500">{r.id}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-neutral-500">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      {ALL_ITEM_IDS.map((id) => (
                        <td key={id} className="whitespace-nowrap px-3 py-2 text-neutral-700">
                          {r.answers[id] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function ItemCard({ aggregation }: { aggregation: ItemAggregation }) {
  const highlightSet = new Set([...(aggregation.expected ?? []), ...(aggregation.watch ?? [])]);

  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-neutral-200">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-neutral-900">{aggregation.label}</p>
        <span className="whitespace-nowrap text-xs text-neutral-400">
          {aggregation.totalAnswered} answer{aggregation.totalAnswered === 1 ? "" : "s"}
        </span>
      </div>
      {aggregation.note && (
        <p className="mt-1 text-xs text-amber-700">
          Watch: {aggregation.note}
        </p>
      )}
      <div className="mt-3 space-y-2">
        {aggregation.counts.length === 0 && (
          <p className="text-xs text-neutral-400">No answers yet</p>
        )}
        {aggregation.counts.map((c) => {
          const isExpected = aggregation.expected?.includes(c.option);
          const isWatch = aggregation.watch?.includes(c.option);
          const barColor = isExpected
            ? "bg-brand-500"
            : isWatch
              ? "bg-amber-400"
              : "bg-neutral-300";
          return (
            <div key={c.option}>
              <div className="flex justify-between text-xs text-neutral-600">
                <span className={highlightSet.has(c.option) ? "font-medium" : ""}>
                  {c.option}
                </span>
                <span>
                  {c.count} ({c.pct}%)
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className={`h-full ${barColor}`} style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoginScreen({ showError }: { showError: boolean }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
        <h1 className="text-xl font-semibold text-neutral-900">Admin login</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter the admin password to view survey results.
        </p>
        <form action="/api/admin/login" method="POST" className="mt-6 space-y-4">
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {showError && (
            <p className="text-sm text-red-600">Incorrect password. Please try again.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}
