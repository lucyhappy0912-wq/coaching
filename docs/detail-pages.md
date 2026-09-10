# 상세페이지 레이아웃 시스템 설계

작성: 수진(designer) · 2026-09-10
대상 독자: 선우(frontend) — 이 문서를 읽고 그대로 구현할 수 있어야 한다.
관련 문서: `DEVNOTE.md` 3·4절, `docs/admin-ui.md`

이번 단계는 설계만이다. `globals.css` 를 포함해 코드는 건드리지 않았다. 3절의 CSS는 그대로 붙여 넣으면 되는 형태로 적어 뒀다.

---

## 0. 지금 상태와 이 설계의 범위

라우트가 `/` 하나뿐이고 상세페이지는 0개다. 메뉴·푸터 링크 30여 개가 전부 같은 페이지 앵커를 가리킨다. 지금까지 만든 12개 섹션은 전부 랜딩용이고, **상세페이지의 디자인 언어는 존재하지 않는다.**

만들 페이지는 11개(선택 2개 포함 13개)다. 하나씩 디자인하면 유지보수가 안 되므로 **템플릿 4종 + 블록 라이브러리**로 묶는다.

---

## 1. 랜딩과 상세페이지의 관계 — 가장 중요한 판단

### 1.1 결론 한 줄

> **브랜드를 만드는 것은 여백이 아니라 색·세리프·사진 톤이다. 그래서 여백과 사진 비중은 줄여도 되고, 색·서체·CTA 어휘는 한 톨도 바꾸지 않는다.**

### 1.2 왜 여백을 줄여도 브랜드가 안 깨지는가

랜딩의 80px 여백은 **서로 다른 주제의 섹션을 분리**하는 장치다. 히어로 다음에 대상별 코칭이 오고 그 다음에 가격표가 온다. 주제가 매번 바뀌므로 경계가 강해야 하고, 그 경계를 여백이 만든다.

상세페이지는 반대다. `/coaching/senior` 안의 모든 블록은 **같은 주제의 연속**이다. 여기서 경계를 만드는 것은 여백이 아니라 위계다 — 제목 크기, 좌측 제목 컬럼, 구분선. 위계가 경계를 만드는 곳에 80px를 또 넣으면 그냥 스크롤이 늘어난다.

정리하면 이렇게 읽으면 된다.

> **상세페이지 한 장 전체가 랜딩의 한 섹션에 해당한다.**
> 그래서 80px 규칙은 페이지의 바깥 경계(헤더 아래 / CTA 밴드)에 적용되고,
> 페이지 안쪽 블록 사이는 56/80px 리듬을 쓴다.

이 해석이면 DEVNOTE의 80px 규칙을 어기는 게 아니라 적용 층위를 명시하는 것이 된다. 다만 "블록 리듬"이라는 개념이 DEVNOTE에 없으므로 문장을 추가해야 한다(→ §10).

절감량은 실측 가능한 값이다. 서사형 페이지 기준 블록 경계가 5~6개이고 경계당 160px → 112px(모바일) / 160px → 160px 유지가 아니라 96px 절감(데스크톱). **5개 경계 × 64~80px = 320~400px, 대략 화면 절반**이 줄어든다.

### 1.3 갈라내는 것 / 그대로 두는 것

| 항목 | 랜딩 | 상세 | 근거 |
| --- | --- | --- | --- |
| `@theme` 색 | — | **100% 동일** | 브랜드는 여기서 나온다. 새 색 0개 |
| 서체 · 타이포 스케일 | `.t*` / `.b*` | **100% 동일** | 미사용이던 `.t4` 를 본문 소제목으로 되살린다 |
| 제목 서체 | 세리프 | **세리프 유지** | 페이지 실루엣을 만드는 단계 |
| `.lined` CTA | 주요 CTA | **유지** | 사이트 공통 어휘 |
| 사진 톤 5종 | `Photo` | **유지 + 랜딩 배정 승계** (§4.2) | |
| 히어로 | `100svh` 풀블리드 슬라이더 | **폐기.** 컴팩트 헤더 (§4.1) | 페이지마다 한 화면 낭비 |
| 사진 위 흰 글자 | 4곳(히어로·중간배너·브랜드·원칙) | **금지** (§4.1) | 대비 부채를 11페이지로 늘리지 않는다 |
| 본문 줄길이 | 블록마다 `max-w-xl`/`md`/`sm` 제각각 | **`--measure` 42rem 단일 상한** | §5 |
| 본문 행간 | 160% | **180% (`.reading`)** | 연속 독해 · 시니어 |
| 본문 기본 크기 | `.b3` 15/16 가 흔함 | **`.b2` 16/18 하한** | 읽는 화면이다 |
| 블록 상하 여백 | 64/80px, 예외 64/96 | **56/80px 리듬** | §1.2 |
| `Reveal` | 거의 모든 블록 | **사진·카드·스텝에만.** 산문 금지 | 읽으러 온 사람에게 0.5초 지연 + 16px 이동은 방해다 |
| 가로 스냅 슬라이더 | 모바일 카드 그리드 | **쓰지 않는다.** 세로 스택 | 랜딩은 훑는 화면이라 흘려도 되지만, 상세는 다 읽어야 한다. 가로 스크롤은 항목 누락을 만든다 |
| 브레이크포인트 | 1024 단일 | **`sm`(640) 추가** (§7) | 카드 그리드 전용 |

---

## 2. 라우트와 템플릿 배정

### 2.1 라우트

```
/                          랜딩                            (기존)
/coaching                  대상별 코칭 인덱스   [선택]      T-C 목록형
/coaching/adult            성인 코칭                        T-A 서사형
/coaching/senior           시니어 코칭                      T-A 서사형
/coaching/leadership       리더십 코칭                      T-A 서사형
/program                   프로그램 인덱스     [선택]       T-C 목록형
/program/diagnosis         진단 세션                        T-B 사양형
/program/weekly            주간 코칭                        T-B 사양형
/program/online            온라인 코칭                      T-B 사양형
/about                     브랜드 스토리                    T-A 서사형
/coach                     코치                             T-A 서사형(portrait)
/service                   서비스                           T-C 목록형
/faq                       자주 묻는 질문                   T-C 목록형
/privacy                   개인정보처리방침                 T-D 문서형
```

파일 구조는 `docs/admin-ui.md` §3.2에서 이미 결정한 `(site)` 라우트 그룹 안에 들어간다. 관리자 작업보다 상세페이지가 먼저 진행되면 **라우트 그룹 분리를 여기서 먼저 해야 한다.**

```
src/app/
  layout.tsx              <html> + 폰트 + globals.css + {children}
  (site)/
    layout.tsx            TopBanner + Header + main + Footer  ← 현재 layout.tsx 내용
    page.tsx              랜딩
    coaching/[...]        ...
```

**선택 2개(`/coaching`, `/program`)를 넣자고 제안하는 이유**는 브레드크럼이다. 없으면 `홈 / 프로그램 / 진단 세션` 의 가운데가 링크 없는 텍스트가 되고, 메가메뉴의 `PROGRAM` 그룹 제목도 갈 곳이 없다. 목록형 템플릿을 그대로 쓰므로 추가 비용은 원고뿐이다. → §12

**`/about` 과 랜딩 `#story` 의 이름 충돌.** 랜딩 `#story` 는 StoryTabs(코칭 진행 방식)이고 메가메뉴 라벨도 `Story` 다. 브랜드 스토리 페이지를 `/story` 로 만들면 같은 이름이 두 개가 된다. **URL은 `/about`, 메가메뉴 라벨은 `Story` → `About` 으로 바꾼다.** 진행 방식 3단계는 `/about` 안의 Steps 블록으로 흡수한다. → §12

### 2.2 템플릿 4종

| 템플릿 | 페이지 성격 | 대상 페이지 | 수 |
| --- | --- | --- | --- |
| **T-A 서사형** | 설득. 상황 공감 → 방식 → 다음 행동 | 성인 · 시니어 · 리더십 · 브랜드 · 코치 | 5 |
| **T-B 사양형** | 조회. 얼마 · 몇 번 · 어떻게 | 진단 · 주간 · 온라인 | 3 |
| **T-C 목록형** | 훑기. 같은 형태 항목의 나열 | 서비스 · FAQ (+ 인덱스 2) | 2~4 |
| **T-D 문서형** | 정독. 긴 텍스트 가독성이 전부 | 개인정보처리방침 | 1 |

**코치 페이지에 별도 템플릿을 만들지 않았다.** 블록 구성이 서사형과 같고 헤더 사진 비율만 다르다(세로 인물). 템플릿을 1페이지에 하나 쓰는 것은 템플릿이 아니라 그냥 페이지다. `PageHeader` 의 `variant="portrait"` 하나로 처리한다.

---

## 3. `globals.css` 추가분

아래를 `.c1` 반응형 블록 다음, `.serif` 앞에 넣는다. `.reading` 은 `.b1~.b3` 보다 뒤에 와야 `line-height` 가 덮인다.

```css
/* ═══ 상세페이지 조판 ══════════════════════════════════════
 *
 * 랜딩에는 없던 것들이다. 랜딩 본문은 전부 2~4줄짜리 스캔 텍스트라
 * 블록마다 max-w-xl / max-w-md 를 따로 주는 것으로 충분했다.
 * 상세페이지는 페이지 전체가 읽는 화면이라 상한을 하나로 고정한다.
 */

:root {
  /* 본문 1줄 상한.
   * 한글은 글리프 1자가 거의 1em 이므로 18px 본문에서 42rem(672px) ≈ 37자.
   * 한글 본문이 편한 구간은 30~40자다. 라틴 기준 45~75자를 그대로 쓰면
   * 한글에서는 60자가 넘어가 다음 줄 첫머리를 놓친다(return sweep 실패).
   * 1025px 미만에서는 --gutter 가 먼저 걸려 이 값에 닿지 않는다. */
  --measure: 42rem;
  --measure-narrow: 34rem; /* 리드 문단 · CTA 본문. 3줄 이내로 끊기게 */
  --measure-wide: 60rem;   /* 사양 목록 · 카드 그리드 */
}

/* 이어 읽는 단락. 랜딩 본문(160%)보다 행간을 넓힌다.
 * 근거: 랜딩 본문은 2~4줄이고 여기는 10줄 이상 연속 독해다.
 * 줄이 길고 행간이 좁을수록 return sweep 실패가 늘고,
 * 시니어에게 먼저 나타난다. 줄길이 상한(--measure)과 반드시 짝으로 쓴다. */
.reading {
  line-height: 180%;
}
.reading p + p {
  margin-top: 1.1em;
}

/* 본문 목록 — 랜딩에는 목록 조판이 없었다(CoachBand credentials 는 마커 없는 나열).
 * 마커는 forest-70(4.95:1). forest-50 은 4px 점에서 사라진다. */
.list-dot,
.list-num {
  padding-left: 1.2em;
}
.list-dot > li,
.list-num > li {
  position: relative;
}
.list-dot > li + li,
.list-num > li + li {
  margin-top: 0.55em;
}
.list-dot > li::before {
  content: "";
  position: absolute;
  left: -1em;
  top: 0.72em; /* 180% 행간 첫 줄의 시각 중앙 */
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  background-color: var(--color-forest-70);
}
.list-num {
  counter-reset: item;
}
.list-num > li {
  counter-increment: item;
}
.list-num > li::before {
  content: counter(item) ".";
  position: absolute;
  left: -1.2em;
  color: var(--color-forest-70);
  font-variant-numeric: tabular-nums;
}

/* 인용 — 세리프로 바꿔 본문(산세리프)과 층을 나눈다.
 * 좌측 선은 stem(#6b8b8d, 3.7:1). 텍스트가 아닌 장식 규칙선이므로
 * "stem 은 장식 전용" 규칙에 정확히 해당하는 용법이다. */
.quote {
  border-left: 3px solid var(--color-stem);
  padding-left: 20px;
  font-family: var(--font-serif);
  font-size: 22px;
  line-height: 145%;
  color: var(--color-forest);
}
@media (min-width: 1025px) {
  .quote {
    font-size: 26px;
    padding-left: 28px;
  }
}
```

그리고 **기존 `:target` 규칙을 고쳐야 한다. 이건 지금도 틀린 값이다.**

```css
/* 수정 전 — 배너 높이가 빠져 있다 */
:target {
  scroll-margin-top: calc(var(--header-h) + 24px);
}

/* 수정 후 */
:target {
  /* TopBanner(fixed top-0) 와 Header(fixed top-(--banner-h)) 가 둘 다 화면에 고정돼 있다.
   * 배너 높이를 빼먹으면 앵커 대상이 데스크톱에서 60px 위로 올라가 배너에 가린다. */
  scroll-margin-top: calc(var(--banner-h) + var(--header-h) + 24px);
}
```

문서형 페이지 목차가 이 값에 직접 걸리므로 상세페이지 작업 전에 고친다.

### 3.1 새 클래스를 최소로 유지한 이유

추가한 것은 `--measure` 3종과 `.reading` / `.list-dot` / `.list-num` / `.quote` 뿐이다. 아래는 **만들지 않기로 한 것들**이다.

| 만들려다 만 것 | 대신 쓰는 것 |
| --- | --- |
| 본문 소제목 클래스 | **`.t4`.** 24/20 세리프, 지금 미사용이다. `.t3`(28/22) 아래 한 단이고 `.b1`(20/18)보다 크다. 새 클래스를 만들면 사다리가 두 개가 된다 |
| 구분선 클래스 | `border-forest-20` (Faq 가 이미 쓴다). 본문 안 화제 전환은 `border-ink-15` |
| 캡션 클래스 | `.b3 text-ink-70` |
| 표 스타일 | **표를 만들지 않는다.** §6.3 |
| 다크 섹션 클래스 | `bg-forest text-white`. 컴포넌트 한 곳(`ConsultCta`)에만 있으면 된다 |

---

## 4. 모든 상세페이지의 공통 블록

### 4.1 `PageHeader` — 첫 화면

#### 사진 위에 흰 글자를 올리지 않는다

이게 이 절의 핵심 결정이다. 근거 넷.

1. **사진이 나중에 11장 교체된다.** 랜딩은 사진 위 흰 글자가 4곳(히어로·중간배너·브랜드·원칙)이고, 실제 사진이 들어오면 스크림 농도를 4번 재조정해야 한다는 부채를 이미 지고 있다(DEVNOTE §5). 상세페이지 헤더까지 올리면 부채가 15곳이 된다. 그리고 관리자가 붙으면 **대표가 사진을 갈아끼우는 순간 대비가 깨지는데 아무도 모른다.**
2. **`paper` / `mist` 톤은 45% 스크림에도 3.4:1까지밖에 안 나온다.** 이 프로젝트에서 실측한 값이다. 헤더 사진 톤 배정(§4.2)에 `paper` 가 3장 들어간다.
3. **h1 은 페이지의 유일한 최상위 제목**이고 SEO·스크린리더·인쇄·다크모드 강제 확장까지 모든 경로에서 가장 중요한 텍스트다. 이 한 줄의 대비를 사진 밝기에 의존시킬 이유가 없다.
4. **`AudienceRows` 가 이미 같은 판단을 했다.** 컴포넌트 주석에 "카피는 사진 위가 아니라 사진 옆 흰 배경에 둔다"라고 적혀 있다. 상세페이지가 반대로 가면 사이트 안에 규칙이 두 개가 된다.

**대신 사진을 옆에 둔다.** 흰 배경에 텍스트, 오른쪽에 사진. 사진은 여전히 크게 나오고(데스크톱 456px 폭), 대비 리스크는 0이고, `AudienceRows` 와 같은 문법이라 사이트 안에서 낯설지 않다.

부수 효과로 **헤더 투명/솔리드 문제도 같이 풀린다**(§8.1). 헤더 아래가 항상 흰 배경이므로 고정 헤더를 늘 솔리드로 두면 끝이다.

#### `variant="split"` (기본, 9개 페이지)

```jsx
<section className="pt-[calc(var(--header-h)+24px)] pb-10 lg:pt-[calc(var(--header-h)+40px)] lg:pb-16">
  <Container>
    <Breadcrumb items={crumbs} />

    <div className="mt-7 lg:mt-10 lg:flex lg:items-end lg:gap-12">
      <div className="lg:flex-1">
        <p className="c1 tracking-[0.2em] text-stem uppercase">{eyebrow}</p>
        <h1 className="t1 mt-3 text-balance">{title}</h1>
        <p className="b1 mt-5 max-w-(--measure-narrow) text-ink-90">{lead}</p>
      </div>

      <div className="relative mt-8 aspect-16/9 w-full overflow-hidden lg:mt-0 lg:aspect-3/2 lg:w-[38%]">
        <Photo
          src={photo.src}
          tone={photo.tone}
          alt={photo.alt}
          sizes="(min-width: 1025px) 38vw, 100vw"
          priority
        />
      </div>
    </div>
  </Container>
</section>
```

- `pt` 에 `--header-h` 를 더하는 이유: `Header` 가 `fixed` 라 자리를 차지하지 않는다. `layout.tsx` 의 `main` 은 `pt-(--banner-h)` 만 준다. **이 값을 빠뜨리면 h1 이 헤더 밑으로 들어간다.** `PageHeader` 안에 넣어 두면 페이지마다 잊을 일이 없다
- `lg:items-end` — 텍스트 블록이 사진보다 짧아 아래로 정렬된다. `CoachBand` 와 같은 정렬이다
- eyebrow 는 `stem`(3.7:1) 장식용이다. 흰 배경 위 12~13px 라벨이고 정보를 담지 않는다. 정보가 있는 라벨이면 `forest-70` 으로 올린다
- 리드는 `.b1`(20/18). 3줄 이내로 끊기게 `--measure-narrow`. 본문보다 한 단 크게 두는 이유는 "이 페이지가 무엇인지"를 한 번에 주기 위해서다
- `priority` — LCP 후보다

**실측 높이** (선우가 확인할 값):

| 폭 | 헤더 높이 | 참고 |
| --- | --- | --- |
| 1280 | 약 560px | 랜딩 히어로 `100svh` 대비 약 240px 절감 |
| 768 | 약 600px | |
| 390 | 약 600px | 텍스트 위 / 사진 아래로 쌓여 데스크톱보다 살짝 높다 |
| 320 | 약 640px | h1 2줄 가정 |

#### `variant="plain"` (사진 없음 — `/faq`, `/privacy`, 인덱스 2개)

위와 같되 사진 `div` 를 렌더하지 않고 텍스트 블록에 `max-w-(--measure)` 를 건다. `pb` 를 `pb-8 lg:pb-12` 로 줄인다.

`/privacy` 는 리드 자리에 시행일을 넣는다: `<p className="b3 mt-5 text-ink-70">시행일 2026-00-00</p>`

#### `variant="portrait"` (`/coach`)

`split` 과 같고 사진만 `lg:aspect-4/5 lg:w-[30%]` (모바일 `aspect-4/5`). `lg:items-end` 유지. 인물 사진이라 세로다.

#### 페이지 헤더에 CTA를 넣지 않는다

버튼을 넣으면 (a) 아직 아무 정보도 안 읽은 사람에게 신청을 요구하는 것이고 (b) 하단 CTA 밴드와 중복이고 (c) 헤더가 60px 더 높아진다. 상단 전환은 고정 헤더의 `Consult` 링크와 전화 아이콘이 이미 담당한다.

### 4.2 헤더 사진 톤 배정

**규칙: 그 항목이 랜딩에서 이미 가진 톤을 그대로 승계한다.** 근거는 사진이 없는 지금이 오히려 중요하다 — 랜딩 카드에서 본 그라데이션 색과 상세페이지 헤더 색이 같아야 "같은 것"으로 인지된다. 플레이스홀더 단계에서 이게 유일한 연속성 단서다.

| 페이지 | tone | 출처 |
| --- | --- | --- |
| `/coaching/adult` | `sage` | `AUDIENCES[0].tone` |
| `/coaching/senior` | `paper` | `AUDIENCES[1].tone` |
| `/coaching/leadership` | `forest` | `AUDIENCES[2].tone` |
| `/program/diagnosis` | `sage` | `PROGRAM_CARDS[0].tone` |
| `/program/weekly` | `paper` | `PROGRAM_CARDS[1].tone` |
| `/program/online` | **`mist`** | `PROGRAM_CARDS[2]` 가 `sage` 라 진단과 겹친다. `site.ts` 에서 `mist` 로 바꾼다 → §12 |
| `/about` | `forest` | `BRAND_STORY` 가 forest 밴드 |
| `/coach` | `paper` | `COACH.tone` |
| `/service` | `mist` | 랜딩 대응 없음 |
| `/coaching`, `/program` 인덱스 | `sage` / `paper` | 대표 항목 승계 |
| `/faq`, `/privacy` | — | 사진 없음 |

사진 위에 글자를 안 올리므로 **톤 선택에 대비 제약이 없다.** 미적 판단만 하면 된다. 이게 §4.1 결정의 실질적 이득이다.

### 4.3 `Breadcrumb`

브레드크럼은 **필요하다.** 근거: 페이지가 11개인데 위치 단서가 h1 하나뿐이고, 메가메뉴는 닫혀 있어서 열기 전에는 구조가 안 보인다. 시니어 타깃에서 "뒤로 가는 길"이 브라우저 버튼밖에 없으면 이탈한다.

```jsx
<nav aria-label="현재 위치">
  <ol className="b3 flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-70">
    <li><Link href="/" className="transition-colors hover:text-forest">홈</Link></li>
    <li aria-hidden className="text-ink-30">/</li>
    <li><Link href="/coaching" className="transition-colors hover:text-forest">대상별 코칭</Link></li>
    <li aria-hidden className="text-ink-30">/</li>
    <li><span className="text-forest" aria-current="page">시니어 코칭</span></li>
  </ol>
</nav>
```

- **`.c1`(12/13) 이 아니라 `.b3`(15/16) 을 쓴다.** 시니어 타깃이고 이건 실제로 누르는 링크다. 12px 링크는 터치 실패율이 높다. 비용은 한 줄 24px뿐이다
- 색은 `ink-70`(6.0:1). 구분자 `/` 는 `ink-30`(1.9:1) 장식이라 `aria-hidden`
- 마지막 항목은 링크가 아니고 `aria-current="page"`
- 중간 단계에 페이지가 없으면(인덱스를 안 만들면) 링크 없는 `<span className="text-ink-70">` 으로 렌더한다
- **JSON-LD `BreadcrumbList` 를 같은 컴포넌트에서 함께 출력한다** → 로보

### 4.4 `PageBody` — 본문 래퍼

```jsx
<div className="py-14 lg:py-20">
  <Container>
    <div className="space-y-14 lg:space-y-20">{children}</div>
  </Container>
</div>
```

56/80px 블록 리듬(§1.2). 풀블리드가 필요한 블록(`PhotoBand`)은 `-mx-(--gutter)` 로 컨테이너를 뚫는다.

### 4.5 두 가지 블록 레이아웃

#### `SectionRow` — 제목 왼쪽 / 산문 오른쪽 (산문 전용)

```jsx
<section className="lg:grid lg:grid-cols-[minmax(0,16rem)_minmax(0,var(--measure))] lg:gap-x-16">
  <div>
    {kicker && <p className="c1 tracking-[0.18em] text-stem uppercase">{kicker}</p>}
    <h2 className="t2 mt-3 text-balance lg:mt-0">{title}</h2>
  </div>
  <div className="reading b2 mt-6 text-ink-90 lg:mt-0">{children}</div>
</section>
```

**왜 2열인가.** `Container` 가 최대폭 제한이 없어서 1280px에서 본문을 그대로 흘리면 한 줄이 68자가 된다. 상한을 걸면 오른쪽에 570px가 빈다. 그 자리를 제목이 채우면 세 가지를 동시에 얻는다.

1. 줄길이가 `--measure` 로 고정된다
2. 제목 열만 훑으면 페이지 목차가 된다 — 상세페이지에서 가장 흔한 행동이 "내가 찾는 대목이 어디냐"다
3. 좌측 앵커 비대칭이 유지된다. 본문을 가운데 정렬하면 문서 같아지고 히녹 톤이 끊긴다

폭 검증: 1280px에서 `40(gutter) + 256(제목) + 64(gap) + 672(본문) = 1032`, 오른쪽 여백 208px. 1025px에서는 본문 열이 `minmax(0, ...)` 로 641px까지 줄어든다. 넘치지 않는다.

#### `Block` — 제목 위 / 내용 전폭 (구조물 전용)

```jsx
<section>
  {kicker && <p className="c1 tracking-[0.18em] text-stem uppercase">{kicker}</p>}
  <h2 className="t2 mt-3">{title}</h2>
  {intro && <p className="b2 reading mt-5 max-w-(--measure) text-ink-90">{intro}</p>}
  <div className="mt-8 lg:mt-10">{children}</div>
</section>
```

`Steps` · `SpecList` · `CardGrid` · `PhotoBand` · `Callout` 은 전부 여기 들어간다.

**왜 갈라놨나.** 제목 열은 320px를 쓴다. 산문에서는 그 대가로 줄길이 제어를 얻지만, 3열 카드 그리드에서는 각 칸이 373px → 271px로 줄어들어 카드 본문이 17자/줄이 된다. 구조물은 이미 자체 위계(번호·구분선·사진)가 있어서 제목 열이 필요 없고, **폭이 곧 가독성이다.**

한 페이지 안에서 두 레이아웃이 번갈아 나오는 것은 소음이 아니라 규칙이다: **산문은 왼쪽 제목, 구조물은 위 제목.** 문단이 이어지는 곳과 무언가를 조회하는 곳이 시각적으로 구분된다.

### 4.6 `Steps` — 절차

프로그램 진행 순서, `/about` 의 코칭 3단계에 쓴다.

```jsx
<ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
  {steps.map((s, i) => (
    <li key={s._key} className="border-t border-forest-20 pt-4">
      <span className="c1 tabular-nums tracking-[0.2em] text-forest-70">
        STEP {String(i + 1).padStart(2, "0")}
      </span>
      <h3 className="t4 mt-2.5 text-balance">{s.title}</h3>
      <p className="b3 mt-2.5 text-ink-70">{s.body}</p>
    </li>
  ))}
</ol>
```

- 번호 색 `forest-70`(4.95:1). `stem` 은 정보를 담은 라벨이라 쓰지 않는다
- 칸 사이 연결선을 그리지 않는다. 정보가 없고 반응형에서만 깨진다. 상단 hairline + 번호로 충분하다
- 4단계면 `lg:grid-cols-4`, 3단계면 `lg:grid-cols-3`. 5단계 이상은 `lg:grid-cols-3` 2행
- `Reveal` 을 감싸도 되는 블록이다 (`delay={i * 0.06}`, `Services` 와 같은 값)

### 4.7 `SpecList` — 사양 목록 (`<dl>`)

```jsx
<dl className="max-w-(--measure-wide) border-t border-forest-20">
  {rows.map((r) => (
    <div
      key={r.label}
      className="border-b border-forest-20 py-3.5 lg:grid lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-x-6 lg:py-4"
    >
      <dt className="b3 text-ink-70">{r.label}</dt>
      <dd className="b2 mt-1 text-forest lg:mt-0">{r.value}</dd>
    </div>
  ))}
</dl>
```

320px에서 라벨을 옆에 두면 값 열이 152px로 무너지므로 **1024px 미만에서는 세로 스택**이다. 라벨이 `.b3` 보조색, 값이 `.b2` `forest` 라 스택 상태에서도 위계가 읽힌다.

### 4.8 `CardGrid` / `LinkCard` — 다른 페이지로 보내는 카드

```jsx
<ul className="grid gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
  {items.map((it) => (
    <li key={it.href}>
      <Link href={it.href} className="group block">
        <div className="relative aspect-4/3 overflow-hidden">
          <Photo
            src={it.image}
            tone={it.tone}
            alt=""
            sizes="(min-width:1025px) 30vw, (min-width:640px) 45vw, 100vw"
          />
        </div>
        <h3 className="serif mt-4 text-[19px] lg:text-[22px]">{it.title}</h3>
        <p className="b3 mt-2 text-ink-70">{it.summary}</p>
        <span className="lined b3 mt-4 inline-block transition-opacity group-hover:opacity-60">
          자세히 보기
        </span>
      </Link>
    </li>
  ))}
</ul>
```

- 카드 제목 19/22px는 `Services` · `ProgramTabs` 와 같은 값이다. 랜딩 카드와 같은 물건으로 보여야 한다
- **카드 전체가 링크다.** `LinedLink` 만 링크로 두면 히트 영역이 텍스트 폭뿐이라 터치가 어렵다. `.lined` 는 어포던스 표시로만 남기고 실제 링크는 카드가 받는다
- 사진 `alt=""` — 바로 아래 제목이 같은 내용을 말한다. 중복 낭독을 만들지 않는다

### 4.9 `PageNav` — 다음 페이지 유도

같은 그룹 안 이전/다음 2개. 서사형·사양형에만 붙인다(목록형·문서형은 형제가 없다).

```jsx
<nav aria-label="같은 그룹의 다른 페이지" className="border-t border-forest-20">
  <ul className="grid sm:grid-cols-2">
    <li className="border-b border-forest-20 sm:border-r sm:border-b-0 sm:border-forest-20">
      <Link href={prev.href} className="group block py-6 pr-6 transition-opacity hover:opacity-60">
        <span className="c1 tracking-[0.2em] text-ink-70 uppercase">Previous</span>
        <span className="serif mt-2 block text-[20px] lg:text-[24px]">{prev.label}</span>
      </Link>
    </li>
    <li>
      <Link href={next.href} className="group block py-6 sm:pl-8 sm:text-right">
        <span className="c1 tracking-[0.2em] text-ink-70 uppercase">Next</span>
        <span className="serif mt-2 block text-[20px] lg:text-[24px]">{next.label}</span>
      </Link>
    </li>
  </ul>
</nav>
```

`PageBody` 의 마지막 자식으로 넣는다(`space-y` 가 간격을 준다). 이전/다음이 하나뿐이면 그 칸만 렌더하고 `sm:grid-cols-2` 를 유지해 위치를 고정한다.

**교차 유도는 별도다.** 대상 페이지에서 프로그램 페이지로 보내는 것이 전환에 더 중요하므로, 서사형 본문에 `CardGrid` 「추천 프로그램」 블록을 따로 둔다(§5.1).

### 4.10 `ConsultCta` — 하단 상담 유도

**모든 상세페이지의 마지막 블록.** 단, `/privacy` 는 제외(§6.4).

```jsx
<section className="bg-forest px-(--gutter) py-16 text-white lg:py-20">
  <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
    <div>
      <p className="c1 tracking-[0.2em] text-grass uppercase">Consulting</p>
      <h2 className="t2 mt-3">{title}</h2>
      <p className="b2 mt-4 max-w-(--measure-narrow) text-white/85">{body}</p>
    </div>
    <div className="flex shrink-0 flex-wrap items-center gap-x-8 gap-y-4">
      <PillButton href={ctaHref} variant="white">무료 상담 신청</PillButton>
      <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="lined b2">
        {SITE.phone}
      </a>
    </div>
  </div>
</section>
```

**배경을 `forest` 다크로 한 이유 셋.**

1. **푸터와 붙었을 때 색이 튀지 않는다.** 랜딩 `ConsultSection` 은 `bg-grass-20` 이고 `Footer` 는 `from-white to-grass-20` 그라데이션이다. 상세페이지에서 `grass-20` CTA 뒤에 흰색으로 시작하는 푸터가 오면 세이지 → 흰색 → 세이지로 색이 두 번 뒤집힌다. 다크 밴드 뒤에는 흰색 시작이 자연스럽다
2. **사진이 없으므로 대비 리스크가 0이다.** `MidBanner` · `BrandStory` 와 같은 다크 밴드 어휘를 쓰면서 사진 부채는 지지 않는다
3. 랜딩 `ConsultSection`(폼 포함)과 명확히 다른 물건이라 대표도 관리자에서 헷갈리지 않는다

**대비 검증** (배경 `forest` #003a40):

| 요소 | 값 | 대비 |
| --- | --- | --- |
| eyebrow `grass` | `#9db4ab` | **5.6:1** ✓ |
| h2 · 버튼 `white` | `#ffffff` | **12.5:1** ✓ |
| 본문 `white/85` | 합성 `#d9e1e2` | **9.4:1** ✓ |

> **주의**: 랜딩 eyebrow 색인 `stem`(#6b8b8d)은 `forest` 위에서 **3.4:1** 로 미달이다. 다크 밴드에서는 반드시 `grass` 를 쓴다.

**폼을 복제하지 않는다.** 11개 페이지에 `ConsultForm`(클라이언트 컴포넌트)을 넣으면 모든 페이지가 무거워지고, 트랙 구분 hidden 필드가 페이지마다 달라져 데이브의 검증 로직이 11갈래가 된다.

`ctaHref` 는 prop 으로 받는다. 지금은 `/#consult`, 전용 상담 페이지가 생기면 `/consult?track=senior` 로 한 줄만 바꾼다. → §12

### 4.11 `PhotoBand` — 풀블리드 사진

```jsx
<figure className="-mx-(--gutter)">
  <div className="relative aspect-4/3 sm:aspect-16/9 lg:aspect-auto lg:h-[420px]">
    <Photo src={src} tone={tone} alt={alt} sizes="100vw" />
  </div>
  {caption && <figcaption className="b3 mt-3 px-(--gutter) text-ink-70">{caption}</figcaption>}
</figure>
```

데스크톱에서 `aspect-21/9` 를 쓰면 1280px에서 549px가 되어 한 화면의 3분의 2를 사진이 차지한다. **높이를 420px로 고정**하고 `object-cover` 가 잘라내게 둔다(`Photo` 가 이미 `fill + object-cover` 다). 랜딩 `MidBanner` 가 `min-h-[520px]` 인 것과 대비되는 값이고, 의도적으로 낮췄다 — 랜딩 배너는 그 자체가 목적지고 여기는 문단 사이 호흡이다.

`Reveal` 로 감싸도 되는 블록이다.

### 4.12 `Callout` — 유의사항 박스

```jsx
<div className="max-w-(--measure-wide) border-l-[3px] border-stem bg-grass-10 px-5 py-4 lg:px-6 lg:py-5">
  <p className="b3 font-semibold text-forest">{title}</p>
  <div className="b3 reading mt-2 text-ink-70">{children}</div>
</div>
```

`grass-10` 배경은 `Services` · `Faq` 가 이미 쓴다. `stem` 좌측 선은 장식 규칙선이므로 허용 용법이다. 새 토큰 0개.

---

## 5. 템플릿별 블록 순서

### 5.1 T-A 서사형 — `/coaching/*`, `/about`, `/coach`

```
PageHeader  variant="split"  (coach 는 "portrait")
PageBody
  ① SectionRow  「지금 어떤 상황인가요」      산문 2~3문단
  ② Block       「이렇게 진행합니다」          Steps ×3~4
  ③ PhotoBand                                  풀블리드 (선택)
  ④ SectionRow  「이런 분께 권합니다」          .list-dot
  ⑤ Block       「추천 프로그램」               CardGrid ×2~3 → /program/*
  ⑥ Block       「자주 묻는 질문」              발췌 3개 + /faq 링크 (선택)
  ⑦ PageNav
ConsultCta
```

- ①이 먼저인 이유: 이 페이지에 온 사람은 아직 자기 상황을 코칭 언어로 번역하지 못한 상태다. 방법론(②)을 먼저 놓으면 남 얘기로 읽힌다
- ⑤가 ⑦보다 앞인 이유: 이 페이지의 실질적 다음 행동은 "형제 대상 페이지"가 아니라 "프로그램 고르기"다. `PageNav` 는 관심이 어긋난 사람을 위한 보조 출구다
- `/coach` 는 ①②를 「코치 소개」 산문 + 「자격·경력」 `.list-dot` 로 바꾸고 ⑤를 「추천 프로그램」 대신 「코칭 진행 방식」(`/about`) 링크 1개로 줄인다
- `/about` 은 ②에 코칭 3단계(Clarify · Practice · Review)를 넣는다. 랜딩 `StoryTabs` 의 확장판이다

### 5.2 T-B 사양형 — `/program/*`

```
PageHeader  variant="split"
PageBody
  ① Block       「한눈에 보기」                SpecList  ← 본문 첫 블록
  ② SectionRow  「이 프로그램은」               산문 2문단
  ③ Block       「진행 순서」                   Steps ×3~5
  ④ SectionRow  「포함되는 것 / 포함되지 않는 것」  .list-dot 2열
  ⑤ Callout     「신청 전 확인해 주세요」        일정 변경 · 환불
  ⑥ Block       「다른 프로그램」                CardGrid ×2
  ⑦ PageNav
ConsultCta
```

**①을 맨 앞에 둔 이유가 이 템플릿의 핵심이다.** 프로그램 페이지에 온 사람의 첫 질문은 "얼마 · 몇 번 · 어떻게"다. 서사를 먼저 놓으면 스크롤 비용을 물리고, 그 사람은 이미 대상 페이지에서 설득을 한 번 받고 왔다.

`SpecList` 행 구성(로보·대표 확정 필요):

| 라벨 | 예시 값 |
| --- | --- |
| 대상 | 커리어 전환을 준비하는 성인 |
| 형식 | 1:1 · 대면 또는 화상 |
| 회차 | 주 1회 60분 · 8주 |
| 진행 | 세션 기록 제공 · 세션 사이 점검 |
| 비용 | 상담 후 안내 |
| 신청 | 무료 상담 후 일정 조율 |

현재 가격이 3종 모두 "상담 후 안내"라 6행 중 1행이 비어 있는 셈이다. → §12

### 5.3 T-C 목록형 — `/service`, `/faq`, 인덱스 2개

```
PageHeader  variant="plain" (인덱스는 "split")
PageBody
  ① Prose        리드 1~2문단           max-w-(--measure) .reading .b2
  ② 항목 반복
ConsultCta
```

`PageNav` 없음 — 형제 페이지가 없다.

**`/service` 항목 형태**: `CardGrid` 를 `sm:grid-cols-2 lg:grid-cols-2` 로 쓴다. 4개뿐이라 3열은 마지막 줄이 1개가 되어 깨져 보인다. 각 항목에 `id={service.id}` 를 달아 랜딩 카드에서 `/service#group-session` 으로 딥링크한다.

**`/faq` 항목 형태**: 랜딩 `Faq.tsx` 의 `details/summary` 마크업을 그대로 쓴다. 다만 상세페이지에서는

- 배경 `bg-grass-10` 을 걷어낸다. 랜딩에서는 섹션 구분용이었고 여기서는 페이지 전체다
- `summary` 폭에 `max-w-(--measure-wide)`, 답변 `<p>` 에 `.b2 .reading max-w-(--measure)` — 랜딩은 `.b3 max-w-3xl`(768px)이라 답변이 48자/줄까지 간다. 정독 페이지에서는 상한을 낮춘다
- 문항이 10개를 넘으면 카테고리 소제목(`.t4` + `border-forest-20` 구분)으로 묶는다
- 각 `<details>` 에 `id` 를 달아 다른 페이지에서 개별 문항으로 링크할 수 있게 한다

### 5.4 여백·리듬 요약표

| 위치 | 모바일 | 데스크톱 |
| --- | --- | --- |
| 헤더 상단 (`--header-h` 포함) | +24px | +40px |
| 헤더 하단 | 40px | 64px |
| `PageBody` 상하 | 56px | 80px |
| 블록 사이 | 56px | 80px |
| `SectionRow` 제목 → 본문 | 24px | 가로 64px |
| `Block` 제목 → 내용 | 32px | 40px |
| 문단 사이 | 1.1em | 1.1em |
| `ConsultCta` 상하 | 64px | 80px |
| 푸터 | 기존 그대로 (96/128px) | |

---

## 6. T-D 문서형 — `/privacy`

긴 텍스트 가독성이 전부다. 나머지 템플릿과 공유하는 것은 `PageHeader(plain)` · `Breadcrumb` · `Footer` 뿐이다.

### 6.1 제목 사다리를 한 단 누른다

개인정보처리방침은 조항이 8~12개다. 각 조항 제목에 `.t2`(34px)를 쓰면 페이지가 제목으로 뒤덮인다.

| 역할 | 다른 템플릿 | 문서형 |
| --- | --- | --- |
| 페이지 제목 h1 | `.t1` 40/32 | `.t1` 40/32 (동일) |
| 조항 제목 h2 | `.t2` 34/26 | **`.t3` 28/22** |
| 하위 제목 h3 | `.t3` 28/22 | **`.t4` 24/20** |
| 본문 | `.b2` 16/18 | `.b2` 16/18 (동일) |

본문 크기는 절대 내리지 않는다. 조항 수가 많다고 본문을 `.b3` 로 내리면 정독 페이지에서 하한을 깨는 것이다.

### 6.2 레이아웃

```jsx
<div className="py-12 lg:py-16">
  <Container>
    <div className="lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,var(--measure))] lg:items-start lg:gap-x-16">

      {/* 목차 — 데스크톱 전용 sticky */}
      <nav
        aria-label="문서 목차"
        className="hidden lg:sticky lg:block lg:top-[calc(var(--banner-h)+var(--header-h)+24px)]"
      >
        <p className="c1 tracking-[0.18em] text-stem uppercase">목차</p>
        <ol className="mt-4 space-y-2.5 border-l border-forest-20 pl-4">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="b3 text-ink-70 transition-colors hover:text-forest">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 본문 */}
      <div className="space-y-10 lg:space-y-12">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="border-t border-forest-20 pt-7 lg:pt-9">
            <h2 className="t3">{s.title}</h2>
            <div className="reading b2 mt-4 text-ink-90">{s.content}</div>
          </section>
        ))}
      </div>
    </div>
  </Container>
</div>
```

**목차를 모바일에서 렌더하지 않는 이유.** 10항목 목차는 모바일에서 290px를 문서 앞에 놓는다. 앵커로 점프하면 돌아올 방법이 없어 실제 사용률도 낮다. `<details>` 접이식으로 만들면 데스크톱에서 강제로 펼치는 CSS가 브라우저 지원에 걸리고, 두 벌 렌더하면 스크린리더에 목차가 두 번 나온다. **모바일은 조항 제목(`.t3` 22px)이 충분히 커서 스크롤 스캔이 된다.**

`lg:top-...` 값에 `--banner-h` 를 반드시 포함한다. `TopBanner` 와 `Header` 가 둘 다 `fixed` 다. §3의 `:target` 수정과 같은 이유다.

### 6.3 표를 만들지 않는다

개인정보처리방침에서 표가 필요해 보이는 곳은 「수집 항목 · 목적 · 보유기간」 하나다. 여기서 `<table>` 을 쓰면 320px에서 3열이 성립하지 않고, 해결책은 전부 나쁘다 — 가로 스크롤은 시니어에게 최악이고, 모바일/데스크톱 두 벌 렌더는 스크린리더 중복을 만든다.

**`SpecList`(§4.7) 반복으로 대체한다.** 수집 목적마다 하나씩:

```
── 무료 상담 신청
수집 항목    이름, 연락처, 희망 시간, 상담 내용
수집 목적    상담 일정 조율 및 회신
보유 기간    상담 종료 후 6개월 · 미상담 시 접수일로부터 3개월
```

세로로 읽히고, 320px에서 깨지지 않고, 코드가 한 벌이고, 이미 있는 컴포넌트다.

이 판단으로 **프로젝트 전체에서 `<table>` 이 필요한 곳은 프로그램 3종 비교표 하나만 남는다.** 그건 `/program` 인덱스가 확정되면 그때 설계한다. 지금 표 패턴을 만들 이유가 없다.

### 6.4 문서형에는 `ConsultCta` 를 붙이지 않는다

개인정보처리방침을 읽으러 온 사람에게 필요한 것은 상담 신청이 아니라 **열람·정정·삭제 요청 경로**다. 그리고 그 연락처는 법적 필수 기재사항이기도 하다. 마지막 블록을 이걸로 대체한다.

```jsx
<section className="bg-grass-10 px-(--gutter) py-12 lg:py-16">
  <h2 className="t3">개인정보 보호책임자</h2>
  <div className="mt-6">
    <SpecList rows={[{ label: "성명", value: "..." }, { label: "연락처", value: "..." }]} />
  </div>
</section>
```

그 아래 개정 이력: `.b3 text-ink-70` + `.list-dot`.

### 6.5 개인정보처리방침은 관리자 편집 대상에서 뺀다

법적 문서를 리치텍스트 편집기로 대표가 고치게 하면 (a) 조항 번호와 목록 구조가 깨지고 (b) 개정 이력이 남지 않고 (c) 보안관 검토를 우회한다. **코드 안 상수(`src/lib/legal.ts`)로 두고 개정 시 커밋한다.** 관리자에는 시행일과 마지막 개정일만 읽기 전용으로 표시한다. → §11, §12

---

## 7. 반응형

### 7.1 브레이크포인트

DEVNOTE는 "1024px 단일 기준"이다. 상세페이지는 **`sm`(640px) 을 하나 추가한다.**

- 근거: 1024 단일 기준은 **풀블리드 블록의 선형 스크롤**에 맞는 규칙이었고, 카드 그리드에는 안 맞는다. 640~1024px에서 카드 1열은 사진이 900px 폭까지 늘어나 페이지가 사진 앨범이 된다
- **`md`(768) 가 아니라 `sm`(640) 인 이유**: 768을 쓰면 640~767 구간에서 1열 카드가 그대로 남는다. 그 폭에서 2열이 이미 유효하다. `ProgramTabs.tsx:36` 이 이미 `sm:w-[45%]` 를 쓰고 있어 선례도 있다
- **`sm` 은 카드 그리드·`Steps`·`PageNav` 에만 쓴다.** 산문·`SpecList`·헤더는 `lg` 단일 기준을 유지한다. 산문은 `--measure` 가 먼저 걸려서 브레이크포인트가 필요 없다
- 상세페이지 CSS에서 `--gutter` · `--header-h` · `--banner-h` 는 **읽는다** (관리자와 반대다). 공개 사이트이므로 같은 체계를 쓴다

→ DEVNOTE 갱신 필요 (§10)

### 7.2 템플릿 × 폭

| | 320 | 768 | 1280 |
| --- | --- | --- | --- |
| **PageHeader** | 텍스트 → 사진(16:9) 세로 스택. h1 32px 2줄 | 동일 (사진이 728px 폭) | 텍스트 62% / 사진 38%(3:2) 좌우, 하단 정렬 |
| **SectionRow** | 1열. 제목 → 24px → 본문 | 1열. 본문 폭 728 → `--measure` 미만이라 그대로 | 제목 256 / gap 64 / 본문 672 |
| **Steps** | 1열 스택 | 2열 (`sm`) | 3~4열 |
| **SpecList** | dt 위 / dd 아래 스택 | 동일 | 라벨 160px / 값 나머지 |
| **CardGrid** | 1열 | 2열 (`sm`) | 3열 (`/service` 는 2열) |
| **PhotoBand** | `aspect-4/3` | `aspect-16/9` (`sm`) | 높이 420px 고정 |
| **PageNav** | 세로 2행, 아래 테두리로 분리 | 좌우 2열 (`sm`) | 동일 |
| **ConsultCta** | 세로 스택, 버튼 아래 | 동일 | 좌 텍스트 / 우 버튼, 하단 정렬 |
| **문서형** | 목차 없음. 본문 1열 | 동일 | 목차 240 sticky / 본문 672 |

### 7.3 시니어 기준 — 본문 크기·행간·줄길이

상세페이지는 읽는 화면이라 이 판단이 랜딩보다 중요하다.

| 항목 | 값 | 근거 |
| --- | --- | --- |
| 본문 기본 | **`.b2` 16/18px** | 랜딩은 `.b3`(15/16)이 흔하다. 그건 2~4줄짜리 스캔 텍스트라 허용됐고, 여기는 정독이라 한 단 올린다 |
| 리드 문단 | **`.b1` 18/20px** | 3줄 이내라 줄길이 손해가 작다 |
| 행간 | **180%** (`.reading`) | 랜딩 160%. 연속 독해에서 return sweep 실패가 시니어에게 먼저 나타난다 |
| 줄길이 상한 | **42rem = 18px에서 약 37자** | 한글 편안한 구간 30~40자 |
| 브레드크럼 | **`.b3` 15/16px** | `.c1`(12/13)은 실제 누르는 링크로 너무 작다 |
| 최소 색 | 본문 `ink-90` / 보조 `ink-70` | `ink-60`(4.35:1)은 상세페이지 어디에도 쓰지 않는다 |

**`.b1`(18/20)을 본문 기본으로 올리지 않은 이유.** 320px에서 좌우 거터 20px를 빼면 본문 폭이 280px다. 18px 한글이면 **한 줄 15자**가 되어 줄길이가 무너진다. 줄이 너무 짧아도 return sweep 횟수가 늘어 읽기가 힘들어진다. 16px에서 17자가 320px의 한계이고, 그 대신 행간 180%와 문단 간격으로 부담을 낮춘다.

**320px은 하한이고 최적화 대상이 아니다.** 390px(21자)을 설계 기준으로 잡고, 320px에서는 깨지지 않기만 확인한다.

---

## 8. 네비게이션 영향

### 8.1 `Header.tsx` — 이건 놓치면 글자가 안 보이는 실제 버그다

현재 로직:

```ts
const solid = scrolled || menuOpen;  // scrollY > 40
```

상세페이지에 들어가면 스크롤 0에서 `solid === false` 이므로 헤더가 `bg-transparent text-white` 다. 그 아래는 **흰 배경 페이지 헤더**다. 로고 · Menu · Consult · 아이콘 전부가 흰색 위 흰색이 되어 사라진다. 40px만 스크롤하면 나타나지만, 첫 화면에서 내비게이션이 통째로 안 보인다.

**수정:**

```tsx
"use client";
import { usePathname } from "next/navigation";

const pathname = usePathname();

// 투명 헤더는 100svh 다크 히어로가 있는 랜딩에서만 성립한다.
// 상세페이지는 헤더 아래가 흰 배경이라 투명이면 흰 글자가 사라진다.
const overlayCapable = pathname === "/";
const solid = !overlayCapable || scrolled || menuOpen;
```

```tsx
<header
  className={cn(
    "fixed inset-x-0 top-(--banner-h) z-50 h-(--header-h) transition-colors duration-300",
    solid ? "bg-white/95 text-forest backdrop-blur" : "bg-transparent text-white",
    // 스크롤해서 본문이 헤더 밑으로 지나갈 때만 경계선을 준다.
    // 상세페이지 최상단에서는 페이지 헤더와 같은 흰 배경이라 선이 없는 편이 깨끗하다.
    solid && scrolled && "border-b border-ink-10"
  )}
>
```

- `usePathname()` 을 쓰는 이유: Context provider나 prop 전달 없이 한 줄로 끝나고, `(site)` 레이아웃 구조와 무관하게 동작한다. 나중에 다크 히어로를 가진 상세페이지가 생기면 그때 목록을 배열로 바꾸면 된다
- `transition-colors` 가 남아 있어도 문제없다. 상세페이지에서는 상태가 안 바뀐다

### 8.2 앵커 링크가 전부 죽는다 — 필수 수정

상세페이지에서 `href="#consult"` 는 아무 일도 하지 않는다. 해당 요소가 그 페이지에 없기 때문이다. **현재 사이트 전체의 링크가 이 형태다.**

| 위치 | 현재 | 수정 |
| --- | --- | --- |
| `Header.tsx:56` | `#program` | `/program` (또는 `/#program`) |
| `Header.tsx:71` | `#consult` | `/#consult` (또는 `/consult`) |
| `MENU_GROUPS` 11개 항목 | `#audience-adult` 등 | 실제 라우트 (§2.1) |
| `FOOTER_LINKS` 9개 항목 | `#story` 등 | 실제 라우트 |
| `AUDIENCES[].link` ×3 | `#consult` | `/coaching/{id}` 로 바꾸는 게 맞다 — 랜딩 카드는 상세페이지로 보내는 게 자연스럽다 |
| `PROGRAM_CARDS` CTA (`ProgramTabs.tsx:67`) | `#consult` | `/program/{slug}` |
| `SERVICES[].link` ×4 | `#consult` 등 | `/service#{id}` 또는 유지 |
| `STORY_TABS[].link` ×3 | `#program` 등 | 실제 라우트 |
| `MID_BANNER.cta` · `BRAND_STORY.link` | `#story` | `/about` |
| `CoachBand.tsx:32` | `#consult` | 유지 (랜딩 안 이동) 또는 `/coach` |

**규칙**: 랜딩 안에서 랜딩으로 가는 링크만 `#anchor`, 나머지는 전부 절대 경로.

`site.ts` 를 고치는 작업이므로 **로보 담당**이고, 앵커 목록이 관리자 `AnchorSelect` 의 입력값이므로 **데이브와 함께 확인**해야 한다(§11).

### 8.3 메가메뉴 — 활성 상태 표시

실제 라우트가 되면 활성 표시가 필요하다. 다만 메가메뉴는 **열었을 때만 보이므로** 우선순위가 낮다. 값어치는 "메뉴를 열었을 때 내가 지금 어디 있는지 확인하는 비용이 0이 되는 것"이다.

새 스타일을 만들지 않는다. **이미 있는 `.lined` 를 재사용한다.**

```tsx
const pathname = usePathname();
const active = pathname === item.href || pathname.startsWith(item.href + "/");

<a
  href={item.href}
  aria-current={active ? "page" : undefined}
  className={cn(
    "serif text-[22px] leading-none transition-opacity hover:opacity-50 lg:text-[26px]",
    active && "lined"
  )}
>
```

그룹 제목(`COACHING` 등)에는 표시하지 않는다 — 항목 밑줄만으로 충분하고, 두 곳에 표시하면 무엇이 현재 위치인지 모호해진다.

**메가메뉴 구조 자체는 그대로 둔다.** `MENU_GROUPS` 4개 그룹 / 11개 항목이 라우트 13개를 거의 그대로 덮는다. 다만 `Header.tsx:88` 이 `lg:grid-cols-3` 인데 그룹이 4개라 네 번째가 둘째 줄로 떨어지는 **기존 레이아웃 불일치**가 있다(admin-ui.md §2.2에서 이미 지적). 상세페이지가 생기면 메뉴가 실제 사이트맵이 되므로 이번에 `lg:grid-cols-4` 로 고치는 게 맞다.

**검색 버튼**(`Header.tsx:68`)은 지금 아무 동작이 없다. 페이지가 1개일 때는 무해했지만 13개가 되면 눌러 보는 사람이 생긴다. 동작을 붙이거나 버튼을 뺀다. → §12

### 8.4 브레드크럼 vs 메뉴 활성 표시 — 둘 다 필요한가

**둘 다 필요하다.** 역할이 다르다.

- 브레드크럼은 **항상 보이고** 계층(홈 › 대상별 › 시니어)을 알려주며 **상위로 올라가는 링크**다
- 메뉴 활성 표시는 **열었을 때만 보이고** 형제 항목 중 어디인지를 알려준다

시니어 타깃에서 상시 노출되는 위치 단서가 없으면 안 된다. 브레드크럼이 주, 메뉴 활성 표시가 보조다.

### 8.5 `Footer` — 두 가지만 고치면 그대로 쓴다

1. **링크 href 를 절대 경로로** (§8.2)
2. **개인정보처리방침 링크 추가.** 지금 푸터에 없다. 게시 의무 대상이고 모든 페이지에서 접근 가능해야 한다. `FOOTER_LINKS` 의 `Help` 그룹 맨 아래에 넣는다

레이아웃·여백·그라데이션은 손대지 않는다. `ConsultCta` 를 다크 밴드로 만든 덕분에(§4.10) 푸터 `from-white` 시작이 자연스럽고, `pt-24 lg:pt-32` 도 그대로 성립한다.

---

## 9. 컴포넌트 목록

### 9.1 새로 만들 것 — `src/components/detail/`

| 컴포넌트 | 용도 | 클라이언트 | 비고 |
| --- | --- | --- | --- |
| `PageHeader.tsx` | 페이지 첫 화면 | 서버 | `variant`: `split` / `plain` / `portrait` |
| `Breadcrumb.tsx` | 현재 위치 | 서버 | JSON-LD `BreadcrumbList` 함께 출력 |
| `PageBody.tsx` | 본문 래퍼 (56/80 리듬) | 서버 | |
| `SectionRow.tsx` | 제목 좌 / 산문 우 | 서버 | 산문 전용 |
| `Block.tsx` | 제목 위 / 내용 전폭 | 서버 | 구조물 전용 |
| `Steps.tsx` | 번호 절차 | 서버 | |
| `SpecList.tsx` | `<dl>` 사양 목록 | 서버 | 문서형에서도 재사용 |
| `PhotoBand.tsx` | 풀블리드 사진 + 캡션 | 서버 | `-mx-(--gutter)` |
| `CardGrid.tsx` | 링크 카드 그리드 | 서버 | |
| `PageNav.tsx` | 이전 / 다음 | 서버 | |
| `ConsultCta.tsx` | 하단 다크 CTA 밴드 | 서버 | `href` prop |
| `Callout.tsx` | 유의사항 박스 | 서버 | |
| `DocLayout.tsx` | 문서형 셸 (sticky 목차 + 본문) | 서버 | `/privacy` 전용 |

**전부 서버 컴포넌트다.** 상세페이지에 상태가 필요한 곳은 `/faq` 아코디언(`details/summary` — JS 불필요)뿐이다. 랜딩과 달리 슬라이더·탭이 없다.

### 9.2 그대로 재사용

| 대상 | 어디서 |
| --- | --- |
| `Container` | 모든 페이지. `--measure` 는 안쪽에서 걸므로 `Container` 를 고치지 않는다 |
| `Photo` | 헤더 · `PhotoBand` · `CardGrid`. 톤 배정은 §4.2 |
| `PillButton` | `ConsultCta` (`variant="white"`) |
| `LinedLink` / `.lined` | 본문 링크, 메뉴 활성 표시 |
| `Reveal` | `PhotoBand` · `CardGrid` · `Steps` **만**. 산문 블록에는 걸지 않는다 |
| `cn()` | 당연 |
| `Faq.tsx` 의 `details/summary` 마크업 | `/faq` (배경·폭만 조정) |

### 9.3 고칠 기존 파일

| 파일 | 무엇을 |
| --- | --- |
| `src/app/layout.tsx` | `(site)` 라우트 그룹으로 분리 (admin-ui.md §3.2와 동일 작업) |
| `src/app/globals.css` | §3 추가분 + `:target` 수정 |
| `src/components/layout/Header.tsx` | 투명/솔리드 조건 (§8.1), 앵커 → 라우트, 메뉴 활성 표시, `lg:grid-cols-4` |
| `src/lib/site.ts` | 링크 href 전면 교체, 푸터에 개인정보처리방침, `PROGRAM_CARDS[2].tone` → `mist` — **로보 담당** |

---

## 10. `DEVNOTE.md` 갱신이 필요한 항목

여백·레이아웃 규칙에 예외를 만들면 DEVNOTE를 고쳐야 한다. 이번 설계로 갱신할 것은 다섯 개다.

| # | 위치 | 현재 문장 | 갱신 내용 |
| --- | --- | --- | --- |
| 1 | §3 레이아웃 규칙 | "브레이크포인트 **1024px 단일 기준**" | 상세페이지의 카드 그리드·Steps·PageNav 에 한해 `sm`(640) 추가. 산문·헤더는 1024 단일 유지 (§7.1) |
| 2 | §3 레이아웃 규칙 | "최대폭 제한 없는 풀블리드. `Container` 는 좌우 여백만 담당" | `Container` 는 그대로. 상세페이지 **본문에만** `--measure` 42rem 상한을 안쪽에서 건다 (§3) |
| 3 | §3 레이아웃 규칙 | "섹션 상하 여백 80px(모바일 64px)" | **적용 층위를 명시.** 상세페이지 한 장이 랜딩의 한 섹션에 해당하므로 80px 는 페이지 바깥 경계에 걸리고, 페이지 안쪽 블록 사이는 56/80px 리듬을 쓴다 (§1.2) |
| 4 | `globals.css` 타이포 주석 | "현재 `.t4` 는 미사용" | `.t4` = 본문 소제목 · Steps 항목 제목 · 문서형 h3 으로 용도 확정 |
| 5 | §4 파일 구조 | "`Header.tsx` 히어로 위 투명 → 스크롤 시 흰 배경" | "**`/` 에서만** 투명. 그 외 라우트는 항상 흰 배경" (§8.1) |

추가로 §4 파일 구조에 `src/components/detail/` 13개, §6 결정사항에 "개인정보처리방침 페이지 **없음**" → 설계 완료 상태로 갱신한다.

---

## 11. `docs/admin-ui.md` 에 미치는 영향

페이지가 11개 늘면 관리 화면이 여섯 군데 바뀐다. 지금 갱신하지 않으면 데이브의 모델 작업과 어긋난다.

### (1) §3.1 라우트 · §3.3 사이드바 — 항목이 17개 → 28개가 될 뻔했다

`/admin/sections/*` 11개는 **랜딩 섹션과 1:1** 이었다. 상세페이지 콘텐츠는 이 구조에 안 들어간다. 상세페이지마다 사이드바 항목을 만들면 28개가 되고, §3.3의 결정 근거("17개라 세로 사이드바")와 §3.4의 3그룹 구조가 같이 무너진다.

**권고: 사이드바 항목은 `상세페이지` 하나만 추가한다.**

```
/admin/pages           상세페이지 목록 (11행 표: 제목 · 슬러그 · 이미지 채움 · 마지막 수정)
/admin/pages/[slug]    개별 페이지 편집
```

사이드바 17 → 18개. §3.3·§3.4의 결정이 전부 유지된다. `운영` 그룹 위에 `상세페이지` 단독 항목으로 넣고, 빈 이미지 슬롯이 있으면 §3.4의 `warn` 점을 붙인다.

### (2) §4.5 `AnchorSelect` → `LinkSelect` 로 확장

지금은 `#anchor` 전용이다. 상세페이지가 생기면 링크 대상이 **라우트**가 된다. optgroup 을 나눈다.

```
optgroup「상세 페이지」     /coaching/adult … /faq          (11~13개)
optgroup「랜딩 안 위치」    #hero #audience #program …
optgroup「연락」            __tel / __mail
option  「외부 주소 직접 입력…」
```

**상세 페이지 그룹을 위에 둔다.** 상세페이지가 생기고 나면 대표가 고르는 대상의 대부분이 실제 페이지지 랜딩 앵커가 아니다.

`§4.5` 의 "앵커가 없는 3개 섹션(중간배너·브랜드스토리·원칙카드)에 `id` 추가 필요" 항목은 여전히 유효하다.

### (3) §5.5 소프트 글자수 — 상세 본문은 기준이 다르다

§5.5 표는 "이 박스가 몇 px 이라 몇 자에서 깨진다"가 근거였다. 상세페이지 본문은 `--measure` 42rem 고정이라 박스별 계산이 필요 없고, 대신 **단락 단위** 기준이 맞다.

| 필드 | 권장 | 경고 |
| --- | --- | --- |
| 페이지 h1 | 18자 | 26자 |
| 리드 | 70자 | 110자 (3줄 상한) |
| `SectionRow` 산문 문단 | 300자 | 600자 |
| `Steps[].title` | 14자 | 20자 |
| `Steps[].body` | 50자 | 75자 |
| `SpecList` 값 | 30자 | 50자 |
| 페이지 meta description | 80자 | 160자 |

### (4) §2.1 이미지 인벤토리 — 21개 → 40개 안팎

헤더 사진 9장 + `PhotoBand` 페이지당 0~1장(약 8장) = **38~41개**. `/admin/media` 의 그리드 규모가 두 배가 되고 사이드바 배지 숫자도 그렇다. `max-w-[1200px]` 그리드는 유지 가능하지만 **섹션/페이지별 그룹 헤더**가 필요해진다.

### (5) §2.5 편집 불가 필드에 `slug` 추가

상세페이지의 `slug` 는 라우트 그 자체다. 바꾸면 메뉴·푸터·랜딩 카드의 링크가 전부 죽고 검색 색인도 끊긴다. `.adm-mono text-ink-70` 읽기 전용 + `주소에 쓰이는 값이라 바꿀 수 없습니다`.

### (6) §5.7 미리보기 — 오히려 단순해진다

`target="admin-preview"` + `/#anchor` 였던 것이 `/coaching/senior` 같은 실제 라우트가 된다. `:target` 스크롤 보정에 기댈 필요가 없어진다. §5.7 끝의 "앵커가 없는 3개 섹션" 제약도 상세페이지에는 해당하지 않는다.

### (7) 개인정보처리방침은 관리 대상에서 뺀다

§6.5 참조. `src/lib/legal.ts` 상수 + 커밋으로 관리하고, 관리자에는 시행일·최종 개정일만 읽기 전용 표시.

---

## 12. 대표 확인이 필요한 항목

| # | 항목 | 왜 지금 물어야 하는가 |
| --- | --- | --- |
| **A1** | **상세페이지 11장의 원고를 누가 언제 쓰는가** | **가장 큰 미결이다.** 지금 `site.ts` 에는 페이지당 본문이 2~3문장뿐이다. 서사형 한 페이지를 채우려면 문단 6~8개, 스텝 3~4개, 목록 4~6줄이 필요하다. 원고 없이 템플릿만 구현하면 빈 껍데기 11장이 남는다 |
| **A2** | `/coaching`, `/program` 인덱스 2개를 만드는가 | 브레드크럼 중간 링크와 메가메뉴 그룹 제목의 목적지. 템플릿은 재사용이라 비용은 원고뿐 |
| **A3** | 브랜드 페이지 URL `/about` + 메가메뉴 라벨 `Story` → `About` | 랜딩 `#story`(진행 방식)와 이름이 충돌한다 (§2.1) |
| **A4** | 하단 CTA 목적지: `/#consult` 인가, `/consult?track=` 전용 페이지를 만드는가 | 전용 페이지를 만들면 대상별 트랙을 프리셋할 수 있다. DEVNOTE §6의 "상담 트랙 구분 미구현" 이 여기서 해결되거나 미뤄진다. 데이브 작업 범위에 직결 |
| **A5** | 사진 11장 이상 촬영 계획 | 헤더 9장 + 밴드 8장. 없으면 플레이스홀더 그라데이션으로 오픈한다 |
| **A6** | 프로그램 가격·회차 확정 | 사양형 `SpecList` 6행 중 「비용」이 3개 페이지 모두 "상담 후 안내"다. 그 상태로 페이지를 여는가 |
| **A7** | 개인정보처리방침 원문 | 보안관이 지적한 두 문제(동의 문구가 실제 폼과 불일치 · 미상담 건 파기 시점 미정의)가 먼저 해결돼야 원고를 쓸 수 있다 |
| **A8** | FAQ·서비스를 별도 페이지로 뺄 때 **랜딩 섹션을 남기는가** | 남기면 같은 내용이 두 곳에 있고 관리자에서도 두 벌 편집이 된다. 랜딩은 발췌 3~4개 + "전체 보기" 링크로 줄이는 것을 권한다 |
| **A9** | 헤더 검색 버튼 — 동작을 붙이는가, 빼는가 | 페이지가 13개가 되면 눌러 보는 사람이 생긴다 (§8.3) |
| **A10** | 개인정보처리방침을 관리자 편집 대상에서 제외 | §6.5. 법적 문서를 대표가 직접 고치면 조항 구조가 깨지고 검토를 우회한다 |
| **A11** | 랜딩 카드의 링크를 상세페이지로 돌리는가 | 지금 `AUDIENCES[].link` 는 전부 `#consult` 다. 상세페이지가 생기면 `/coaching/{id}` 로 보내는 게 자연스럽지만, 랜딩에서 바로 신청받는 경로가 하나 줄어든다. 얌얌 의견 필요 |

### 담당 배분

| 담당 | 할 일 |
| --- | --- |
| 선우(frontend) | §3 CSS 추가 · §9.1 컴포넌트 13개 · §9.3 기존 파일 4개 수정 · 라우트 그룹 분리 |
| 로보(content) | 상세페이지 원고 11장 · `site.ts` 링크 전면 교체 · 페이지별 `generateMetadata` · `BreadcrumbList` JSON-LD · 사진 alt |
| 보안관(security) | 개인정보처리방침 원문 · 푸터 링크 · 관리자 편집 제외 판단 |
| 데이브(backend) | `/consult?track=` 여부(A4) · `LinkSelect` 데이터 소스 · 상세페이지 콘텐츠 모델 |
| 얌얌(marketing) | A8 · A11 · `ConsultCta` 카피 |
| 자비스(pm) | 구현 후 320/768/1280 3폭 회귀 점검 |
