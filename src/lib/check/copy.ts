import type { Band } from "./questions";

export const BAND_COPY: Record<
  Band,
  { label: string; range: string; lead: string; need: string; help: string }
> = {
  STABLE: {
    label: "STABLE",
    range: "21–41점",
    lead: "현재의 방식이 비교적 안정적으로 작동하고 있습니다. Founder의 역할과 회사의 성장 단계 사이에 큰 충돌이 나타나고 있지는 않은 상태입니다.",
    need: "큰 변화보다, 지금 잘 작동하는 방식을 명확히 인식하고 다음 단계에서 유지할 것과 바꿀 것을 구분하는 것이 중요합니다.",
    help: "문제를 고치는 코칭보다 “다음 단계에서 나는 어떤 Founder가 되어야 하는가?”를 미리 설계하는 예방적 Transition의 의미가 더 클 수 있습니다.",
  },
  SIGNAL: {
    label: "TRANSITION SIGNAL",
    range: "42–62점",
    lead: "몇 가지 영역에서 변화의 신호가 나타나고 있습니다. 예전에는 잘되던 방식이 조금씩 불편해지기 시작하는 시점에 가깝습니다.",
    need: "무엇이 잘못되었는지를 찾기보다, 지금까지 효과적이었던 방식 중 무엇을 유지하고 무엇을 바꾸어야 하는지 구분하는 것이 중요합니다.",
    help: "역할, 시간 사용, 리더십과 조직을 함께 살펴보며 Founder → Leader로 이동하기 위해 먼저 바꿀 한두 가지를 발견하는 과정이 도움이 됩니다.",
  },
  NEEDED: {
    label: "TRANSITION NEEDED",
    range: "63–83점",
    lead: "Founder의 다음 역할을 본격적으로 재설계할 시점입니다. 현재의 방식과 회사가 요구하는 다음 단계 사이의 간격이 여러 영역에서 나타나고 있을 가능성이 높습니다.",
    need: "일을 줄이거나 위임을 늘리는 것보다, Founder의 역할 자체를 다시 정의하는 작업이 필요합니다.",
    help: "단편적인 리더십 기술보다 VALUE부터 LIFE까지 연결해서 보는 구조적인 전환 과정이 의미가 있습니다.",
  },
  PRIORITY: {
    label: "TRANSITION PRIORITY",
    range: "84–105점",
    lead: "지금까지의 방식만으로 다음 단계를 지속하기 어려울 가능성이 있습니다. Founder가 성장의 동력이면서 동시에 다음 성장의 한계가 되는 상황이 나타날 수 있습니다.",
    need: "“어떻게 더 잘할 것인가?”보다 먼저 “앞으로도 지금과 같은 방식으로 일해야 하는가?”를 질문할 필요가 있습니다.",
    help: "모든 것을 한꺼번에 바꾸기보다 가장 큰 병목을 발견하고, Founder가 직접 바꿀 수 있는 것부터 우선순위를 정해 실행하는 과정으로 활용할 수 있습니다.",
  },
};
