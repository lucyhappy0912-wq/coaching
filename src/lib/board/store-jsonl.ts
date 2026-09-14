import "server-only";

import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import type { BoardQuestion } from "./types";

const FILE = path.join(process.cwd(), "data", "questions.jsonl");

let writeChain: Promise<void> = Promise.resolve();

async function readAll(): Promise<BoardQuestion[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const row = JSON.parse(line) as BoardQuestion;
        return { ...row, passwordHash: row.passwordHash ?? "", views: row.views ?? 0 };
      });
  } catch {
    return [];
  }
}

async function replaceAll(rows: BoardQuestion[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp-${randomBytes(8).toString("hex")}`;
  const body = rows.length ? `${rows.map((row) => JSON.stringify(row)).join("\n")}\n` : "";
  await writeFile(tmp, body, "utf8");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await rename(tmp, FILE);
      return;
    } catch {
      if (attempt === 2) {
        await unlink(tmp).catch(() => undefined);
        throw new Error("BOARD_STORE_WRITE_FAILED");
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}

async function withWrite<T>(fn: (rows: BoardQuestion[]) => Promise<T> | T) {
  let result!: T;
  writeChain = writeChain.then(async () => {
    result = await fn(await readAll());
  });
  await writeChain;
  return result;
}

export function validateQuestion(input: {
  name: string;
  title: string;
  body: string;
  published?: boolean;
  password?: string;
}) {
  const name = input.name.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 20);
  const title = input.title.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 80);
  const body = input.body.trim().slice(0, 1000);
  const published = input.published !== false;
  const password = (input.password ?? "").trim();
  if (name.length < 2 || title.length < 2 || body.length < 4) throw new Error("BOARD_INVALID");
  if (!published && (password.length < 4 || password.length > 20)) throw new Error("BOARD_PASSWORD");
  return { name, title, body, published, password };
}

export async function createQuestionJsonl(input: {
  name: string;
  title: string;
  body: string;
  published?: boolean;
  password?: string;
  passwordHash?: string;
}) {
  const { name, title, body, published } = validateQuestion(input);
  const row: BoardQuestion = {
    id: randomUUID(),
    name,
    title,
    body,
    answer: "",
    published,
    passwordHash: input.passwordHash ?? "",
    views: 0,
    createdAt: new Date().toISOString(),
    answeredAt: "",
  };
  await withWrite(async (rows) => {
    rows.unshift(row);
    await replaceAll(rows);
  });
  return row.id;
}

export async function listPublishedQuestionsJsonl(): Promise<BoardQuestion[]> {
  return readAll();
}

export async function getPublishedQuestionJsonl(id: string): Promise<BoardQuestion | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await readAll();
  return rows.find((row) => row.id === id) ?? null;
}

export async function listQuestionsJsonl(): Promise<BoardQuestion[]> {
  return readAll();
}

export async function getQuestionJsonl(id: string): Promise<BoardQuestion | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await readAll();
  return rows.find((row) => row.id === id) ?? null;
}

export async function answerQuestionJsonl(id: string, answer: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  const text = answer.trim().slice(0, 2000);
  return withWrite(async (rows) => {
    const next = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            answer: text,
            answeredAt: text ? new Date().toISOString() : "",
          }
        : row,
    );
    await replaceAll(next);
    return true;
  });
}

export async function bumpViewsJsonl(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  await withWrite(async (rows) => {
    await replaceAll(
      rows.map((row) => (row.id === id ? { ...row, views: (row.views ?? 0) + 1 } : row)),
    );
  });
}

export async function removeQuestionJsonl(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  return withWrite(async (rows) => {
    const next = rows.filter((row) => row.id !== id);
    await replaceAll(next);
    return next.length !== rows.length;
  });
}
