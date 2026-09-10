# 다페이지 확장 — 라우팅·콘텐츠 스키마 설계

작성: 데이브(backend) · 2026-09-10 · **설계 문서. 구현 없음.**

원페이지 랜딩(`/` 하나)을 상세페이지 12개 + 법정 고지 1개로 확장하는 라우팅과 데이터 구조를 정한다.
이 문서는 **URL·스키마·링크 계약**만 다룬다. 화면 설계는 `docs/pages-ui.md`(수진), 전환 설계는 `docs/pages-funnel.md`(얌얌)를 따른다. 충돌하면 각 담당 문서가 우선한다.
`docs/admin-architecture.md`(이하 **관리자 설계**)를 이 확장이 어떻게 바꾸는지는 §2.6과 §7에 모았다.

---

## 0. 근거로 삼은 문서

Next.js **16.2.10** 이고 학습 데이터와 다르다. 아래는 전부 `node_modules/next/dist/docs/` 에서 직접 확인했다. 본문에서 `[R1]` 로 참조한다.
관리자 설계의 `[D1]`~`[D18]` 은 그 문서를 그대로 가리킨다(중복 정의하지 않는다).

| 표시 | 문서 경로 (`node_modules/next/dist/docs/` 기준) | 이 문서에서 쓰는 사실 |
| --- | --- | --- |
| R1 | `01-app/01-getting-started/03-layouts-and-pages.md` | 폴더=세그먼트, 중첩 레이아웃, `searchParams` 사용 시 동적 렌더링 전환, `PageProps<'/route'>` 헬퍼 |
| R2 | `01-app/03-api-reference/03-file-conventions/dynamic-routes.md` | `[slug]` 규약, `params` 는 Promise, 유한 집합 param 의 런타임 검증 + `notFound()` 패턴 |
| R3 | `01-app/03-api-reference/03-file-conventions/route-groups.md` | `(group)` 규약, URL 미포함, 경로 충돌·다중 루트 레이아웃 주의사항 |
| R4 | `01-app/01-getting-started/02-project-structure.md` | 파일 규약 전체 목록, 사설 폴더 `_folder`, 메타데이터 파일 위치 |
| R5 | `01-app/03-api-reference/04-functions/generate-static-params.md` | 반환 형식, 빌드 시점 실행, 일부만 프리렌더, 미지정 경로 처리 |
| R6 | `01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md` | 기본값 `true`(미지정 param 은 요청 시 생성), `false` 는 404 |
| R7 | `01-app/03-api-reference/04-functions/generate-metadata.md` | `metadata` 객체 vs `generateMetadata`, `title.template`/`default`/`absolute` 규칙, `metadataBase`, `alternates.canonical`, `robots` 필드 |
| R8 | `01-app/01-getting-started/14-metadata-and-og-images.md` | 서버 컴포넌트 전용, React `cache()` 로 메타데이터·본문 데이터 중복 제거, OG 이미지 파일 규약 |
| R9 | `01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` | `app/sitemap.ts` 규약, `MetadataRoute.Sitemap` 반환 타입, 기본 캐시 동작 |
| R10 | `01-app/03-api-reference/03-file-conventions/01-metadata/robots.md` | `app/robots.ts` 규약, `Robots` 객체 형태 |
| R11 | `01-app/02-guides/json-ld.md` | `layout.js`/`page.js` 안의 `<script type="application/ld+json">`, `<` → `\u003c` 치환, `schema-dts` 언급 |
| R12 | `01-app/03-api-reference/03-file-conventions/not-found.md` | `not-found.js` 는 세그먼트 단위, 루트 `app/not-found.js` 가 미매칭 URL 전부 처리, `global-not-found` 는 실험 |
| R13 | `01-app/01-getting-started/04-linking-and-navigating.md` | 정적 라우트는 전체 프리페치·동적은 생략, `generateStaticParams` 없으면 동적 폴백, 고정 헤더는 `scroll-padding-top` |
| R14 | `01-app/03-api-reference/05-config/02-typescript.md` § Statically Typed Links | `typedRoutes` 로 `href` 정적 검증, **리터럴만 검증되고 비리터럴은 `as Route` 캐스트 필요** |
| R15 | `01-app/03-api-reference/05-config/01-next-config-js/typedRoutes.md` | `typedRoutes` 는 **stable**. `experimental.typedRoutes` 아님 |
| R16 | `01-app/02-guides/caching-without-cache-components.md` § Route segment config | `dynamic` 4가지 값의 의미, `force-static` 의 효과 |

### 이 확장에서 특히 중요한 사실 4가지

1. **`typedRoutes` 는 문자열 **리터럴**만 검증한다.** 비리터럴 문자열은 `as Route` 캐스트가 필요하다 [R14]. 즉 **JSON 저장소에서 읽어온 `href` 문자열은 타입이 보호해 주지 않는다.** 이 한 문장이 §3 설계 전체의 근거다.
2. **`dynamicParams` 기본값은 `true`** 다 — `generateStaticParams` 가 반환하지 않은 slug 도 요청 시 생성된다 [R6]. `false` 로 두면 404다. 관리자가 런타임에 페이지를 추가할 수 있는 구조에서는 이 선택이 결정적이다(§1.6).
3. **`title.template` 은 자식 세그먼트에만 적용된다.** 같은 세그먼트의 `page.js` 에는 적용되지 않고, `title.template` 을 쓰면 `title.default` 가 필수다 [R7]. 지금 `layout.tsx` 가 template 을 쓰고 있으므로 랜딩 제목 처리에 함정이 있다(§4.1).
4. **`searchParams` 를 읽으면 그 페이지는 동적 렌더링이 된다** [R1]. `/consult?track=senior` 를 만들 때 이 비용을 어디에 둘지 결정해야 한다(§3.3).

---

## 1. URL 구조와 라우트 트리

### 1.1 확정 URL 목록

13개 신규 라우트 + 기존 `/`.

| # | URL | 성격 | 데이터 출처 | 색인 |
| --- | --- | --- | --- | --- |
| 0 | `/` | 랜딩 (기존) | `pages.home` + 각 엔티티 티저 | ○ |
| 1 | `/coaching` | 대상별 인덱스 | `pages.coaching.index` + 티저 3개 | ○ |
| 2 | `/coaching/adult` | 성인 코칭 | `pages.coaching.items.adult` | ○ |
| 3 | `/coaching/senior` | 시니어 코칭 | `pages.coaching.items.senior` | ○ |
| 4 | `/coaching/leadership` | 리더십 코칭 | `pages.coaching.items.leadership` | ○ |
| 5 | `/program` | 프로그램 인덱스 | `pages.program.index` + 티저 3개 | ○ |
| 6 | `/program/diagnosis` | 진단 세션 | `pages.program.items.diagnosis` | ○ |
| 7 | `/program/weekly` | 주간 코칭 | `pages.program.items.weekly` | ○ |
| 8 | `/program/online` | 온라인 코칭 | `pages.program.items.online` | ○ |
| 9 | `/about` | 브랜드·스토리 | `pages.about` + `shared.principles` | ○ |
| 10 | `/coach` | 코치 소개 | `pages.coach` | ○ |
| 11 | `/service` | 서비스 | `pages.service` + `shared.services` | ○ |
| 12 | `/faq` | 자주 묻는 질문 | `pages.faq` + `shared.faqs` | ○ |
| 13 | `/consult` | 무료 상담 신청 | `pages.consult` | ○ |
| 14 | `/privacy` | 개인정보처리방침 | **코드 내 정적 문서** (§2.4.8) | ○ |
| — | `/admin/**` | 관리자 (관리자 설계 §5.1) | — | **×** |

`/` 를 포함해 공개 색인 대상 라우트는 15개다.

### 1.2 계층 판단 — 왜 두 그룹만 중첩하는가

**결론: 형제가 있고 인덱스가 필요한 두 묶음(`/coaching/*`, `/program/*`)만 중첩하고, 나머지는 평평하게 둔다.**

중첩한 근거:

- **메가메뉴가 이미 그렇게 묶여 있다.** `MENU_GROUPS` 는 COACHING(3) / PROGRAM(3) / BRAND(4) / 문의(3) 다. 사용자가 보는 정보 구조와 URL 계층이 어긋나면 검색 결과의 경로 표시와 브레드크럼이 사이트 구조를 잘못 설명한다. `/coaching/senior` 는 URL 만으로 자기가 무엇인지 말하고 `/senior` 는 말하지 못한다.
- **인덱스 페이지가 실제로 필요하다.** 푸터에 이미 `Coaching`(`#audience`)과 `Program`(`#program`) 링크가 있고, 헤더 상단에도 `Program` 링크가 있다. 이 링크들이 갈 곳이 필요하다. 중첩하면 `/coaching`, `/program` 이 자연스러운 인덱스가 되고, 평평하게 가면 인덱스 URL 을 따로 발명해야 한다(`/coaching-list` 같은 것).
- **공유 레이아웃 자리가 생긴다.** `coaching/layout.tsx` 에 브레드크럼과 "다른 대상 보기" 형제 내비를 한 번만 쓰면 3개 페이지가 공유한다. 레이아웃은 이동 시 재렌더되지 않으므로 형제 간 이동이 값싸다 [R1].

BRAND 묶음(`/about`, `/coach`, `/service`, `/faq`)을 **중첩하지 않은** 근거:

- "BRAND" 는 메뉴 컬럼 라벨이지 정보 계층이 아니다. `/brand/faq` 는 틀렸다 — FAQ 는 브랜드 콘텐츠가 아니라 운영 안내다.
- `/brand` 인덱스 페이지가 할 말이 없다. 내용 없는 계층 노드를 만들면 크롤러와 사용자 모두에게 빈 페이지를 하나 준다.
- 네 페이지는 구조가 서로 다르다(스토리 산문 / 인물 프로필 / 카드 4개 / Q&A 목록). 공유할 레이아웃이 없으므로 중첩의 이점이 0이다.

`/consult`, `/privacy` 는 단독 라우트다.

**`/about` 이라는 이름을 고른 이유.** 메뉴 라벨은 `Story` 지만 URL 은 `/about` 이다. `#story` 앵커가 랜딩에 그대로 남기 때문에(§3.2) 같은 단어가 서로 다른 목적지를 가리키는 상태를 만들지 않는다 — 이게 지금 `#program` 이 세 항목을 다 받아버리는 문제와 같은 종류의 버그다. 라벨과 URL 이 일치할 필요는 없고, 라우트 참조를 쓰면(§3.1) 라벨 변경이 링크를 깨지 않는다. `/story` 를 원하면 승인 항목 **B1** 에서 바꾼다.

**`leader` → `leadership` 슬러그 개명이 필요하다.** 현재 `AUDIENCES[2].id` 는 `leader` 이고 `#audience-leader` 앵커와 메뉴 `href` 에 결합돼 있다(관리자 설계 §1.2에서 잠금 필드로 지정). `/coaching/leader` 는 URL 로서 어색하다. 식별자를 둘(`id: "leader"`, `slug: "leadership"`)로 늘리는 방법은 쓰지 않는다 — **동일 개체에 식별자가 두 개면 어느 쪽을 써야 하는지 헷갈리는 지점이 코드 전체에 생긴다.** 대신 콘텐츠 계층 이전(§5 S2) 시점에 `id` 값 자체를 `leadership` 으로 바꾼다. 그 시점에 어차피 `id` 부여·`satHours` 개명·토큰 링크 치환을 함께 하므로(관리자 설계 §1.5 M1) 추가 비용이 사실상 없고, 고칠 참조는 `site.ts` 메뉴 1곳과 `AudienceRows.tsx` 앵커 템플릿 1곳뿐이다. **잠금 자체는 유지하고 값만 지금 확정한다.**

### 1.3 동적 라우트로 묶을지 — 묶는다. 단, 조건이 있다

대상 3개와 프로그램 3개를 `[slug]` 로 묶는다. 다만 "구조가 같아서" 가 근거가 아니다.

**진짜 근거: 관리자 편집 비용은 페이지 수가 아니라 스키마 종류 수에 비례한다.**

개별 파일로 6개를 만들면 각 페이지가 자기 필드를 갖게 되고, 관리자 화면도 6개의 서로 다른 폼이 된다. `[slug]` 로 묶으면 페이지 컴포넌트 2개, 관리자 폼 2개(대상용·프로그램용), 데이터 6행이다. 상세페이지를 관리자보다 먼저 만드는 이유가 "페이지 구조가 관리자 스키마를 결정한다" 는 것이므로, 이 판단이 관리자 작업량을 직접 결정한다.

**"페이지마다 내용이 크게 다르면 오히려 복잡해진다" 는 우려는 실재한다.** 해법은 두 가지인데 하나만 고른다.

| 안 | 형태 | 장점 | 단점 | 판단 |
| --- | --- | --- | --- | --- |
| A. 블록 배열 | `body: Block[]`, `Block` 은 `richText \| steps \| faq \| cta …` 유니온. 렌더러가 `type` 으로 분기 | 페이지마다 자유롭게 구성 가능 | 관리자 UI 가 **블록 에디터**가 된다 — 추가·삭제·순서 변경·타입 선택. `docs/admin-ui.md` 가 설계한 필드 기반 폼과 성격이 다르고 난이도가 한 단계 높다 | **미채택** |
| B. 고정 슬롯 | 이름이 정해진 슬롯 8개. 전부 타입이 있고, **비우면 그 섹션이 렌더되지 않는다** | 관리자 폼이 필드 그룹 8개로 끝난다. 스키마가 곧 페이지 골격이라 읽기 쉽다 | 새 종류의 섹션이 필요하면 스키마·렌더러·폼을 함께 고쳐야 한다 | **채택** |

B 를 고른 이유는 하나 더 있다. **블록 배열은 순서가 데이터에 있어서, 관리자가 순서를 망치면 페이지가 망가진다.** 고정 슬롯은 순서가 코드에 있어서 데이터로 망칠 수 없다. 편집자가 한 명이고 페이지 성격이 정해져 있는 사이트에서는 이 제약이 이득이다.

변화(variation)는 슬롯을 비우는 것으로 표현한다. 예: 리더십 페이지만 `facts` 에 "기업 담당자 문의" 항목을 넣고, 시니어 페이지는 `signals` 를 7개 쓰고 성인 페이지는 4개 쓴다. 코드 분기가 0이다.

**단독 페이지 4개(`/about`, `/coach`, `/service`, `/faq`)는 개별 파일로 둔다.** 구조가 서로 달라 하나의 유니온 타입에 넣으면 대부분의 필드가 쓰이지 않는 스키마가 된다. 단 **섹션 프리미티브(`<Steps>`, `<Signals>`, `<Facts>`, `<FaqList>`, `<CtaBand>`)는 공유**한다 — 재사용 단위는 라우트가 아니라 컴포넌트다.

**`/coaching/[slug]` 과 `/program/[slug]` 을 하나의 `/[kind]/[slug]` 로 합치지 않는다.** 이유 셋. (1) `facts` 의 의미가 다르다 — 프로그램은 가격·기간·세션 길이, 대상은 대상 정의·진행 형태. (2) 최상위 동적 세그먼트는 `/about`, `/coach` 같은 정적 라우트와 같은 층에 놓여 라우팅 우선순위를 사람이 추론해야 하는 상태를 만든다. (3) 형제 내비의 의미가 다르다.

### 1.4 라우트 그룹 — `(site)` 와 `(admin)` 둘만 둔다

관리자 설계 §5.1이 이미 정한 구조를 그대로 이어받는다. 루트 `layout.tsx` 는 `html`/`body`/폰트 3종만, 화면 요소(TopBanner·Header·Footer)는 `(site)/layout.tsx` 로 내린다.

**법적 고지 페이지를 위한 `(legal)` 그룹은 만들지 않는다.**

- `/privacy` 가 `(site)` 밖으로 나가면 헤더·푸터가 사라진다. 보안관 PRIV-1 은 처리방침이 **푸터와 동의 체크박스에서 링크**되어야 한다고 요구하는데, 도착한 페이지에 푸터가 없으면 사용자가 돌아갈 길이 없다.
- `(legal)` 그룹이 실제로 주는 것은 "긴 산문용 좁은 측정폭" 하나다. 그건 레이아웃이 아니라 컴포넌트(`<Prose>`)로 해결할 문제다. **레이아웃 차이가 `max-width` 하나뿐인 라우트 그룹은 만들지 않는다.**
- 다중 루트 레이아웃(그룹마다 `<html>`)은 특히 쓰지 않는다. 그룹 간 이동이 전체 페이지 리로드가 되고 [R3], 폰트 3종 설정을 두 벌 유지해야 한다(관리자 설계 §5.1과 같은 판단).

[R3] 의 경로 충돌 주의사항도 지킨다: 어떤 두 그룹도 같은 URL 로 해석되는 페이지를 갖지 않는다. `/` 는 `(site)/page.tsx` 하나뿐이다.

### 1.5 파일 트리

```
src/app/
  layout.tsx                      루트. html/body/폰트/metadataBase/title.template. 화면 요소 없음
  globals.css
  not-found.tsx                   미매칭 URL 전부 [R12]. chrome 없는 최소 화면
  sitemap.ts                      ※ app 루트 [R4, R9]. (site) 안이 아니다
  robots.ts                       ※ app 루트 [R4, R10]
  opengraph-image.*               ※ 도입 시. app 루트 = 전역 기본 OG [R8]

  (site)/
    layout.tsx                    TopBanner + Header + main + Footer  (현재 layout.tsx 에서 이동)
    not-found.tsx                 notFound() 용. chrome 유지 ※실측 필요(§4.5)
    page.tsx                      랜딩 (현재 page.tsx 이동)

    coaching/
      layout.tsx                  브레드크럼 + 형제 내비
      page.tsx                    /coaching 인덱스
      [slug]/page.tsx             대상 3개. generateStaticParams + generateMetadata
    program/
      layout.tsx
      page.tsx                    /program 인덱스
      [slug]/page.tsx             프로그램 3개
    about/page.tsx
    coach/page.tsx
    service/page.tsx
    faq/page.tsx
    consult/page.tsx              폼 전용 페이지. 동적 렌더링(§1.6)
    privacy/page.tsx              정적 문서. metadata 객체 export

    _actions/consult.ts           (관리자 설계 §4.1 그대로)

  (admin)/ …                      관리자 설계 §5.1 그대로
  api/admin/media/route.ts        관리자 설계 §3.2 그대로

src/lib/
  routes.ts                       ★신규. RouteId · ROUTES · href() (§3.1)
  content/
    schema.ts  seed.ts  read.ts  store/…       관리자 설계 §1.3 구조 + 페이지 계층(§2.2)
src/components/
  page-sections/                  ★신규. Hero/Intro/Signals/Steps/Facts/FaqList/CtaBand/Prose
  sections/                       기존 랜딩 섹션
proxy.ts                          관리자 설계 §5.4 그대로. matcher 는 /admin 만
```

`sitemap.ts` / `robots.ts` 위치가 중요하다. 문서는 **`app` 디렉터리 루트**라고 명시한다 [R9, R10]. 라우트 그룹 안에 넣으면 URL 은 같게 나올 수 있지만 규약에서 벗어나므로 루트에 둔다.

### 1.6 정적 생성 전략

`next.config.ts` 가 비어 있어 `cacheComponents` 는 꺼져 있다(관리자 설계 §2.6에서 확인). 따라서 [R16] 의 이전 모델이 적용된다.

| 라우트 | 렌더링 | 근거 |
| --- | --- | --- |
| `/` | **정적 프리렌더 유지** | `getContent()` 가 파일 읽기일 뿐 request-time API 를 쓰지 않는다. 현재와 동일 |
| `/coaching`, `/program`, `/about`, `/coach`, `/service`, `/faq`, `/privacy` | **정적 프리렌더** | 같은 이유 |
| `/coaching/[slug]`, `/program/[slug]` | **`generateStaticParams` 로 빌드 시 프리렌더** | 없으면 요청마다 동적 렌더링으로 폴백한다 [R13]. 프리페치도 생략되거나 부분만 된다 |
| `/consult` | **동적** | 아래 |
| `/sitemap.xml`, `/robots.txt` | 기본 캐시(정적) | "special Route Handler that is cached by default unless it uses a Request-time API" [R9, R10]. `getContent()` 는 request-time API 가 아니다 |
| `/admin/**` | **동적** (강제) | 쿠키를 읽는다. 보안관 P8: 정적 프리렌더 금지, `force-static`·`generateStaticParams` 사용 금지 |

**`generateStaticParams` 는 콘텐츠에서 유도한다.**

```ts
// src/app/(site)/coaching/[slug]/page.tsx
export async function generateStaticParams() {
  const { pages } = await getContent();
  return pages.coaching.order
    .filter((slug) => pages.coaching.items[slug]?.published)
    .map((slug) => ({ slug }));
}
```

**`dynamicParams` 는 설정하지 않는다(기본 `true`).** 이유:

- `false` 로 두면 빌드 시점 목록에 없는 slug 는 404다 [R6]. 관리자가 프로그램을 추가하거나 slug 를 바꾸면 **재빌드 전까지 그 페이지가 404** 가 된다. `revalidatePath` 로는 해결되지 않는다 — 없는 라우트를 무효화할 수는 없다.
- `true` 면 빌드 목록에 없는 slug 도 첫 요청에 생성된다 [R6]. 관리자 저장 → 즉시 접근 가능이라는 흐름이 성립한다.
- 대신 **쓰레기 slug 를 404로 만드는 책임이 페이지 코드로 온다.** [R2] 의 유한 집합 param 검증 패턴을 그대로 쓴다.

```ts
export default async function Page({ params }: PageProps<'/coaching/[slug]'>) {
  const { slug } = await params;                 // params 는 Promise [R2]
  const { pages } = await getContent();
  const page = pages.coaching.items[slug];
  if (!page || !page.published) notFound();      // [R2] assertValidLocale 패턴과 동일
  // …
}
```

`published: boolean` 이 여기서 처음 필요해진다. 관리자가 본문을 채우는 중인 페이지가 URL 로 공개되면 안 된다. `generateStaticParams` 필터와 `notFound()` 두 곳에서 같은 조건을 본다.

**`/consult` 만 동적인 이유.** 보안관 RATE-2 는 폼 렌더 시각을 HMAC 서명한 hidden 값으로 내려보내라고 요구하고, 그 값은 요청 시점에 생성되므로 폼을 담은 페이지가 동적이 된다. 보안관도 같은 문서에서 "이 요건이 랜딩 페이지 전체를 동적으로 만들어서는 안 된다" 고 못박았다. **폼 전용 페이지가 있으면 이 문제가 구조적으로 사라진다** — `/` 는 정적으로 남고 폼은 `<Suspense>` 경계 안의 서버 컴포넌트로, `/consult` 는 처음부터 동적이다. §3.3에서 `/consult` 를 만드는 세 번째 근거가 이것이다.

`generateMetadata` 도 `getContent()` 를 부른다. 본문과 같은 데이터를 두 번 읽지 않도록 `getContent` 가 이미 React `cache()` 로 감싸여 있어야 한다(관리자 설계 §1.3) — [R8] 이 권장하는 바로 그 패턴이다.

---

## 2. 콘텐츠 스키마 확장

### 2.1 현재 구조의 한계

`site.ts` 의 15개 export 는 **섹션 단위 평면 구조**다. 다페이지에서 이게 깨지는 지점은 셋이다.

1. **소속이 표현되지 않는다.** `AUDIENCES[1]` 이 랜딩 섹션의 한 행인지 `/coaching/senior` 의 데이터인지 구분할 방법이 없다.
2. **한 엔티티가 두 화면에 나타난다.** 시니어 코칭은 랜딩 티저이면서 상세페이지다. 지금 구조에는 그 두 역할을 담을 자리가 하나뿐이다.
3. **부분 갱신 경로가 최상위 키뿐이다.** 관리자 설계 §2.1의 `updateSection<K extends SectionKey>` 는 `SiteContent` 의 1층 키만 지목할 수 있다. `pages.coaching.items.senior` 를 지목할 수 없다.

### 2.2 페이지 계층 도입

```
SiteContent
├─ revision: number                       시스템 (관리자 설계 §2.3 낙관적 잠금)
├─ updatedAt: string
├─ site: { … }                            전역 브랜드·연락처·사업자 정보 (기존과 동일 + satHours 개명)
├─ seo:  { defaultTitle, defaultDescription, ogImage }   ★신규. layout.tsx 가 읽는다
├─ topBanner: { messages: string[] }
├─ nav:  { header: NavGroup[], footer: NavGroup[] }      MENU_GROUPS / FOOTER_LINKS 통합
├─ pages
│   ├─ home:     HomePage
│   ├─ coaching: { index: IndexPage, order: Slug[], items: Record<Slug, AudiencePage> }
│   ├─ program:  { index: IndexPage, order: Slug[], items: Record<Slug, ProgramPage> }
│   ├─ about:    AboutPage
│   ├─ coach:    CoachPage
│   ├─ service:  ServicePage
│   ├─ faq:      FaqPage
│   └─ consult:  ConsultPage
└─ shared
    ├─ faqs:       Faq[]          태그 기반 공용 풀 (§2.5)
    ├─ principles: Principle[]    3 고정
    └─ services:   Service[]      4 고정
```

`/privacy` 는 이 문서에 **없다.** §2.4.8 참조.

**배열이 아니라 `order: Slug[]` + `items: Record<Slug, Page>` 로 둔 이유.**

- 부분 갱신 경로가 안정적이다. 배열 인덱스로 지목하면(`items[1]`) 순서를 바꾼 뒤 저장할 때 **다른 항목을 덮어쓴다.** slug 키는 순서와 무관하다.
- 참조 조회가 O(1)이다. `recommendedPrograms: ["weekly"]` 같은 참조(§2.4)를 매번 배열 순회로 찾지 않는다.
- 순서는 별개의 관심사다. 관리자에서 "순서 바꾸기" 는 `order` 만 쓰는 작업이 되어 본문을 건드리지 않는다.

**대가와 대응**: `items[slug]` 가 `undefined` 일 수 있는데 `noUncheckedIndexedAccess` 가 꺼져 있어 **타입이 잡아주지 않는다** — 관리자 설계 §1.4가 이미 지적한 부류의 위험이 여기서 재발한다. 그래서 스키마 검증에 **교차 검증**을 넣는다: `order` 의 집합과 `items` 의 키 집합이 정확히 일치해야 한다. 렌더 코드는 `order.map()` 으로만 순회하고 `Object.values(items)` 를 쓰지 않는다(순서가 보장되지 않는다).

`Slug` 는 `"adult" | "senior" | "leadership"` 처럼 **닫힌 유니온**이다. 프로그램은 `"diagnosis" | "weekly" | "online"`. 이유는 §3.1과 같다 — 이 값이 URL 이 되기 때문에 자유 문자열이면 안 된다.

### 2.3 랜딩 섹션과 상세페이지의 관계 — 결론

**결론: 엔티티는 하나, 문장은 둘. 그리고 두 문장이 같은 내용을 담아야 하는 경우가 0이 되도록 필드 의미를 갈라 놓는다.**

세 가지 안을 비교했다.

| 안 | 형태 | 문제 |
| --- | --- | --- |
| 완전 공유 | 랜딩이 상세 본문을 잘라서(`slice`) 보여준다 | 문장이 중간에서 잘린다. 편집자가 랜딩에서 어떻게 보일지 예측할 수 없다. 그리고 상세 본문의 링크(`/#consult` 같은 경로 포함 앵커)가 랜딩에서 자기 페이지를 가리키는 이상한 링크가 된다 |
| 완전 분리 | 랜딩과 상세가 각자 데이터를 갖는다 | 라벨·제목·이미지가 갈라진다. 메뉴에는 "시니어 코칭", 랜딩에는 "Senior Coaching", 상세 제목에는 또 다른 이름이 되는 사고가 **실제로 가장 흔하다** |
| **채택** | 식별·연결 정보는 공유, 문장은 역할별로 분리 | 아래 |

```
AudiencePage / ProgramPage 공통 골격
├─ slug:      Slug          URL. 잠금 (§1.2)
├─ published: boolean       미공개면 라우트에서 404 (§1.6)
├─ label:     string        "Senior Coaching" — 메뉴·티저·카드·상세 eyebrow 가 전부 이 값을 쓴다
├─ navLabel:  string        메가메뉴용 짧은 라벨 ("Senior")
├─ tone:      PhotoTone     사진 자리 표시 톤
├─ image:     string        대표 이미지. 랜딩 티저·카드·인덱스가 쓴다 (4:3 크롭 전제)
├─ teaser                   ★랜딩 전용
│   ├─ title: string        "경험을 다음 시간에 쓰는 법"
│   └─ body:  string        1~2문장. 클릭하게 만드는 글
└─ page                     ★상세 전용
    ├─ hero:    { title, lead, image, tone }     image 는 풀블리드 전제라 대표 이미지와 별개
    ├─ intro:   { heading, paragraphs: string[] }
    ├─ …                    (§2.4 슬롯 목록)
    └─ seo:     { title?, description?, ogImage? }
```

**공유하는 것과 분리하는 것의 경계 규칙**

- **공유(단일 소스)**: `slug`, `label`, `navLabel`, `tone`, `image`. 이름과 식별자가 갈라지면 메뉴·랜딩·상세가 서로 다른 이름을 말한다. 이건 편집 실수가 아니라 구조의 실패다.
- **분리**: 모든 문장. `teaser.body` 는 **미끼**이고 `page.intro.paragraphs` 는 **설명**이다. 같은 내용일 이유가 없다.
- **금지**: 요약 자동 생성(`body.slice(0, 120)`), 상세 본문을 랜딩에 그대로 재사용, 랜딩 카피를 상세 히어로에 그대로 재사용.

이 규칙의 핵심은 **동기화 의무가 생기지 않는다는 것**이다. "요약본과 전문" 이면 전문을 고칠 때 요약도 고쳐야 하는지 매번 판단해야 한다. "미끼와 설명" 이면 각자 독립적으로 산다. 얌얌의 퍼널 문서가 티저 카피를 다시 쓰더라도 상세 본문은 영향받지 않고, 로보가 상세를 채워도 랜딩 전환율은 흔들리지 않는다.

**이미지만 예외적으로 두 개 둔다.** 대표 이미지(`image`)는 4:3 카드 크롭이고 상세 히어로(`page.hero.image`)는 풀블리드 와이드다. 하나로 쓰면 한쪽이 반드시 잘린다. 비워두면 `Photo` 가 그라디언트 자리 표시로 대체하므로(관리자 설계 §3.4) 처음에는 대표 이미지만 채워도 화면이 성립한다.

### 2.4 페이지별 슬롯 정의

공통 프리미티브를 먼저 정한다. 이 다섯 개가 페이지 8종에서 재사용된다.

```ts
type Paragraphs = string[];                                  // 문단 배열. 개행 파싱 안 함
type Signals  = { heading: string; items: string[] };        // "이런 상황이라면" 불릿
type Steps    = { heading: string; items: { title: string; body: string }[] };
type Facts    = { items: { label: string; value: string }[] };
type Cta      = { heading: string; body: string; link: Link };  // Link 는 §3.1
```

`Paragraphs` 를 배열로 두는 이유: 단일 긴 문자열에 `\n\n` 을 넣고 렌더할 때 쪼개는 방식은 관리자 입력에서 공백 개수가 흔들려 깨진다. 그리고 `dangerouslySetInnerHTML` 로 가는 유혹을 원천 차단한다(보안관 CSP-4).

#### 2.4.1 `AudiencePage.page` — 대상별 3개

| 슬롯 | 타입 | 내용 | 비었을 때 |
| --- | --- | --- | --- |
| `hero` | `{title, lead, image, tone}` | 페이지 제목 + 1문장 | 필수 |
| `intro` | `{heading, paragraphs}` | 이 코칭이 무엇인지 | 섹션 미출력 |
| `signals` | `Signals` | "이런 상황이라면" 4~7개 | 섹션 미출력 |
| `process` | `Steps` | 세션 흐름 | 섹션 미출력 |
| `facts` | `Facts` | 대상 / 진행 형태 / 기간 / 장소 | 섹션 미출력 |
| `detail` | `{heading, paragraphs}` | 본문 (긴 산문) | 섹션 미출력 |
| `recommendedPrograms` | `ProgramSlug[]` | 이 대상에게 맞는 프로그램 | 섹션 미출력 |
| `faqTags` | `string[]` | 공용 FAQ 풀에서 뽑을 태그 (§2.5) | 섹션 미출력 |
| `cta` | `Cta` | 상담 유도 | 필수 |
| `seo` | `{title?, description?, ogImage?}` | 없으면 파생 (§4.2) | 파생 |

`recommendedPrograms` 는 **참조**다. 프로그램 카드 데이터를 복제하지 않는다 — 복제하면 가격을 고칠 때 4곳을 고쳐야 하고 반드시 한 곳을 빠뜨린다. 렌더 시 `pages.program.items[slug]` 의 `label`/`teaser`/`image` 를 읽어 카드를 만든다. 스키마 검증에서 **참조 무결성**을 확인한다(존재하지 않는 slug 를 가리키면 로드 거부).

#### 2.4.2 `ProgramPage.page` — 프로그램 3개

`AudiencePage` 와 같은 슬롯에 아래가 다르다.

| 슬롯 | 타입 | 내용 |
| --- | --- | --- |
| `summary` | `string` | 한 줄 요약 (카드에도 쓰인다) |
| `facts` | `Facts` | **가격 / 1회 시간 / 주기 / 총 기간 / 진행 형태 / 장소** — 프로그램의 핵심 정보 |
| `included` | `{heading, items: string[]}` | 포함 사항 (세션 노트, 중간 점검 등) |
| `forWhom` | `AudienceSlug[]` | 어떤 대상에게 맞는지. 대상 페이지로 되돌아가는 참조 |
| `notes` | `{heading, paragraphs}` | 유의사항 |

`facts.value` 를 구조화된 숫자가 아니라 문자열로 두는 이유: 가격이 `"상담 후 안내"` 로 미확정이고(DEVNOTE §6), `"주 1회 60분"` 처럼 단위가 섞인 값이 대부분이다. 숫자 타입으로 만들면 지금 넣을 수 있는 값이 없다. 가격이 확정되고 정렬·필터가 필요해지면 그때 `price: {amount, currency, note}` 로 분리한다.

**환불·해지 규정은 이번 범위에 넣지 않는다.** 유료 프로그램의 청약철회 고지는 전자상거래법 영역이고, 보안관이 "통신판매업 신고번호 — 해당 여부 미확정 [법률 검토 필요]" 로 남긴 항목과 묶여 있다. 슬롯을 미리 만들어 두면 누군가 지어낸 문구를 채운다.

#### 2.4.3 `IndexPage` — `/coaching`, `/program`

`{ hero: {title, lead, image, tone}, intro?: {heading, paragraphs}, cta: Cta, seo }`.
목록은 `order` + `items[*].teaser` 에서 유도하므로 인덱스가 카드 데이터를 갖지 않는다.

#### 2.4.4 `HomePage` — 랜딩

랜딩은 **자기만 갖는 것**만 소유한다. 섹션 순서는 지금처럼 `page.tsx` 에 코드로 고정한다(§1.3 B 안과 같은 논리).

```
HomePage
├─ hero:       { slides: HeroSlide[] }          기존 HERO_SLIDES
├─ midBanner:  Banner                           기존 MID_BANNER
├─ brandBand:  { tagline, link, tone, image }   기존 BRAND_STORY (풀블리드 다크 밴드)
├─ storyTabs:  { tabs: StoryTab[] }             기존 STORY_TABS — 아래 주의
└─ headings:   Record<SectionKey, { eyebrow?, heading?, sub? }>
                                                섹션별 제목. 지금 컴포넌트에 하드코딩된 문구
```

**`storyTabs`(Clarify / Practice / Review)의 소속 문제.** 현재 이건 "코칭 진행 방식 3단계" 이고 메뉴의 `Story` 와 `#story` 앵커가 이걸 가리킨다. 그런데 브랜드 스토리(`BRAND_STORY`)도 `#story` 로 링크한다 — **한 앵커가 두 개념을 받고 있다.** 정리:

- 랜딩의 3단계 탭은 **랜딩 소유로 유지**한다(`home.storyTabs`). 랜더링 방식(탭 인터랙션)이 랜딩 전용이다.
- `/about` 페이지는 같은 3단계를 **`process: Steps` 로 다시, 더 길게** 쓴다. 데이터를 공유하지 않는다 — §2.3의 "미끼와 설명" 규칙 그대로다.
- 메뉴 `Story` 는 `/about` 으로 간다. `#story` 앵커는 랜딩 내부 이동으로만 남는다(§3.2).

`headings` 를 데이터로 올리는 이유: 지금 "Program", "Our Service" 같은 섹션 제목이 컴포넌트에 하드코딩돼 있어 관리자가 못 바꾼다. 관리자 대상이 "섹션 텍스트 전부"(DEVNOTE 재개 지점)이므로 빠뜨릴 수 없다.

#### 2.4.5 `AboutPage` — `/about`

`{ hero, story: {heading, paragraphs}, process: Steps, principlesHeading: {…}, cta, seo }`.
원칙 3개는 `shared.principles` 를 읽는다(랜딩과 공유. 이유는 §2.5).

#### 2.4.6 `CoachPage` — `/coach`

```
{ hero, profile: { name, role, image, tone, intro: Paragraphs },
  credentials: { heading, items: { label: string; note?: string }[] },
  career?:     { heading, items: { period: string; body: string }[] },
  philosophy:  { heading, paragraphs },
  cta, seo }
```

`credentials` 를 `string[]` 에서 객체 배열로 올린 이유: 자격증과 경력 연수가 지금 한 문자열에 섞여 있다(`"성인·시니어 코칭 ○○년"`). 상세페이지에서는 구분해서 보여야 한다. **DEVNOTE 의 경고를 스키마에 남긴다** — 코치 실명·이력은 미확정이고 현재 값은 플레이스홀더다. `published` 를 `false` 로 두고 시작해서, 확인 전에는 `/coach` 가 404 이도록 한다. 링크가 죽는 것보다 허위 이력이 공개되는 게 나쁘다.

#### 2.4.7 `ServicePage` / `FaqPage` / `ConsultPage`

- `ServicePage`: `{ hero, intro?, cta, seo }`. 항목 4개는 `shared.services` 에서 읽고, 각 항목에 `detail: Paragraphs` 를 추가한다(랜딩 카드는 `body` 한 줄, 상세는 문단). **서비스 항목별 개별 페이지는 만들지 않는다** — 4개는 프로그램이 아니라 부가 서비스고, 각각 한 화면 분량이 안 된다. 그룹 세션·After Care 는 실제 운영 여부도 미확정이다(DEVNOTE §6).
- `FaqPage`: `{ hero, categories: { id, label }[], cta, seo }`. Q&A 본문은 `shared.faqs`.
- `ConsultPage`: `{ hero, notice: Paragraphs, hours: {…}, consent: { version, body, links }, cta? }`. `consent.version` 은 관리자 설계 §4.2의 `consentVersion` 과 짝을 이룬다 — 동의 문구가 데이터에 있으면 버전 관리가 데이터 안에서 닫힌다.

  단 **동의 문구를 관리자 자유 편집으로 열지 않는다.** 보안관 CONS-1~6은 동의 문구가 실제 수집 항목·보유기간·처리방침과 글자 단위로 일치해야 한다고 요구한다. 관리자가 자유롭게 고칠 수 있으면 그 정합성이 첫날에 깨진다. → `consent` 는 스키마에 두되 **관리자 편집 UI 를 만들지 않는다**(읽기 전용 표시 + "변경은 개발자 협의" 안내). 승인 항목 **B6**.

#### 2.4.8 `/privacy` — 콘텐츠 저장소에 넣지 않는다

**개인정보처리방침은 관리자 편집 대상에서 제외하고, 코드 내 정적 문서로 둔다.** `src/app/(site)/privacy/page.tsx` 에 본문을 두고, 사업자 정보 같은 값만 `site.*` 에서 읽는다.

근거:

- 보안관 3.2 의 마지막 경고: "실제로 하지 않는 조치를 적으면 그 자체가 허위 공표이고 사고 시 불리하게 작용한다." 안전조치 서술은 **구현 상태와 연동된 문서**다. 관리자에서 자유 편집 가능하면 코드와 문서가 갈라진다.
- PRIV-2 는 변경 이력 관리를 요구한다. git 커밋 이력이 그 자체로 변경 이력이 된다. JSON 저장소로 옮기면 이력이 `content.json` 커밋에 섞여 처리방침 변경만 추적하기 어려워진다.
- PRIV-4 는 값이 미확정이면 게시하지 말라고 한다. 코드에 있으면 리뷰(자비스·보안관)를 거치지 않고 게시되는 경로가 없다.
- 처리방침은 편집 빈도가 극히 낮다. 관리자 편집의 이점이 없다.

**단 `site.*` 참조는 필수다.** `owner`, `company`, `bizNo`, `addressLine`, `phone`, `email` 을 처리방침 본문에 다시 적으면 관리자에서 전화번호를 바꿀 때 처리방침이 옛 번호를 남긴다. 그리고 **플레이스홀더가 남아 있으면 빌드를 막는 검사**를 넣는다 — `site.owner === "○○○"` 같은 조건을 `privacy/page.tsx` 에서 확인해 개발 환경에서는 경고, 프로덕션 빌드에서는 실패시킨다. 보안관 8절 "배포를 막아야 하는 조건" 2·3번을 코드 레벨 가드로 옮기는 것이다.

### 2.5 공용 풀 — FAQ·서비스·원칙

세 항목만 여러 페이지가 공유한다. 나머지는 전부 소유자가 하나다.

**`shared.faqs` — 태그 기반 풀. 이건 완전 공유가 맞다.**

```ts
type Faq = { id: string; q: string; a: string; tags: string[] };
// tags 예: ["general"], ["audience:senior"], ["program:weekly", "general"]
```

- 랜딩 FAQ 섹션: `tags` 에 `"general"` 인 것 4개
- `/coaching/senior`: `faqTags: ["audience:senior", "general"]` 에 매칭되는 것
- `/faq`: 전부, 카테고리별 그룹

§2.3의 "문장은 분리" 규칙에서 **FAQ 만 예외**다. 이유: 같은 질문에 다른 답이 있으면 그것 자체가 사실 오류다. "상담은 비용이 드나요" 의 답이 랜딩과 상세에서 다르면 신뢰 문제가 된다. 답이 같아야 하는 데이터는 한 곳에 있어야 한다.

태그 문자열이 자유롭다는 문제가 있다 — 오타 하나로 FAQ 가 사라진다. → `tags` 도 닫힌 유니온으로 둔다(`"general" | "audience:adult" | … | "program:online"`). 스키마 검증에서 잡힌다.

**`shared.services`(4 고정) / `shared.principles`(3 고정)** — 랜딩 섹션과 `/service`·`/about` 이 같은 항목을 다른 깊이로 보여준다. 엔티티가 하나이므로 `Service` 에 `body`(랜딩 한 줄)와 `detail`(상세 문단)을 둘 다 둔다. §2.3의 티저/상세 분리와 같은 형태다.

### 2.6 관리자 설계가 바뀌는 지점

이 확장이 `docs/admin-architecture.md` 의 무엇을 바꾸는지 구체적으로 적는다.

#### (1) 편집 단위: 섹션 13개 → 2층 구조 (§1.1, §5.1 변경)

관리자 설계는 "관리자 탭은 섹션과 1:1" 이었다. 이제 페이지가 편집 단위가 된다.

| 층 | 탭 | 대상 |
| --- | --- | --- |
| 전역 | 사이트 정보 / 상단 배너 / 메뉴·푸터 / SEO 기본값 | `site`, `topBanner`, `nav`, `seo` |
| 랜딩 | 히어로 슬라이드 / 중간 배너 / 브랜드 밴드 / 진행 방식 탭 / 섹션 제목 | `pages.home.*` |
| 페이지 | 대상별(3) / 프로그램(3) / 브랜드·스토리 / 코치 / 서비스 / FAQ / 상담 | `pages.*` |
| 공용 | FAQ 풀 / 원칙 / 서비스 항목 | `shared.*` |
| 자산·신청 | 이미지 / 상담 신청 목록 | (변화 없음) |

탭 수가 13 → **약 20**이 되고, 좌측 단일 리스트로는 감당이 안 된다. 2층 내비가 필요하다. **`docs/admin-ui.md` 의 사이드바 설계에 영향이 간다 — 수진에게 전달할 항목이다.**

각 페이지 편집 화면 안은 §2.4의 슬롯이 그대로 필드 그룹이 된다. 슬롯이 고정이므로 폼도 고정이다(§1.3 B 안의 이득이 여기서 회수된다).

#### (2) 저장 단위: `updateSection` 시그니처가 깨진다 (§2.1 변경)

```ts
// 관리자 설계 §2.1 — 최상위 키만 지목 가능
updateSection<K extends SectionKey>(section: K, value: SiteContent[K], expectedRevision: number)

// 변경안 — 열거된 경로만 허용
type ContentPath =
  | "site" | "seo" | "topBanner" | "nav"
  | "pages.home.hero" | "pages.home.midBanner" | "pages.home.brandBand"
  | "pages.home.storyTabs" | "pages.home.headings"
  | "pages.coaching.index" | "pages.coaching.order"
  | `pages.coaching.items.${AudienceSlug}`
  | "pages.program.index" | "pages.program.order"
  | `pages.program.items.${ProgramSlug}`
  | "pages.about" | "pages.coach" | "pages.service" | "pages.faq" | "pages.consult"
  | "shared.faqs" | "shared.principles" | "shared.services";

update(path: ContentPath, value: unknown, expectedRevision: number): Promise<SiteContent>
```

**임의 경로 문자열을 받지 않는다.** 임의 경로를 허용하면 관리자 입력으로 문서의 아무 곳에나 쓸 수 있게 되고, 그건 편의 문제가 아니라 보안 문제다(스키마 파괴·프로토타입 오염). 열거된 경로마다 검증기를 붙여서, 경로가 결정되면 검증기가 결정되게 한다.

Supabase 매핑은 그대로 성립한다: `jsonb_set(doc, '{pages,coaching,items,senior}', $1)`. 관리자 설계 §2.5의 인터페이스 검증 결론은 유지된다. **경로를 slug 키로 지목하기 때문에** 배열 인덱스 기반 `jsonb_set` 의 순서 의존 문제도 발생하지 않는다.

#### (3) 재검증: `revalidatePath("/", "layout")` 한 줄로는 부족하다 (§2.6 변경)

페이지가 15개가 되면 "어디를 무효화할지" 가 결정이 된다.

| 저장 경로 | 무효화 대상 | 근거 |
| --- | --- | --- |
| `site`, `seo`, `nav`, `topBanner` | `revalidatePath("/", "layout")` | 루트 레이아웃(헤더·푸터·`generateMetadata`)이 읽는다 |
| `pages.home.*` | `revalidatePath("/")` | 랜딩만 |
| `pages.coaching.items.senior` | `revalidatePath("/coaching/senior")` + `"/coaching"` + `"/"` | 티저가 인덱스·랜딩에 나온다 |
| `pages.coaching.order` | `revalidatePath("/coaching")` + `"/"` + `"/sitemap.xml"` | 순서·공개 여부가 목록과 사이트맵에 영향 |
| `shared.faqs` | `"/faq"` + `"/"` + 태그를 참조하는 페이지 전부 | 참조 역추적 필요 |
| `shared.services`, `shared.principles` | `"/service"` / `"/about"` + `"/"` | |
| 아무 페이지의 `published` 변경 | 위 + `"/sitemap.xml"` + `revalidatePath("/", "layout")` | 메뉴에도 영향 |

**단순화 판단**: 위 표를 정확히 구현하는 것과 "저장할 때마다 `revalidatePath("/", "layout")`" 를 비교하면, 페이지 15개 규모에서는 **후자가 맞다.** 전체 재생성 비용이 작고(정적 페이지 15개), 참조 역추적 로직의 버그(무효화 누락 → 옛 콘텐츠가 남는다)가 훨씬 비싸다. 표는 페이지가 수십 개로 늘어날 때의 최적화 경로로 남긴다.

**단 `/sitemap.xml` 은 별도로 확인해야 한다.** `revalidatePath("/", "layout")` 이 `sitemap.ts` 의 캐시된 출력까지 무효화하는지는 **문서에서 확인하지 못했다.** [R9] 은 sitemap 이 "special Route Handler that is cached by default" 라고만 말한다. 구현 시 `next build` + `next start` 로 실측하고, 무효화되지 않으면 `revalidatePath("/sitemap.xml")` 을 명시적으로 추가한다. **추측으로 넘기지 않는다.**

#### (4) 이미지 슬롯: 21개 → 약 34개 (§3.4 변경)

| 구역 | 슬롯 |
| --- | --- |
| 랜딩 | 히어로 2 + 중간 배너 1 + 브랜드 밴드 1 + 진행방식 탭 3 = **7** |
| 대상별 | 인덱스 히어로 1 + (대표 1 + 상세 히어로 1) × 3 = **7** |
| 프로그램 | 인덱스 히어로 1 + (대표 1 + 상세 히어로 1) × 3 = **7** |
| `/about` | 히어로 1 + 원칙 3 = **4** |
| `/coach` | 히어로 1 + 인물 1 = **2** |
| `/service` | 히어로 1 + 항목 4 = **5** |
| `/faq`, `/consult` | 히어로 1 + 1 = **2** |
| 합계 | **약 34** |

`listImageSlots(content)` 가 콘텐츠에서 유도하는 설계(§3.4)라 **코드 변경은 없다.** 다만 `/admin/media` 화면이 34개 슬롯을 평면 목록으로 보여줄 수 없다 → **페이지별 그룹화**가 필요하다(수진 전달 항목). 그리고 슬롯 인벤토리 표(§3.4의 비율·오버레이 정보)를 34행으로 다시 써야 하는데, 그건 수진의 `docs/pages-ui.md` 가 레이아웃을 확정한 뒤에 만들 표다. **지금 지어내지 않는다.**

EXIF 노출 표면이 21 → 34로 늘어난다 → 승인 항목 **A4**(`sharp` 재인코딩) 의 우선순위가 올라간다(§7).

#### (5) 마이그레이션 순서: M1/M2 가 재정의된다 (§1.5, §8 변경)

관리자 설계 §1.5 의 M1(데이터 이동) → M2(읽기 전환)는 **섹션 15개 평면 구조 기준**이었다. 이제 M1 의 스키마가 페이지 계층이어야 한다. §5 의 S2 가 M1 을, S3 가 M2 를 대체한다.

§8 의 P1~P3 도 같은 이유로 §5 의 S1~S3 로 교체된다. P4 이후(인증·상담 폼·이미지·섹션 에디터)는 유효하되 P7(섹션 에디터 13개)이 **페이지 에디터 약 20개**로 늘어난다.

#### (6) 환경변수 1개 추가 (§6 변경)

| 이름 | 필수 | 형식 | 용도 |
| --- | --- | --- | --- |
| `SITE_URL` | 빌드 시 | `https://example.com` (뒤 슬래시 없음) | `metadataBase`, `sitemap.ts`, `robots.ts` 의 절대 URL |

**`NEXT_PUBLIC_` 을 붙이지 않는다.** 이 값은 `generateMetadata`·`sitemap`·`robots` 에서만 쓰이고 전부 서버 전용이다. 관리자 설계 §6 의 "`NEXT_PUBLIC_*` 은 하나도 없다" 불변식이 유지된다.

로컬 기본값은 `http://localhost:3100`(DEVNOTE 의 개발 포트). 미설정 시 이 값으로 폴백하고 **프로덕션 빌드에서는 미설정이면 실패**시킨다 — 상대 경로를 `metadataBase` 없이 쓰면 빌드 에러가 나고 [R7], 잘못된 도메인이 사이트맵에 박히면 색인이 망가진다.

`typedRoutes: true` 는 환경변수가 아니라 `next.config.ts` 설정이다(§3.5).

---

## 3. 내부 링크 무결성

### 3.1 콘텐츠에 URL 문자열을 저장하지 않는다 — 라우트 참조를 저장한다

**이게 이 문서에서 가장 중요한 결정이다.**

현재 `site.ts` 에는 `href` 문자열이 36개 있다(앵커 33 + `tel:`/`mailto:` 3). 이 값들이 JSON 저장소로 옮겨가면 상황이 나빠진다.

- **타입이 보호하지 못한다.** `typedRoutes: true` 를 켜도 검증되는 건 **문자열 리터럴**뿐이고, 비리터럴은 `as Route` 캐스트가 필요하다 [R14]. JSON 에서 읽은 값은 언제나 비리터럴이므로, 캐스트를 쓰는 순간 검증을 포기한 것이다. **즉 typedRoutes 만으로는 데이터에 든 링크를 지킬 수 없다.**
- **관리자가 자유 URL 을 입력하면 `javascript:` 스킴이 들어온다.** 보안관 CSP-4 마지막 단락이 이미 지적했다: `href` 값은 화이트리스트 검증이 필요하다.
- 라우트 이름을 바꿀 때 고칠 곳이 데이터 전체에 흩어진다.

```ts
// src/lib/routes.ts
export type RouteId =
  | "home" | "coaching" | "coaching.adult" | "coaching.senior" | "coaching.leadership"
  | "program" | "program.diagnosis" | "program.weekly" | "program.online"
  | "about" | "coach" | "service" | "faq" | "consult" | "privacy";

export type AnchorId =
  | "hero" | "audience" | "program" | "story" | "service" | "coach" | "faq" | "consult";

export type LinkTarget =
  | { kind: "route"; route: RouteId; hash?: AnchorId }
  | { kind: "external"; url: string }        // https:// 만 허용
  | { kind: "tel" }                          // site.phone 에서 파생
  | { kind: "mail" };                        // site.email 에서 파생

export type Link = { label: string; target: LinkTarget };

export const ROUTES: Record<RouteId, { path: string; index: boolean; priority: number }> = {
  home:                   { path: "/",                     index: true, priority: 1.0 },
  coaching:               { path: "/coaching",              index: true, priority: 0.8 },
  "coaching.adult":       { path: "/coaching/adult",        index: true, priority: 0.9 },
  // …
  privacy:                { path: "/privacy",               index: true, priority: 0.3 },
};
```

이게 해결하는 것:

1. **스키마 검증이 곧 링크 검증이다.** `RouteId` 유니온을 벗어난 값은 콘텐츠 로드 시 거부된다. 깨진 링크가 런타임에 도달하지 않는다.
2. **관리자 UI 가 자유 텍스트 입력이 아니라 드롭다운이 된다.** `javascript:` 문제가 구조적으로 사라진다 — 화이트리스트 검증을 따로 짜지 않아도 된다.
3. **라우트 경로 변경이 한 곳이다.** `ROUTES` 만 고치면 데이터·컴포넌트 전부 따라온다.
4. **`ROUTES` 의 값은 리터럴이므로 `typedRoutes` 가 검증한다.** 두 겹이 된다 — 데이터→`RouteId`(런타임 enum), `RouteId`→경로(컴파일 타임 리터럴). 검증되지 않는 구간이 없다.
5. **파생 링크 문제가 깔끔히 풀린다.** 관리자 설계 §1.2는 `"{{site.phone|tel}}"` 같은 **토큰 문법**을 제안했는데, 그건 작은 템플릿 엔진을 만드는 것이다. `{ kind: "tel" }` 이면 문자열 파싱이 없다. **토큰 문법 제안은 폐기한다.**

`href()` 헬퍼가 `LinkTarget` + `site` 를 받아 실제 문자열을 만든다. `hash` 는 대상 라우트가 랜딩일 때만 허용하고(스키마 검증), `/#consult` 처럼 **경로를 반드시 붙인다** — 이게 §2.3에서 "완전 공유" 를 거부한 이유 중 하나다. 순수 해시(`#consult`)를 상세페이지에서 렌더하면 그 페이지엔 해당 요소가 없어 아무 일도 일어나지 않는다.

### 3.2 앵커 → 페이지 전환 매핑

현재 앵커 사용처는 **37곳**이다(데이터 33 + 컴포넌트 하드코딩 4).

| 현재 값 | 사용처 | 전환 후 | 판단 |
| --- | --- | --- | --- |
| `#audience-adult/senior/leader` | 메뉴 COACHING 3항목 | `coaching.adult` / `.senior` / `.leadership` | 상세페이지 존재 → **페이지 링크** |
| `#audience` | 히어로 슬라이드2 CTA, 푸터 `Coaching` | `coaching` | 인덱스로 |
| `#program` | 메뉴 PROGRAM **3항목 전부**, 헤더 상단 `Program`, 푸터 `Program`, 스토리탭 `practice` | 메뉴 3항목 → `program.diagnosis` / `.weekly` / `.online`<br>헤더·푸터 → `program`<br>스토리탭 → `program.weekly` | **§3.4 문제 해결** |
| `#story` | 메뉴 `Story`, 중간배너 CTA, 브랜드 밴드 링크, 서비스 `Session Note` | `about` | 4곳 전부 페이지 링크 |
| `#coach` | 메뉴 `Coach`, 스토리탭 `review` | `coach` | |
| `#service` | 메뉴 `Service`, 푸터 `Service` | `service` | |
| `#faq` | 메뉴 `FAQ` ×2, 푸터 `FAQ` | `faq` | |
| `#consult` | **13곳** (데이터 10 + `ProgramTabs`·`CoachBand`·`Header` 하드코딩 3) | `consult` — 단 랜딩 내부는 예외 | **§3.3** |
| `tel:07000000000` | 메뉴 `전화 문의` (하드코딩, `SITE.phone` 과 우연히만 일치) | `{ kind: "tel" }` | 파생으로 |
| `mailto:`/`tel:` (푸터) | 모듈 평가 시점 문자열 조립 | `{ kind: "mail" }` / `{ kind: "tel" }` | 파생으로 |
| — | 없음 | `privacy` → **푸터에 신규 추가** | 보안관 PRIV-1 필수 |

**앵커로 남는 것은 랜딩 페이지 안에서의 스크롤 이동만이다.** 구체적으로: 랜딩의 `#consult` 섹션 이동, 그리고 상세페이지에 목차가 생기면 그 페이지 안의 앵커. 섹션 `id` 속성 자체는 전부 유지한다(제거할 이유가 없고, `/#program` 형태의 딥링크가 계속 유효하다).

**되돌릴 수 없는 사실 하나**: 프래그먼트는 서버로 전송되지 않으므로 `next.config.ts` 의 `redirects` 로 `/#program` → `/program` 리다이렉트를 만들 수 없다. 외부에 공유된 `/#program` 류 링크는 랜딩의 해당 섹션으로 계속 간다 — 섹션이 남아 있으므로 깨지지 않는다. **이것도 랜딩 섹션을 유지하는 근거다.**

**고정 헤더 오프셋 주의.** 페이지 이동 후 앵커로 스크롤할 때 콘텐츠가 고정 헤더 뒤로 숨는다. [R13] 이 CSS `scroll-padding-top` 을 해법으로 제시한다. `--header-h` + `--banner-h` 를 쓰면 된다. 지금은 `<a href="#…">` 브라우저 기본 동작이라 같은 문제가 있는데 눈에 덜 띈다. **수진 전달 항목.**

**`<a>` → `<Link>` 전환이 필요하다.** 현재 메가메뉴(`Header.tsx:96`)와 푸터(`Footer.tsx:24`)는 raw `<a href>` 다. 같은 페이지 앵커라 문제가 없었지만 페이지 링크가 되면 **클라이언트 사이드 전환과 프리페치를 잃는다** — 매 클릭이 전체 페이지 로드가 된다 [R13]. `Link` 로 바꿔야 한다. 단 `tel:`/`mailto:`/외부 링크는 `<a>` 로 남긴다.

프리페치 관련 판단: 메가메뉴를 열면 링크 10개가 한꺼번에 뷰포트에 들어오고 [R13] 에 따라 전부 프리페치된다. 정적 라우트이므로 전체 프리페치다. 페이지가 가벼워 초기에는 문제없지만, 링크가 늘어나면 `prefetch={false}` 또는 hover 프리페치 패턴을 검토한다 [R13 § Disabling prefetching]. **지금 끄지 않는다** — 프리페치가 메가메뉴의 체감 속도를 만드는 주된 요소다.

### 3.3 `#consult` — `/consult` 페이지를 만들고 랜딩 섹션도 유지한다

**결론: 둘 다 둔다. 폼 컴포넌트는 하나를 공유하고, 데이터는 `pages.consult` 하나다.**

| 안 | 문제 |
| --- | --- |
| 랜딩 앵커만 유지 | 상세페이지 13곳의 CTA 가 "랜딩으로 이동해서 맨 아래로" 가 된다. 사용자는 방금 읽던 페이지를 잃는다. 그리고 폼의 서명 토큰(RATE-2) 때문에 랜딩이 동적화 압력을 받는다 |
| `/consult` 만 두고 랜딩 섹션 제거 | 스크롤로 내려온 사람에게 페이지 이동을 강제한다. 전환 지점을 한 클릭 뒤로 미룬다 |
| **둘 다** | 아래 |

`/consult` 를 만드는 근거 셋:

1. **상세페이지의 CTA 목적지.** 13개 페이지에서 오는 CTA 가 갈 곳이 필요하다.
2. **정적 프리렌더 보존.** 보안관 RATE-2 는 요청 시점 서명 토큰을 요구하고, 그 폼이 랜딩에 있으면 랜딩이 동적화된다. 보안관 스스로 "이 요건이 랜딩 페이지 전체를 동적으로 만들어서는 안 된다" 며 Suspense 경계 트릭을 제안했다. **폼 전용 페이지가 있으면 그 페이지만 동적으로 두면 되고, 랜딩의 Suspense 트릭은 그대로 쓰되 실패해도 `/consult` 라는 정상 경로가 남는다.**
3. **전환 측정.** 상담 신청은 퍼널의 끝이다. URL 이 없으면 도달을 측정할 수 없다. (얌얌 영역이지만 URL 유무는 구조 결정이다)

랜딩 섹션을 유지하는 근거: 위 표 + §3.2 의 "외부에 공유된 `/#consult` 링크가 계속 작동한다".

**트랙 전달.** `/consult?track=senior` 를 허용한다. `searchParams` 를 읽으면 페이지가 동적이 되지만 [R1], `/consult` 는 이미 동적이므로 추가 비용이 0이다. 랜딩 앵커 경로에서는 관리자 설계 §4.2의 hidden 필드 방식을 그대로 쓴다. **두 경로 모두 서버에서 초기값을 결정해 hidden 필드에 넣고, 제출 시 화이트리스트로 다시 검증한다**(보안관 PII-2). `track` 은 개인정보가 아니므로 쿼리스트링에 있어도 PII-15 위반이 아니다.

### 3.4 메가메뉴 프로그램 3항목 문제

지금 `Diagnosis` / `Weekly Coaching` / `Online Coaching` 이 **셋 다 `#program`** 이다. 사용자가 셋 중 무엇을 눌러도 같은 곳으로 간다.

이건 데이터 문제가 아니라 **목적지가 없었던 문제**다. 프로그램 상세페이지 3개가 생기면 그대로 해결된다.

```
PROGRAM  Diagnosis        → { kind:"route", route:"program.diagnosis" }
         Weekly Coaching  → { kind:"route", route:"program.weekly" }
         Online Coaching  → { kind:"route", route:"program.online" }
```

**재발 방지**: 스키마 검증에서 **같은 메뉴 그룹 안에 동일한 `LinkTarget` 이 둘 이상 있으면 거부**한다. 메뉴 항목 두 개가 같은 곳으로 가는 것은 거의 항상 실수이고, 지금 이 사고가 실제로 일어났다는 것이 근거다. 의도적으로 중복이 필요한 경우(푸터 `FAQ` 와 문의 그룹 `자주 묻는 질문`)는 **그룹 단위 검사**이므로 걸리지 않는다.

`PROGRAM_TABS` 의 id(`start` / `core` / `online`)와 프로그램 slug(`diagnosis` / `weekly` / `online`)에 **`online` 이 겹친다.** 다른 이름공간이라 동작은 하지만, 랜딩 탭 필터와 프로그램 페이지가 헷갈린다. 탭 id 를 `filter:start` 처럼 접두어를 붙이거나 탭 라벨을 재검토하는 것이 낫다 — **로보·수진 판단 항목**으로 남긴다.

### 3.5 `typedRoutes` 를 켠다

```ts
// next.config.ts
const nextConfig: NextConfig = { typedRoutes: true };
```

`typedRoutes` 는 **stable** 이다 — `experimental.typedRoutes` 가 아니다 [R15]. `tsconfig.json` 의 `include` 에 `.next/types/**/*.ts` 가 이미 들어 있어(확인 완료) 추가 설정이 필요 없다 [R14].

효과와 한계를 정확히 적는다.

- **효과**: `ROUTES` 맵의 `path` 리터럴, 컴포넌트에 직접 쓰는 `<Link href="/coaching">`, `router.push()` 가 검증된다. 오타가 컴파일 에러다.
- **한계**: 데이터에서 온 문자열은 검증되지 않는다 [R14]. 그래서 §3.1의 라우트 참조 설계가 필요한 것이다. **`typedRoutes` 는 §3.1을 대체하지 않고 보완한다.**
- **실측 필요**: 동적 세그먼트의 구체 값(`"/coaching/adult"`)이 리터럴로 통과하는지. 문서는 "support includes any string literal, including dynamic segments" 라고 하지만 [R14], `ROUTES` 맵이 실제로 컴파일되는지는 `npx tsc --noEmit` 으로 확인한다. 실패하면 `Route<T>` 제네릭 또는 맵 타입을 `Record<RouteId, { path: string; … }>` 로 완화한다(그 경우 §3.1의 4번 이득만 잃고 나머지는 유지된다).

---

## 4. SEO · 메타데이터

### 4.1 계층 구조

현재 `layout.tsx` 는 모듈 평가 시점에 `SITE` 를 읽는 정적 `metadata` 객체다. `getContent()` 가 async 가 되면 이 형태로는 값을 넣을 수 없다(관리자 설계 §1.3이 이미 지적).

**루트 `layout.tsx` → `generateMetadata()`**

```ts
export async function generateMetadata(): Promise<Metadata> {
  const { site, seo } = await getContent();
  return {
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3100"),
    title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
    description: seo.defaultDescription,
    openGraph: { siteName: site.name, type: "website", locale: "ko_KR" },
    alternates: { canonical: "/" },
  };
}
```

- `metadataBase` 는 루트 레이아웃에 두는 것이 표준이고, 하위 세그먼트의 상대 경로가 여기에 합성된다 [R7]. **상대 경로를 `metadataBase` 없이 쓰면 빌드 에러**이므로 [R7] 이 값이 필수다.
- **`title.template` 함정**: template 은 **자식 세그먼트에만** 적용되고 `title.default` 가 필수다 [R7]. 랜딩(`(site)/page.tsx`)은 루트 레이아웃의 자식이므로 template 이 적용된다 → 랜딩이 `title` 을 그냥 문자열로 주면 `코칭 | coaching` 이 된다. 랜딩 제목은 `title: { absolute: … }` 로 template 을 무시시킨다 [R7].
- `(site)/layout.tsx` 에는 metadata 를 두지 않는다. 둘 이유가 없고, template 이 두 층이 되면 추론이 어려워진다.

**각 페이지 → `generateMetadata()`**

정적 `metadata` 객체를 쓸 수 있는 곳은 `/privacy` 하나뿐이다(콘텐츠 저장소를 읽지 않으므로). 나머지는 전부 `generateMetadata`. [R7] 은 "metadata 객체와 generateMetadata 를 같은 세그먼트에서 함께 export 할 수 없다" 고 명시하므로 페이지마다 하나만 쓴다.

### 4.2 페이지별 메타데이터 파생 규칙

관리자가 SEO 필드를 비워두는 것이 기본 상태다. 비었을 때 무엇이 되는지 정한다.

| 필드 | 관리자 입력 있음 | 비었을 때 |
| --- | --- | --- |
| `title` | `seo.title` | 대상·프로그램: `` `${label} — ${page.hero.title}` ``. 단독 페이지: `page.hero.title` |
| `description` | `seo.description` | `teaser.body` (없으면 `page.hero.lead`)를 155자로 자름 |
| `alternates.canonical` | — | `ROUTES[routeId].path` (관리자 편집 대상 아님) |
| `openGraph.images` | `seo.ogImage` | `page.hero.image` → 없으면 `seo.ogImage`(전역) → 없으면 파일 규약 `app/opengraph-image` |
| `robots` | — | 공개 페이지는 지정하지 않음(기본 색인). `/admin/**` 만 `{ index:false, follow:false }` |

description 자동 절단은 §2.3에서 금지한 "요약 자동 생성" 과 달라 보이지만 다르다 — **메타 description 은 화면에 보이는 문장이 아니라 검색 결과용 문자열이고, 관리자가 언제든 덮어쓸 수 있는 파생값**이다. 화면에 잘린 문장이 보이는 일은 없다.

`canonical` 을 관리자에게 열지 않는 이유: 잘못 설정하면 페이지가 색인에서 사라진다. 되돌리기까지 수 주가 걸린다. 라우트에서 파생한다.

### 4.3 구조화 데이터 (JSON-LD)

[R11] 의 방식대로 `page.tsx` 안에 `<script type="application/ld+json">` 을 렌더한다. `next/script` 를 쓰지 않는다(실행 코드가 아니다). **`JSON.stringify(x).replace(/</g, "\\u003c")` 를 반드시 거친다** — 관리자가 편집한 문장이 들어가므로 XSS 경로가 실재한다.

| 라우트 | 타입 | 근거 |
| --- | --- | --- |
| 루트 레이아웃 | **`Organization`** — **단, 사업자 정보 확정 후** | 주소·전화·상호가 플레이스홀더인 동안 넣지 않는다. 허위 구조화 데이터는 보안관 PRIV-3 와 같은 문제이고, 구글이 신뢰도 신호로 쓴다 |
| — | `LocalBusiness` / `ProfessionalService` 는 **보류** | 주소·영업시간이 확정되면 이쪽이 더 정확하다. 지금 `hours` 는 로보가 정한 임시값이다(DEVNOTE §6) |
| `/program/[slug]` | **`Service`** | `Product` 는 물리 상품 문법이다. 가격이 `"상담 후 안내"` 이므로 `offers` 를 넣지 않는다 — 가격 없는 `offers` 는 구조화 데이터 오류다 |
| `/coach` | **`Person`** | 실명·이력 확정 후. 미확정 동안 `published:false` 이므로 자연히 나가지 않는다 |
| `/faq` | **`FAQPage`** | Q&A 가 실제로 화면에 보여야 유효하다. `/faq` 는 전체를 표시하므로 조건 충족. **상세페이지의 부분 FAQ 에는 넣지 않는다** — 같은 Q&A 가 여러 URL 에서 `FAQPage` 로 선언되면 중복 신고 대상이다 |
| `/about` | `AboutPage` | 가벼운 이득. 우선순위 낮음 |
| 중첩 라우트 전부 | **`BreadcrumbList`** | `/coaching/senior` 의 계층을 검색 결과에 노출. `ROUTES` 에서 자동 생성 가능 |

**타입 안전성**: `schema-dts` 를 devDependency 로 넣으면 JSON-LD 객체가 타입 검증된다 [R11]. 런타임 의존성이 아니고 번들에 들어가지 않는다. 다만 의존성 추가이므로 승인 항목 **B7** 로 올린다. 없어도 성립한다.

### 4.4 `sitemap.ts` / `robots.ts`

**둘 다 필요하다.** 페이지가 15개가 되면 크롤러가 내부 링크만으로 전부 찾을 것이라고 가정할 수 없고, 관리자 경로 차단이 명시적으로 필요하다(보안관 SEO-1~SEO-6).

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const base = siteUrl();
  return listPublicRoutes(content)              // ROUTES 에서 index:true + published 인 것만
    .map((r) => ({
      url: `${base}${r.path}`,
      lastModified: content.updatedAt,
      changeFrequency: "monthly",
      priority: r.priority,
    }));
}
```

반환 타입은 `MetadataRoute.Sitemap` 이고 `url` / `lastModified` / `changeFrequency` / `priority` 형태다 [R9].

**보안관 SEO-4 는 "파일시스템을 훑어 자동 생성하지 말고 공개 라우트를 손으로 나열하라" 고 요구한다.** 이 설계는 그 요구를 만족한다 — `ROUTES` 는 **명시적 레지스트리**이고 파일시스템 스캔이 아니다. 그리고 손으로 나열하는 방식보다 안전하다: 새 라우트를 만들면 `RouteId` 추가가 컴파일 에러로 강제되고, 그 순간 `index` 를 정해야 한다. 손으로 나열하는 목록은 새 페이지를 추가할 때 조용히 누락된다. `/admin/**` 는 `ROUTES` 에 **아예 넣지 않는다.**

`published:false` 인 페이지는 사이트맵에서 빠진다 — `generateStaticParams` 필터와 같은 조건을 쓴다(§1.6).

```ts
// src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
```

`/admin` 과 `/admin/` 을 **둘 다** 적는다 — 보안관 P2·SEO-1·SEO-3 이 반복해서 지적하는 함정이다(`/admin/:path*` 만 쓰면 `/admin` 정확히 그 경로가 빠진다).

`robots.ts` 는 콘텐츠를 읽지 않으므로 `getContent()` 를 호출하지 않는다 — 캐시 무효화 대상이 하나 줄어든다.

**주 차단 수단은 헤더다.** 보안관 SEO-1 은 `next.config.ts` 의 `headers()` 로 `/admin` 에 `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` 을 붙이라고 요구한다. `robots.txt` 는 색인을 완전히 막지 못하므로 보조 수단이다. 관리자 레이아웃의 `metadata.robots` 는 세 번째 안전망(SEO-2, [R7] 의 `robots` 필드).

### 4.5 `not-found`

- **`src/app/not-found.tsx`** — 미매칭 URL 전부를 처리한다 [R12]. 루트 레이아웃에 화면 요소가 없으므로(§1.4) 헤더·푸터 없는 최소 화면이 된다. `/` 로 돌아가는 링크와 주요 라우트 3~4개를 직접 렌더한다.
- **`src/app/(site)/not-found.tsx`** — `notFound()` 가 `(site)` 서브트리에서 던져질 때(§1.6의 잘못된 slug) 헤더·푸터를 유지한 404를 보여준다. `not-found.js` 는 세그먼트 단위이므로 [R12] 라우트 그룹 세그먼트에서도 동작할 것으로 읽히지만 **실측이 필요하다.** 동작하지 않으면 루트 하나로 통합한다.
- **`global-not-found.js` 는 쓰지 않는다.** `experimental.globalNotFound` 플래그가 필요하고 [R12], 루트 레이아웃이 하나이므로 그것이 해결하는 문제(다중 루트 레이아웃)가 우리에게 없다.
- 404 응답에는 Next 가 `<meta name="robots" content="noindex" />` 를 자동으로 넣는다 [R12]. 추가 작업 없음.

---

## 5. 마이그레이션 순서

### 5.1 순서를 정하는 제약

세 가지가 서로 당긴다.

1. **"상세페이지를 관리자보다 먼저"** (대표 지시) — 페이지 구조가 관리자 스키마를 정하기 때문.
2. **콘텐츠 계층 전환은 상세페이지보다 먼저** 와야 한다. 상세페이지 13개를 `site.ts` 하드코딩으로 만들면 나중에 전부 다시 전환해야 한다. 13개를 두 번 만지는 비용이 압도적이다.
3. **깨진 링크가 한 순간도 존재해서는 안 된다.** 링크를 페이지 링크로 바꾸는 시점에 대상 페이지가 이미 있어야 한다.

1과 2는 충돌하지 않는다 — "관리자보다 먼저" 는 **관리자 UI**(관리자 설계 P4~P7)보다 먼저라는 뜻이고, 콘텐츠 스키마·저장소(P1~P3)는 관리자 UI 가 아니라 상세페이지의 전제다.

3이 순서를 결정한다: **라우트 골격(빈 페이지)을 만든 뒤에 링크를 바꾼다.** 반대로 하면 링크 전환 커밋과 페이지 생성 커밋 사이에 404가 존재한다.

### 5.2 단계

한 번에 다 만들지 않는다. 단 **쪼개는 기준은 페이지가 아니라 "무엇이 동작하는지"** 다. 페이지 단위로 쪼개면(`/coaching/adult` 먼저, `/coaching/senior` 나중) 메뉴 항목 절반이 404인 상태가 며칠씩 유지된다. 그래서 **라우트는 전부 한 번에, 콘텐츠는 페이지별로** 채운다.

| 단계 | 내용 | 담당 | 완료 시 동작해야 하는 것 |
| --- | --- | --- | --- |
| **S0** | 이 문서의 승인 항목 확정 (§6). 산출물 없음 | 대표 | — |
| **S1** | 라우트 레지스트리 + 라우트 그룹 이동 + 설정<br>`src/lib/routes.ts`, `(site)/` 로 `layout.tsx`·`page.tsx` 이동, `typedRoutes: true`, `SITE_URL` | 데이브 | **URL·화면 변화 0.** `/` 정적 프리렌더 유지, 기존 앵커 전부 동작. `npx tsc --noEmit` + `npm run build` 통과 |
| **S2** | 콘텐츠 스키마 + 시드 (페이지 계층). 상세 본문은 빈 슬롯<br>`schema.ts`, `seed.ts`, `content-init` 스크립트. `leader`→`leadership` 개명, 링크를 `LinkTarget` 으로 변환 | 데이브 | **화면 변화 0.** `site.ts` 대비 값 누락 0(대조 스크립트). 시드가 스키마 검증 통과. 교차 검증(`order`↔`items`, 참조 무결성, 메뉴 중복) 동작 |
| **S3** | 읽기 전환. `getContent()` + 컴포넌트 14개 async 전환 + `site.ts` 삭제<br>**링크는 아직 앵커 그대로** (`LinkTarget` 이 랜딩 앵커를 가리킴) | 데이브 주도, 선우 리뷰 | 렌더 결과가 S2 이전과 **동일**. `/` 정적 프리렌더 유지. `layout.tsx` 가 `generateMetadata()` |
| **S4** | 라우트 골격 13개 + 섹션 프리미티브 + `sitemap.ts`/`robots.ts`/`not-found`<br>본문은 비어 있고 슬롯이 없으면 섹션 미출력 | **선우** | 13개 URL 이 200을 반환하고 헤더·푸터가 붙는다. `/coaching/xxx` 가 404. `next build` 에서 `[slug]` 6개가 프리렌더 목록에 나온다. `/sitemap.xml` 에 15개 URL, `/admin` 없음 |
| **S5** | 링크 전환. `LinkTarget` 을 페이지 라우트로 교체 + 메가메뉴 3항목 분리 + `<a>`→`<Link>` + 푸터에 `/privacy` 추가 | 데이브(레지스트리·데이터) + 선우(컴포넌트) | 앵커 37곳 중 페이지로 갈 것이 전부 전환. **깨진 링크 0**(링크 검사 스크립트). 메뉴 3항목이 서로 다른 URL |
| **S6** | 페이지 콘텐츠 채우기. 페이지별 완전 병렬 | **로보** | 페이지별로 `published:true` 전환. 채우지 않은 페이지는 `published:false` 로 404 유지 |
| **S7** | `/privacy` 본문 + 동의 문구 정합성 | 로보 + 보안관 | 보안관 3.2 표의 15개 항목 존재. 플레이스홀더 검사 통과 |
| **S8** | 관리자 (관리자 설계 P4~P7, 경로 확장 반영) | 데이브 + 선우 | 관리자 설계의 완료 조건 |

**S3 과 S5 를 나눈 것이 이 순서의 핵심이다.** 읽기 전환(대규모·기계적)과 링크 전환(의미 변경)을 한 커밋에 넣으면 렌더 결과가 달라져서 "전환 전과 동일" 이라는 검증 기준을 쓸 수 없다. 나누면 S3은 diff 없이 검증되고 S5는 링크만 본다.

**S4 를 선우 단독으로 둔 이유.** S3 이 `src/components/sections/**` 14개를 통째로 만지는 구간이라(관리자 설계 §8 P3 이 "유일한 대규모 충돌 구간" 으로 표시한 곳) 그 동안 선우는 `src/components/page-sections/**` 라는 **새 디렉터리**에서 작업한다. 파일이 겹치지 않는다.

### 5.3 파일 소유 분리 — 선우와 로보의 병렬

| 경로 | 소유 | 비고 |
| --- | --- | --- |
| `src/lib/routes.ts` | 데이브 | 라우트 추가·변경은 데이브만 |
| `src/lib/content/schema.ts`, `read.ts`, `store/**` | 데이브 | |
| `src/lib/content/seed.ts` | **로보** | S2 에서 데이브가 구조를 만들고 넘긴 뒤 **손 뗀다.** 이후 텍스트는 로보 단독 |
| `src/app/sitemap.ts`, `robots.ts`, `next.config.ts` | 데이브 | |
| `src/app/(site)/**/page.tsx`, `layout.tsx` | **선우** | |
| `src/components/page-sections/**` | **선우** | |
| `src/components/sections/**`, `layout/**` | 선우 (S3 동안은 데이브) | |
| `src/app/(site)/privacy/page.tsx` | **로보** (보안관 검수) | 본문이 코드에 있는 유일한 페이지 |
| `docs/pages-*.md` | 각 작성자 | |

**병렬이 성립하는 조건은 하나다: S4 종료 시점에 섹션 프리미티브의 props 계약이 고정되어야 한다.** `<Signals heading items>`, `<Steps heading items>` 같은 형태가 정해지면 선우는 레이아웃을 다듬고 로보는 텍스트를 채우는 작업이 서로 독립이 된다. 계약이 흔들리면 로보가 채운 데이터가 매번 스키마 에러를 낸다.

S6 은 페이지 단위로 완전 병렬이다 — `items.senior` 와 `items.adult` 는 다른 객체이고 저장 경로도 다르다(§2.6). 다만 S6 은 `seed.ts` **한 파일**을 여러 페이지분 편집하는 작업이라, 관리자 UI 가 없는 동안에는 병렬 작업자가 여럿이면 충돌한다. 로보 단독이면 문제없다.

### 5.4 각 단계의 검증 방법

기계적으로 확인 가능한 것만 적는다.

- **S1**: `git diff` 로 렌더 결과 변화가 없음을 확인할 수 없으므로 `next build` 출력의 라우트 표를 전후 비교한다(`/` 가 `○ (Static)` 유지).
- **S2**: 시드 대조 스크립트. `site.ts` 의 모든 문자열 리터럴이 시드에 존재하는지 확인한다(개명·구조 변경분은 화이트리스트).
- **S3**: 전환 전 `/` 의 HTML 을 저장해 두고 전환 후와 비교한다. `id` 부여로 생기는 차이만 허용.
- **S4**: 15개 URL 에 대한 상태 코드 확인. `next build` 라우트 표에서 `[slug]` 프리렌더 확인. `/sitemap.xml` 파싱 후 URL 집합 대조.
- **S5**: **링크 검사 스크립트**를 만든다 — 콘텐츠 전체를 훑어 모든 `LinkTarget` 을 수집하고, `route` 종류는 `ROUTES` 에 있는지, `hash` 는 랜딩 라우트에만 붙었는지, 렌더된 HTML 의 모든 내부 `href` 가 `ROUTES` 의 경로 집합에 속하는지 확인한다. 이게 §3의 설계가 실제로 링크를 지키는지 증명하는 유일한 방법이다.
- **S6/S7**: 플레이스홀더 검사(`○○○`, `000-00-00000`, `hello@example.com`, `070-0000-0000`). 보안관 7.2 체크리스트에 이미 있다.

---

## 6. 승인이 필요한 항목

되돌리기 비싼 결정과 의존성 추가만 모았다. 승인 없이 진행하지 않는다.

| # | 항목 | 추천 | 대안 | 왜 승인이 필요한가 |
| --- | --- | --- | --- | --- |
| **B1** | **URL 구조 확정** (§1.1, §1.2) — 중첩 2개 + 평면 나머지, `/about`(vs `/story`), `/service`(vs `/services`), `leader`→`leadership` | 표 그대로 | 전부 평면(`/adult`, `/senior`, …) / BRAND 도 중첩 | **URL 은 게시 후 바꾸면 색인이 초기화된다.** 리다이렉트로 완화되지만 순위 회복에 수 주가 걸린다. 사업자 정보·도메인 확정 전에 굳혀야 할 결정 |
| **B2** | **대상·프로그램을 `[slug]` 동적 라우트로 묶기** (§1.3) | 묶는다 + 고정 슬롯 8개 | 개별 파일 6개 / 블록 배열 스키마 | 관리자 폼 개수(2 vs 6)와 로보의 콘텐츠 작업 형태를 결정한다. 나중에 바꾸면 페이지·스키마·관리자를 함께 다시 만든다 |
| **B3** | **`/consult` 별도 페이지 신설 + 랜딩 앵커 병존** (§3.3) | 둘 다 | 랜딩 앵커만 / `/consult` 만 | 폼이 두 곳에 렌더되고, 랜딩의 정적 프리렌더 보존 방식이 여기에 달려 있다. 얌얌의 퍼널 설계와도 직접 맞물린다 |
| **B4** | **콘텐츠에 URL 대신 `RouteId` 저장** (§3.1). 관리자는 드롭다운으로 링크 선택, 자유 URL 입력 불허 | 라우트 참조 | URL 문자열 + 화이트리스트 검증 | 관리자가 임의 링크(외부 사이트 등)를 못 넣는다는 제약. 대신 `javascript:` 스킴 문제가 구조적으로 사라진다(보안관 CSP-4). 외부 링크가 필요하면 `{kind:"external"}` 로 열 수 있지만 그 순간 검증이 다시 필요하다 |
| **B5** | **`typedRoutes: true` + `SITE_URL` 환경변수** (§2.6, §3.5) | 도입 | 미도입 | `typedRoutes` 는 `next.config.ts` 첫 설정이고 빌드 산출물에 타입 파일이 늘어난다. `SITE_URL` 은 배포 시 필수 환경변수가 하나 늘어난다는 뜻 |
| **B6** | **`/privacy` 와 동의 문구를 관리자 편집 대상에서 제외** (§2.4.7, §2.4.8) | 제외 (코드 + 리뷰) | 관리자 편집 허용 | 대표가 처리방침을 직접 못 고친다. 대신 코드 리뷰 없이 법정 고지가 바뀌는 경로가 없다(보안관 PRIV-4, CONS-6) |
| **B7** | **`schema-dts` devDependency** (§4.3) | 도입 (선택) | 미도입 (JSON-LD 를 `unknown` 으로 손수 작성) | 의존성 1개. devDependency 이고 번들 영향 0. 없어도 성립한다 |
| **B8** | **랜딩 카피와 상세 카피를 분리하고 동기화하지 않는다** (§2.3) | 분리 (미끼/설명) | 공유 (요약/전문) | **로보와 얌얌의 작업량이 두 배가 된다** — 페이지 13개의 상세 본문과 티저 카피를 따로 쓴다. 그 대가로 동기화 의무가 0이 된다. 작업량 결정이므로 대표 확인이 필요하다 |

**승인 불필요(문서로 확인한 사실이므로 그냥 따르는 것)**

- `dynamicParams` 는 설정하지 않는다(기본 `true`) + `notFound()` 로 검증 [R2, R6]
- `sitemap.ts` / `robots.ts` 는 `app` 루트 [R9, R10]
- `title.template` 은 자식에만 적용되므로 랜딩은 `title.absolute` [R7]
- `global-not-found` 는 실험 플래그이므로 쓰지 않는다 [R12]
- JSON-LD 는 `<script>` + `<` 치환 [R11]
- 다중 루트 레이아웃 쓰지 않음 [R3] (관리자 설계 §5.1과 동일)

**실측이 필요한 항목(구현 시 확인하고 결과를 DEVNOTE 에 남긴다)**

1. `revalidatePath("/", "layout")` 이 `/sitemap.xml` 캐시를 무효화하는가 (§2.6)
2. `(site)/not-found.tsx` 가 라우트 그룹 세그먼트에서 동작하는가 (§4.5)
3. `typedRoutes` 가 `ROUTES` 맵의 동적 세그먼트 리터럴을 통과시키는가 (§3.5)
4. 라우트 그룹 도입 후 `revalidatePath("/")` 가 리터럴 경로로 정상 동작하는가 (관리자 설계 §2.6에서 이미 실측 항목으로 남긴 것)

---

## 7. `docs/admin-architecture.md` A1~A6 재검토

| # | 항목 | 원래 답 | 이번 확장 후 | 무엇이 바뀌었나 |
| --- | --- | --- | --- | --- |
| **A1** | 스키마 검증 라이브러리 | zod v4 추천 | **추천 유지, 우선순위 상승** | 검증할 것이 크게 늘었다: `order`↔`items` 키 집합 교차 검증, `recommendedPrograms`/`forWhom` 참조 무결성, `RouteId`·`Slug`·FAQ 태그 닫힌 유니온, 메뉴 그룹 내 `LinkTarget` 중복 금지, `hash` 는 랜딩 라우트에만. **이걸 손으로 쓰면 타입과 검증기가 반드시 갈라진다.** 직접 작성(C 안)의 비용이 배 이상이 됐다 |
| **A2** | 상담 신청 알림 수단 | 지금 없음 → 배포 직전 웹훅 | **변화 없음** | 페이지 구조와 무관 |
| **A3** | 세션 토큰 구현 | `node:crypto` HMAC 직접 | **변화 없음** — 단 정합성 지적 하나 | 보안관 7.1 에 `FORM_TOKEN_SECRET`(RATE-2 폼 서명 키)이 필수로 있는데 관리자 설계 §6 환경변수 표에는 없다. `/consult` 페이지가 이 키를 쓰므로(§1.6) 표에 추가해야 한다 |
| **A4** | 이미지 재인코딩·EXIF 제거 (`sharp`) | 1차는 하지 않음 (검증만) | **답을 다시 봐야 한다** | 이미지 슬롯이 21 → 약 34로 늘어난다(§2.6-4). 인물 사진과 공간 사진이 늘어나므로 GPS 좌표가 공개 URL 로 나갈 표면이 커진다(보안관 UP-10). "하지 않음 + 운영 안내" 로 갈 수는 있지만 **의식적으로 다시 결정해야 하는 항목**이 됐다 |
| **A5** | 관리자 저장분을 git 에 커밋 | 커밋한다 | **답 유지, 비용 증가** | 콘텐츠 문서가 페이지 13개 본문을 담아 커진다. 저장 한 번의 diff 가 읽기 어려워지므로 §2.6-2의 경로 단위 부분 갱신이 실질적으로 중요해진다(diff 가 해당 페이지에 국한된다) |
| **A6** | `Services` 4 · `Principles` 3 · `Audiences` 3 개수 고정 | 고정 | **답이 바뀐다 — 성격이 격상되고 프로그램이 추가된다** | 아래 |

### A6 재정의

원래 근거는 레이아웃이었다(`lg:grid-cols-3/4`, `i % 2` 좌우 교차). 이제 **개수가 URL 개수이자 메뉴 항목 수**다.

| 대상 | 원래 | 변경 후 | 근거 |
| --- | --- | --- | --- |
| `audiences` | 3 고정 (앵커·그리드 결합) | **3 고정 유지, 근거 격상** | 이제 `/coaching/*` 3개 URL, 메가메뉴 3항목, 사이트맵 3행, `AudienceSlug` 유니온이 함께 묶인다. 추가는 코드 변경(슬러그 유니온·수진의 레이아웃)이 선행돼야 하는 작업이다 |
| `program.cards` | **자유** | **자유 아님** | 프로그램 추가 = **새 URL 생성**이다. 관리자가 빈 페이지를 공개할 수 있으면 안 된다. → `published: boolean` 필수(§1.6), slug 는 생성 후 **변경 불가**(변경하면 기존 URL 이 죽는다), 추가 시 `ProgramSlug` 유니온 확장이 필요하므로 **관리자에서 추가·삭제를 제공하지 않는다**(3개 고정) |
| `services` | 4 권장 | **4 고정** | `/service` 한 페이지 안의 레이아웃 제약. 성격 변화 없음 |
| `principles` | 3 고정 | **3 고정** | 랜딩과 `/about` 두 곳의 3열 그리드. 제약이 하나 늘었을 뿐 |
| `faqs` | 자유 | **자유 유지** | 페이지가 되지 않는다. 태그만 닫힌 유니온 |

**핵심 변화: "관리자가 개수를 못 늘린다" 가 레이아웃 편의 문제에서 IA·URL 안정성 문제로 바뀌었다.** 슬러그 유니온을 열린 `string` 으로 두면 개수 자유를 얻지만, 그 순간 §3.1의 링크 무결성 보장 전체가 무너진다(`RouteId` 가 닫힌 유니온이라는 전제 위에 서 있다). **개수 고정을 유지하는 쪽이 맞다.**

### 그 밖에 관리자 설계에서 고쳐야 할 문장

1. §1.2 의 **토큰 링크 문법(`"{{site.phone|tel}}"`) 폐기** → `LinkTarget` 의 `{kind:"tel"}` / `{kind:"mail"}` 로 대체(§3.1).
2. §1.2 의 `audiences[].id` 잠금은 유지하되 **값을 `leader` → `leadership` 으로 확정**(§1.2).
3. §2.1 의 `ContentStore.updateSection` → `update(path: ContentPath, …)`(§2.6-2).
4. §2.6 의 "Server Action 마지막에 `revalidatePath("/", "layout")`" 는 유지하되 **`/sitemap.xml` 실측 항목 추가**(§2.6-3).
5. §3.4 의 슬롯 인벤토리 21행 표 → 약 34행으로 재작성. **단 수진의 `docs/pages-ui.md` 가 비율·오버레이를 확정한 뒤에 쓴다.**
6. §5.1 의 파일 트리에 `(site)` 하위 라우트 13개 추가(§1.5).
7. §6 환경변수 표에 `SITE_URL` 추가, `FORM_TOKEN_SECRET` 추가(보안관 7.1과 정합).
8. §8 의 P1~P3 → 이 문서 §5 의 S1~S3 으로 교체. P7 은 "섹션 에디터 13개" → "페이지 에디터 약 20개".

이 문서가 승인되면 위 8건을 관리자 설계에 반영한다. **지금 그 문서를 고치지 않았다** — 수진·얌얌이 병렬로 작업 중이고, 승인 전에 두 문서를 함께 흔들면 어느 쪽이 최신인지 알 수 없어진다.

---

## 8. DEVNOTE 반영 예정 (구현 시작 시)

S1 착수 시 `DEVNOTE.md` §6 보류 표를 갱신한다.

- 사이트 구조 — 원페이지 랜딩 → **다페이지 (공개 라우트 15개)**
- 콘텐츠 계층 분리 — 보류 → **설계 확정** (페이지 계층 + `getContent()` 단일 진입점)
- 개인정보처리방침 페이지 — 없음 → **`/privacy`, 코드 내 정적 문서**
- 상담 트랙 구분 — 미구현 → `/consult?track=` + hidden 필드, 서버 화이트리스트
- 신규 항목: 라우트 레지스트리(`src/lib/routes.ts`), `typedRoutes`, `SITE_URL`, 실측 항목 4건(§6)
