export const AREA_IDS = [
  "VALUE",
  "ROLE",
  "BEING",
  "LEADERSHIP",
  "ORGANIZATION",
  "DECISION",
  "LIFE",
] as const;

export type AreaId = (typeof AREA_IDS)[number];
export type Likert = 1 | 2 | 3 | 4 | 5;
export type Band = "STABLE" | "SIGNAL" | "NEEDED" | "PRIORITY";

export type QuestionKey =
  | "VALUE_SHIFT"
  | "PURPOSE_AWARENESS"
  | "VALUE_BASED_DECISION"
  | "ROLE_TRANSITION"
  | "ROLE_CLARITY"
  | "ROLE_BOUNDARY"
  | "IDENTITY"
  | "SOURCE_OF_FULFILLMENT"
  | "SELF_WORTH"
  | "LEADERSHIP_TRANSITION"
  | "INFLUENCE"
  | "LEADER_CAPABILITY"
  | "LEADERSHIP_IMPACT"
  | "FOUNDER_DEPENDENCY"
  | "ORGANIZATIONAL_AUTONOMY"
  | "DECISION_OVERLOAD"
  | "FOUNDER_FOCUS"
  | "DECISION_AUTHORITY"
  | "LIFE_NEGLECT"
  | "LIFE_TO_LEADERSHIP_SPILLOVER"
  | "LIFE_SUSTAINABILITY";

export type Question = {
  no: number;
  key: QuestionKey;
  area: AreaId;
  label: string;
  prompt: string;
  transitionPoint: string;
};

export const AREAS: Record<AreaId, { title: string; question: string; wrap: string }> = {
  VALUE: {
    title: "VALUE",
    question: "나는 무엇을 위해 이 사업을 하는가?",
    wrap: "역할이나 조직을 손보기 전에, 지금의 나에게 중요한 것이 회사의 방향과 연결되어 있는지를 먼저 봅니다.",
  },
  ROLE: {
    title: "ROLE",
    question: "지금의 회사에서 나는 어떤 역할을 하고 있는가?",
    wrap: "회사의 다음 성장은 Founder가 더 많은 일을 할 때가 아니라, 역할이 다음 단계로 전환될 때 시작됩니다.",
  },
  BEING: {
    title: "BEING",
    question: "일을 넘어, 나는 어떤 사람인가?",
    wrap: "일하는 방식보다 먼저, Founder라는 역할 안에 갇히지 않은 채로 회사를 이끌 수 있는지를 봅니다.",
  },
  LEADERSHIP: {
    title: "LEADERSHIP",
    question: "지금까지의 리더십이 다음 성장에도 유효한가?",
    wrap: "직접 성과를 만드는 사람에서, 사람들이 성과를 만들 수 있게 하는 사람으로의 전환이 핵심입니다.",
  },
  ORGANIZATION: {
    title: "ORGANIZATION",
    question: "나의 방식은 어떤 조직을 만들고 있는가?",
    wrap: "‘내가 움직이는 회사’에서 ‘조직이 움직이는 회사’로 바꾸는 작업이 우선입니다.",
  },
  DECISION: {
    title: "DECISION",
    question: "나는 어디에 시간과 에너지를 쓰고 있는가?",
    wrap: "다음 단계의 Leader는 모든 결정의 중심이 아니라, 중요한 결정에 집중하고 나머지는 조직이 정하게 만드는 사람입니다.",
  },
  LIFE: {
    title: "LIFE",
    question: "지금 나의 삶은 어떠한가?",
    wrap: "워라밸 문제가 아니라, 원하는 성공과 원하는 삶이 같은 방향을 보는가입니다.",
  },
};

export const QUESTIONS: Question[] = [
  {
    no: 1,
    key: "VALUE_SHIFT",
    area: "VALUE",
    label: "VALUE SHIFT",
    prompt:
      "사업을 처음 시작했을 때 중요하게 생각했던 것과 지금 내가 추구하는 것 사이에 변화가 생겼다.",
    transitionPoint: "과거의 가치로 현재의 회사를 이끌고 있지는 않은가?",
  },
  {
    no: 2,
    key: "PURPOSE_AWARENESS",
    area: "VALUE",
    label: "PURPOSE AWARENESS",
    prompt:
      "매출과 성장에 집중하면서, 이 사업을 통해 궁극적으로 무엇을 이루고 싶은지 돌아볼 여유가 부족하다고 느낀다.",
    transitionPoint: "나는 지금 사업을 운영하고 있는가, 아니면 내가 원하는 미래를 만들고 있는가?",
  },
  {
    no: 3,
    key: "VALUE_BASED_DECISION",
    area: "VALUE",
    label: "VALUE-BASED DECISION",
    prompt: "중요한 선택의 순간에 무엇을 기준으로 결정해야 하는지 흔들리거나 고민하는 경우가 있다.",
    transitionPoint: "나에게 중요한 것은 알고 있지만, 그것이 실제 선택의 기준으로 작동하고 있는가?",
  },
  {
    no: 4,
    key: "ROLE_TRANSITION",
    area: "ROLE",
    label: "ROLE TRANSITION",
    prompt: "회사가 성장하면서 대표인 나에게 요구되는 역할이 이전과 달라졌다고 느낀다.",
    transitionPoint:
      "회사는 이미 다음 단계로 이동했는데, 나는 아직 이전 단계의 Founder 역할에 머물러 있지는 않은가?",
  },
  {
    no: 5,
    key: "ROLE_CLARITY",
    area: "ROLE",
    label: "ROLE CLARITY",
    prompt:
      "회사의 현재 성장 단계에서 대표인 내가 가장 집중해야 할 역할이 무엇인지 명확하지 않을 때가 있다.",
    transitionPoint: "지금 내 캘린더를 보면, 회사에서 내가 가장 중요하게 맡아야 할 역할이 보이는가?",
  },
  {
    no: 6,
    key: "ROLE_BOUNDARY",
    area: "ROLE",
    label: "ROLE BOUNDARY",
    prompt:
      "팀이 커지고 구성원의 역할이 늘어났지만, 내가 직접 해야 하는 일과 구성원에게 맡겨야 하는 일의 구분이 명확하지 않을 때가 있다.",
    transitionPoint:
      "내가 지금 하고 있는 일은 정말 ‘대표가 해야 하는 일’인가, 아니면 단지 ‘내가 잘하는 일’인가?",
  },
  {
    no: 7,
    key: "IDENTITY",
    area: "BEING",
    label: "IDENTITY",
    prompt:
      "회사와 일에서 잠시 벗어나면, ‘나는 어떤 사람인가’라는 질문에 선뜻 답하기 어렵다고 느낄 때가 있다.",
    transitionPoint: "Founder라는 직함을 잠시 내려놓았을 때, 나는 나를 어떻게 설명할 수 있는가?",
  },
  {
    no: 8,
    key: "SOURCE_OF_FULFILLMENT",
    area: "BEING",
    label: "SOURCE OF FULFILLMENT",
    prompt: "일과 사업을 제외하면, 나에게 무엇이 즐거움과 만족을 주는지 잘 모르겠다고 느낄 때가 있다.",
    transitionPoint: "성과를 만들어내는 시간 외에, 무엇이 나를 즐겁고 살아 있다고 느끼게 하는가?",
  },
  {
    no: 9,
    key: "SELF_WORTH",
    area: "BEING",
    label: "SELF-WORTH",
    prompt: "회사의 성과나 상황에 따라 나 자신의 가치까지 달라지는 것처럼 느껴질 때가 있다.",
    transitionPoint: "회사가 기대만큼 잘되지 않는 순간에도, 나는 나 자신의 가치를 유지할 수 있는가?",
  },
  {
    no: 10,
    key: "LEADERSHIP_TRANSITION",
    area: "LEADERSHIP",
    label: "LEADERSHIP TRANSITION",
    prompt:
      "지금까지 회사를 성장시킨 나의 방식이 회사의 다음 단계에서도 계속 효과적일지 의문이 들 때가 있다.",
    transitionPoint: "지금까지 나를 성공시킨 방식 중, 다음 단계에서는 오히려 내려놓아야 할 것은 무엇인가?",
  },
  {
    no: 11,
    key: "INFLUENCE",
    area: "LEADERSHIP",
    label: "INFLUENCE",
    prompt:
      "대표라는 직책이나 권한이 없다면, 구성원들이 방향에 공감하고 자발적으로 움직이게 하는 영향력을 충분히 발휘하기 어려울 것 같다.",
    transitionPoint:
      "사람들은 내가 대표이기 때문에 움직이는가, 아니면 내가 제시하는 방향을 믿기 때문에 움직이는가?",
  },
  {
    no: 12,
    key: "LEADER_CAPABILITY",
    area: "LEADERSHIP",
    label: "LEADER CAPABILITY",
    prompt:
      "회사가 성장하면서 내가 일을 잘하는 것과 조직을 잘 이끄는 것은 다른 능력이라는 것을 느끼고 있다.",
    transitionPoint:
      "나는 아직 가장 뛰어난 실행자인가, 아니면 다른 사람들이 뛰어난 성과를 내도록 만드는 리더인가?",
  },
  {
    no: 13,
    key: "LEADERSHIP_IMPACT",
    area: "ORGANIZATION",
    label: "LEADERSHIP IMPACT",
    prompt:
      "내가 의도하는 리더십과 구성원들이 실제로 경험하는 나의 리더십 사이에는 차이가 있을 수 있다고 생각한다.",
    transitionPoint:
      "내가 생각하는 ‘나의 리더십’과 구성원들이 실제로 경험하는 ‘나의 리더십’은 얼마나 같은가?",
  },
  {
    no: 14,
    key: "FOUNDER_DEPENDENCY",
    area: "ORGANIZATION",
    label: "FOUNDER DEPENDENCY",
    prompt: "조직의 중요한 일들이 대표인 나의 판단이나 개입을 기다리면서 멈추는 경우가 있다.",
    transitionPoint: "내가 일주일 동안 회사에 없어도 중요한 일들은 계속 앞으로 나아갈 수 있는가?",
  },
  {
    no: 15,
    key: "ORGANIZATIONAL_AUTONOMY",
    area: "ORGANIZATION",
    label: "ORGANIZATIONAL AUTONOMY",
    prompt:
      "구성원들이 스스로 판단하고 움직이기를 기대하지만, 어떻게 해야 구성원들의 자발적인 판단과 실행을 이끌어낼 수 있는지 방법을 모르겠다고 느낄 때가 있다.",
    transitionPoint:
      "나는 자율성을 기대하기만 하는가, 아니면 자율적으로 움직일 수 있는 환경을 만들고 있는가?",
  },
  {
    no: 16,
    key: "DECISION_OVERLOAD",
    area: "DECISION",
    label: "DECISION OVERLOAD",
    prompt: "중요한 의사결정이 여전히 나에게 집중되어 있어 판단의 부담을 크게 느낄 때가 있다.",
    transitionPoint: "지금 내가 내리는 결정 중 정말 Founder만이 내려야 하는 결정은 얼마나 되는가?",
  },
  {
    no: 17,
    key: "FOUNDER_FOCUS",
    area: "DECISION",
    label: "FOUNDER FOCUS",
    prompt:
      "눈앞의 문제와 운영을 해결하느라 정작 대표인 내가 해야 할 중요한 일에 충분한 시간을 쓰지 못하고 있다.",
    transitionPoint:
      "나는 오늘의 회사를 운영하는 데 시간을 쓰고 있는가, 다음 단계의 회사를 만드는 데 시간을 쓰고 있는가?",
  },
  {
    no: 18,
    key: "DECISION_AUTHORITY",
    area: "DECISION",
    label: "DECISION AUTHORITY",
    prompt:
      "구성원에게 업무를 맡기더라도, 어디까지 스스로 결정하게 하고 어떤 사안부터 나와 상의하게 해야 하는지 기준이 명확하지 않을 때가 있다.",
    transitionPoint: "우리 조직의 구성원들은 ‘어디까지 내가 결정해도 되는가’를 알고 있는가?",
  },
  {
    no: 19,
    key: "LIFE_NEGLECT",
    area: "LIFE",
    label: "LIFE NEGLECT",
    prompt:
      "사업에 많은 시간과 에너지를 쏟는 동안, 내 삶에서 중요하지만 충분히 돌보지 못한 영역이 있다고 느낀다.",
    transitionPoint: "사업을 키우는 동안 나는 무엇을 계속 뒤로 미루고 있는가?",
  },
  {
    no: 20,
    key: "LIFE_TO_LEADERSHIP_SPILLOVER",
    area: "LIFE",
    label: "LIFE-TO-LEADERSHIP SPILLOVER",
    prompt:
      "일, 관계, 건강, 휴식 등 삶의 다른 영역에서 겪는 어려움이 대표로서의 판단이나 역할 수행에도 영향을 미친다고 느낄 때가 있다.",
    transitionPoint:
      "지금 나의 삶의 상태는 더 좋은 리더십을 가능하게 하고 있는가, 아니면 어렵게 만들고 있는가?",
  },
  {
    no: 21,
    key: "LIFE_SUSTAINABILITY",
    area: "LIFE",
    label: "LIFE SUSTAINABILITY",
    prompt: "지금과 같은 방식으로 앞으로 5년을 살아간다면, 그때의 삶에 만족할 수 있을지 확신이 없다.",
    transitionPoint: "지금과 똑같은 방식으로 5년을 더 살아도 나는 이 삶을 선택할 것인가?",
  },
];

export const QUESTION_KEYS = QUESTIONS.map((q) => q.key);

export const LIKERT_LABELS = [
  { value: 1 as const, label: "전혀 그렇지 않다" },
  { value: 2 as const, label: "그렇지 않은 편이다" },
  { value: 3 as const, label: "보통이다" },
  { value: 4 as const, label: "그런 편이다" },
  { value: 5 as const, label: "매우 그렇다" },
];

export const INSTRUMENT_VERSION = "2026-09-10";
export const CONSENT_VERSION = "check-2026-09-12";
export const RETENTION_DAYS = 90;
