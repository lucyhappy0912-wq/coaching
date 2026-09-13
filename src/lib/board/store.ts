import "server-only";

import { cache } from "react";

import { requireAdmin } from "@/lib/auth/dal";
import { dataStoreMode } from "@/lib/check/store-mode";

import {
  answerQuestionJsonl,
  createQuestionJsonl,
  getPublishedQuestionJsonl,
  getQuestionJsonl,
  listPublishedQuestionsJsonl,
  listQuestionsJsonl,
  removeQuestionJsonl,
} from "./store-jsonl";
import {
  answerQuestionSupabase,
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

export async function createQuestion(input: { name: string; title: string; body: string }) {
  assertWritable();
  if (dataStoreMode() === "supabase") return createQuestionSupabase(input);
  return createQuestionJsonl(input);
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

export async function answerQuestion(id: string, answer: string, published: boolean) {
  await requireAdmin();
  assertWritable();
  if (dataStoreMode() === "supabase") return answerQuestionSupabase(id, answer, published);
  return answerQuestionJsonl(id, answer, published);
}

export async function removeQuestion(id: string) {
  await requireAdmin();
  assertWritable();
  if (dataStoreMode() === "supabase") return removeQuestionSupabase(id);
  return removeQuestionJsonl(id);
}
