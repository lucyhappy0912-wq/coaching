import "server-only";

import { randomUUID } from "node:crypto";

import { dataRest } from "@/lib/supabase/rest";

import { validateQuestion } from "./store-jsonl";
import type { BoardQuestion } from "./types";

type Row = {
  id: string;
  name: string;
  title: string;
  body: string;
  answer: string;
  published: boolean;
  created_at: string;
  answered_at: string | null;
};

function toQuestion(row: Row): BoardQuestion {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    body: row.body,
    answer: row.answer,
    published: row.published,
    createdAt: row.created_at,
    answeredAt: row.answered_at ?? "",
  };
}

function isPublished(row: BoardQuestion) {
  return row.published && Boolean(row.answer);
}

export async function createQuestionSupabase(input: { name: string; title: string; body: string }) {
  const { name, title, body } = validateQuestion(input);
  const row: Row = {
    id: randomUUID(),
    name,
    title,
    body,
    answer: "",
    published: false,
    created_at: new Date().toISOString(),
    answered_at: null,
  };
  await dataRest<Row[]>("board_questions", { method: "POST", body: JSON.stringify(row) });
  return row.id;
}

export async function listPublishedQuestionsSupabase(): Promise<BoardQuestion[]> {
  const rows = await dataRest<Row[]>("board_questions?published=eq.true&select=*&order=created_at.desc");
  return rows.map(toQuestion).filter(isPublished);
}

export async function getPublishedQuestionSupabase(id: string): Promise<BoardQuestion | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await dataRest<Row[]>(`board_questions?id=eq.${encodeURIComponent(id)}&select=*`);
  const row = rows[0] ? toQuestion(rows[0]) : null;
  return row && isPublished(row) ? row : null;
}

export async function listQuestionsSupabase(): Promise<BoardQuestion[]> {
  return (await dataRest<Row[]>("board_questions?select=*&order=created_at.desc")).map(toQuestion);
}

export async function getQuestionSupabase(id: string): Promise<BoardQuestion | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await dataRest<Row[]>(`board_questions?id=eq.${encodeURIComponent(id)}&select=*`);
  return rows[0] ? toQuestion(rows[0]) : null;
}

export async function answerQuestionSupabase(id: string, answer: string, published: boolean) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  const found = await getQuestionSupabase(id);
  if (!found) return false;
  const text = answer.trim().slice(0, 2000);
  await dataRest<unknown>(`board_questions?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      answer: text,
      published: published && Boolean(text),
      answered_at: text ? new Date().toISOString() : null,
    }),
  });
  return true;
}

export async function removeQuestionSupabase(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  const deleted = await dataRest<Pick<Row, "id">[]>(`board_questions?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return Array.isArray(deleted) && deleted.length > 0;
}
