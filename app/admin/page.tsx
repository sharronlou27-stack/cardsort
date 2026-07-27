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
    <main className="mx-auto min-h-[calc(100vh-57px)] max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-groupr-ink">
            Groupr Card Sort &mdash; Results
          </h1>
          <p className="mt-1 text-sm tabular-nums text-groupr-inkMuted">
            {totalResponses} response{totalResponses === 1 ? "" : "s"} collected
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export"
            className="rounded-lg border border-groupr-line px-4 py-2 font-display text-sm font-bold text-groupr-ink hover:bg-groupr-surface2"
          >
            Export CSV
          </a>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-lg border border-groupr-line px-4 py-2 font-display text-sm font-bold text-groupr-ink hover:bg-groupr-surface2"
            >
              Log out
            </button>
          </form>
        </div>
      </div>

      {totalResponses === 0 ? (
        <p className="mt-10 rounded-xl border border-groupr-line bg-groupr-surface p-6 text-sm text-groupr-inkMuted">
          No responses yet. Share the survey link to start collecting answers.
        </p>
      ) : (
        <>
          <section className="mt-8">
            <ItemCard aggregation={aggregations[0]} />
          </section>

          {SECTIONS.map((section) => (
            <section key={section.id} className="mt-10">
              <h2 className="font-display text-lg font-bold text-groupr-ink">{section.title}</h2>
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
            <h2 className="font-display text-lg font-bold text-groupr-ink">Raw responses</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-groupr-line bg-groupr-surface">
              <table className="min-w-full divide-y divide-groupr-line text-sm">
                <thead className="bg-groupr-surface2">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-display font-bold text-groupr-inkFaint">
                      ID
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-display font-bold text-groupr-inkFaint">
                      Submitted
                    </th>
                    {ALL_ITEM_IDS.map((id) => (
                      <th
                        key={id}
                        className="whitespace-nowrap px-3 py-2 text-left font-display font-bold text-groupr-inkFaint"
                      >
                        {labelById[id]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-groupr-line">
                  {responses.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap px-3 py-2 tabular-nums text-groupr-inkMuted">
                        {r.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 tabular-nums text-groupr-inkMuted">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      {ALL_ITEM_IDS.map((id) => (
                        <td key={id} className="whitespace-nowrap px-3 py-2 text-groupr-ink">
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
    <div className="rounded-xl border border-groupr-line bg-groupr-surface p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="font-display font-bold text-groupr-ink">{aggregation.label}</p>
        <span className="whitespace-nowrap text-xs tabular-nums text-groupr-inkFaint">
          {aggregation.totalAnswered} answer{aggregation.totalAnswered === 1 ? "" : "s"}
        </span>
      </div>
      {aggregation.note && (
        <p className="mt-1 inline-block rounded bg-groupr-watchSoft px-2 py-0.5 text-xs text-groupr-watch">
          Watch: {aggregation.note}
        </p>
      )}
      <div className="mt-3 space-y-2">
        {aggregation.counts.length === 0 && (
          <p className="text-xs text-groupr-inkFaint">No answers yet</p>
        )}
        {aggregation.counts.map((c) => {
          const isExpected = aggregation.expected?.includes(c.option);
          const isWatch = aggregation.watch?.includes(c.option);
          const barColor = isExpected ? "bg-groupr-goodBar" : isWatch ? "bg-groupr-watchBar" : "bg-groupr-inkFaint";
          return (
            <div key={c.option}>
              <div className="flex justify-between text-xs text-groupr-inkMuted">
                <span className={highlightSet.has(c.option) ? "font-semibold text-groupr-ink" : ""}>
                  {c.option}
                </span>
                <span className="tabular-nums">
                  {c.count} ({c.pct}%)
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full border border-groupr-line bg-groupr-surface2">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${c.pct}%` }} />
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
    <main className="mx-auto flex min-h-[calc(100vh-57px)] max-w-sm flex-col justify-center px-6">
      <div className="rounded-2xl border border-groupr-line bg-groupr-surface p-8 shadow-groupr">
        <h1 className="font-display text-xl font-bold text-groupr-ink">Admin login</h1>
        <p className="mt-1 text-sm text-groupr-inkMuted">
          Enter the admin password to view survey results.
        </p>
        <form action="/api/admin/login" method="POST" className="mt-6 space-y-4">
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            className="w-full rounded-lg border border-groupr-line bg-groupr-surface px-3 py-2 text-sm text-groupr-ink focus:border-groupr-accent focus:outline-none focus:ring-1 focus:ring-groupr-accent"
          />
          {showError && (
            <p className="text-sm text-groupr-danger">Incorrect password. Please try again.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-groupr-accent px-4 py-2.5 font-display text-sm font-bold text-groupr-onAccent hover:bg-groupr-accentStrong"
          >
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}
