import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";
import { ALL_ITEM_IDS } from "./questions";

declare global {
  // eslint-disable-next-line no-var
  var __surveyDb: Client | undefined;
  var __surveySchemaReady: Promise<void> | undefined;
}

function getDb(): Client {
  if (!global.__surveyDb) {
    const url = process.env.TURSO_DATABASE_URL;
    if (url) {
      global.__surveyDb = createClient({
        url,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
    } else {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const dbPath = process.env.DB_PATH || path.join(dataDir, "survey.db");
      global.__surveyDb = createClient({ url: `file:${dbPath}` });
    }
  }
  return global.__surveyDb;
}

function ensureSchema(db: Client): Promise<void> {
  if (!global.__surveySchemaReady) {
    global.__surveySchemaReady = db
      .execute(
        `CREATE TABLE IF NOT EXISTS responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          created_at TEXT NOT NULL,
          answers TEXT NOT NULL,
          user_agent TEXT
        );`
      )
      .then(() => undefined);
  }
  return global.__surveySchemaReady;
}

export type StoredResponse = {
  id: number;
  createdAt: string;
  answers: Record<string, string>;
  userAgent: string | null;
};

export async function insertResponse(
  answers: Record<string, string>,
  userAgent: string | null
): Promise<number> {
  const clean: Record<string, string> = {};
  for (const id of ALL_ITEM_IDS) {
    const value = answers[id];
    if (typeof value === "string" && value.trim().length > 0) {
      clean[id] = value.trim();
    }
  }

  const db = getDb();
  await ensureSchema(db);
  const result = await db.execute({
    sql: `INSERT INTO responses (created_at, answers, user_agent) VALUES (?, ?, ?)`,
    args: [new Date().toISOString(), JSON.stringify(clean), userAgent],
  });
  return Number(result.lastInsertRowid);
}

export async function getAllResponses(): Promise<StoredResponse[]> {
  const db = getDb();
  await ensureSchema(db);
  const result = await db.execute(
    `SELECT id, created_at, answers, user_agent FROM responses ORDER BY id DESC`
  );

  return result.rows.map((row) => ({
    id: Number(row.id),
    createdAt: String(row.created_at),
    answers: JSON.parse(String(row.answers)) as Record<string, string>,
    userAgent: (row.user_agent as string | null) ?? null,
  }));
}

export async function getResponseCount(): Promise<number> {
  const db = getDb();
  await ensureSchema(db);
  const result = await db.execute(`SELECT COUNT(*) as count FROM responses`);
  return Number(result.rows[0].count);
}
