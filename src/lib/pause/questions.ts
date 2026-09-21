export type Likert = 1 | 2 | 3 | 4 | 5;
export type PauseBand = "FLOW" | "SIGNAL" | "PAUSE" | "TRANSITION";

export type PauseQuestionKey =
  | "P01"
  | "P02"
  | "P03"
  | "P04"
  | "P05"
  | "P06"
  | "P07"
  | "P08"
  | "P09"
  | "P10"
  | "P11"
  | "P12"
  | "P13"
  | "P14"
  | "P15"
  | "P16"
  | "P17"
  | "P18"
  | "P19"
  | "P20"
  | "P21"
  | "P22"
  | "P23"
  | "P24"
  | "P25"
  | "P26"
  | "P27"
  | "P28"
  | "P29"
  | "P30";

export type PauseQuestion = {
  no: number;
  key: PauseQuestionKey;
  prompt: string;
};

export const PAUSE_PAGES = [
  { id: "ONE", title: "01–05", question: "지금의 하루가 나에게 어떻게 느껴지는가?" },
  { id: "TWO", title: "06–10", question: "겉으로 보이는 삶과 내가 느끼는 삶은 같은가?" },
  { id: "THREE", title: "11–15", question: "멈춤과 변화 앞에서 나는 어디에 있는가?" },
  { id: "FOUR", title: "16–20", question: "지금의 선택은 누구의 기준으로 이어지고 있는가?" },
  { id: "FIVE", title: "21–25", question: "원하는 삶과 익숙한 삶 사이에서 무엇이 걸리는가?" },
  { id: "SIX", title: "26–30", question: "잠시 멈추고 나를 돌아볼 필요가 있는가?" },
] as const;

export type PausePageId = (typeof PAUSE_PAGES)[number]["id"];

export const PAUSE_QUESTIONS: PauseQuestion[] = [
  { no: 1, key: "P01", prompt: "하루를 바쁘게 보내지만 집에 돌아오면 공허하게 느껴질 때가 많다." },
  { no: 2, key: "P02", prompt: "해야 할 일은 계속 해내고 있지만, 내가 왜 이렇게 열심히 살고 있는지 문득 의문이 든다." },
  { no: 3, key: "P03", prompt: "특별히 큰 문제가 있는 것은 아닌데 지금의 삶이 만족스럽지는 않다." },
  { no: 4, key: "P04", prompt: "예전에는 중요했던 목표를 이루었는데도 생각했던 만큼 행복하지 않다." },
  { no: 5, key: "P05", prompt: "다음에 무엇을 원하는지보다 지금 해야 하는 일을 처리하며 살아가는 느낌이 든다." },
  { no: 6, key: "P06", prompt: "다른 사람에게는 잘 살고 있는 것처럼 보이지만 정작 나는 그렇게 느끼지 못할 때가 있다." },
  { no: 7, key: "P07", prompt: "하루 중 대부분의 시간을 나보다 일이나 다른 사람의 필요에 맞추어 사용한다." },
  { no: 8, key: "P08", prompt: "오랫동안 원했던 것을 이루고도 ‘그래서 이제 뭐 하지?’라는 생각이 든 적이 있다." },
  { no: 9, key: "P09", prompt: "내가 무엇을 좋아하고 무엇을 원하는지 예전보다 잘 모르겠다." },
  { no: 10, key: "P10", prompt: "지금의 선택들이 정말 내가 원하는 것인지, 익숙해서 계속하고 있는 것인지 헷갈릴 때가 있다." },
  { no: 11, key: "P11", prompt: "바쁘지 않은 시간이 생기면 오히려 무엇을 해야 할지 모르겠다." },
  { no: 12, key: "P12", prompt: "쉬고 있어도 마음 한편에서는 무언가 해야 할 것 같은 압박을 느낀다." },
  { no: 13, key: "P13", prompt: "지금까지는 잘해왔지만 앞으로도 같은 방식으로 살아가고 싶지는 않다." },
  { no: 14, key: "P14", prompt: "현재의 삶에서 무언가 달라져야 한다는 생각을 반복해서 한다." },
  { no: 15, key: "P15", prompt: "변화하고 싶지만 무엇부터 바꿔야 할지 몰라 다시 일상으로 돌아가곤 한다." },
  { no: 16, key: "P16", prompt: "중요한 결정을 할 때 내가 원하는 것보다 현실적인 조건이나 다른 사람의 기대를 먼저 생각한다." },
  { no: 17, key: "P17", prompt: "어느 순간부터 새로운 것을 기대하는 마음보다 하루를 잘 버텨내는 것이 더 중요해졌다." },
  { no: 18, key: "P18", prompt: "예전에는 나를 설레게 했던 일들이 지금은 별다른 감흥을 주지 않는다." },
  { no: 19, key: "P19", prompt: "내 삶에서 무엇이 나를 지치게 하고 무엇이 나를 살아 있게 하는지 제대로 생각해본 지 오래됐다." },
  { no: 20, key: "P20", prompt: "지금의 생활을 5년 후에도 똑같이 하고 있다고 생각하면 마음이 답답해진다." },
  { no: 21, key: "P21", prompt: "지금까지 만들어온 것을 놓치거나 잃을까 봐 원하는 변화를 미루고 있다." },
  { no: 22, key: "P22", prompt: "‘이 정도면 괜찮은 삶이지’라고 생각하면서도 마음 한편에는 다른 삶에 대한 갈망이 있다." },
  { no: 23, key: "P23", prompt: "내 선택이라기보다 상황이 흘러가는 대로 여기까지 온 것처럼 느껴질 때가 있다." },
  { no: 24, key: "P24", prompt: "내 삶에서 중요한 것이 무엇인지 알고 있다고 생각했지만 요즘은 다시 생각해볼 필요를 느낀다." },
  { no: 25, key: "P25", prompt: "성공하거나 인정받는 것과 별개로 ‘나는 어떻게 살고 싶은가’를 생각하게 된다." },
  { no: 26, key: "P26", prompt: "지금 맡고 있는 역할들을 모두 내려놓았을 때 나는 누구인지 선뜻 설명하기 어렵다." },
  { no: 27, key: "P27", prompt: "하고 싶은 일이 있어도 ‘지금은 때가 아니다’라며 계속 뒤로 미루고 있다." },
  { no: 28, key: "P28", prompt: "삶을 크게 바꾸고 싶은 것은 아니더라도 지금의 방식은 한번 점검해보고 싶다는 생각이 든다." },
  { no: 29, key: "P29", prompt: "앞으로 더 열심히 사는 것보다 무엇을 위해 살아갈지를 먼저 정하고 싶다." },
  { no: 30, key: "P30", prompt: "지금의 나에게는 새로운 목표를 하나 더 세우는 것보다 잠시 멈춰 나와 내 삶을 돌아보는 시간이 필요하다고 느낀다." },
];

export const PAUSE_QUESTION_KEYS = PAUSE_QUESTIONS.map((q) => q.key);

export function pageQuestions(pageIndex: number) {
  return PAUSE_QUESTIONS.slice(pageIndex * 5, pageIndex * 5 + 5);
}

export const LIKERT_LABELS = [
  { value: 1 as const, label: "전혀 그렇지 않다" },
  { value: 2 as const, label: "그렇지 않은 편이다" },
  { value: 3 as const, label: "보통이다" },
  { value: 4 as const, label: "그런 편이다" },
  { value: 5 as const, label: "매우 그렇다" },
];

export const PAUSE_INSTRUMENT = "pause-check" as const;
export const INSTRUMENT_VERSION = "2026-09-21";
export const CONSENT_VERSION = "pause-2026-09-21";
export const RETENTION_DAYS = 90;
