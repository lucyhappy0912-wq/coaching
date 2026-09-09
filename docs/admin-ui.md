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

---

## 4. 폼 프리미티브 — 정확한 클래스

이 절의 클래스 문자열은 그대로 복사해서 쓸 수 있다. 모든 상태를 명시했다.

### 4.1 Field (라벨 + 컨트롤 + 도움말 + 에러)

```jsx
<div className="min-w-0">
  <div className="mb-1.5 flex items-baseline justify-between gap-2">
    <label htmlFor={id} className="adm-label text-forest-70">
      {label}
      {required && <span className="ml-1 text-danger" aria-hidden>*</span>}
    </label>
    {counter && <span className={cn("adm-meta tabular-nums",
      over ? "text-warn" : "text-ink-70")}>{len}/{soft}자</span>}
  </div>

  {children}

  {help && !error && <p className="adm-body mt-1.5 text-ink-70">{help}</p>}
  {error && (
    <p id={`${id}-error`} className="adm-body mt-1.5 flex items-start gap-1.5 text-danger">
      <AlertCircle className="mt-[3px] size-3.5 shrink-0" strokeWidth={2} aria-hidden />
      {error}
    </p>
  )}
</div>
```

- 컨트롤에 `aria-invalid={!!error}` + `aria-describedby={error ? id-error : id-help}`
- 필수 표시 `*`는 `aria-hidden`. 스크린리더에는 `required` 속성이 전달된다
- 에러 텍스트는 `.adm-body` 15px. **에러는 문장이므로 본문 하한을 지킨다**(§1.2)
- 글자수 카운터는 라벨 줄 오른쪽에 둔다. 필드 아래에 두면 에러 메시지와 자리를 다툰다
- `tabular-nums`: 숫자가 바뀔 때 폭이 흔들리지 않게

### 4.2 TextInput

```js
const input = cn(
  "adm-input h-10 w-full rounded-[4px] border bg-white px-3 text-forest",
  "placeholder:text-ink-70",
  "transition-colors",
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest",
  "disabled:cursor-not-allowed disabled:bg-ink-05 disabled:text-ink-70",
  invalid ? "border-danger bg-danger-tint" : "border-ink-50"
);
```

| 상태 | 스타일 | 근거 |
| --- | --- | --- |
| 기본 | `border-ink-50` (3.2:1) | UI 경계선 하한. `ink-30`(1.9:1)·`ink-15`(1.4:1)는 컨트롤 경계로 못 쓴다 |
| 포커스 | 2px `forest` outline, offset 1 | 12.5:1. 테두리 색만 바꾸지 않는다 — 색 변화 단독은 지각적으로 약하다 |
| 무효 | `border-danger` + `bg-danger-tint` | 색 + 배경 + 아이콘 + 텍스트 4채널. 색각 이상 대응 |
| 비활성 | `bg-ink-05` + `text-ink-70` | 6.0:1 유지. 비활성이라고 읽을 수 없게 만들지 않는다 |
| 플레이스홀더 | `text-ink-70` (6.0:1) | `ink-60`(4.35:1)은 AA 미달. 공개 `ConsultForm`도 `ink-70`이라 일관 |

**높이 40px 근거.** 16px 값 + 상하 패딩 10px + 테두리 2px = 38px가 최소이고, 40px이 그중 4px 배수다. 터치 최소 44px보다 작지만 편집 화면은 데스크톱 전용(§3.7)이다. 예외: 로그인 버튼과 모바일 상담 신청 행은 44px.

### 4.3 TextArea

```js
const textarea = cn(
  input.replace("h-10", "min-h-24 py-2.5"),
  "resize-y leading-[1.6]"
);
```

- `leading-[1.6]`: 여러 줄 문장은 공개 페이지와 같은 160% 행간으로 본다. 대표가 줄바꿈 감각을 잡는 곳이다
- `min-h-24`(96px) = 3줄. `resize-y` 허용
- 자동 높이 확장은 넣지 않는다. 입력 중 레이아웃이 움직이면 아래 필드가 밀린다

### 4.4 ToneSelect

`tone`은 절대 텍스트 입력이 아니다. `Photo`의 5개 값(`sage`/`paper`/`mist`/`dusk`/`forest`)만 유효하다.

라디오 그룹으로 만들고 **각 옵션이 실제 그라디언트를 렌더한다.** `Photo`를 그대로 써서 `TONE_CLASS`를 재구현하지 않는다.

```jsx
<div role="radiogroup" aria-label="사진 없을 때 표시할 색" className="flex gap-2">
  {TONES.map((t) => (
    <button type="button" role="radio" aria-checked={value === t} key={t}
      className={cn(
        "group relative size-14 overflow-hidden rounded-[4px] transition-shadow",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest",
        value === t ? "ring-2 ring-forest ring-offset-2" : "ring-1 ring-ink-30 hover:ring-ink-50"
      )}>
      <Photo tone={t} />
      {value === t && <Check className="absolute inset-0 m-auto size-5 text-white
        drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" strokeWidth={2.5} />}
      <span className="sr-only">{TONE_LABEL[t]}</span>
    </button>
  ))}
</div>
<p className="adm-body mt-1.5 text-ink-70">사진을 넣지 않았을 때 그 자리에 표시되는 색입니다.</p>
```

도움말 문구가 중요하다. `tone`이 뭔지 대표는 모른다. "사진이 없을 때 뜨는 색"이라고 말해줘야 한다.

`sage`/`paper`/`mist`/`dusk`/`forest` 라벨은 한글로: `연한 초록` / `따뜻한 회색` / `연한 하늘` / `어두운 청록` / `진한 초록`.

### 4.5 AnchorSelect — 링크 필드는 자유 입력이 아니다

링크 필드가 11개 있다(`HERO_SLIDES.cta`, `AUDIENCES.link` ×3, `STORY_TABS.link` ×3, `SERVICES.link` ×4, `MID_BANNER.cta`, `BRAND_STORY.link`, `MENU_GROUPS.items` ×11, `FOOTER_LINKS.items` ×9). 전부 `#anchor` 형식이고, 오타 하나면 클릭해도 아무 일이 없는 링크가 된다. 자유 텍스트로 두면 안 된다.

**유효한 내부 앵커 전체 목록** (컴포넌트에서 확인):

| 앵커 | 위치 |
| --- | --- |
| `#hero` | `HeroSlider.tsx:26` |
| `#audience` | `AudienceRows.tsx:19` |
| `#audience-adult` / `#audience-senior` / `#audience-leader` | `AudienceRows.tsx:25` (`AUDIENCES[].id` 파생) |
| `#program` | `ProgramTabs.tsx:14` |
| `#story` | `StoryTabs.tsx:15` |
| `#service` | `Services.tsx:8` |
| `#coach` | `CoachBand.tsx:7` |
| `#faq` | `Faq.tsx` |
| `#consult` | `ConsultSection.tsx:6` |

**중간 배너 · 브랜드 스토리 · 원칙 카드에는 `id`가 없다.** 이 세 섹션은 링크 대상이 될 수 없고, §5.7의 "이 섹션 보기" 딥링크도 동작하지 않는다. `id="banner"` / `id="brand"` / `id="principles"` 추가가 필요하다. → §10

UI:

```jsx
<div className="flex gap-2">
  <select className={cn(input, "flex-1")}>
    <optgroup label="페이지 안 위치">
      <option value="#consult">상담 신청 섹션</option>
      ...
    </optgroup>
    <optgroup label="연락">
      <option value="__tel">전화 걸기 (사이트 정보의 전화번호)</option>
      <option value="__mail">메일 보내기 (사이트 정보의 이메일)</option>
    </optgroup>
    <option value="__url">외부 주소 직접 입력…</option>
  </select>
</div>
{mode === "url" && (
  <input className={cn(input, "mt-2")} placeholder="https://" inputMode="url" />
)}
```

`__tel` / `__mail`을 고르면 값은 `SITE.phone`/`SITE.email`에서 파생시킨다(현재 `FOOTER_LINKS`가 하는 방식과 동일). 대표가 번호를 두 곳에 적지 않게 한다.

`AUDIENCES`의 순서·id가 바뀌면 옵션 목록도 따라 바뀌어야 하므로, 이 목록은 **하드코딩 상수 + `AUDIENCES`에서 동적 생성**을 합쳐서 만든다.

### 4.6 Panel / Card

```jsx
<section className="rounded-[6px] border border-ink-15 bg-white p-5">
  <h2 className="adm-h text-forest">{title}</h2>
  {desc && <p className="adm-body mt-1 text-ink-70">{desc}</p>}
  <div className="mt-4 space-y-5">{children}</div>
</section>
```

`border-ink-15`는 흰 배경 대비 1.4:1로 약하지만, 캔버스가 `ink-05`이므로 카드 경계가 배경 차이로도 드러난다. 카드는 컨트롤이 아니므로 WCAG 1.4.11 대상이 아니다. 표 행 구분선은 `ink-10`(더 약하게 — 행 구분은 정렬로도 읽힌다).

### 4.7 버튼

```js
const btn = "adm-body inline-flex items-center justify-center gap-1.5 rounded-[4px] font-medium " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest " +
  "disabled:cursor-not-allowed disabled:opacity-45";

const primary   = "bg-forest text-white hover:bg-forest-90";                    // 12.5:1
const secondary = "border border-ink-50 bg-white text-forest hover:bg-ink-05";  // 경계 3.2:1
const ghost     = "text-forest hover:bg-ink-05";
const destruct  = "bg-danger text-white hover:brightness-90";                   // 7.0:1
const destructGhost = "text-danger hover:bg-danger-tint";                       // 7.0:1

const h = { md: "h-9 px-4", lg: "h-10 px-5", icon: "size-8 p-0", touch: "h-11 px-5" };
```

- 기본 `h-9`(36px). **입력과 나란히 놓일 때만 `h-10`** — 40px 입력 옆의 36px 버튼은 어긋나 보인다
- 표 행 액션은 `size-8` 아이콘 버튼. 반드시 `aria-label` 부여
- `touch`(44px)는 로그인 버튼과 모바일 카드 액션 전용
- `font-medium`(500): 15px 버튼 라벨이 본문과 같은 무게면 클릭 가능해 보이지 않는다
- 아이콘은 `size-4` `strokeWidth={1.8}`. 공개 페이지의 `strokeWidth={1}~1.4`(장식용 얇은 선)보다 굵게 — 16px에서 1.4는 흐려 보인다

**`disabled:opacity-45`가 대비를 깨는 문제.** `forest` 12.5:1 × 0.45 → 약 3.4:1. WCAG는 비활성 컨트롤을 대비 요건에서 제외하므로 위반은 아니다. 다만 비활성 버튼이 화면에 오래 머무는 곳은 저장 버튼 하나뿐이고, 거기는 옆의 상태 텍스트가 이유를 말해준다(§5.8).

### 4.8 확인 대화상자 — 언제 띄우는가

**규칙: 확인 대화상자는 서버에 되돌릴 수 없는 변경을 일으킬 때만 띄운다.**

| 동작 | 확인 | 근거 |
| --- | --- | --- |
| 배열 항목 삭제(저장 전) | **없음** | 아직 서버에 없다. 저장 바의 `되돌리기`로 복구된다. 대화상자는 소음 |
| 배열 항목 순서 변경 | 없음 | 동일 |
| 저장하지 않고 이동 | **있음** (§5.6) | 작업 손실 |
| 이미지 삭제 | **있음** | 서버 파일·경로가 즉시 바뀐다 |
| 상담 신청 삭제 | **있음** + 문구 재입력 | 개인정보. 복구 불가 |
| 저장 | 없음 | 저장은 사용자가 의도한 것이다. 저장에 확인을 붙이면 저장을 두 번 누르게 만든다 |

대화상자 본문은 `.adm-body` 15px, 파괴적 액션 버튼은 `destruct`, 취소는 `secondary`이며 **취소가 기본 포커스**다.

---

## 5. 편집 화면 패턴

### 5.1 저장 — 섹션별 · 명시적

**자동 저장을 쓰지 않는다.** 이 콘텐츠는 곧 공개 페이지다. 저장 계층에 초안/발행 구분이 없으므로(데이브의 어댑터는 콘텐츠 문서 하나다) **자동 저장 = 즉시 발행**이다. 반쯤 쓴 히어로 제목이 사이트에 뜨는 걸 감수할 수 없다.

**전체 저장을 쓰지 않는다.** 17개 섹션을 한 페이로드로 묶으면 어느 한 곳의 검증 실패가 전부를 막고, 무엇이 바뀌었는지 대표가 알 수 없다.

**섹션 = 저장 단위다.** 섹션보다 작게(슬라이드 1개만 저장) 쪼개지 않는 이유: 배열 인덱스 정합성과 상호 참조(`PROGRAM_CARDS[].tabs` → `PROGRAM_TABS[].id`, `MENU_GROUPS[].items[].href` → `AUDIENCES[].id`)는 섹션 전체를 봐야 검증된다.

### 5.2 저장 바

콘텐츠 영역 하단에 고정된다.

```jsx
<div className="sticky bottom-0 z-20 -mx-6 mt-8 flex h-15 items-center justify-between gap-4
                border-t border-ink-15 bg-white/95 px-6 backdrop-blur">
  <div className="min-w-0">{상태 텍스트}</div>
  <div className="flex shrink-0 gap-2">
    <button className={cn(btn, ghost, h.md)} disabled={!dirty}>되돌리기</button>
    <button className={cn(btn, primary, h.md)} disabled={!dirty || saving || hasError}>
      {saving ? "저장 중…" : "저장"}
    </button>
  </div>
</div>
```

`-mx-6`로 좌우 여백을 상쇄해 콘텐츠 폭 전체를 덮는다. `sticky bottom-0`이므로 페이지가 길어도 항상 보인다.

### 5.3 저장 상태 — 5가지

| 상태 | 왼쪽 텍스트 | 저장 버튼 | 그 외 |
| --- | --- | --- | --- |
| **깨끗함** | `.adm-meta text-ink-70` — `마지막 저장 09-09 14:22` | 비활성 | — |
| **변경됨** | `.adm-body text-warn` + `AlertCircle size-4` — `저장하지 않은 변경 3곳` | 활성 | 사이드바 항목에 `danger` 점, `beforeunload` 등록 |
| **저장 중** | `.adm-body text-ink-70` — `저장 중…` | `Loader2 animate-spin` + 비활성 | 폼 전체 `pointer-events-none opacity-70`. 저장 중 편집을 허용하면 어느 값이 저장됐는지 알 수 없다 |
| **성공** | `.adm-body text-forest` + `Check size-4` — `저장했습니다` (3초 후 `깨끗함`으로) | 비활성 | 토스트 + 공개 페이지 링크. 초안 `sessionStorage` 삭제 |
| **실패** | `.adm-body text-danger` + `AlertCircle` — 서버 메시지 | **활성 유지** | 토스트(자동 소멸 없음). **입력값 절대 유지** |

**저장 버튼이 비활성일 때 활성으로 바뀌는 조건 세 개**: 변경 있음 + 저장 중 아님 + 검증 에러 없음. 검증 에러가 있으면 저장 버튼 옆에 `.adm-body text-danger`로 `입력 확인이 필요한 항목이 1개 있습니다`를 띄우고, 클릭하면 첫 에러 필드로 스크롤 + 포커스한다.

**실패 시 입력값을 절대 버리지 않는다.** 300자 본문을 다시 쓰게 만드는 것이 이 화면에서 일어날 수 있는 최악의 일이다.

### 5.4 세 가지 콘텐츠 종류

하나의 `Repeater` 컴포넌트로 세 경우를 다 덮는다. 차이는 props뿐이다.

| 종류 | `min` / `max` | 추가·삭제 | 순서 변경 |
| --- | --- | --- | --- |
| 단일 객체 | — | Repeater 안 씀 | — |
| 고정 개수 배열 | `min === max` | **버튼 자체를 렌더하지 않는다** | 허용 |
| 가변 배열 | `min < max` | 허용 | 허용 |

#### (a) 단일 객체 — `SITE`, `MID_BANNER`, `BRAND_STORY`, `COACH`, `CONSULT`

Repeater 없이 Panel 안에 필드를 나열한다. 의미별로 Panel을 나눈다.

`SITE`(12필드) 예시:

```
Panel「브랜드」      name · nameKo · tagline · description
Panel「연락처」      phone · email · addressLine
Panel「운영시간」    hours · lunch(라벨: 토요일 운영시간)
Panel「사업자 정보」 owner · company · bizNo
```

12개를 한 Panel에 세로로 쌓으면 스크롤 480px에 아무 구조가 없다. 4개 Panel로 나누면 각 3~4필드이고, 대표가 "연락처 고치러 왔다"는 목적으로 바로 찾는다.

2열 배치(`md:grid-cols-2`)를 쓰는 기준: **짧고 서로 독립된 값만.** `phone`+`email`은 나란히, `tagline`·`description`은 전폭. 서로 비교하며 읽어야 하는 값(`name`/`nameKo`)도 나란히.

`COACH.credentials`는 단일 객체 안의 가변 문자열 배열이다. Panel 안에 축소판 Repeater(입력 1개 + 삭제 + ↑↓)를 둔다.

#### (b) 고정 개수 배열 — `AUDIENCES`(3), `SERVICES`(4), `PRINCIPLES`(3), `PROGRAM_TABS`(3), `FOOTER_LINKS`(2)

**추가·삭제 버튼을 비활성으로 렌더하지 않고, 아예 렌더하지 않는다.** 비활성 버튼은 "왜 안 눌려요?"를 만든다. 대신 페이지 헤더 아래 한 줄로 이유를 말한다.

```jsx
<p className="adm-body flex items-start gap-2 rounded-[4px] bg-ink-05 px-3 py-2 text-ink-70">
  <Info className="mt-[3px] size-4 shrink-0 text-forest-70" strokeWidth={1.8} aria-hidden />
  이 섹션은 3칸 고정입니다. 공개 페이지가 3열 그리드라서 칸 수를 바꿀 수 없습니다.
  칸을 늘리거나 줄여야 하면 개발자에게 문의해 주세요.
</p>
```

섹션별 문구:

| 섹션 | 문구 근거 |
| --- | --- |
| `AUDIENCES` 3 | 좌우 교차 3행. 개수 자체는 유연하지만 DEVNOTE에서 "성인·시니어·리더십 3트랙"이 브랜드 정의다 |
| `SERVICES` 4 | `Services.tsx:11` `lg:grid-cols-4` |
| `PRINCIPLES` 3 | `Principles.tsx:7` `lg:grid-cols-3` |
| `PROGRAM_TABS` 3 | `PROGRAM_CARDS[].tabs`가 id를 참조. 탭 삭제 시 카드가 사라진다 |
| `FOOTER_LINKS` 2 | `Footer.tsx:6` `lg:grid-cols-[1.6fr_1fr_1fr]` (§2.2) |

**개수는 잠그고 순서는 푼다.** `AUDIENCES` 순서는 DEVNOTE에 따라 "우선순위를 순서로만 표현"하는 의도적 설계다. 순서 변경은 그리드를 깨지 않는다. 이 구분이 중요하다.

#### (c) 가변 배열 — `HERO_SLIDES`, `PROGRAM_CARDS`, `STORY_TABS`, `FAQS`, `TOP_MESSAGES`, `MENU_GROUPS`

| 배열 | min | max | max 근거 |
| --- | --- | --- | --- |
| `HERO_SLIDES` | 1 | 5 | 6초 자동 순환(`HeroSlider.tsx:11`). 5장이면 한 바퀴 30초로 이미 아무도 끝까지 안 본다 |
| `PROGRAM_CARDS` | 1 | 8 | 가로 슬라이더라 개수 제약은 없다. 8은 관리 가능성 상한 |
| `STORY_TABS` | 2 | 5 | 탭이 세로 목록(`.t2` 26/34px)이라 6개부터 38% 컬럼 높이를 넘긴다 |
| `FAQS` | 1 | 20 | 아코디언. 제약 없음 |
| `TOP_MESSAGES` | 1 | 5 | 4초 순환. 0개면 배너 높이만 남는다 |
| `MENU_GROUPS` | 1 | 3 또는 4 | `Header.tsx:88` `lg:grid-cols-3` → §2.2, §10 |

#### 항목 카드 구조

```jsx
<li className="rounded-[6px] border border-ink-15 bg-white">
  {/* 헤더 — 고정 44px */}
  <div className="flex h-11 items-center gap-2 border-b border-ink-10 px-3">
    <span className="adm-mono w-6 shrink-0 text-center text-ink-70">{i + 1}</span>
    <span className="adm-h min-w-0 flex-1 truncate text-forest">
      {itemTitle(item) || <span className="text-ink-70">(제목 없음)</span>}
    </span>
    <div className="flex shrink-0 items-center gap-0.5">
      <button aria-label={`${i + 1}번째 항목을 위로`} disabled={i === 0}
        className={cn(btn, ghost, h.icon)}><ArrowUp className="size-4" /></button>
      <button aria-label={`${i + 1}번째 항목을 아래로`} disabled={i === last}
        className={cn(btn, ghost, h.icon)}><ArrowDown className="size-4" /></button>
      {canDelete && <button aria-label={`${i + 1}번째 항목 삭제`}
        className={cn(btn, destructGhost, h.icon)}><Trash2 className="size-4" /></button>}
    </div>
  </div>

  {/* 본문 */}
  <div className="space-y-5 p-4">{fields}</div>
</li>
```

- **`itemTitle`은 그 배열의 대표 필드다**: `HERO_SLIDES` → `title`, `FAQS` → `q`, `PROGRAM_CARDS` → `name`, `STORY_TABS` → `tab`, `MENU_GROUPS` → `title`, `TOP_MESSAGES` → 문자열 자체. 접혀 있을 때 무엇인지 알아야 한다
- **↑↓는 첫/마지막에서 비활성이지 숨기지 않는다.** 숨기면 버튼 위치가 행마다 달라져서 ↓를 연속으로 누르는 리듬이 깨진다
- `aria-label`에 순서를 넣는다. 스크린리더에서 "위로" 버튼이 12개면 구분이 안 된다
- 순서 변경 후 `aria-live="polite"` 영역에 `3번째 → 2번째로 이동했습니다` 안내. 이동 후 같은 항목의 ↑ 버튼에 포커스 유지

#### 접기 — 배열마다 다르게

| 배열 | 기본 상태 | 근거 |
| --- | --- | --- |
| `HERO_SLIDES`(2×7필드) | 전부 펼침 | 2개뿐이고 서로 비교하며 쓴다 |
| `PROGRAM_CARDS`(3×8) | 전부 펼침 | 가격·요약을 나란히 봐야 균형이 잡힌다 |
| `STORY_TABS`(3×8) | 전부 펼침 | 3단계 흐름이라 같이 봐야 한다 |
| `AUDIENCES`(3×8) | 전부 펼침 | 동일 |
| `SERVICES`(4×6) | 전부 펼침 | 동일 |
| `FAQS`(N×2) | **전부 접힘** | 답변이 300자다. 20개 펼치면 6000자 스크롤. 질문 목록으로 훑고 하나만 펼친다 |
| `MENU_GROUPS` | 그룹 펼침, 항목 표 형태 | 아래 별도 |
| `TOP_MESSAGES` | 카드 없이 한 줄씩 | 필드가 1개다. 카드 껍데기가 내용보다 크다 |

`TOP_MESSAGES` 전용 축소 행:

```jsx
<li className="flex items-center gap-2">
  <span className="adm-mono w-6 shrink-0 text-center text-ink-70">{i+1}</span>
  <input className={cn(input, "flex-1")} />
  <button className={cn(btn, ghost, h.icon)} aria-label="위로">…</button>
  <button className={cn(btn, ghost, h.icon)} aria-label="아래로">…</button>
  <button className={cn(btn, destructGhost, h.icon)} aria-label="삭제">…</button>
</li>
```

#### `MENU_GROUPS` — 유일한 2단 중첩

가장 복잡한 화면이다. 그룹 카드 안에 항목 표를 넣는다.

```
┌ 1  COACHING                            ↑ ↓ 🗑 ┐
│  그룹 제목  [COACHING            ]              │
│                                                │
│  항목                                          │
│  ┌──────────────────┬────────────────┬───────┐ │
│  │ 표시할 글자       │ 이동할 위치     │       │ │
│  ├──────────────────┼────────────────┼───────┤ │
│  │ [Adult        ]  │ [성인 코칭 ▾]   │ ↑↓🗑  │ │
│  │ [Senior       ]  │ [시니어 코칭 ▾] │ ↑↓🗑  │ │
│  │ [Leadership   ]  │ [리더십 코칭 ▾] │ ↑↓🗑  │ │
│  └──────────────────┴────────────────┴───────┘ │
│  + 항목 추가                                    │
└────────────────────────────────────────────────┘
+ 그룹 추가
```

- 항목 행은 `grid grid-cols-[1fr_1fr_auto] gap-2 items-center`, 헤더 라벨은 `.adm-label text-forest-70` 한 번만
- 768px 미만에서는 각 항목이 카드로 쌓인다(`grid-cols-1`)
- 이동할 위치는 `AnchorSelect`(§4.5)
- 그룹 추가는 `max`에 도달하면 렌더하지 않고 그 자리에 이유를 표시

### 5.5 검증

**타이밍**: `blur` 시 + 저장 시. **입력 중에는 검증하지 않는다** — 두 글자 쳤을 때 "너무 짧습니다"가 뜨면 방해다.

| 규칙 | 대상 | 메시지 |
| --- | --- | --- |
| 필수 비어 있음 | 제목·본문·라벨 등 렌더에 필요한 값 | `이 항목은 비워 둘 수 없습니다.` |
| 이메일 형식 | `SITE.email` | `이메일 형식이 아닙니다.` |
| 전화 형식 | `SITE.phone` | `숫자와 하이픈만 넣어 주세요. 예: 070-1234-5678` |
| 링크 형식 | 모든 href | `AnchorSelect`가 구조적으로 방지. 외부 URL 모드만 `^https?://` 검사 |
| 앵커 존재 | `#xxx` | 존재하지 않는 앵커: `이 위치는 페이지에 없습니다.` (§4.5 목록과 대조) |
| **중복 값** | §2.4의 key 필드 — `HERO_SLIDES.title`, `PROGRAM_CARDS.name`, `SERVICES.title`, `PRINCIPLES.title`, `MENU_GROUPS.title`, `items[].label`, `FOOTER_LINKS` 동일, `TOP_MESSAGES` 값, `COACH.credentials` 값 | `같은 값이 이미 있습니다. 화면이 잘못 표시될 수 있어 다르게 적어 주세요.` |
| 배열 최소 개수 | §5.4(c) | `최소 1개는 있어야 합니다.` |
| `tabs` 참조 | `PROGRAM_CARDS[].tabs` | 유효한 탭 id만. 체크박스 그룹으로 구조적 방지. 최소 1개 |
| `PROGRAM_TABS` 삭제 | — | 그 탭을 참조하는 카드가 있으면 삭제 차단: `이 탭을 쓰는 카드가 2개 있습니다.` |

**소프트 글자수 — 막지 않고 알린다.** 하드 리밋은 화나게 만들고, 길이 문제는 대부분 "된다/안 된다"가 아니라 "예쁘다/안 예쁘다"다. 그래서 카운터 색만 `warn`으로 바꾼다.

박스가 실제로 좁아서 알려줄 값어치가 있는 것만 표에 넣었다.

| 필드 | 렌더 | 실제 박스 | 권장 | 경고 |
| --- | --- | --- | --- | --- |
| `HERO_SLIDES.title` | `.t1` 32/40px 세리프 | `max-w-xl` 576px | 20자 | 28자 |
| `HERO_SLIDES.body` | `.b3` | `max-w-md` 448px | 90자 | 120자 |
| `HERO_SLIDES.cta.label` | PillButton | 1줄 고정 | 12자 | 16자 |
| `PROGRAM_CARDS.summary` | `.b3` 중앙 | **`max-w-[16rem]` 256px** | 60자 | 80자 |
| `PROGRAM_CARDS.name` | 19/22px 세리프 중앙 | 카드폭 30vw | 20자 | 26자 |
| `MID_BANNER.title` | `.t2` | 50%폭 | 24자 | 32자 |
| `MID_BANNER.body` | `.b3` | `max-w-md` | 90자 | 120자 |
| `STORY_TABS.tab` | `.t2` 26/34 세리프 | 38% 컬럼 세로 목록 | 12자 | 16자 |
| `STORY_TABS.body` | `.b3` | `max-w-sm` 384px | 70자 | 95자 |
| `PRINCIPLES.title` | 22/26 세리프, 사진 위 | 카드폭 32vw | 16자 | 22자 |
| `PRINCIPLES.body` | `.b3` 사진 위 | 동일 | 24자 | 34자 |
| `AUDIENCES.title` | `.t2` | 46%폭 | 22자 | 30자 |
| `SERVICES.body` | `.b3` | 24vw | 50자 | 70자 |
| `BRAND_STORY.tagline` | `.b3` 중앙 | `max-w-md` | 45자 | 60자 |
| `TOP_MESSAGES[]` | `.c1` 12/13 | **`max-w-md` 448px · 높이 40px 1줄** | 24자 | 32자 |
| `SITE.description` | meta description | — | 80자 | **160자** (검색결과 잘림) |
| `SITE.tagline` | `<title>`에 결합 | — | 30자 | 40자 |

`PROGRAM_CARDS.summary`와 `TOP_MESSAGES`가 특히 좁다. 현재 `PROGRAM_CARDS[1].summary`가 45자로 256px 박스에서 이미 3줄이다. 대표가 여기에 80자를 쓰면 카드 높이가 어긋난다.

`TOP_MESSAGES`에는 도움말을 붙인다: `배너 높이가 40px로 고정이라 한 줄을 넘기면 잘립니다. 320px 화면에서는 오른쪽 KR/EN 표기와 겹칠 수 있습니다.` (DEVNOTE §8 미확인 항목)

### 5.6 저장하지 않고 이탈 — 3중 방어

**(1) 앱 내부 이동** — 사이드바 링크·뒤로가기를 가로채 대화상자를 띄운다.

```
저장하지 않은 변경이 있습니다
「히어로」 섹션에 저장하지 않은 변경 3곳이 있습니다.
이동하면 사라집니다.

        [ 취소 ]  [ 버리고 이동 ]  [ 저장하고 이동 ]
```

버튼 3개인 이유: 90%의 경우 대표가 원하는 것은 "저장하고 이동"이다. 2개(취소/버리기)면 취소 → 저장 → 다시 클릭으로 3번 만들게 된다. 기본 포커스는 `저장하고 이동`, `Esc`는 취소, `버리고 이동`은 `destructGhost`.

**(2) 탭 닫기·새로고침·외부 이동** — `beforeunload`. 브라우저 기본 대화상자는 못생기고 문구도 못 바꾸지만 그 지점에서 작동하는 유일한 수단이다. 변경이 없을 때는 반드시 해제한다(항상 걸려 있으면 대표가 경고를 무시하는 습관이 든다).

**(3) 초안 보존 — 실제 손실은 링크 클릭이 아니라 이쪽에서 난다.**

노트북 절전, 브라우저 크래시, 실수로 창 닫기. 300자 본문을 쓰던 중이면 위 두 방어가 아무 도움이 안 된다.

- 변경 시 300ms 디바운스로 `sessionStorage`에 `admin:draft:<sectionKey>` 기록
- 마운트 시 초안이 있고 서버 값과 다르면 상단 배너

```jsx
<div className="mb-4 flex flex-wrap items-center gap-3 rounded-[4px] border border-warn/40
                bg-warn-tint px-4 py-3">
  <AlertCircle className="size-4 shrink-0 text-warn" strokeWidth={1.8} aria-hidden />
  <p className="adm-body min-w-0 flex-1 text-ink-90">
    저장하지 않은 편집이 남아 있습니다. <span className="text-ink-70">(09-09 14:05)</span>
  </p>
  <button className={cn(btn, secondary, h.md)}>편집 내용 복원</button>
  <button className={cn(btn, ghost, h.md, "text-ink-70")}>버리기</button>
</div>
```

- 저장 성공 시 해당 초안 삭제
- **`localStorage`가 아니라 `sessionStorage`다.** 브라우저를 닫으면 사라진다. 공용 PC에서 콘텐츠 초안이 무기한 남지 않는다
- **상담 신청 데이터와 비밀번호는 어떤 스토리지에도 기록하지 않는다.** 여기 저장되는 것은 공개될 예정인 마케팅 문구뿐이다. → 보안관 확인 요청

### 5.7 미리보기 — 실시간 미리보기를 만들지 않는다

**결정: 인라인 실시간 미리보기 없음. 새 탭으로 공개 페이지를 여는 것 + 타입 견본 두 가지로 대체한다.**

만들지 않는 근거 셋.

1. **유지보수가 섹션 수에 비례해 늘어난다.** 충실한 미리보기는 실제 섹션 컴포넌트를 관리자 안에서 렌더해야 하고, 방법은 (a) 공개 페이지를 iframe으로 띄우고 미저장 상태를 `postMessage`로 주입, (b) 섹션 컴포넌트를 관리자용으로 복제뿐이다. 둘 다 11개 섹션 × 앞으로의 모든 디자인 변경마다 비용을 낸다. 과제가 경고한 "유지보수 두 배"가 정확히 이것이다.
2. **축소 미리보기는 정작 중요한 걸 거짓말한다.** 히어로는 `100svh` 풀블리드, 중간 배너·브랜드 스토리도 풀블리드다. 880px(사실상 700px) 패널에 넣으면 "제목이 몇 줄로 꺾이는가", "흰 글자가 사진 위에서 읽히는가"가 실제와 다르게 나온다. 그리고 그 둘이 여기서 실제로 깨지는 항목이다.
3. **반복 빈도가 낮다.** 대표는 문장을 쓰고 저장하고 확인한다. 한 문장을 20번 다듬는 작업이 아니다.

**대신 이렇게 한다.**

페이지 헤더 오른쪽에 항상 링크를 둔다.

```jsx
{/* 깨끗할 때 */}
<a href={`/#${anchor}`} target="admin-preview" rel="noopener"
   className={cn(btn, secondary, h.md)}>
  공개 페이지에서 보기 <ArrowUpRight className="size-4" />
</a>

{/* 변경이 있을 때 — 저장 후 열지 않으면 옛 내용을 보게 된다 */}
<button className={cn(btn, secondary, h.md)} onClick={saveThenOpen}>
  저장하고 공개 페이지에서 보기 <ArrowUpRight className="size-4" />
</button>
```

- `target="admin-preview"` — **명명된 탭이라 반복 클릭해도 탭이 쌓이지 않고 같은 탭이 갱신된다.** 이름 없는 `_blank`면 열 번 누르면 탭이 열 개다
- `/#<anchor>`로 해당 섹션까지 스크롤된다. `:target { scroll-margin-top }`이 `globals.css:189`에 이미 있다
- 저장 성공 토스트에도 같은 링크를 넣는다
- 앵커가 없는 3개 섹션(중간 배너·브랜드 스토리·원칙 카드)은 `id` 추가가 선행되어야 한다 → §10

**예외 하나 — 타입 견본(`TypeSpecimen`).**

미리보기를 안 만든다고 해서 "흰 글자가 사진 위에서 읽히는가"를 포기할 수는 없다. 이 프로젝트가 이미 한 번 겪은 문제다(DEVNOTE §5).

**흰 글자가 사진 위에 올라가는 4개 섹션에만** 작은 견본을 붙인다: `HERO_SLIDES`, `MID_BANNER`, `BRAND_STORY`, `PRINCIPLES`.

```jsx
<div className="relative aspect-video overflow-hidden rounded-[4px]">
  <Photo src={item.image} tone={item.tone} />
  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/40" />
  {/* ↑ 해당 섹션 컴포넌트의 스크림 클래스를 그대로 복사한다 */}
  <div className="absolute bottom-4 left-4 text-white">
    <p className="c1 tracking-[0.2em] uppercase opacity-90">{eyebrow}</p>
    <h3 className="t1 mt-2">{title}</h3>
  </div>
</div>
<p className="adm-meta mt-1.5 text-ink-70">
  실제 폰트·글자색·사진 위 어둡기입니다. 화면 폭은 실제와 다르므로 줄바꿈은 다를 수 있습니다.
</p>
```

**레이아웃 미리보기가 아니라 타입 견본이다.** 보장하는 것은 두 가지뿐이고, 그 두 가지가 실제로 깨지는 것들이다.
1. 실제 세리프로 이 문자열이 어떻게 보이는가(공백·특수문자·영문 대소문자)
2. 이 사진 위에서 흰 글자가 읽히는가

구현 비용은 `Photo` + 기존 `.t1`/`.c1` 클래스 + 스크림 div 하나다. 새 컴포넌트도 새 토큰도 필요 없다. 나머지 7개 섹션에는 붙이지 않는다 — 흰 글자가 사진 위에 없으므로 얻을 게 없다.
