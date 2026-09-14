import "server-only";

import { cache } from "react";

import { requireAdmin } from "@/lib/auth/dal";
import { dataStoreMode } from "@/lib/check/store-mode";

import { hashPassword } from "@/lib/auth/password";

import {
  answerQuestionJsonl,
  bumpViewsJsonl,
  createQuestionJsonl,
  getPublishedQuestionJsonl,
  getQuestionJsonl,
  listPublishedQuestionsJsonl,
  listQuestionsJsonl,
  removeQuestionJsonl,
  validateQuestion,
} from "./store-jsonl";
import {
  answerQuestionSupabase,
  bumpViewsSupabase,
  createQuestionSupabase,
  getPublishedQuestionSupabase,
  getQuestionSupabase,
  listPublishedQuestionsSupabase,
  listQuestionsSupabase,
  removeQuestionSupabase,
} from "./store-supabase";
import type { BoardQuestion } from "./types";

export type { BoardQuestion } from "./types";

function assertWritable() {
  if (dataStoreMode() === "readonly") throw new Error("BOARD_STORE_READONLY");
}

function missingTable(error: unknown) {
  return error instanceof Error && error.message === "STORE_NO_TABLE";
}

export async function createQuestion(input: {
  name: string;
  title: string;
  body: string;
  published?: boolean;
  password?: string;
}) {
  assertWritable();
  const parsed = validateQuestion(input);
  const passwordHash = parsed.published ? "" : await hashPassword(parsed.password);
  const next = { ...parsed, passwordHash };
  if (dataStoreMode() === "supabase") return createQuestionSupabase(next);
  return createQuestionJsonl(next);
}

export async function listPublishedQuestions(): Promise<BoardQuestion[]> {
  const mode = dataStoreMode();
  try {
    if (mode === "readonly") return [];
    if (mode === "supabase") return await listPublishedQuestionsSupabase();
    return await listPublishedQuestionsJsonl();
  } catch (error) {
    if (missingTable(error)) return [];
    throw error;
  }
}

export async function getPublishedQuestion(id: string): Promise<BoardQuestion | null> {
  const mode = dataStoreMode();
  try {
    if (mode === "readonly") return null;
    if (mode === "supabase") return await getPublishedQuestionSupabase(id);
    return await getPublishedQuestionJsonl(id);
  } catch (error) {
    if (missingTable(error)) return null;
    throw error;
  }
}

export const listQuestionsForAdmin = cache(async (): Promise<BoardQuestion[]> => {
  await requireAdmin();
  const mode = dataStoreMode();
  try {
    if (mode === "readonly") return [];
    if (mode === "supabase") return await listQuestionsSupabase();
    return await listQuestionsJsonl();
  } catch (error) {
    if (missingTable(error)) return [];
    throw error;
  }
});

export async function getQuestionForAdmin(id: string): Promise<BoardQuestion | null> {
  await requireAdmin();
  const mode = dataStoreMode();
  try {
    if (mode === "readonly") return null;
    if (mode === "supabase") return await getQuestionSupabase(id);
    return await getQuestionJsonl(id);
  } catch (error) {
    if (missingTable(error)) return null;
    throw error;
  }
}

export async function answerQuestion(id: string, answer: string) {
  await requireAdmin();
  assertWritable();
  if (dataStoreMode() === "supabase") return answerQuestionSupabase(id, answer);
  return answerQuestionJsonl(id, answer);
}

export async function bumpBoardViews(id: string) {
  try {
    if (dataStoreMode() === "supabase") return await bumpViewsSupabase(id);
    if (dataStoreMode() === "jsonl") return await bumpViewsJsonl(id);
  } catch (error) {
    if (missingTable(error)) return;
    throw error;
  }
}

export async function removeQuestion(id: string) {
  await requireAdmin();
  assertWritable();
  if (dataStoreMode() === "supabase") return removeQuestionSupabase(id);
  return removeQuestionJsonl(id);
}
