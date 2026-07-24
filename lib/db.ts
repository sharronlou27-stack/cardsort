import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { ALL_ITEM_IDS } from "./questions";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, "survey.db");

declare global {
  // eslint-disable-next-line no-var
  var __surveyDb: Database.Database | undefined;
}

function getDb(): Database.Database {
  if (!global.__surveyDb) {
    const db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        answers TEXT NOT NULL,
        user_agent TEXT
      );
    `);
    global.__surveyDb = db;
  }
  return global.__surveyDb;
}

export type StoredResponse = {
  id: number;
  createdAt: string;
  answers: Record<string, string>;
  userAgent: string | null;
};

export function insertResponse(
  answers: Record<string, string>,
  userAgent: string | null
): number {
  const clean: Record<string, string> = {};
  for (const id of ALL_ITEM_IDS) {
    const value = answers[id];
    if (typeof value === "string" && value.trim().length > 0) {
      clean[id] = value.trim();
    }
  }

  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO responses (created_at, answers, user_agent) VALUES (?, ?, ?)`
  );
  const result = stmt.run(new Date().toISOString(), JSON.stringify(clean), userAgent);
  return Number(result.lastInsertRowid);
}

export function getAllResponses(): StoredResponse[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT id, created_at, answers, user_agent FROM responses ORDER BY id DESC`)
    .all() as { id: number; created_at: string; answers: string; user_agent: string | null }[];

  return rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    answers: JSON.parse(row.answers) as Record<string, string>,
    userAgent: row.user_agent,
  }));
}

export function getResponseCount(): number {
  const db = getDb();
  const row = db.prepare(`SELECT COUNT(*) as count FROM responses`).get() as {
    count: number;
  };
  return row.count;
}
