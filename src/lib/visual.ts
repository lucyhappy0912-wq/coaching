/** 홈 비주얼 가이드 v1.0 — 한 섹션에 강한 사진 1장. */
export const HOME_VISUAL = {
  hero: "/media/visual-hero.jpg",
  pause: "/media/visual-pause.jpg",
  transition: "/media/visual-transition.jpg",
  stairs: "/media/visual-stairs.jpg",
  next: "/media/visual-next.jpg",
  founder: "/media/visual-founder.png",
} as const;

export const VISUAL_POS = {
  hero: "center 70%",
  pause: "32% 78%",
  transition: "center 60%",
  stairs: "center 20%",
  next: "center 40%",
  founder: "center 40%",
} as const;

export const WAY_CYCLE = [
  HOME_VISUAL.hero,
  HOME_VISUAL.pause,
  HOME_VISUAL.transition,
  HOME_VISUAL.stairs,
  HOME_VISUAL.next,
] as const;

const OLD_HERO =
  /home-moment|belief-hero|way-hero|check-hero|founder-hero|stage-hero|chapter-hero|leadership-hero|home-stage|home-next|home-founder|story-pause|week-see|week-move/;

export function portraitOrFounder(src?: string) {
  if (!src?.trim() || OLD_HERO.test(src)) return HOME_VISUAL.founder;
  return src;
}

export const HOME_PROCESS = [
  { key: "PAUSE", body: "잠시 멈춰 지금의 삶을 바라봅니다." },
  { key: "AWARENESS", body: "무엇이 지금의 나와 맞지 않는지 알아차립니다." },
  { key: "TRANSITION", body: "무엇을 유지하고 바꿀지 선택합니다." },
  { key: "NEXT", body: "선택한 방향을 다음 삶의 방식으로 만듭니다." },
] as const;
