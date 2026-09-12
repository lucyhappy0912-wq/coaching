import type { CheckScores } from "@/lib/check/compute";

export type FindCheckState = { error: string | null; scores: CheckScores | null };
