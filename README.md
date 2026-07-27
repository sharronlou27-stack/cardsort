# Groupr Food Survey — Card Sort

A self-hosted site for running the "Groupr Food Survey" closed card sort:
participants take the survey on their own time at `/survey`, and you can
review every submitted answer on a password-protected dashboard at `/admin`.

The questions, answer options, and the "watch this split" / "should be X"
interpretation notes are all taken directly from the survey spec and live in
[`lib/questions.ts`](lib/questions.ts).

## What's included

- **`/` and `/survey`** — participant-facing intro + multi-step survey
  (Q0 demographic, Part 1 main-section sort for 12 items, Part 2 shelf sort
  across Pantry/Frozen/Dairy & Eggs/Meat & Seafood/Bread & Bakery). Options
  for the Part 1 questions are shuffled per item, matching the spec.
- **`/thank-you`** — confirmation page after submitting.
- **`/admin`** — password-gated dashboard: response count, a
  per-question breakdown of every answer with the ambiguous "watch" options
  and "should be" expected answers highlighted, a raw response table, and a
  CSV export.
- Responses are stored in SQLite via [`@libsql/client`](https://github.com/tursodatabase/libsql-client-ts):
  a local file (`data/survey.db`, created automatically, not committed to
  git) for local dev, or a hosted [Turso](https://turso.tech) database in
  production — see "Deploying" below.

## Running locally

```bash
npm install
cp .env.example .env.local   # then edit the two values below
npm run dev
```

Environment variables (set in `.env.local` for dev, or in your host's env
config for production):

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Password required to log into `/admin`. |
| `ADMIN_SESSION_SECRET` | Random string used to sign the admin session cookie. Generate one with `openssl rand -hex 32`. |

Visit `http://localhost:3000` to try the survey, and
`http://localhost:3000/admin` to view results.

## Deploying

### Free option: Vercel + Turso

This is the no-cost path — Vercel's serverless functions don't have a
persistent local disk, so responses are stored in a free hosted [Turso](https://turso.tech)
database instead of the local SQLite file.

1. Create a free Turso account and database at [turso.tech](https://turso.tech)
   (via their web dashboard or `turso db create groupr-cardsort` with their
   CLI). Grab the database URL and create an auth token.
2. Import this repo into [Vercel](https://vercel.com) (free Hobby plan —
   sign in with GitHub, "Add New Project", pick this repo).
3. In the Vercel project's Environment Variables, set:
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET` (e.g. `openssl rand -hex 32`)
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
4. Deploy. Every push to the connected branch redeploys automatically.

### Paid alternative: a long-running server

If you'd rather keep everything on a plain local SQLite file with no
external database, run this as a persistent Node server instead (Render,
Railway, Fly.io, or a basic VPS/Docker host) — a small "web service"
running `npm run build` then `npm start`, with a persistent disk mounted
at the project's `data/` directory, and `ADMIN_PASSWORD` /
`ADMIN_SESSION_SECRET` set as environment variables. This generally isn't
free since persistent disks require a paid instance tier on most hosts.

## Updating the survey

All question text, answer options, and interpretation notes live in
[`lib/questions.ts`](lib/questions.ts) — edit that file to add/remove
items or change wording; the survey UI, submission validation, and the
admin dashboard's aggregation all read from it automatically.
