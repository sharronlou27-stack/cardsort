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
- Responses are stored in a local SQLite database (`data/survey.db`, created
  automatically, not committed to git).

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

This app needs a **persistent filesystem** for the SQLite database, so it
needs a long-running Node server rather than a stateless/serverless
platform (plain Vercel won't persist `data/survey.db` between requests).
Any of these work well:

- Render / Railway / Fly.io — a small "web service" running `npm run build`
  then `npm start`, with a persistent disk mounted at the project's `data/`
  directory.
- A basic VPS (or a Docker container with a mounted volume) running
  `npm run build && npm start`.

Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` as environment variables on
whichever host you use, and make sure `data/` is on a persistent volume so
responses survive restarts/redeploys.

## Updating the survey

All question text, answer options, and interpretation notes live in
[`lib/questions.ts`](lib/questions.ts) — edit that file to add/remove
items or change wording; the survey UI, submission validation, and the
admin dashboard's aggregation all read from it automatically.
