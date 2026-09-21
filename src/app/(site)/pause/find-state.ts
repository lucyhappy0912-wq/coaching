import type { PauseScores } from "@/lib/pause/compute";

export type FindPauseState = {
  error: string | null;
  scores: PauseScores | null;
  name?: string;
  phone?: string;
  email?: string;
};
