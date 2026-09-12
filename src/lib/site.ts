/**
 * 사이트 전체에서 쓰는 브랜드 정보와 문구.
 * 사진은 아직 없어서 image 값을 비워 두었다. `/public/images/...` 에 파일을 넣고
 * 경로만 채우면 각 섹션의 그라데이션 자리가 실제 사진으로 바뀐다.
 */

export const SITE = {
  // TODO(미확정): 브랜드명·연락처·주소·사업자 정보 모두 플레이스홀더. 대표 확인 필요.
  name: "coaching",
  nameKo: "코칭",
  tagline: "멈춰야 비로소 보이는 것이 있습니다.",
  description:
    "멈춘자는 삶과 사업의 중요한 전환점에서 더 나은 선택을 할 수 있도록 돕는 Transition Coaching 전문 코칭 그룹입니다.",
  phone: "070-0000-0000",
  email: "hello@example.com",
  addressLine: "3F, 00, ○○-ro, ○○-gu, Seoul",
  // TODO(미확정): 임시값. 기존 13시 시작은 방과후 전제였어서 오전 포함으로 바꿔 둠. 실제 운영시간 확인 필요.
  hours: "Mon-Fri 10:00-20:00",
  // NOTE: 키 이름은 `lunch` 지만 값은 토요일 운영시간이다. ConsultSection·Header 가 이 키를 참조하고 있어
  // 이름을 바꾸면 컴포넌트가 깨지므로 그대로 둔다. 컴포넌트 정리 시 `satHours` 등으로 함께 개명 필요.
  lunch: "Sat 10:00-18:00",
  owner: "○○○",
  company: "coaching Inc.",
  bizNo: "000-00-00000",
} as const;

/** 상단 띠 배너 — 순환 노출 */
export const TOP_MESSAGES = [
  "첫 상담 무료 · 하루 안에 연락드립니다",
  "성인 · 시니어 · 리더십 1:1 코칭 · 온라인 진행 가능",
] as const;

/** 헤더 메가메뉴 */
export const MENU_GROUPS = [
  {
    title: "The Moment",
    items: [
      { label: "왜멈춘자인가", href: "/story" },
      { label: "멈춘자가 만든 전환", href: "/way" },
      { label: "Our Belief", href: "/belief" },
    ],
  },
  {
    title: "Coaching",
    items: [
      { label: "Stage Transition", href: "/coaching/stage" },
      { label: "Next Chapter Transition", href: "/coaching/next-chapter" },
      { label: "From founder to leader", href: "/coaching/founder" },
      { label: "founder transition 진단", href: "/check" },
      { label: "your next leadership", href: "/coaching/leadership" },
    ],
  },
  {
    title: "Q&A",
    items: [
      { label: "1:1 코칭", href: "/consult" },
      { label: "자주묻는 질문", href: "/faq" },
      { label: "Q&A 게시판", href: "/board" },
      { label: "전화문의", href: `tel:${SITE.phone.replace(/-/g, "")}` },
    ],
  },
] as const;

export const HERO_SLIDES = [
  {
    eyebrow: "Adult · Senior · Leadership",
    title: "The Direction",
    body: "답을 드리는 대신, 스스로 답을 정할 수 있는 질문과 구조를 함께 만듭니다. 성인·시니어·리더를 위한 1:1 코칭.",
    cta: { label: "무료 상담 신청", href: "/consult" },
    tone: "forest" as const,
    image: "",
    video: "",
  },
  {
    eyebrow: "1:1 Coaching",
    title: "The Next Step",
    body: "커리어 전환, 은퇴 이후의 설계, 조직을 이끄는 일. 지금 서 있는 자리에 맞춰 다음 한 걸음을 정합니다.",
    cta: { label: "내게 맞는 코칭 찾기", href: "/coaching" },
    tone: "dusk" as const,
    image: "",
    video: "",
  },
] as const;

/**
 * 대상별 코칭 섹션.
 * 섹션 래퍼 id 는 `audience`, 각 항목 앵커는 `audience-{id}` 로 맞춘다(헤더 COACHING 메뉴가 참조).
 */
export const AUDIENCES = [
  {
    id: "adult",
    label: "Adult Coaching",
    title: "다음 방향을 스스로 정하는 시간",
    body: "이직, 창업, 커리어 전환. 결정을 미루는 이유는 정보가 부족해서가 아니라 기준이 정리되지 않아서입니다. 지금의 상황을 함께 펼쳐 놓고 무엇을 우선할지부터 정합니다. 코치가 답을 드리는 대신, 스스로 답을 말할 수 있을 때까지 질문합니다.",
    link: { label: "내 방향 상담 신청하기", href: "/consult" },
    tone: "sage" as const,
    image: "",
  },
  {
    id: "senior",
    label: "Senior Coaching",
    title: "경험을 다음 시간에 쓰는 법",
    body: "은퇴는 끝이 아니라 역할이 바뀌는 지점입니다. 지금까지 해온 일에서 무엇이 남고 무엇을 놓아도 되는지 함께 정리합니다. 속도는 본인이 정하고, 코치는 매 세션 그 속도를 확인합니다.",
    link: { label: "시니어 코칭 상담 신청하기", href: "/consult" },
    tone: "paper" as const,
    image: "",
  },
  {
    id: "leader",
    label: "Leadership Coaching",
    title: "성과가 아니라 사람을 이끄는 훈련",
    body: "팀을 맡는 순간 필요한 능력이 바뀝니다. 실무에서 통했던 방식이 사람 앞에서는 통하지 않습니다. 위임, 피드백, 갈등 대화처럼 매일 마주치는 장면을 하나씩 다룹니다. 회사를 거치지 않고 개인이 직접 신청할 수 있습니다.",
    link: { label: "리더십 코칭 상담 신청하기", href: "/consult" },
    tone: "forest" as const,
    image: "",
  },
] as const;

/** 프로그램 탭 + 카드 */
export const PROGRAM_TABS = [
  { id: "start", label: "Start" },
  { id: "core", label: "1:1" },
  { id: "online", label: "Online" },
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

/**
 * TODO(미확정): 실제 프로그램 가격이 확정되지 않았다. 이전 값(₩90,000~320,000)은 학생 대상 플레이스홀더였고
 * 성인·시니어·리더십 기준으로 다시 정해야 한다. 확정 전까지 `price` 는 "상담 후 안내" 로 노출한다.
 * 금액 확정 후 각 카드의 `price` 를 교체할 것. 할인가(`salePrice`)·배지는 검증된 근거가 생길 때만 다시 넣는다.
 */
export const PROGRAM_CARDS: ProgramCard[] = [
  {
    name: "Diagnosis Session",
    price: "상담 후 안내",
    summary:
      "지금의 상황과 원하는 방향을 정리하고, 앞으로의 코칭 로드맵으로 만들어 드리는 첫 단계",
    badge: "First Step",
    tone: "sage",
    image: "",
    tabs: ["start", "core"],
  },
  {
    name: "Weekly Coaching",
    price: "상담 후 안내",
    summary: "주 1회 60분 1:1 세션 · 세션 사이의 실행을 점검하고 다음 목표를 함께 조정합니다",
    tone: "paper",
    image: "",
    tabs: ["start", "core"],
  },
  {
    name: "Online Coaching",
    price: "상담 후 안내",
    summary: "지역과 상관없이 화상으로 진행하는 1:1 세션 · 출장과 이주 일정에도 끊기지 않습니다",
    tone: "sage",
    image: "",
    tabs: ["online", "core"],
  },
];

/** 중간 풀블리드 배너 */
export const MID_BANNER = {
  title: "The Coaching Room",
  body: "말이 정리되는 데는 방해받지 않는 한 시간이 필요합니다. 조용한 공간에서 지금의 상황을 소리 내어 펼쳐 놓는 것부터 시작합니다.",
  cta: { label: "코칭 진행 방식 보기", href: "/story" },
  tone: "forest" as const,
  image: "",
} as const;

/** 스토리 탭 섹션 — 코칭 진행 방식 3단계 */
export const STORY_TABS = [
  {
    id: "clarify",
    tab: "Clarify",
    title: "질문으로 정리하는 첫 세션",
    body: "무엇이 문제인지부터 다시 정의합니다. 스스로 설명해 보는 과정에서 실제로 걸려 있는 지점이 드러납니다.",
    link: { label: "첫 세션 상담 신청하기", href: "/consult" },
    tone: "sage" as const,
    image: "",
  },
  {
    id: "practice",
    tab: "Practice",
    title: "생각을 행동으로 옮기는 주간",
    body: "세션에서 정한 것을 실제로 해봅니다. 크게 바꾸지 않습니다. 다음 세션까지 지킬 수 있는 크기로 잘라 드립니다.",
    link: { label: "주간 코칭 살펴보기", href: "/program" },
    tone: "mist" as const,
    image: "",
  },
  {
    id: "review",
    tab: "Review",
    title: "돌아보고 다시 정하는 대화",
    body: "안 된 주에도 그대로 이야기합니다. 왜 막혔는지 확인하고 계획을 현실에 맞게 다시 맞춥니다.",
    link: { label: "코치 소개 보기", href: "/coach" },
    tone: "paper" as const,
    image: "",
  },
] as const;

/** 서비스 4종 */
export const SERVICES = [
  {
    title: "Free Consulting",
    body: "지금 어떤 상황인지 듣고 코칭이 필요한지부터 솔직하게 말씀드립니다.",
    link: { label: "무료 상담 신청하기", href: "/consult" },
    tone: "sage" as const,
    image: "",
  },
  {
    title: "Session Note",
    body: "세션에서 정리한 내용과 다음까지 할 일을 기록으로 남겨 드립니다.",
    link: { label: "진행 방식 살펴보기", href: "/story" },
    tone: "paper" as const,
    image: "",
  },
  {
    // TODO(미확정): 그룹 세션 실제 운영 여부·정원·주기 확인 필요.
    title: "Group Session",
    body: "비슷한 시기를 지나는 분들과 함께 이야기하는 소규모 세션도 있습니다.",
    link: { label: "그룹 세션 문의하기", href: "/consult" },
    tone: "mist" as const,
    image: "",
  },
  {
    title: "After Care",
    body: "프로그램이 끝난 뒤에도 정한 방향을 지키고 있는지 한 번 더 점검합니다.",
    link: { label: "이후 관리 문의하기", href: "/consult" },
    tone: "forest" as const,
    image: "",
  },
] as const;

/** 브랜드 스토리 (풀블리드 다크) */
export const BRAND_STORY = {
  tagline: "삶의 방향을 스스로 정하는 사람을 위한 1:1 코칭 브랜드",
  link: { label: "브랜드 스토리 확인하기", href: "/story" },
  image: "",
} as const;

/** 하단 3분할 원칙 카드 — 그리드가 3열 고정이므로 개수를 3개로 유지한다 */
export const PRINCIPLES = [
  { title: "Your Answer", body: "답은 당신 안에서 찾습니다.", tone: "forest" as const, image: "" },
  { title: "Fact & Record", body: "대화를 기록으로 남깁니다.", tone: "mist" as const, image: "" },
  { title: "Own Pace", body: "각자의 속도를 존중합니다.", tone: "sage" as const, image: "" },
] as const;

export const COACH = {
  // TODO(미확정): 코치 실명과 이력 확인 필요. 아래 credentials 는 코칭 브랜드 맥락의 중립 플레이스홀더이며
  // 실제 학위·자격·경력이 아니다. 확인 전까지 대외 공개하지 말 것.
  name: "김○○",
  role: "대표 코치",
  intro:
    "방향은 결국 본인이 정합니다. 그 결정을 대신하지 않고, 스스로 말할 수 있을 때까지 질문하고 끝까지 함께 점검합니다.",
  credentials: ["○○ 코칭 자격 보유", "성인·시니어 코칭 ○○년", "리더십 코칭 프로그램 운영"],
  tone: "paper" as const,
  image: "",
} as const;

export const FAQS = [
  {
    q: "일과 병행할 수 있나요?",
    a: "네, 대부분 재직 중이거나 사업을 운영하며 함께 진행합니다. 세션 시간은 일정에 맞춰 조율합니다.",
  },
  {
    q: "어떤 분들이 받을 수 있나요?",
    a: "커리어 전환을 준비하는 성인, 은퇴 이후를 설계하는 시니어, 조직을 이끄는 리더까지 목표를 스스로 정하고 싶은 분이면 됩니다. 리더십 코칭도 회사를 거치지 않고 개인이 직접 신청할 수 있습니다.",
  },
  {
    q: "온라인으로도 진행되나요?",
    a: "대면과 화상 중 선택할 수 있고, 진행 중에 바꾸셔도 됩니다. 지역과 출장 일정에 맞춰 화상으로만 진행하는 분도 있습니다.",
  },
  {
    q: "상담은 비용이 드나요?",
    a: "첫 상담은 무료입니다. 상담 후 프로그램을 시작하지 않아도 진단 결과는 그대로 안내드립니다.",
  },
] as const;

export const FOOTER_LINKS = [
  {
    title: "Brand",
    items: [
      { label: "왜멈춘자인가", href: "/story" },
      { label: "멈춘자가 만든 전환", href: "/way" },
      { label: "Our Belief", href: "/belief" },
      { label: "Coaching", href: "/coaching" },
      { label: "Coach", href: "/coach" },
      { label: "FAQ", href: "/faq" },
      { label: "Q&A 게시판", href: "/board" },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "무료 상담 신청", href: "/consult" },
      { label: "Founder Transition Check", href: "/check" },
      { label: "개인정보처리방침", href: "/privacy" },
      { label: SITE.email, href: `mailto:${SITE.email}` },
      { label: SITE.phone, href: `tel:${SITE.phone.replace(/-/g, "")}` },
    ],
  },
] as const;
