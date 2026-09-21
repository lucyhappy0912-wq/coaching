import { PAUSE_QUESTIONS, type Likert, type PauseBand, type PauseQuestionKey } from "./questions";

export type PauseAnswers = Record<PauseQuestionKey, Likert>;

export type PauseScores = {
  total: number;
  band: PauseBand;
  highKeys: PauseQuestionKey[];
};

export function isLikert(value: number): value is Likert {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

export function bandOf(total: number): PauseBand {
  if (total <= 59) return "FLOW";
  if (total <= 89) return "SIGNAL";
  if (total <= 119) return "PAUSE";
  return "TRANSITION";
}

export function computePause(answers: PauseAnswers): PauseScores {
  let total = 0;
  const highKeys: PauseQuestionKey[] = [];

  for (const q of PAUSE_QUESTIONS) {
    const score = answers[q.key];
    total += score;
    if (score >= 4) highKeys.push(q.key);
  }

  return { total, band: bandOf(total), highKeys };
}
