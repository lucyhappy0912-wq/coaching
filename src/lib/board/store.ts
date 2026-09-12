import "server-only";

import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { cache } from "react";

import { requireAdmin } from "@/lib/auth/dal";

export type BoardQuestion = {
  id: string;
  name: string;
  title: string;
  body: string;
  answer: string;
  published: boolean;
  createdAt: string;
  answeredAt: string;
};

const FILE = path.join(process.cwd(), "data", "questions.jsonl");

let writeChain: Promise<void> = Promise.resolve();

async function readAll(): Promise<BoardQuestion[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as BoardQuestion);
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

export async function createQuestion(input: { name: string; title: string; body: string }) {
  if (process.env.VERCEL) throw new Error("BOARD_STORE_READONLY");
  const name = input.name.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 20);
  const title = input.title.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 80);
  const body = input.body.trim().slice(0, 1000);
  if (name.length < 2 || title.length < 2 || body.length < 4) throw new Error("BOARD_INVALID");
  const row: BoardQuestion = {
    id: randomUUID(),
    name,
    title,
    body,
    answer: "",
    published: false,
    createdAt: new Date().toISOString(),
    answeredAt: "",
  };
  await withWrite(async (rows) => {
    rows.unshift(row);
    await replaceAll(rows);
  });
  return row.id;
}

export async function listPublishedQuestions(): Promise<BoardQuestion[]> {
  const rows = await readAll();
  return rows.filter((row) => row.published && row.answer);
}

export async function getPublishedQuestion(id: string): Promise<BoardQuestion | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await readAll();
  return rows.find((row) => row.id === id && row.published && row.answer) ?? null;
}

export const listQuestionsForAdmin = cache(async (): Promise<BoardQuestion[]> => {
  await requireAdmin();
  if (process.env.VERCEL) return [];
  return readAll();
});

export async function getQuestionForAdmin(id: string): Promise<BoardQuestion | null> {
  await requireAdmin();
  if (process.env.VERCEL || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await readAll();
  return rows.find((row) => row.id === id) ?? null;
}

export async function answerQuestion(id: string, answer: string, published: boolean) {
  await requireAdmin();
  if (process.env.VERCEL || !/^[0-9a-f-]{36}$/i.test(id)) return false;
  const text = answer.trim().slice(0, 2000);
  return withWrite(async (rows) => {
    const next = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            answer: text,
            published: published && Boolean(text),
            answeredAt: text ? new Date().toISOString() : "",
          }
        : row,
    );
    await replaceAll(next);
    return true;
  });
}

export async function removeQuestion(id: string) {
  await requireAdmin();
  if (process.env.VERCEL || !/^[0-9a-f-]{36}$/i.test(id)) return false;
  return withWrite(async (rows) => {
    const next = rows.filter((row) => row.id !== id);
    await replaceAll(next);
    return next.length !== rows.length;
  });
}
