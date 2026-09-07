/**
 * 사이트 전체에서 쓰는 브랜드 정보와 문구.
 * 사진은 아직 없어서 image 값을 비워 두었다. `/public/images/...` 에 파일을 넣고
 * 경로만 채우면 각 섹션의 그라데이션 자리가 실제 사진으로 바뀐다.
 */

export const SITE = {
  name: "coaching",
  nameKo: "코칭",
  tagline: "스스로 공부하는 힘을 길러주는 1:1 학습코칭",
  description:
    "학습 진단부터 주간 코칭까지, 아이가 스스로 공부하는 습관을 만드는 1:1 학습코칭 브랜드입니다.",
  phone: "070-0000-0000",
  email: "hello@example.com",
  addressLine: "3F, 00, ○○-ro, ○○-gu, Seoul",
  hours: "Mon-Fri 13:00-22:00",
  lunch: "Sat 10:00-18:00",
  owner: "○○○",
  company: "coaching Inc.",
  bizNo: "000-00-00000",
} as const;

/** 상단 띠 배너 — 순환 노출 */
export const TOP_MESSAGES = [
  "첫 상담 무료 · 하루 안에 연락드립니다",
  "주 1회 1:1 코칭 · 학부모 주간 리포트 제공",
] as const;

/** 헤더 메가메뉴 */
export const MENU_GROUPS = [
  {
    title: "PROGRAM",
    items: [
      { label: "Diagnosis", href: "#program" },
      { label: "Weekly Coaching", href: "#program" },
      { label: "Daily Planner", href: "#program" },
      { label: "Online Coaching", href: "#program" },
    ],
  },
  {
    title: "BRAND",
    items: [
      { label: "Story", href: "#story" },
      { label: "Coach", href: "#coach" },
      { label: "Service", href: "#service" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "문의",
    items: [
      { label: "무료 상담 신청", href: "#consult" },
      { label: "자주 묻는 질문", href: "#faq" },
      { label: "전화 문의", href: "tel:07000000000" },
    ],
  },
] as const;

export const HERO_SLIDES = [
  {
    eyebrow: "2026 Spring Class",
    title: "The Habit",
    body: "성적은 하루의 선택이 쌓인 결과입니다. 매일의 선택을 바꾸는 12주 학습코칭을 시작해 보세요.",
    cta: { label: "상담 신청", href: "#consult" },
    tone: "forest" as const,
    image: "",
  },
  {
    eyebrow: "1:1 Coaching",
    title: "The Plan",
    body: "무엇을 어떻게 공부할지 매주 함께 정합니다. 지킬 수 있는 계획부터 만들어 드립니다.",
    cta: { label: "프로그램 보기", href: "#program" },
    tone: "sage" as const,
    image: "",
  },
] as const;

/** 프로그램 탭 + 카드 */
export const PROGRAM_TABS = [
  { id: "new", label: "Coaching" },
  { id: "best", label: "Best" },
  { id: "event", label: "Online" },
] as const;

export type ProgramCard = {
  name: string;
  price: string;
  salePrice?: string;
  summary: string;
  badge?: string;
  tone: "sage" | "paper" | "mist" | "forest";
  image: string;
  tabs: string[];
};

export const PROGRAM_CARDS: ProgramCard[] = [
  {
    name: "Diagnosis Report",
    price: "₩ 90,000",
    summary: "학습 성향과 과목별 취약 단원을 진단하고 3개월 로드맵으로 정리해 드리는 첫 단계",
    badge: "New",
    tone: "sage",
    image: "",
    tabs: ["new", "best"],
  },
  {
    name: "Weekly Coaching",
    price: "₩ 320,000",
    summary: "주 1회 60분 1:1 코칭 · 주간 실행률 점검과 과목별 공부법 피드백, 학부모 리포트 포함",
    badge: "Best",
    tone: "paper",
    image: "",
    tabs: ["new", "best"],
  },
  {
    name: "Daily Planner Care",
    price: "₩ 180,000",
    summary: "주 5일 매일의 학습 기록을 코치가 확인하고 흐트러질 때 바로 잡아 주는 온라인 관리",
    tone: "mist",
    image: "",
    tabs: ["new", "event"],
  },
  {
    name: "Exam 4 Weeks",
    price: "₩ 240,000",
    summary: "시험 4주 전, 과목별 우선순위와 시간표를 다시 짜고 매일 실행을 점검하는 집중 관리",
    tone: "forest",
    image: "",
    tabs: ["best", "event"],
  },
  {
    name: "Online Coaching",
    price: "₩ 260,000",
    salePrice: "₩ 208,000",
    summary: "지역과 상관없이 화상으로 진행하는 1:1 주간 코칭 · 첫 4주 체험 할인",
    badge: "Event",
    tone: "sage",
    image: "",
    tabs: ["event", "new"],
  },
  {
    name: "Parent Consulting",
    price: "₩ 60,000",
    summary: "아이와의 대화 방식부터 학원 선택까지, 학부모만을 위한 1회 상담",
    tone: "paper",
    image: "",
    tabs: ["best"],
  },
];

/** 중간 풀블리드 배너 */
export const MID_BANNER = {
  title: "The Study Room",
  body: "집중이 어려운 아이를 위한 코칭 공간. 조용한 환경과 코치의 관찰 아래에서 스스로 공부하는 시간을 만들어 갑니다.",
  cta: { label: "More", href: "#service" },
  tone: "forest" as const,
  image: "",
} as const;

/** 스토리 탭 섹션 */
export const STORY_TABS = [
  {
    id: "habit",
    tab: "Habit Care",
    title: "습관을 만드는 12주",
    body: "계획을 지키는 경험이 쌓이면 공부를 대하는 태도가 달라집니다. 12주 동안 실행률을 함께 관리합니다.",
    link: { label: "더 알아보기", href: "#program" },
    tone: "sage" as const,
    image: "",
  },
  {
    id: "subject",
    tab: "Subject Care",
    title: "과목마다 다른 공부법",
    body: "국어는 지문 분석, 수학은 오답 재풀이. 과목의 성격에 맞는 방법을 하나씩 손에 익혀 드립니다.",
    link: { label: "더 알아보기", href: "#program" },
    tone: "mist" as const,
    image: "",
  },
  {
    id: "mind",
    tab: "Mind Care",
    title: "흔들릴 때 잡아주는 대화",
    body: "성적이 떨어진 주에도 다시 앉을 수 있도록, 코치가 먼저 상태를 묻고 계획을 조정합니다.",
    link: { label: "더 알아보기", href: "#coach" },
    tone: "paper" as const,
    image: "",
  },
] as const;

/** 서비스 4종 */
export const SERVICES = [
  {
    title: "Free Consulting",
    body: "지금 어떤 상황인지 듣고 코칭이 필요한지부터 솔직하게 말씀드립니다.",
    link: { label: "무료 상담 신청하기", href: "#consult" },
    tone: "sage" as const,
    image: "",
  },
  {
    title: "Weekly Report",
    body: "이번 주 실행률과 다음 주 계획을 학부모님께 리포트로 보내드립니다.",
    link: { label: "리포트 예시 보기", href: "#story" },
    tone: "paper" as const,
    image: "",
  },
  {
    title: "Group Class",
    body: "친구와 함께라면 조금 더 부담 없는 제안을 드릴 수 있습니다.",
    link: { label: "그룹 코칭 문의하기", href: "#consult" },
    tone: "mist" as const,
    image: "",
  },
  {
    title: "School Partnership",
    body: "학교와 기관을 위한 학습코칭 프로그램을 함께 설계합니다.",
    link: { label: "제휴 문의하기", href: "#consult" },
    tone: "forest" as const,
    image: "",
  },
] as const;

/** 브랜드 스토리 (풀블리드 다크) */
export const BRAND_STORY = {
  tagline: "아이와 부모, 그리고 매일의 공부를 위한 학습 코칭 브랜드",
  link: { label: "브랜드 스토리 확인하기", href: "#story" },
  image: "",
} as const;

/** 하단 3분할 원칙 카드 */
export const PRINCIPLES = [
  { title: "Clear Method", body: "방법을 명확히 알려줍니다.", tone: "forest" as const, image: "" },
  { title: "Fact & Record", body: "기록으로 증명합니다.", tone: "mist" as const, image: "" },
  { title: "Own Pace", body: "아이의 속도를 존중합니다.", tone: "sage" as const, image: "" },
] as const;

export const COACH = {
  name: "김○○",
  role: "대표 코치 · 학습코칭 10년",
  intro:
    "성적은 결국 매일의 선택이 쌓인 결과입니다. 학생이 스스로 선택할 수 있을 때까지 방법을 알려 주고 끝까지 함께 점검합니다.",
  credentials: ["○○대학교 교육학 석사", "전 ○○학원 학습관리 총괄", "중·고등 학습코칭 개발"],
  tone: "paper" as const,
  image: "",
} as const;

export const FAQS = [
  {
    q: "학원과 병행할 수 있나요?",
    a: "네, 대부분의 학생이 학원이나 과외와 함께 진행합니다. 코칭은 수업을 대체하는 것이 아니라, 배운 내용을 스스로 정리하고 실행하도록 관리하는 과정입니다.",
  },
  {
    q: "몇 학년부터 받을 수 있나요?",
    a: "초등 고학년부터 고등학생까지 가능합니다. 학년보다 스스로 계획을 지키려는 의지가 있는지가 더 중요합니다.",
  },
  {
    q: "온라인으로도 진행되나요?",
    a: "주간 코칭은 대면과 화상 중 선택할 수 있고, 데일리 플래너 관리는 온라인으로 진행됩니다.",
  },
  {
    q: "상담은 비용이 드나요?",
    a: "첫 상담은 무료입니다. 상담 후 프로그램을 시작하지 않아도 진단 결과는 그대로 안내드립니다.",
  },
] as const;

export const GRADE_OPTIONS = [
  "초등 4학년",
  "초등 5학년",
  "초등 6학년",
  "중1",
  "중2",
  "중3",
  "고1",
  "고2",
  "고3",
  "기타",
] as const;

export const FOOTER_LINKS = [
  {
    title: "Brand",
    items: [
      { label: "Story", href: "#story" },
      { label: "Coach", href: "#coach" },
      { label: "Program", href: "#program" },
      { label: "Service", href: "#service" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "무료 상담 신청", href: "#consult" },
      { label: SITE.email, href: `mailto:${SITE.email}` },
      { label: SITE.phone, href: `tel:${SITE.phone.replace(/-/g, "")}` },
    ],
  },
] as const;
