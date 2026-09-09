# 관리자 페이지 UI/UX 설계

작성: 수진(designer) · 2026-09-09
대상 독자: 선우(frontend) — 이 문서를 읽고 그대로 구현할 수 있어야 한다.
관련 문서: `docs/admin-security.md`(보안관), `docs/admin-architecture.md`(데이브)

---

## 0. 이 설계의 전제

관리자 페이지는 브랜드 사이트가 아니다. **대표 한 명이 매주 반복해서 쓰는 작업 도구**다.

공개 페이지의 언어(세리프 제목, 80px 섹션 여백, 스크롤 페이드업, 밑줄만 있는 CTA)는 처음 온 방문자를 설득하기 위한 장치다. 같은 사람이 같은 화면을 50번째 열 때는 전부 비용으로 바뀐다. 여백은 스크롤을, 세리프는 판독 시간을, 진입 애니메이션은 클릭 지연을 만든다.

그렇다고 별도 디자인 시스템을 만들면 유지보수가 두 배가 된다. 그래서 이 설계의 원칙은 하나다.

> **값(토큰)은 최대한 재사용하고, 값을 쓰는 규칙(스케일·간격·형태)만 갈라낸다.**

색 스케일과 폰트 패밀리는 100% 재사용한다. 타이포 스케일·간격·라운딩·컴포넌트는 갈라낸다. 새로 추가하는 토큰은 색 4개뿐이고, 그 4개는 브랜드 팔레트에 애초에 없는 것(위험·주의)이다.

---

## 1. 디자인 언어 결정

### 1.1 색 — 전면 재사용 + 상태색 4개 추가

| 역할 | 토큰 | 근거 |
| --- | --- | --- |
| 앱 캔버스 배경 | `ink-05` `#f4f4f4` | 흰 카드와 1.10:1. 눈에 띄지 않으면서 카드 경계를 만든다 |
| 카드·패널 배경 | `white` | 폼 입력값 대비 최대 확보 |
| 사이드바 배경 | `forest` `#003a40` | 아래 별도 설명 |
| 본문 텍스트 | `ink-90` `#353535` | 폼이 많은 화면. 공개 페이지 본문 `ink-70`보다 한 단 올린다 |
| 보조 텍스트·도움말 | `ink-70` `#636363` | 6.0:1. **본문 색 하한** |
| 필드 라벨 | `forest-70` `#4d7579` | 4.95:1. 기능 텍스트에 `stem`(3.7:1) 금지 규칙 준수 |
| 입력 경계선·체크박스 | `ink-50` `#8f8f8f` | 3.2:1. **UI 경계선 하한** |
| 카드 경계선·표 구분선 | `ink-15` / `ink-10` | 장식용. 컨트롤 식별에 필요한 경계가 아니므로 1.4.11 대상 아님 |
| 주 강조·활성·포커스 | `forest` | 흰 배경 12.5:1. 브랜드 인지를 0원에 얻는다 |
| 저장 성공 | `forest` | 아래 별도 설명 |

**사이드바를 `forest` 딥그린으로 채운 이유.** 관리자가 브랜드에 속한다는 신호를 세리프·여백·애니메이션 없이 주는 방법이 필요했다. 왼쪽 다크 레일 하나가 그걸 다 한다. 추가 토큰 0개, 정보 밀도 손실 0, 공간 인지(내가 도구 안에 있다)까지 확보한다. 흰 글자 대비 12.5:1.

**성공색으로 초록을 새로 만들지 않았다.** `forest`가 이미 딥그린이다. "저장되었습니다"를 `forest`로 쓰면 브랜드 색이 그대로 성공 신호가 된다. 별도 success 토큰은 팔레트 안에서 중복이고 브랜드와 어긋난다.

**추가가 불가피한 것 — 위험/주의.** 브랜드 팔레트에 빨강·주황이 없다. 공개 페이지에는 `ConsultForm.tsx:97`에 `#c0392b`가 하드코딩되어 하나 있을 뿐이다(흰 배경 5.4:1로 AA 간신히 통과). 관리자는 파괴적 삭제·검증 실패·저장 안 됨 상태를 색으로 구분해야 하므로 정식 토큰이 필요하다.

```css
/* globals.css 의 @theme 에 추가 — 관리자 전용. 공개 페이지에는 쓰지 않는다. */
@theme {
  /* 관리자 상태색. 브랜드 팔레트에 위험·주의 색이 없어 추가한다.
   * 채도를 낮춰 forest 와 같은 화면에서 튀지 않게 잡았다. */
  --color-danger: #a8281c;       /* 흰 배경 7.0:1 · 흰 글자 7.0:1 · tint 위 6.3:1 */
  --color-danger-tint: #fdf0ee;
  --color-warn: #8a5a00;         /* 흰 배경 5.9:1 · tint 위 5.5:1 */
  --color-warn-tint: #fdf5e4;
}
```

값 선정 근거:
- `#a8281c` — 기존 `#c0392b`(5.4:1)를 그대로 승격하지 않았다. 삭제 버튼 배경으로도 쓰려면 흰 글자 4.5:1이 필요하고, 잘못 눌리면 안 되는 색이 AA 경계선에 있으면 안 된다. 명도만 내려 7.0:1로 올렸다.
- `#8a5a00` — 밝은 주황(`#f59e0b` 계열)은 흰 배경에서 2:1대라 텍스트에 못 쓴다. 어두운 황토색으로 내려 5.9:1을 확보했다. `forest`와 같은 채도대라 화면에서 이질감이 없다.
- tint 2종은 배너·무효 필드 배경 전용. 각각 자기 전경색과 5.4:1 이상.

### 1.2 타이포 — 패밀리 재사용, 스케일 신설

**패밀리는 그대로 쓴다.** `--font-sans`(Mulish + Noto Sans KR). 추가 폰트 다운로드 0바이트, 한글 렌더링이 공개 페이지와 동일하다. 대표가 관리자에서 본 글줄이 사이트에서 다르게 보이면 교정을 두 번 하게 된다.

**스케일은 공개 페이지 것을 쓸 수 없다.** 두 가지 이유다.

1. `.b1~.b3`은 `line-height: 160%`다. 15px 라벨 하나가 24px 줄상자를 차지한다. 20행 표에서 480px, 필드 20개 폼에서 180px가 아무 정보 없이 늘어난다.
2. `.b3`은 1025px에서 15px → 16px로 커진다. 브레이크포인트에서 라벨 크기가 바뀌면 필드 정렬과 표 열 너비가 같이 흔들린다. 관리자는 책상에서 쓰는 화면이라 거리 보정이 필요 없다.

그래서 관리자 전용 스케일을 만든다. `.adm-` 접두어로 공개 `.t*`/`.b*`와 절대 혼동되지 않게 한다.

```css
/* globals.css 하단 — 관리자 전용 타이포. 공개 페이지 .t*/.b* 와 섞어 쓰지 않는다.
 *
 * 공개 스케일과 갈라낸 이유:
 * - line-height 160% → 1.5 이하. 폼·표 밀도가 이 값에 직접 걸린다
 * - 반응형 단계 제거. 브레이크포인트에서 라벨 크기가 바뀌면 필드 정렬이 흔들린다
 * - weight 로 위계를 만든다. 세리프(Cormorant)는 500/600 이 UI 크기에서 안 읽혀 못 쓴다
 */
.adm-title { font-size: 20px; line-height: 1.35; font-weight: 600; letter-spacing: -0.01em; }
.adm-h     { font-size: 17px; line-height: 1.4;  font-weight: 600; }
.adm-body  { font-size: 15px; line-height: 1.5;  font-weight: 400; }
.adm-input { font-size: 16px; line-height: 1.5;  font-weight: 400; }
.adm-label { font-size: 13px; line-height: 1.3;  font-weight: 500; letter-spacing: 0.02em; }
.adm-meta  { font-size: 12px; line-height: 1.3;  font-weight: 400; letter-spacing: 0.02em; }
.adm-mono  { font-size: 13px; line-height: 1.4;  font-family: ui-monospace, "Cascadia Mono",
             Consolas, "Courier New", monospace; }

@media (min-width: 768px) {
  .adm-title { font-size: 22px; }
}
```

| 클래스 | 용도 | 값 근거 |
| --- | --- | --- |
| `.adm-title` | 페이지 제목 | 22px는 공개 `.t3` 모바일 크기지만 산세리프 600. 768px 미만에서 20px로 내리는 건 햄버거 버튼과 같은 줄에 서기 때문 |
| `.adm-h` | 카드·그룹 제목 | 17px. `.adm-input`(16px)보다 1px만 크고 weight로 벌린다. 크기로 벌리면 카드가 많은 화면에서 제목이 소음이 된다 |
| `.adm-body` | 본문·도움말·에러·빈 상태·확인 대화상자 | **15px = 이 프로젝트의 본문 하한.** 문장으로 읽는 텍스트는 전부 이 클래스다 |
| `.adm-input` | 모든 입력값 | 아래 별도 설명 |
| `.adm-label` | 필드 라벨 | 아래 별도 설명 |
| `.adm-meta` | 시각·글자수·배열 인덱스 | 색은 `ink-70` 하한. 12px에서 `ink-50` 금지 |
| `.adm-mono` | 이미지 경로·데이터 키 | 시스템 폰트 스택이라 다운로드 0바이트. `l`/`1`/`I`, `-`/`_` 구분이 필요한 값에만 |

**입력값을 16px로 키운 이유 — 이 화면에서 가장 중요한 타이포 결정이다.**

1. iOS Safari는 포커스된 입력의 `font-size`가 16px 미만이면 페이지를 자동 확대한다. 로그인 화면은 폰에서 쓰인다.
2. 입력값은 대표가 **교정하는 대상**이다. 같은 문장이 공개 페이지에서 15~40px로 렌더된다. 관리자에서 13px로 보면 오타와 어색한 줄바꿈이 보이지 않는다. 관리자는 미리보기가 아니라 원고지다.

**라벨을 13px로 내린 것이 본문 하한 규칙 위반이 아닌 이유.**

15px 하한은 **문장으로 읽는 텍스트**에 건 규칙이고, 시니어 방문자가 단락을 읽어야 해서 만들었다. 관리자에서 문장으로 읽는 것은 도움말·에러·빈 상태·확인 대화상자 본문뿐이며 전부 `.adm-body` 15px다. "이름", "연락처" 같은 필드 라벨은 읽는 문장이 아니라 **찾는 표지**다. 라벨을 15px로 두면 16px 입력값과 위계가 붙어 폼이 평평해지고, 20개 필드에서 무엇이 라벨이고 무엇이 값인지 스캔이 안 된다. 대가는 weight 500 + `forest-70`(4.95:1)로 보전했다. 사용자가 시니어 방문자가 아니라 매주 같은 화면을 쓰는 대표 한 명이라는 점도 근거다.

**세리프를 쓰는 곳은 정확히 두 곳이다.**

1. 로그인 화면 워드마크
2. 사이드바 최상단 워드마크

그 외 전부 금지다. 페이지 제목·버튼·표 헤더에 쓰지 않는다. 근거: Cormorant는 x-height가 낮은 디스플레이 세리프다. 13~17px에서 획 대비 때문에 판독성이 떨어지고, 로드된 weight가 400/500/600뿐인데 이 크기에서 서로 구분되지 않아 **weight로 위계를 만들 수 없다.** 관리자의 위계는 크기가 아니라 weight가 만든다.

### 1.3 간격 — 갈라낸다

| 항목 | 공개 페이지 | 관리자 | 근거 |
| --- | --- | --- | --- |
| 좌우 여백 | `--gutter` 20/40px | **고정 24px (`px-6`)** | 1280px에서 사이드바 240px를 빼면 1040px. 40px 거터로 80px를 더 버리면 2열 폼이 답답해진다. 고정값이므로 CSS 변수를 새로 만들지 않는다(변수는 반응형일 때만 값어치가 있다) |
| 섹션 상하 | 64/80px | **페이지 헤더 아래 24px** | |
| 카드 패딩 | 28/40px | **20px (`p-5`)** | |
| 라벨 → 입력 | 12px | **6px (`mb-1.5`)** | 라벨과 입력은 한 덩어리로 읽혀야 한다. 12px는 두 요소로 분리된다 |
| 필드 → 필드 | 28px (`gap-7`) | **20px (`gap-5`)** | 필드 20개 폼에서 160px 절약 |
| 카드 → 카드 | 24~48px | **16px (`gap-4`)** | |
| 그룹 → 그룹 | — | **32px (`mt-8`)** | 필드 간격(20px)의 1.6배. 그룹 경계가 필드 경계보다 확실히 크게 읽혀야 한다 |

기준은 Tailwind 기본 4px 스케일 그대로다. 새 스페이싱 토큰을 만들지 않는다.

### 1.4 라운딩 — 갈라낸다

| 요소 | 공개 페이지 | 관리자 |
| --- | --- | --- |
| 입력 | `rounded-none` + 하단 1px 밑줄만 | **`rounded-[4px]` + 사방 1px 테두리** |
| 버튼 | `rounded-sm` (2px) | `rounded-[4px]` |
| 카드 | 없음 / `rounded-xl` (12px) | `rounded-[6px]` |

**하단 밑줄 입력을 버린 이유가 이 절의 핵심이다.** `ConsultForm`의 밑줄 입력은 브랜드 제스처다. 절제되고 우아하다. 그리고 밀집 폼에서는 못 쓴다.

1. 비어 있을 때 클릭 대상이 어디까지인지 보이지 않는다. 필드 20개에서 매번 조준해야 한다.
2. 무효 상태를 표시할 면적이 1px 선밖에 없다. 빨간 밑줄은 눈에 안 들어온다.
3. 배경색으로 상태(무효·비활성)를 표현할 수 없다.

**4px을 고른 이유.** 공개 페이지 어휘가 2px인데 40px 높이 입력에 2px를 주면 의도가 아니라 렌더링 잔재로 보인다. 4px은 그 높이에서 "의도된 값"으로 읽히는 최소 반경이고, 공개 페이지 2px과 나란히 놓아도 다른 제품처럼 보이지 않는다.

### 1.5 재사용 / 폐기 목록

**그대로 재사용**

| 대상 | 이유 |
| --- | --- |
| `@theme` 색 스케일 전체 | 위 1.1 |
| `--font-serif` / `--font-sans` | 위 1.2 |
| `Photo` (`src/components/ui/Photo.tsx`) | **가장 값어치 있는 재사용.** 이미지 슬롯 미리보기가 `Photo`를 그대로 쓰면, 비어 있는 칸에 대표가 보는 그라디언트가 공개 페이지에 나오는 그라디언트와 **같은 픽셀**이다. 관리자가 자기 플레이스홀더를 그리면 관리자에선 회색 박스, 사이트에선 초록 그라디언트가 되어 대표가 상태를 오해한다 |
| `cn()` | 당연 |
| `lucide-react` | 이미 의존성에 있다 |

**쓰지 않는다**

| 대상 | 이유 |
| --- | --- |
| `Reveal` | 스크롤 진입 페이드업. 대표가 있는 걸 아는 필드를 0.5초 늦게 보여주고, 클릭하려는 순간 16px 움직인다. 폼 화면에서 능동적 방해다. **관리자에 진입 애니메이션 금지** |
| `PillButton` | 세리프 + h-11/h-12 + px-7/px-8. 관리자 버튼은 h-9 산세리프다 |
| `LinedLink` | 밑줄만 있는 텍스트 링크는 히트 영역이 없다. 표 행 액션에 못 쓴다 |
| `Container` | `px-(--gutter)` 그 자체. 관리자는 24px 고정이다 |
| `ConsultForm`의 `Field`/`inputClass` | 밑줄 입력 + `gap-7`. 관리자 `Field`는 별도로 만든다. **이름이 같으니 import 경로를 반드시 확인할 것** |
| framer-motion | 드로어 슬라이드 하나에 라이브러리를 쓰지 않는다. CSS transition으로 충분하다 |

### 1.6 포커스 표시 — 관리자에서 새로 정한다

공개 페이지는 `focus:border-forest`뿐이고 가시적 링이 없다. 폼이 20개인 화면에서는 키보드 위치를 잃는다.

```
/* 밝은 배경 위 */
focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest
/* forest 사이드바 위 — forest 링은 보이지 않는다 */
focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white
```

`outline`을 쓰는 이유: `ring`은 `box-shadow` 기반이라 `overflow-hidden` 부모(카드·표) 안에서 잘린다.

---

## 2. 관리 대상 전수 조사

화면 설계의 입력값이다. `src/lib/site.ts` 전체를 훑어 확정했다.

### 2.1 콘텐츠 인벤토리

| # | 데이터 | 종류 | 개수 | 항목당 필드 | 이미지 |
| --- | --- | --- | --- | --- | --- |
| 1 | `SITE` | 단일 객체 | — | 12 | 0 |
| 2 | `TOP_MESSAGES` | 가변 배열(문자열) | 2 | 1 | 0 |
| 3 | `MENU_GROUPS` | 가변 배열 + 중첩 | 4 그룹 / 11 항목 | 그룹 1 + 항목 2 | 0 |
| 4 | `HERO_SLIDES` | 가변 배열 | 2 | 7 | 2 |
| 5 | `AUDIENCES` | **고정 3** | 3 | 8 | 3 |
| 6 | `PROGRAM_TABS` | **고정 3** | 3 | 2 | 0 |
| 7 | `PROGRAM_CARDS` | 가변 배열 | 3 | 8 | 3 |
| 8 | `MID_BANNER` | 단일 객체 | — | 6 | 1 |
| 9 | `STORY_TABS` | 가변 배열 | 3 | 8 | 3 |
| 10 | `SERVICES` | **고정 4** | 4 | 6 | 4 |
| 11 | `BRAND_STORY` | 단일 객체 | — | 4 | 1 |
| 12 | `PRINCIPLES` | **고정 3** | 3 | 4 | 3 |
| 13 | `COACH` | 단일 객체 | — | 6 (+가변 자격 목록) | 1 |
| 14 | `FAQS` | 가변 배열 | 4 | 2 | 0 |
| 15 | `FOOTER_LINKS` | **고정 2** ← 정정 | 2 그룹 / 9 항목 | 그룹 1 + 항목 2 | 0 |
| 16 | (신설) 상담 섹션 문구 | 단일 객체 | — | 3 | 0 |

**이미지 슬롯 합계 21개.** 2 + 3 + 3 + 1 + 3 + 4 + 1 + 3 + 1 = 21. 과제에서 준 숫자와 일치한다.

### 2.2 과제 분류에서 정정할 것 세 가지

**(1) `FOOTER_LINKS`는 가변이 아니라 고정 2개다.**

`Footer.tsx:6`이 `lg:grid-cols-[1.6fr_1fr_1fr]`이다. 회사 정보 블록 1개 + `FOOTER_LINKS` 2개가 3열을 정확히 채운다. 3번째 그룹을 추가하면 그리드를 벗어난다. **고정 개수 배열로 취급한다.**

**(2) `MENU_GROUPS`는 현재 이미 그리드를 벗어나 있다.**

`Header.tsx:88`이 `lg:grid-cols-3`인데 `MENU_GROUPS`는 4개다. 4번째 그룹(`문의`)이 둘째 줄로 떨어진다. 기존 상태의 레이아웃 불일치이며 관리자와 무관하게 존재한다. 관리자를 붙이면 대표가 그룹을 추가/삭제할 수 있게 되므로 지금 정해야 한다. → **§9 대표 확인 항목**

**(3) `FOOTER_LINKS`에는 파생 값이 섞여 있다.**

```
{ label: SITE.email, href: `mailto:${SITE.email}` }
{ label: SITE.phone, href: `tel:${SITE.phone.replace(/-/g, "")}` }
```

`site.ts:309-310`. 이 두 항목은 `SITE`에서 계산된다. 관리자에서 직접 편집 가능하게 하면 사이트 정보와 어긋난다. **읽기 전용으로 렌더하고 `사이트 정보에서 자동으로 채워집니다` 안내를 붙인다.**

### 2.3 컴포넌트에 하드코딩된 문구 — 데이터로 올려야 한다

과제의 확정 사항은 "섹션 텍스트 전부"다. 그런데 일부 섹션 제목이 `site.ts`가 아니라 컴포넌트 안에 있다. 관리자를 열면 대표는 화면에 보이는 모든 글자를 편집할 수 있다고 기대한다. 아래는 데이터 계층으로 올려야 할 목록이다. **데이브의 모델 작업 입력값이다.**

| 위치 | 문구 | 조치 |
| --- | --- | --- |
| `ConsultSection.tsx:9` | eyebrow `Consulting` | 올림 → `CONSULT.eyebrow` |
| `ConsultSection.tsx:10` | h2 `먼저 이야기부터 들려주세요` | 올림 → `CONSULT.title` |
| `ConsultSection.tsx:11-13` | 본문 2줄 | 올림 → `CONSULT.body` |
| `ConsultSection.tsx:18,26,34` | `Tel.` / `Email.` / `Hours.` | **고정.** 라벨이고 영문 표기 규칙이다 |
| `Services.tsx:9` | `{SITE.nameKo}의 특별한 서비스를 만나보세요` | 올림. 템플릿 유지 여부는 대표 확인 |
| `CoachBand.tsx:19` | eyebrow `Coach` | 올림 → `COACH.eyebrow` |
| `CoachBand.tsx:32` | 링크 `코치와 상담하기` | 올림 → `COACH.link` |
| `Faq.tsx:6` | h2 `FAQ` | 올림 → `FAQ_SECTION.title` |
| `ProgramTabs.tsx:70` | 카드 CTA `상담 신청` | 올림. 카드 공통 1개 값 |
| `ConsultForm.tsx:90-93` | 개인정보 수집·이용 동의 문구 | **보안관 판단 필요.** → §9 |
| `ConsultForm.tsx:33-37` | 완료 화면 `Thank you` / 안내문 | 올림 |
| `ConsultForm.tsx:19-21,70,74,80` | 검증 메시지·라벨·플레이스홀더 | **고정.** 폼 기능의 일부다 |
| `Header.tsx:53,57,72` | `Menu` / `Program` / `Consult` | **고정.** 헤더 구조 자체다 |
| `Footer.tsx:35` | `Made with Respect` | **고정** |
| `TopBanner.tsx:34-36` | `KR / EN` | **고정.** 미구현 기능 표기 |

### 2.4 배열을 편집 가능하게 만들면 생기는 새 버그 — React key

현재 배열 렌더링이 **콘텐츠 값을 key로 쓰고 있다.**

```
HeroSlider.tsx:31    key={slide.title}
ProgramTabs.tsx:35   key={card.name}
Services.tsx:13      key={service.title}
Principles.tsx:10    key={item.title}
TopBanner.tsx:21     key={message}
Header.tsx:90,94     key={group.title} / key={item.label}
Footer.tsx:19,23     key={group.title} / key={item.label}
CoachBand.tsx:26     key={item}          (credentials)
```

`site.ts`가 하드코딩일 때는 값이 유일해서 문제가 없었다. 대표가 편집하는 순간 **중복 값 입력이 가능해지고**, 그때 React duplicate key 경고 + 재조정 오류(입력 포커스 튐, 잘못된 항목 삭제)가 난다.

두 방향 다 필요하다.
- **데이브**: 배열 항목에 안정적인 `_key`(생성 시 부여, 편집 불가)를 넣고 렌더링 key를 그것으로 바꾼다. 근본 해결이다.
- **관리자 UI**: 그와 별개로 같은 섹션 안 중복 값을 검증으로 막는다(§5.5). 대표가 실수로 같은 제목 두 개를 만들면 사이트가 아니라 관리자에서 잡아야 한다.

### 2.5 편집 불가 필드

| 필드 | 이유 |
| --- | --- |
| `AUDIENCES[].id` | `#audience-adult` 앵커 대상. `MENU_GROUPS`가 참조한다 |
| `STORY_TABS[].id` | 탭 상태 식별자 |
| `PROGRAM_TABS[].id` | `PROGRAM_CARDS[].tabs` 배열이 문자열로 참조한다 |
| `_key` (신설) | §2.4 |
| `FOOTER_LINKS`의 이메일·전화 항목 | §2.2 |

전부 `.adm-mono text-ink-70` 읽기 전용 텍스트로 표시하고 `링크 주소에 쓰이는 값이라 바꿀 수 없습니다` 안내를 붙인다. **비활성 입력으로 렌더하지 않는다** — 비활성 입력은 "왜 안 눌려요?"를 만든다.

### 2.6 `SITE.lunch` — 라벨을 반드시 고쳐야 한다

`site.ts:19-21`에 적혀 있듯 키 이름은 `lunch`지만 **값은 토요일 운영시간**(`Sat 10:00-18:00`)이다. 관리자에서 라벨을 `점심시간`으로 달면 대표가 점심시간을 입력하고, 그 값이 `ConsultSection`의 `Hours.`와 헤더 메가메뉴에 운영시간으로 노출된다. 되돌리기 어려운 종류의 오류다.

**라벨은 `토요일 운영시간`으로 확정한다.** 키 개명은 데이브에게 넘긴다. → §9

---

## 3. 전체 구조

### 3.1 라우트

```
/admin/login                     로그인
/admin                           대시보드
/admin/site                      사이트 정보          SITE
/admin/banner                    상단 띠 배너         TOP_MESSAGES
/admin/menu                      헤더 메뉴            MENU_GROUPS
/admin/footer                    푸터                 FOOTER_LINKS
/admin/sections/hero             히어로               HERO_SLIDES
/admin/sections/audience         대상별 코칭          AUDIENCES
/admin/sections/program          프로그램             PROGRAM_TABS + PROGRAM_CARDS
/admin/sections/mid-banner       중간 배너            MID_BANNER
/admin/sections/story            진행 방식            STORY_TABS
/admin/sections/service          서비스               SERVICES
/admin/sections/coach            코치                 COACH
/admin/sections/brand-story      브랜드 스토리        BRAND_STORY
/admin/sections/principles       원칙 카드            PRINCIPLES
/admin/sections/faq              FAQ                  FAQS
/admin/sections/consult          상담 섹션            CONSULT (신설)
/admin/media                     이미지 관리          21칸
/admin/inquiries                 상담 신청            목록 + ?id= 상세
```

`/admin/sections/*` 11개가 `page.tsx`의 섹션 순서와 1:1로 대응한다(DEVNOTE 결정사항). 사이드바 순서도 이 순서다.

**상세를 별도 라우트로 만들지 않았다.** `/admin/inquiries?id=<id>`로 처리한다. 근거: 목록의 필터·정렬·스크롤 상태를 잃지 않고, URL로 특정 신청을 지목할 수 있고, 인터셉팅 라우트 없이 단일 페이지로 끝난다. 1024px 이상에서 우측 패널, 그 아래에서 전체화면 시트로 렌더한다.

### 3.2 루트 레이아웃 분리가 먼저 필요하다

현재 `src/app/layout.tsx`가 `<body>` 안에 `TopBanner` + `Header` + `main` + `Footer`를 직접 넣는다. 이 상태에서 `/admin/*`을 만들면 **관리자 화면 위에 공개 사이트 헤더와 푸터가 그대로 붙는다.** App Router의 중첩 레이아웃은 상위 레이아웃 요소를 제거할 수 없다.

라우트 그룹으로 갈라야 한다.

```
src/app/
  layout.tsx            ← <html> + 폰트 변수 + globals.css + {children} 만 남긴다
  (site)/
    layout.tsx          ← TopBanner + Header + main.flex-1.pt-(--banner-h) + Footer
    page.tsx            ← 현재 page.tsx 이동
  (admin)/
    admin/
      layout.tsx        ← AdminShell (인증 확인 포함)
      ...
      login/page.tsx    ← AdminShell 없이 단독
```

`metadata`는 루트에 그대로 두되, `(admin)/admin/layout.tsx`에 `robots: { index: false, follow: false }`를 추가한다. 관리자 화면이 검색에 잡히면 안 된다.

`min-h-svh flex flex-col`은 `(site)/layout.tsx`로 옮긴다. 관리자는 자체 높이 전략(`h-svh` + 내부 스크롤)을 쓴다.

### 3.3 사이드바 vs 상단 탭 — 사이드바

네비게이션 항목이 **17개**다(대시보드 제외). 결정 근거 셋.

1. **17개가 가로 탭 바에 들어가지 않는다.** 1280px에서 한글 라벨 17개는 가로 스크롤이나 오버플로 메뉴를 강제한다. 반복 사용 도구에서 항목이 움직이는 네비게이션은 최악이다. 대표는 세 번째 주쯤 위치를 기억하고 조준 없이 클릭한다.
2. **세로 순서 자체가 1:1 대응이다.** DEVNOTE 결정사항은 관리자 탭을 섹션과 1:1로 나누는 것이다. 공개 페이지는 위→아래로 흐르고, 사이드바도 위→아래로 흐른다. **사이드바는 페이지를 90도 눕힌 것**이다. 가로 탭 바는 좌→우라 이 대응이 성립하지 않는다. 이게 결정적 근거다.
3. 상시 노출되므로 지금 편집 중인 섹션이 전체에서 어디쯤인지 항상 보인다. 가로 탭 17개는 기억에 의존한다.

**접히지 않는다.** 240px는 1280px의 19%다. 접기 상태 하나를 만들면 저장·복원·아이콘 전용 모드 라벨링이 따라온다. v1에서 값어치가 없다.

### 3.4 그룹핑

3개 그룹, 그룹 라벨은 `.adm-meta uppercase text-forest-50`.

```
┌ coaching  Admin ───────────┐   ← 세리프 워드마크 (세리프 허용 지점 1/2)
│                            │
│ 대시보드                    │
│                            │
│ 페이지 섹션 ─────────────    │   ← 공개 페이지 순서 그대로
│   히어로                    │
│   대상별 코칭                │
│   프로그램                   │
│   중간 배너                  │
│   진행 방식                  │
│   서비스                    │
│   코치                      │
│   브랜드 스토리              │
│   원칙 카드                  │
│   FAQ                      │
│   상담 섹션                  │
│                            │
│ 공통 ──────────────────     │
│   사이트 정보                │
│   상단 띠 배너               │
│   헤더 메뉴                  │
│   푸터                      │
│                            │
│ 운영 ──────────────────     │
│   이미지 관리         ● 21   │   ← 비어 있는 슬롯 수
│   상담 신청           ● 3    │   ← 신규 건수
├────────────────────────────┤
│ 로그아웃                    │   ← 하단 고정
└────────────────────────────┘
```

`페이지 섹션`을 맨 위에 둔 이유: 대표가 가장 자주 쓸 그룹이다. `공통`(사이트 정보·배너·메뉴·푸터)은 한 번 채우면 거의 안 건드린다. `사이트 정보`를 `공통`에 넣은 이유는 헤더·푸터·상담 섹션이 전부 `SITE`를 참조하기 때문이다 — 편집 결과가 나타나는 곳과 같은 그룹에 있어야 한다.

**높이 초과 처리.** 17행 × 34px + 그룹 라벨 3개 + 워드마크 56px + 로그아웃 48px ≈ 730px. 1280×800 뷰포트에서 살짝 넘친다. 워드마크와 로그아웃을 `shrink-0`으로 고정하고 nav 목록만 `flex-1 overflow-y-auto`로 둔다.

**상태 표시자.** 세 종류를 오른쪽 정렬로 붙인다.

| 표시 | 조건 | 스타일 |
| --- | --- | --- |
| 숫자 배지 | `이미지 관리`의 빈 슬롯 수, `상담 신청`의 신규 건수 | `.adm-meta` `bg-grass text-forest` `rounded-full px-1.5 min-w-5 text-center` |
| 주의 점 | 그 섹션에 빈 이미지 슬롯이 1개 이상 | `size-1.5 rounded-full bg-warn` + `aria-label="이미지 2개 비어 있음"` |
| 미저장 점 | 그 섹션에 저장하지 않은 변경 | `size-1.5 rounded-full bg-danger` + `aria-label="저장하지 않은 변경 있음"` |

주의 점은 현재 가장 값어치 있는 정보다. 21개 슬롯이 전부 비어 있고, 대표의 실제 다음 작업이 그걸 채우는 것이다. 점 하나가 "여기 아직 안 됐다"를 사이드바에서 알려준다.

### 3.5 사이드바 스타일

```jsx
{/* 컨테이너 */}
<aside className="hidden w-60 shrink-0 flex-col bg-forest lg:flex">

{/* 워드마크 */}
<div className="flex h-14 shrink-0 items-center gap-2 px-5">
  <span className="serif text-[22px] leading-none text-white">coaching</span>
  <span className="adm-meta uppercase tracking-[0.18em] text-forest-30">Admin</span>
</div>

{/* nav */}
<nav className="flex-1 overflow-y-auto px-2 pb-4">

{/* 그룹 라벨 */}
<p className="adm-meta mt-5 mb-1.5 px-3 uppercase tracking-[0.16em] text-forest-50">페이지 섹션</p>

{/* 항목 — 기본 */}
<Link className="adm-body flex h-[34px] items-center gap-2 rounded-[4px] px-3
                 text-forest-10 transition-colors hover:bg-forest-90 hover:text-white
                 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white">

{/* 항목 — 활성 */}
className="... relative bg-forest-80 text-white
           before:absolute before:left-0 before:h-4 before:w-[2px] before:rounded-full before:bg-grass"
aria-current="page"

{/* 하단 로그아웃 */}
<div className="shrink-0 border-t border-forest-80 p-2">
  <button className="adm-body flex h-9 w-full items-center gap-2 rounded-[4px] px-3
                     text-forest-10 hover:bg-forest-90 hover:text-white">
```

대비 검증(전부 `forest` 또는 `forest-80` 배경 기준):

| 요소 | 값 | 대비 | 판정 |
| --- | --- | --- | --- |
| 기본 항목 `forest-10` on `forest` | `#e6ebec` / `#003a40` | **10.4:1** | AAA |
| 활성 항목 `white` on `forest-80` | `#ffffff` / `#336166` | **6.9:1** | AA+ |
| 그룹 라벨 `forest-50` on `forest` | `#809c9f` / `#003a40` | **4.9:1** | AA (12px이지만 라벨이므로 허용, 하한 통과) |
| 워드마크 `Admin` `forest-30` on `forest` | `#b3c4c6` / `#003a40` | **7.4:1** | AAA |
| 활성 좌측 바 `grass` on `forest` | `#9db4ab` / `#003a40` | **5.7:1** | 비텍스트 3:1 통과 |
| 활성 배경 `forest-80` vs `forest` | — | 1.8:1 | 배경 대비는 요건 없음. 아래 참고 |

활성 상태를 **배경 + 흰 글자 + 좌측 grass 바 3채널**로 표현한 이유가 위 마지막 줄이다. `forest-80` 배경만으로는 1.8:1이라 약하다. 색각 이상·저조도 화면에서도 활성 항목이 특정되도록 채널을 겹쳤다. `aria-current="page"`로 스크린리더에도 전달한다.

### 3.6 콘텐츠 영역

```jsx
<div className="flex h-svh overflow-hidden bg-ink-05">
  <AdminSidebar />
  <div className="flex min-w-0 flex-1 flex-col">
    <AdminTopBar />                                  {/* lg 미만에서만 */}
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[880px] px-6 pt-6 pb-0">
        <AdminPageHeader />
        {/* 편집 영역 */}
        <SaveBar />
      </div>
    </main>
  </div>
</div>
```

**`max-w-[880px]`을 준 이유.** 공개 페이지는 최대폭 제한이 없다(히녹 원칙). 관리자는 반대다. 텍스트 입력 필드가 1600px 모니터에서 1500px로 늘어나면 (a) 한 줄에 200자가 들어가 눈이 왕복하고, (b) 공개 페이지에서 그 문장이 실제로 몇 줄이 될지 감이 전혀 안 온다. 880px은 2열 폼(각 420px + 40px gap)이 편하게 들어가고, 한글 16px 한 줄이 약 50자로 끊겨 실제 렌더 폭과 비슷한 감각을 준다.

이미지 관리 페이지는 예외로 `max-w-[1200px]`이다. 슬롯 그리드는 넓을수록 좋다.

### 3.7 반응형 — 지원 범위를 좁혀서 확정한다

다 지원하려 하면 복잡도가 폭증한다. **대표가 폰으로 실제로 할 일**을 기준으로 잘랐다.

| 폭 | 지원 수준 |
| --- | --- |
| **≥1024px** | 주 타깃. 모든 편집 기능 완전 지원. 사이드바 상시 노출, 2열 폼, 표 |
| **768–1023px** | 편집 완전 지원. 사이드바 → 드로어, 폼 1열, 상담 신청 상세 → 전체화면 시트 |
| **<768px** | **로그인 + 상담 신청(목록·상세)만 제대로 설계·검증한다.** 나머지 화면은 1열로 깨지지 않게 렌더되지만 폰 전용 최적화와 검증 대상이 아니다 |

**읽기 전용 모드를 만들지 않는 이유.** "폰에서는 못 고치게 하자"는 매력적이지만 필드 전체에 비활성 변형과 안내 문구를 만들어야 하고, 상태가 하나 늘고 버그 표면이 늘어난다. 이득은 없다 — 폰에서 편집을 시도하는 사람은 대표 본인이고, 막을 대상이 아니라 안 하게 될 사람이다. **막지 않고, 최적화하지도 않는다.**

폰에서 명시적으로 제공하지 않는 것: 드래그 기반 순서 변경(§5.4에서 애초에 버튼으로 결정), 2단 이미지 관리 레이아웃(1열로 쌓인다).

**브레이크포인트 값 — 선우가 반드시 알아야 할 함정.**

공개 페이지는 `@media (min-width: 1025px)` 단일 기준이다(`globals.css:56,132`). 관리자는 **Tailwind 기본 `md`(768px) / `lg`(1024px)** 를 쓴다.

- 관리자는 두 개가 필요하다. "사이드바가 들어가는가"와 "필드가 나란히 서는가"는 서로 독립된 판단이고 다른 폭에서 뒤집힌다. 공개 페이지는 풀블리드 블록의 선형 스크롤이라 하나로 충분했다.
- **`lg`는 1024px, 공개 페이지 변수는 1025px이다.** 정확히 1024px에서 관리자는 데스크톱 레이아웃인데 `--gutter`/`--header-h`는 아직 모바일 값이다. 관리자가 이 변수를 읽지 않으므로 충돌은 없지만, 두 체계가 다르다는 것을 모르면 디버깅에서 헤맨다.
- 관리자 CSS에서 `--gutter`, `--header-h`, `--banner-h`를 **읽지 않는다.**

**드로어 (lg 미만)**

```jsx
{/* 상단 바 */}
<header className="flex h-14 shrink-0 items-center gap-3 border-b border-ink-15 bg-white px-4 lg:hidden">
  <button aria-label="메뉴 열기" aria-expanded={open} className="grid size-10 place-items-center
          rounded-[4px] text-forest hover:bg-ink-05">
    <Menu className="size-5" strokeWidth={1.6} />
  </button>
  <span className="adm-h truncate text-forest">{현재 페이지 제목}</span>
</header>

{/* 스크림 */}
<div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={close} />

{/* 패널 — 사이드바와 동일 컴포넌트, 위치만 다르다 */}
<aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-forest
                  transition-transform duration-200 lg:hidden
                  data-[open=false]:-translate-x-full">
```

동작: 스크림 클릭·`Esc`·항목 선택 시 닫힘. 열려 있을 때 `body` 스크롤 잠금. 열릴 때 첫 항목에 포커스, 닫힐 때 햄버거로 포커스 복귀. 햄버거는 40px(모바일 터치 대상).

`Header.tsx`의 메가메뉴 개폐 로직(`document.body.style.overflow`)과 같은 패턴이라 참고할 수 있지만, framer-motion 없이 CSS transition으로 구현한다.
