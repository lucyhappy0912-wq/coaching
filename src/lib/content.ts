import type { PhotoTone } from "@/lib/cms/types";

export type WeekCopy = {
  week: string;
  stage: string;
  title: string;
  body: string[];
  change: { from: string; to: string };
};

export type ProgramTeaser = {
  id: string;
  eyebrow: string;
  line: string;
  title: string;
  lead: string[];
  axis: string;
  close: string[];
  process: string[];
  href: string;
  cta: string;
  tone: PhotoTone;
};

export const HOME_MOMENT = {
  eyebrow: "The Moment",
  lines: [
    "더 나은 삶을 위해 끊임없이 달리셨나요?",
    "하지만",
    "멈춰야 비로소 보이는 것이 있습니다.",
  ],
  body: "멈춘자는 삶과 사업의 중요한 전환점에서 더 나은 선택을 할 수 있도록 돕는 Transition Coaching 전문 코칭 그룹입니다.",
} as const;

export const PROGRAM_TEASERS: ProgramTeaser[] = [
  {
    id: "stage",
    eyebrow: "Stage Transition",
    line: "From just being to becoming",
    title: "Stage Transition",
    lead: [
      "특별한 문제는 없어 보이는데 문득 공허해질 때가 있습니다.",
      "“앞으로도 이렇게 살아가면 될까?”",
      "혹은 이미 알고 있을지도 모릅니다.",
      "“이제는 정말 달라지고 싶다.”",
    ],
    axis: "Self – Awareness – Direction – Next Stage",
    close: [
      "삶의 변화의 문턱에서 망설인다면 자신의 진짜 존재를 마주하고 진짜 원하는 것을 찾아가는 Stage Transition을 함께합니다.",
      "6주 후, 다음 무대로 나갈 당신을 만나보세요.",
    ],
    process: ["Deep Awareness", "Self Work", "Coaching", "Integration", "Action"],
    href: "/coaching/stage",
    cta: "Stage Transition 더 알아보기",
    tone: "sage",
  },
  {
    id: "next-chapter",
    eyebrow: "Next Chapter Transition",
    line: "From success to significance",
    title: "Next Chapter Transition",
    lead: [
      "치열하게 원하는 부와 명예를 성취했습니다.",
      "이제, 멈춰 인생의 다음 장을 바라볼 시간입니다.",
    ],
    axis: "Role – Self – Contribution – Next Chapter",
    close: [
      "아직 살아보지 않은 삶의 가능성을 발견한다면 남은 20년, 30년은 마지막으로 원하는 삶을 살 기회입니다.",
    ],
    process: ["Deep Awareness", "Self Work", "Group Coaching", "Integration", "Action"],
    href: "/coaching/next-chapter",
    cta: "Next Chapter 더 알아보기",
    tone: "paper",
  },
  {
    id: "founder",
    eyebrow: "Founder Coaching Transition",
    line: "From founder to leader",
    title: "Founder Transition",
    lead: [
      "수많은 결정과 도전을 거쳐, 회사를 여기까지 성장시켰습니다.",
      "이제, 멈춰 창업자 자신과 조직의 다음 단계를 바라볼 시간입니다.",
    ],
    axis: "Founder – Leadership – Organization – Scale",
    close: [
      "당신이 모든 것을 해결하던 방식에서 벗어나 사람과 조직을 통해 성장하는 방법을 발견한다면 회사의 불가능해 보이던 다음 성장이 시작됩니다.",
    ],
    process: ["Deep Awareness", "Self Work", "Group Coaching", "Integration", "Action"],
    href: "/coaching/founder",
    cta: "Founder Transition 더 알아보기",
    tone: "forest",
  },
];

export const BRAND_WHY = {
  eyebrow: "Brand Story",
  title: "WHY 멈춘자",
  lead: "앞으로 나아가기 위해, 우리는 때때로 멈춰야 합니다.",
  paragraphs: [
    "우리는 더 나은 삶을 위해 끊임없이 앞으로 나아갑니다. 더 열심히 일하고, 더 많은 것을 이루고, 더 나은 사람이 되기 위해 노력합니다.",
    "하지만 삶에는 멈춰야 비로소 보이는 것들이 있습니다.",
    "특별한 문제는 없는데 문득 공허해질 때. 지금까지의 방식으로는 더 이상 앞으로 나아가기 어렵다고 느낄 때. 원하던 것을 이루고도 새로운 질문이 시작될 때.",
    "“나는 앞으로 어떻게 살고 싶은가?”",
    "멈춘자는 그 순간을 문제나 실패라고 생각하지 않습니다. 멈춤은, 다음으로 나아가기 위한 시작입니다.",
    "잠시 멈춰 지금의 나를 깊이 바라보면 그동안 보이지 않았던 것들이 보이기 시작합니다. 내가 진정 원하는 것이 무엇인지. 무엇을 남기고, 무엇을 바꿀 것인지. 그리고 어디로 나아가고 싶은지.",
    "멈춘자는 바로 그 순간을 위해 탄생했습니다.",
    "삶과 비즈니스의 중요한 전환점에서 자신을 깊이 이해하고 새로운 가능성을 발견하며, 그 발견이 더 나은 선택과 행동으로 이어지도록. 생각에 머물던 변화를 삶의 실제 전환으로 만들어갑니다.",
  ],
  tone: "forest" as const,
};

export const BELIEFS = [
  {
    no: "01",
    en: "Pause",
    title: "멈춤에서 시작합니다.",
    body: [
      "더 빠르게 달리는 것이 언제나 더 멀리 가는 방법은 아닙니다.",
      "우리는 답을 찾기 전에 잠시 멈춥니다. 지금 어디에 서 있는지, 어디를 향해 가고 있는지 바라봅니다.",
      "멈춤은 포기가 아닙니다. 더 나은 방향을 선택하기 위한 시작입니다.",
    ],
  },
  {
    no: "02",
    en: "Awareness",
    title: "깊이 바라봅니다.",
    body: [
      "삶의 변화는 자신을 제대로 이해하는 것에서 시작됩니다.",
      "겉으로 드러난 문제만 해결하기보다 반복되는 선택과 행동, 그 안의 가치와 욕구를 깊이 바라봅니다.",
      "그리고 묻습니다. 나는 무엇을 원하는가. 나는 무엇을 선택하며 살아가고 싶은가.",
      "자신을 깊이 인식할수록 앞으로 나아갈 방향은 선명해집니다.",
    ],
  },
  {
    no: "03",
    en: "Discover",
    title: "새로운 가능성을 발견합니다.",
    body: [
      "우리는 익숙한 삶 안에서 가능성의 범위를 스스로 좁히곤 합니다.",
      "하지만 잠시 멈춰 다른 시선으로 바라보면 지금까지 생각하지 못했던 선택지가 보이기 시작합니다.",
      "멈춘자는 하나의 정답을 제시하지 않습니다. 당신 안에 이미 존재하지만 아직 발견하지 못한 가능성을 함께 찾습니다.",
    ],
  },
  {
    no: "04",
    en: "Transition",
    title: "실제 변화를 만듭니다.",
    body: [
      "좋은 질문과 깊은 통찰만으로 삶이 달라지는 것은 아닙니다.",
      "발견한 것을 선택으로, 선택을 행동으로 연결할 때 비로소 변화가 시작됩니다.",
      "멈춘자는 생각에 머물던 가능성을 구체적인 선택과 행동으로 연결합니다. 그래서 변화가 순간의 결심으로 끝나지 않고 삶의 실제 전환이 되도록 합니다.",
    ],
  },
] as const;

export const BELIEF_CLOSE = {
  chain: "PAUSE. AWARENESS. DISCOVER. TRANSITION.",
  line: "멈추고, 인식하고, 발견하고, 전환합니다.",
  close: ["우리는 믿습니다.", "지금의 멈춤은 당신의 다음이 시작되는 출발선이라고."],
} as const;

export const WAY = {
  eyebrow: "The Momchunja Way",
  title: "존재에서 시작해, 삶의 변화로 나아갑니다.",
  lead: "멈춘자는 눈앞의 문제를 해결하거나 목표를 달성하는 것에만 머물지 않습니다. 한 사람의 존재를 깊이 이해하는 것에서 시작해, 그 발견이 더 나은 선택과 삶의 실제 변화로 이어지도록 합니다.",
  tone: "mist" as const,
  items: [
    {
      no: "01",
      en: "Deep Awareness",
      title: "문제보다 먼저, 존재를 바라봅니다.",
      body: [
        "무엇을 해결할 것인지보다 누가 그 삶을 살아가고 있는지에서 시작합니다.",
        "눈앞의 문제와 목표를 넘어 나는 누구인지, 무엇을 중요하게 여기는지, 어떤 믿음과 욕구가 나의 선택을 만들어왔는지 깊이 바라봅니다.",
        "무엇을 할 것인가(Doing)보다 어떤 존재로 살아갈 것인가(Being)를 먼저 묻습니다.",
        "자신을 깊이 이해할 때 비로소 진정 원하는 것과 변화의 방향이 선명해집니다.",
      ],
    },
    {
      no: "02",
      en: "Whole-Person Perspective",
      title: "삶을 하나의 전체로 바라봅니다.",
      body: [
        "일의 문제는 일만의 문제가 아닐 수 있고, 사업의 문제 역시 사업만의 문제는 아닐 수 있습니다.",
        "일과 관계, 감정과 가치, 역할과 삶의 방향은 서로 연결되어 있습니다.",
        "멈춘자는 하나의 문제만 떼어놓기보다 한 사람과 그 사람이 살아가는 삶 전체를 바라봅니다.",
        "더 나은 선택은 삶의 한 부분이 아니라 전체와 조화를 이룰 때 지속될 수 있다고 믿습니다.",
      ],
    },
    {
      no: "03",
      en: "Actionable Change",
      title: "깨달음을 실제 변화로 연결합니다.",
      body: [
        "좋은 질문과 깊은 통찰만으로 삶이 달라지는 것은 아닙니다.",
        "새롭게 발견한 것을 선택으로, 선택을 구체적인 행동으로 연결합니다. 그리고 작은 행동을 통해 배우고 조정하며 새로운 방식이 실제 삶에 자리 잡도록 합니다.",
        "Awareness → Choice → Action → Change",
        "멈춘자는 생각에 머물던 변화를 삶에서 경험할 수 있는 변화로 만들어갑니다.",
      ],
    },
    {
      no: "04",
      en: "Honor the Pattern",
      title: "지금까지의 삶을 틀렸다고 말하지 않습니다.",
      body: [
        "우리가 반복해온 선택과 삶의 방식에는 저마다의 이유가 있습니다.",
        "어떤 방식은 나를 지켜주었고, 어떤 선택은 지금의 나를 여기까지 데려온 힘이 되었습니다.",
        "그래서 멈춘자는 과거의 나를 부정하며 변화를 시작하지 않습니다. 지금까지의 나를 이해하고 존중한 뒤, 이제도 필요한 것은 남기고 더 이상 필요하지 않은 것은 새롭게 선택합니다.",
        "변화는 과거의 나를 버리는 것이 아니라 다음 단계의 나에게 맞는 방식으로 전환하는 과정이라고 믿습니다.",
      ],
    },
    {
      no: "05",
      en: "Real-Life Alignment",
      title: "가능성을 현실과 연결합니다.",
      body: [
        "원하는 삶을 발견하는 것만으로는 충분하지 않습니다.",
        "시간과 자원, 관계와 환경, 현재의 책임과 감당할 수 있는 위험까지 함께 바라봅니다.",
        "현실 때문에 원하는 삶을 포기하는 것이 아니라, 내가 원하는 방향과 지금의 현실이 만날 수 있는 방법을 찾습니다.",
        "그래서 변화가 순간의 결심으로 끝나지 않고 지속할 수 있는 삶의 전환이 되도록 합니다.",
      ],
    },
  ],
} as const;

export const STAGE_PROGRAM = {
  eyebrow: "Stage Transition",
  title: "6 weeks to your next stage",
  lead: "6주 후, 당신은 어디에 서 있을까요?",
  intro: [
    "Stage Transition은 내가 원하는 다음 무대를 스스로 선택하고 움직이도록 돕습니다.",
  ],
  process: ["Pause", "See", "Discover", "Explore", "Choose", "Move"],
  tone: "sage" as const,
  weeks: [
    {
      week: "01",
      stage: "Pause",
      title: "지금의 삶을 멈춰 바라봅니다.",
      body: [
        "답을 찾기 전에 먼저 멈춥니다.",
        "현재의 삶을 돌아보며 무엇이 만족스럽고, 무엇이 더 이상 나와 맞지 않는지 발견합니다.",
        "막연했던 변화의 욕구를 “나는 지금 무엇을 바꾸고 싶은가?”라는 선명한 질문으로 바꿉니다.",
      ],
      change: { from: "막연한 변화 욕구", to: "현재 삶에 대한 명확한 인식" },
    },
    {
      week: "02",
      stage: "See",
      title: "지금까지의 나를 이해합니다.",
      body: [
        "지금의 삶을 만들어온 선택과 반복되는 패턴을 돌아봅니다.",
        "지금까지 나를 여기까지 데려온 방식 중 무엇을 가져가고, 무엇을 새롭게 바꿀 것인지 발견합니다.",
      ],
      change: { from: "반복되는 삶", to: "나의 선택과 패턴에 대한 이해" },
    },
    {
      week: "03",
      stage: "Discover",
      title: "역할을 넘어, 진짜 나를 발견합니다.",
      body: [
        "“나는 누구이며, 어떻게 살아가고 싶은가?”",
        "역할과 기대를 넘어 나의 가치와 욕구, 진짜 원하는 것을 탐색합니다.",
        "무엇을 할 것인가(Doing)보다 어떤 존재로 살아갈 것인가(Being)에서 시작합니다.",
      ],
      change: { from: "해야 하는 삶", to: "내가 원하는 삶에 대한 발견" },
    },
    {
      week: "04",
      stage: "Explore",
      title: "새로운 가능성을 발견합니다.",
      body: [
        "익숙한 선택지에서 벗어나 커리어, 관계, 삶의 방식과 새로운 도전까지 다양한 가능성을 열어봅니다.",
        "성급하게 답을 정하기보다 “나에게 또 어떤 삶이 가능할까?”를 충분히 탐색합니다.",
      ],
      change: { from: "익숙한 선택지", to: "새로운 삶의 가능성" },
    },
    {
      week: "05",
      stage: "Choose",
      title: "나의 다음 무대를 선택합니다.",
      body: [
        "가능성을 탐색했다면 이제 “나는 어떤 삶을 선택할 것인가?”를 결정합니다.",
        "나의 가치와 원하는 삶, 현실을 함께 바라보며 남들의 기준이 아닌 나에게 맞는 다음 무대를 선택합니다.",
      ],
      change: { from: "가능성에 대한 고민", to: "나만의 방향과 선택" },
    },
    {
      week: "06",
      stage: "Move",
      title: "생각에 머물던 변화를 삶으로 옮깁니다.",
      body: [
        "선택한 다음 무대로 이동하기 위해 지금 시작할 수 있는 구체적인 행동을 설계합니다.",
        "6주의 발견과 선택을 하나로 연결해 나만의 Stage Transition Plan을 완성하고 실제 전환을 시작합니다.",
      ],
      change: { from: "생각과 결심", to: "삶의 실제 전환" },
    },
  ] satisfies WeekCopy[],
};

export const NEXT_CHAPTER_PROGRAM = {
  eyebrow: "Next Chapter Transition",
  title: "지금까지의 삶을 넘어, 나만의 다음 챕터로.",
  lead: "앞으로의 나는 무엇을 위해 살아갈 것인가?",
  intro: [
    "오랫동안 맡아온 역할과 목표를 따라 열심히 살아왔습니다. 그리고 어느 순간 새로운 질문이 시작됩니다.",
    "Next Chapter Transition은 지금까지 살아온 삶의 의미를 돌아보고, 앞으로의 삶에서 중요한 가치와 새로운 가능성을 발견해 나만의 다음 챕터를 설계하는 6주 전환 코칭 프로그램입니다.",
  ],
  process: ["Pause", "Reflect", "Rediscover", "Imagine", "Design", "Begin"],
  tone: "paper" as const,
  weeks: [
    {
      week: "01",
      stage: "Pause",
      title: "지금까지 걸어온 삶을 바라봅니다.",
      body: [
        "잠시 멈춰 지금까지 살아온 삶과 현재의 위치를 바라봅니다.",
        "무엇을 이루었고, 무엇이 달라졌으며, 지금 내 안에 어떤 질문이 시작되고 있는지 살펴봅니다.",
      ],
      change: { from: "막연한 다음에 대한 고민", to: "지금 서 있는 지점에 대한 이해" },
    },
    {
      week: "02",
      stage: "Reflect",
      title: "지나온 삶에서 나를 발견합니다.",
      body: [
        "삶의 중요한 순간과 선택을 돌아보며 나를 움직여온 가치, 강점, 관계와 경험을 발견합니다.",
        "과거를 평가하기보다 지금까지의 삶이 내게 무엇을 남겼는지 새롭게 이해합니다.",
      ],
      change: { from: "지나온 시간", to: "앞으로 가져갈 삶의 자산" },
    },
    {
      week: "03",
      stage: "Rediscover",
      title: "역할을 넘어, 지금의 나를 다시 만납니다.",
      body: [
        "직함과 성취, 가족과 사회적 역할을 잠시 내려놓고 “지금의 나는 누구인가?”를 다시 묻습니다.",
        "달라진 가치와 욕구를 발견하고 앞으로 어떤 존재로 살아가고 싶은지 탐색합니다.",
      ],
      change: { from: "익숙한 역할 속의 나", to: "지금의 진짜 나" },
    },
    {
      week: "04",
      stage: "Imagine",
      title: "앞으로 가능한 삶을 그려봅니다.",
      body: [
        "앞으로의 삶을 과거의 연장선으로만 생각하지 않습니다.",
        "일과 관계, 배움과 기여, 새로운 도전과 삶의 방식까지 “앞으로 나는 어떤 삶을 살아보고 싶은가?”를 자유롭게 탐색합니다.",
      ],
      change: { from: "정해진 미래", to: "새롭게 열리는 가능성" },
    },
    {
      week: "05",
      stage: "Design",
      title: "나만의 다음 챕터를 설계합니다.",
      body: [
        "발견한 가능성 가운데 앞으로의 삶에서 정말 중요한 것을 선택합니다.",
        "무엇에 시간을 쓰고, 누구와 연결되며, 무엇을 배우고 만들고 기여할지 구체화해 나만의 Next Chapter를 설계합니다.",
      ],
      change: { from: "막연한 미래", to: "내가 선택한 삶의 방향" },
    },
    {
      week: "06",
      stage: "Begin",
      title: "다음 챕터의 첫 페이지를 시작합니다.",
      body: [
        "새로운 삶은 언젠가가 아니라 지금부터 시작됩니다.",
        "6주 동안 발견한 가치와 방향을 현실적인 선택과 행동으로 연결해 Next Chapter Plan을 완성하고 첫걸음을 시작합니다.",
      ],
      change: { from: "그려본 미래", to: "시작된 새로운 삶" },
    },
  ] satisfies WeekCopy[],
};

export const FOUNDER_PROGRAM = {
  eyebrow: "Founder Transition",
  title: "From founder to leader",
  lead: "회사를 시작할 때 필요했던 대표와 회사를 성장시킬 때 필요한 대표는 다릅니다.",
  intro: [
    "사업이 성장할수록 대표의 역할은 달라지고, 지금까지 회사를 성장시킨 방식이 어느 순간 다음 성장을 가로막는 방식이 되기도 합니다.",
    "그래서 사업의 다음 단계에서는 새로운 질문이 필요합니다. “나는 어떤 Founder이며, 이제 어떤 Leader가 되어야 하는가?”",
    "Founder Transition은 사업의 현재 단계와 대표 자신을 함께 바라보고, 나의 일하는 방식과 조직에 미치는 영향을 이해하여 Founder에서 Leader로의 전환을 만드는 6주 1:1 코칭 프로그램입니다.",
  ],
  weeksIntro: [
    "Founder Transition은 경영의 정답을 알려주는 프로그램이 아닙니다.",
    "회사를 이끄는 ‘나’라는 사람을 이해하는 것에서 시작해, 나의 방식이 일과 조직에 어떤 영향을 만들고 있는지 발견하고 지금의 사업과 조직에 필요한 역할과 리더십을 새롭게 정렬합니다.",
    "그리고 그 발견을 실제 업무에서 실행하며 Founder에서 Leader로의 전환을 시작합니다.",
  ],
  process: ["Pause", "Discover", "Impact", "Align", "Evolve", "Sustain"],
  tone: "forest" as const,
  weeks: [
    {
      week: "01",
      stage: "Pause",
      title: "지금, 회사와 나의 위치를 바라봅니다.",
      body: [
        "사업의 현재 단계와 대표로서의 나를 함께 바라봅니다.",
        "지금 회사가 마주한 과제와 내가 맡고 있는 역할을 점검하며 다음 단계로 가기 위해 무엇이 달라져야 하는지 발견합니다.",
      ],
      change: { from: "막연한 문제", to: "전환 과제에 대한 명확한 인식" },
    },
    {
      week: "02",
      stage: "Discover",
      title: "Founder이기 전에, 나라는 사람을 이해합니다.",
      body: [
        "대표의 일하는 방식에는 그 사람의 성향과 가치, 경험과 믿음이 반영되어 있습니다.",
        "나는 무엇을 기준으로 판단하고 결정하는지, 어떤 방식으로 일하고 사람을 대하는지 살펴보며 Founder로서 나의 작동 방식을 이해합니다.",
      ],
      change: { from: "익숙하게 일해온 나", to: "나의 작동 방식에 대한 이해" },
    },
    {
      week: "03",
      stage: "Impact",
      title: "내가 만들어온 영향을 발견합니다.",
      body: [
        "나의 성향과 일하는 방식은 의사결정과 관계, 조직의 움직임에 영향을 미칩니다.",
        "나의 강점은 무엇을 가능하게 했고, 어떤 방식은 병목을 만들어왔는지 살펴보며 앞으로 어떤 영향을 만드는 리더가 되고 싶은지 탐색합니다.",
      ],
      change: { from: "나의 익숙한 방식", to: "내가 만들고 있는 영향에 대한 인식" },
    },
    {
      week: "04",
      stage: "Align",
      title: "지금의 나와 Founder의 역할을 다시 정렬합니다.",
      body: [
        "나의 방식이 조직에 미치는 영향을 이해했다면, 이제 지금의 사업과 조직에 필요한 대표의 역할을 다시 바라봅니다.",
        "조직원들이 나에게 기대하는 것은 무엇인지, 내가 반드시 해야 할 일과 맡겨야 할 일은 무엇인지 살펴보며 역할과 우선순위, 의사결정과 위임의 방식을 정렬합니다.",
      ],
      change: { from: "익숙하게 일하는 대표", to: "지금 조직에 필요한 방식으로 일하는 대표" },
    },
    {
      week: "05",
      stage: "Evolve",
      title: "Founder에서 Leader로 전환합니다.",
      body: [
        "지금까지 회사를 성장시킨 방식이 다음 단계에서도 그대로 유효한 것은 아닙니다.",
        "나의 강점과 패턴, 조직에 미치는 영향과 현재 필요한 역할을 바탕으로 무엇을 유지하고, 무엇을 내려놓고, 무엇을 새롭게 시작할지 선택합니다.",
        "그리고 새로운 방식으로 실제 일하며 Founder에서 Leader로의 전환을 시작합니다.",
      ],
      change: { from: "Founder", to: "Leader" },
    },
    {
      week: "06",
      stage: "Sustain",
      title: "변화된 방식을 지속 가능한 리더십으로 만듭니다.",
      body: [
        "5주차에서 선택한 새로운 방식을 실제 업무에 적용해본 경험을 돌아봅니다.",
        "무엇이 효과적이었고 무엇을 보완해야 하는지 점검하여 변화된 일하는 방식을 다시 정렬하고, Next 90 Days 실행계획으로 연결합니다.",
      ],
      change: { from: "새로운 시도", to: "지속 가능한 리더십" },
    },
  ] satisfies WeekCopy[],
  after: {
    title: "After 6 weeks",
    lead: "6주 후 모든 경영의 답을 갖게 되는 것은 아닙니다. 하지만 적어도 이전과 같은 방식으로 모든 문제를 해결하려 하고 있지는 않을 것입니다.",
    points: [
      "나는 어떤 사람인지",
      "나의 방식이 조직에 어떤 영향을 만드는지",
      "지금 조직이 나에게 무엇을 기대하는지",
      "무엇을 내가 하고 무엇을 맡겨야 하는지",
      "그리고 앞으로 어떤 Leader가 되어야 하는지",
    ],
    close: "더 선명하게 알게 됩니다.",
    pairs: [
      { before: "회사가 커질수록 내가 더 바빠진다", after: "내가 해야 할 일과 맡겨야 할 일을 구분한다" },
      { before: "익숙한 방식으로 판단하고 일한다", after: "나의 일하는 방식과 패턴을 이해한다" },
      { before: "조직의 문제가 반복된다", after: "내가 조직에 미치는 영향을 이해한다" },
      { before: "무엇에 집중해야 할지 모호하다", after: "대표로서의 역할과 우선순위가 선명하다" },
      { before: "모든 것을 직접 해결하려 한다", after: "사람에게 맡기고 책임을 이끄는 방식을 배운다" },
      { before: "좋은 Founder가 되는 데 집중한다", after: "다음 단계에 필요한 Leader로 전환한다" },
    ],
  },
  next: {
    eyebrow: "Your Next Leadership",
    line: "Your company has changed. Have you?",
    body: [
      "회사를 여기까지 성장시킨 방식이 다음 단계까지 데려다주는 방식과 같을 필요는 없습니다.",
      "사업의 다음 성장을 고민하고 있다면, 사업의 전략만큼 그 사업을 이끌고 있는 사람의 변화가 필요할지도 모릅니다.",
      "Founder에서 Leader로. 나를 이해하고, 내가 만드는 영향을 발견하고, 지금 필요한 역할을 다시 선택하며 새로운 방식으로 일하기 시작합니다.",
      "6주 후, 다음 단계의 Leader를 만나보세요.",
    ],
    meta: "Founder Transition · 6-Week 1:1 Transition Coaching",
  },
};
