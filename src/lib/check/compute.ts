import {
  AREA_IDS,
  QUESTIONS,
  type AreaId,
  type Band,
  type Likert,
  type QuestionKey,
} from "./questions";

export const PRIORITY_AREA_MIN = 10;
export const PRIORITY_AREA_FOCUS = 3;

export function isPriorityAreaScore(score: number) {
  return score >= PRIORITY_AREA_MIN;
}

export type Answers = Record<QuestionKey, Likert>;

export type CheckScores = {
  total: number;
  band: Band;
  areas: Record<AreaId, number>;
  highKeys: QuestionKey[];
  midKeys: QuestionKey[];
  topAreas: AreaId[];
  quietAreas: AreaId[];
  priorityAreas: AreaId[];
};

export function bandOf(total: number): Band {
  if (total <= 41) return "STABLE";
  if (total <= 62) return "SIGNAL";
  if (total <= 83) return "NEEDED";
  return "PRIORITY";
}

export function isLikert(value: number): value is Likert {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

export function compute(answers: Answers): CheckScores {
  const areas = Object.fromEntries(AREA_IDS.map((id) => [id, 0])) as Record<AreaId, number>;
  let total = 0;
  const highKeys: QuestionKey[] = [];
  const midKeys: QuestionKey[] = [];

  for (const q of QUESTIONS) {
    const score = answers[q.key];
    total += score;
    areas[q.area] += score;
    if (score >= 4) highKeys.push(q.key);
    if (score === 3) midKeys.push(q.key);
  }

  const ranked = [...AREA_IDS].sort((a, b) => areas[b] - areas[a] || AREA_IDS.indexOf(a) - AREA_IDS.indexOf(b));
  const topScore = areas[ranked[0]];
  const topAreas = ranked.filter((id) => areas[id] === topScore).slice(0, 2);

  const quietAreas = AREA_IDS.filter((id) =>
    QUESTIONS.filter((q) => q.area === id).every((q) => answers[q.key] <= 2),
  );

  const priorityAreas = AREA_IDS.filter((id) => isPriorityAreaScore(areas[id]))
    .sort((a, b) => areas[b] - areas[a] || AREA_IDS.indexOf(a) - AREA_IDS.indexOf(b))
    .slice(0, PRIORITY_AREA_FOCUS);

  return { total, band: bandOf(total), areas, highKeys, midKeys, topAreas, quietAreas, priorityAreas };
}
