# 관리자 페이지 서버 아키텍처 설계

작성: 데이브(backend) · 2026-09-09 · **설계 문서. 구현 없음.**

이 문서는 구조와 근거만 다룬다.
보안 요건(쿠키 속성·헤더·개인정보 처리·업로드 검증 규칙)은 `docs/admin-security.md`(보안관), 화면 설계는 `docs/admin-ui.md`(수진)를 따른다. 충돌하면 각 담당 문서가 우선한다.

---

## 0. 근거로 삼은 문서

이 프로젝트의 Next.js는 **16.2.10** 이고 학습 데이터와 다르다. 아래 API는 전부 `node_modules/next/dist/docs/` 에서 직접 확인했다. 본문에서 `[D1]` 같은 표시로 참조한다.

| 표시 | 문서 경로 (`node_modules/next/dist/docs/` 기준) |
| --- | --- |
| D1 | `01-app/01-getting-started/07-mutating-data.md` |
| D2 | `01-app/02-guides/server-actions.md` |
| D3 | `01-app/02-guides/forms.md` |
| D4 | `01-app/02-guides/authentication.md` |
| D5 | `01-app/01-getting-started/16-proxy.md` |
| D6 | `01-app/03-api-reference/03-file-conventions/proxy.md` |
| D7 | `01-app/03-api-reference/04-functions/cookies.md` |
| D8 | `01-app/02-guides/caching-without-cache-components.md` |
| D9 | `01-app/01-getting-started/08-caching.md` · `09-revalidating.md` |
| D10 | `01-app/03-api-reference/04-functions/revalidatePath.md` |
| D11 | `01-app/01-getting-started/15-route-handlers.md` |
| D12 | `01-app/01-getting-started/12-images.md` · `03-api-reference/03-file-conventions/public-folder.md` |
| D13 | `01-app/02-guides/self-hosting.md` |
| D14 | `01-app/03-api-reference/05-config/01-next-config-js/serverActions.md` |
| D15 | `01-app/01-getting-started/02-project-structure.md` (라우트 그룹) |
| D16 | `01-app/03-api-reference/04-functions/unstable_cache.md` |
| D17 | `01-app/02-guides/upgrading/version-16.md` |
| D18 | `01-app/03-api-reference/03-file-conventions/instrumentation.md` |

### 이번 버전에서 특히 달라진 것 (설계에 직접 영향)

1. **`middleware.ts` 는 `proxy.ts` 로 이름이 바뀌었다.** 파일은 프로젝트 루트(또는 `src/`) 에 하나만 둔다. 함수는 default export 또는 named `proxy` [D5, D6]. `middleware` 컨벤션은 deprecated 다 [D6 상단 Note].
2. **Proxy 의 기본 런타임이 Node.js 다** (v16.0.0 변경). `runtime` 세그먼트 설정은 Proxy 에서 쓸 수 없고 쓰면 에러가 난다 [D6 § Runtime].
3. **`unstable_cache` 는 `use cache` 로 대체됐다** [D16 상단 Note]. 새로 쓰지 않는다.
4. **Cache Components(`cacheComponents: true`) 는 옵트인이다.** 이 프로젝트의 `next.config.ts` 는 비어 있으므로 **꺼져 있다.** 따라서 캐시·재검증은 D8(이전 모델) 기준으로 설계한다. `use cache` / `cacheLife` / `cacheTag` / `updateTag` 는 지금 쓸 수 없다(§2.6에서 전환 경로만 남긴다).
5. `cookies()` 는 **비동기**다. `const cookieStore = await cookies()` [D7]. `.set` / `.delete` 는 **Server Function 또는 Route Handler 안에서만** 호출할 수 있다 [D7 § Good to know].
6. Server Action 요청 본문은 **기본 1MB 상한**이다 [D2 § Security, D14 § bodySizeLimit]. 이미지 업로드 설계가 여기에 걸린다(§3.2).
7. `next/cache` 에 `refresh()` 가 있고 **Server Action 안에서만** 호출 가능하다 [D1 § Refresh data, `04-functions/refresh.md`].

---

## 1. 콘텐츠 계층 분리

### 1.1 현재 `src/lib/site.ts` 전수 매핑

15개 export 를 하나의 `SiteContent` 문서로 재구성한다. 새 키 이름은 관리자 탭 이름과 1:1로 맞춘다(DEVNOTE §6 "관리자 탭은 섹션과 1:1").

| 현재 export | 새 키 | 형태 | 개수 | 이미지 슬롯 | 개수 제약 |
| --- | --- | --- | --- | --- | --- |
| `SITE` | `site` | 객체 12필드 | 1 | 0 | — |
| `TOP_MESSAGES` | `topBanner.messages` | 문자열 배열 | 2 | 0 | 1개 이상 |
| `MENU_GROUPS` | `menu.groups` | 그룹 배열(그룹→항목) | 4 | 0 | 자유 |
| `HERO_SLIDES` | `hero.slides` | 객체 배열 | 2 | 2 | 1개 이상 |
| `AUDIENCES` | `audiences` | 객체 배열 | 3 | 3 | **3 고정**(앵커 결합) |
| `PROGRAM_TABS` | `program.tabs` | 객체 배열 | 3 | 0 | 1개 이상 |
| `PROGRAM_CARDS` | `program.cards` | 객체 배열 | 3 | 3 | 자유 |
| `MID_BANNER` | `midBanner` | 객체 | 1 | 1 | — |
| `STORY_TABS` | `story.tabs` | 객체 배열 | 3 | 3 | 1개 이상 |
| `SERVICES` | `services` | 객체 배열 | 4 | 4 | **4 권장**(`lg:grid-cols-4`) |
| `BRAND_STORY` | `brandStory` | 객체 | 1 | 1 | — |
| `PRINCIPLES` | `principles` | 객체 배열 | 3 | 3 | **3 고정**(`lg:grid-cols-3`) |
| `COACH` | `coach` | 객체 | 1 | 1 | — |
| `FAQS` | `faqs` | 객체 배열 `{q,a}` | 4 | 0 | 자유 |
| `FOOTER_LINKS` | `footer.groups` | 그룹 배열 | 2 | 0 | 자유 |

**이미지 슬롯 합계 21개** — 2(hero) + 3(audiences) + 3(program.cards) + 1(midBanner) + 3(story.tabs) + 4(services) + 1(brandStory) + 3(principles) + 1(coach). §3.4에 슬롯 인벤토리 표가 있다.

### 1.2 스키마 설계

```
SiteContent
├─ revision: number            시스템 필드. 저장할 때마다 +1 (§2.3 낙관적 충돌 검사)
├─ updatedAt: string           ISO8601. 시스템 필드
├─ site: { name, nameKo, tagline, description, phone, email,
│          addressLine, hours, satHours, owner, company, bizNo }
├─ topBanner: { messages: string[] }
├─ menu:     { groups: LinkGroup[] }
├─ hero:     { slides: HeroSlide[] }
├─ audiences: Audience[]
├─ program:  { tabs: ProgramTab[], cards: ProgramCard[] }
├─ midBanner: Banner
├─ story:    { tabs: StoryTab[] }
├─ services: Service[]
├─ brandStory: { tagline, link: Link, tone: PhotoTone, image: string }
├─ principles: Principle[]
├─ coach:    { name, role, intro, credentials: string[], tone, image }
├─ faqs:     Faq[]
└─ footer:   { groups: LinkGroup[] }

Link       = { label: string, href: string }
LinkGroup  = { id: string, title: string, items: (Link & { id: string })[] }
PhotoTone  = "sage" | "paper" | "mist" | "dusk" | "forest"
HeroSlide  = { id, eyebrow, title, body, cta: Link, tone: PhotoTone, image: string }
Audience   = { id, label, title, body, link: Link, tone, image }   // id 는 잠금
ProgramTab = { id, label }
ProgramCard= { id, name, price, salePrice?, summary, badge?, tone, image, tabs: string[] }
Banner     = { title, body, cta: Link, tone, image }
StoryTab   = { id, tab, title, body, link: Link, tone, image }
Service    = { id, title, body, link: Link, tone, image }
Principle  = { id, title, body, tone, image }
Faq        = { id, q, a }
```

현재 구조에서 바꾼 것과 이유:

- **모든 배열 항목에 `id` 를 넣는다.** 지금 컴포넌트는 React key 로 `slide.title`, `card.name`, `service.title`, `item.title`, `item.label` 같은 **사용자 편집 문자열**을 쓴다(`HeroSlider.tsx:31`, `ProgramTabs.tsx:34`, `Services.tsx:13`, `Principles.tsx:10`, `Footer.tsx:23`). 관리자가 두 항목에 같은 제목을 넣거나 제목을 비우는 순간 key 가 충돌한다. `id` 는 서버가 생성하고(짧은 랜덤 문자열) 관리자 UI 에 노출하지 않는다.
- **`SITE.lunch` → `site.satHours`.** 키 이름이 값과 다르다(주석에 이미 적혀 있다: 값은 토요일 운영시간). 어차피 스키마를 새로 쓰는 시점이므로 여기서 고친다. 참조처는 `ConsultSection.tsx:36`, `Header.tsx:111` 두 곳뿐이다.
- **`brandStory.tone` 을 데이터로 올린다.** 지금은 `BrandStory.tsx:10` 에서 `tone="forest"` 하드코딩이고 데이터에는 tone 이 없다. 21개 슬롯 중 이 하나만 톤을 관리자가 못 바꾸는 예외가 되므로 맞춘다.
- **`audiences[].id` 는 잠금 필드다.** 섹션 앵커 `#audience-{id}` 와 헤더 메뉴 `href` 가 이 값에 결합돼 있다(`AudienceRows.tsx:24`, `site.ts` MENU_GROUPS). 관리자에게 편집 UI 를 주지 않는다. 같은 이유로 `audiences` 는 3개 고정, 추가·삭제 불가.
- **파생 링크는 데이터에 넣지 않고 읽을 때 계산한다.** 지금 `FOOTER_LINKS` 의 Help 그룹은 모듈 평가 시점에 `SITE.email` / `SITE.phone` 을 읽어 `mailto:` / `tel:` 을 만든다(`site.ts:309-310`). JSON 으로 빼면 이 결합이 끊어져서, 관리자가 전화번호를 바꿔도 푸터 링크는 옛 번호를 가리킨다. → `href` 에 `"{{site.phone|tel}}"` 같은 토큰을 허용하고 `getContent()` 가 치환한다. 토큰은 `site.phone`·`site.email` 두 개만 지원한다(문법을 늘리면 그때부터 템플릿 엔진이 된다).
  - 같은 문제가 이미 있다: `MENU_GROUPS` 의 "전화 문의" `href: "tel:07000000000"` 은 하드코딩이라 `SITE.phone` 과 우연히만 일치한다. 시드 데이터로 옮길 때 토큰으로 바꾼다.

### 1.3 읽기 인터페이스

페이지 코드는 **저장소를 모른다.** 유일한 진입점은 `getContent()` 하나다.

```
src/lib/content/
  schema.ts      타입 + 검증 (§1.4)
  seed.ts        현재 site.ts 값을 그대로 옮긴 초기 데이터
  read.ts        getContent() — 공개 페이지용 읽기
  store/
    types.ts     ContentStore 인터페이스 (§2.1)
    json.ts      JSON 파일 어댑터
    index.ts     환경변수로 어댑터 선택
```

```ts
// src/lib/content/read.ts
import "server-only";
import { cache } from "react";

export const getContent = cache(async (): Promise<SiteContent> => { /* ... */ });
```

- **`server-only`**: 콘텐츠 읽기 코드가 클라이언트 번들에 새면 `node:fs` import 가 따라 들어간다. 경계를 컴파일 에러로 만든다. (D4가 세션 모듈에 쓰는 것과 같은 패턴)
- **React `cache()`**: 한 번의 렌더 패스 안에서 여러 섹션이 `getContent()` 를 호출해도 파일을 한 번만 읽는다. `fetch` 가 아닌 데이터 소스의 요청 중복 제거로 문서가 권장하는 방법이다 [D8 § Deduplicating requests]. `unstable_cache` 는 쓰지 않는다 — v16에서 대체됐고 [D16], 애초에 크로스 리퀘스트 캐시가 필요한 상황이 아니다(§2.6).
- **읽기는 절대 던지지 않는다.** 파일이 없거나 깨졌으면 `seed` 를 반환하고 `console.error` 로만 남긴다. 이유: 콘텐츠 파일 하나 때문에 공개 랜딩 전체가 500이 되면 안 된다. 반대로 관리자 화면이 쓰는 `readForEdit()` 는 **던진다** — 대표가 깨진 걸 모르고 그 위에 덮어쓰면 데이터를 잃는다.

사용 예 (컴포넌트가 async Server Component 가 된다):

```tsx
// src/components/sections/Principles.tsx
export async function Principles() {
  const { principles } = await getContent();
  // 나머지 JSX 동일
}
```

**클라이언트 컴포넌트는 props 로 받는다.** `HeroSlider` · `ProgramTabs` · `StoryTabs` · `Header` 는 `"use client"` 라서 `getContent()` 를 직접 호출할 수 없다. 각각 얇은 서버 래퍼를 두고 데이터를 내려준다.

| 파일 | 현재 | 전환 후 |
| --- | --- | --- |
| `HeroSlider.tsx` | client, `HERO_SLIDES` 직접 import | `HeroSlider.tsx`(server, 데이터 조회) + `HeroSliderClient.tsx`(현재 로직, props) |
| `ProgramTabs.tsx` | client | 동일 패턴 |
| `StoryTabs.tsx` | client | 동일 패턴 |
| `Header.tsx` | client, `MENU_GROUPS`·`SITE` | 동일 패턴 |
| `TopBanner.tsx` | client(추정) | 동일 패턴 |
| 나머지 9개 섹션 | server | `async` 로만 바꾸면 끝 |

**`app/layout.tsx` 의 `metadata` 는 `generateMetadata()` 로 바꿔야 한다.** 지금은 모듈 평가 시점에 `SITE` 를 읽는 정적 객체다(`layout.tsx:31-43`). `getContent()` 가 async 가 되는 순간 정적 export 로는 값을 넣을 수 없다. 이걸 놓치면 사이트 제목만 옛 값으로 남는다.

### 1.4 타입 안전성 — `as const` 를 잃으면 깨지는 곳

지금 `as const` 가 실제로 하는 일은 하나뿐이다: **`tone` 을 `PhotoTone` 리터럴 유니온으로 좁혀서 `Photo` 컴포넌트에 넘길 수 있게 하는 것.** JSON 에서 읽으면 `tone` 은 `string` 이 되고 `Photo` 의 `tone?: PhotoTone` 에 대입할 수 없어 **컴파일 에러**가 난다. 영향 파일 8개: `HeroSlider`, `AudienceRows`, `ProgramTabs`, `MidBanner`, `StoryTabs`, `Services`, `Principles`, `CoachBand`.

이건 이미 해결된 선례가 있다. `PROGRAM_CARDS` 는 `as const` 가 아니라 `ProgramCard[]` 명시 타입이고(`site.ts:130-173`), `tone: "sage" | "paper" | "mist" | "forest"` 를 타입 쪽에서 보장한다. **같은 방식을 전 섹션에 적용한다.** 즉 `as const` 는 버리고, 명시 타입 + 런타임 검증으로 대체한다.

**더 위험한 건 타입이 안 잡아주는 쪽이다:**

| 지점 | 지금 | JSON 전환 후 | 대응 |
| --- | --- | --- | --- |
| `ProgramTabs.tsx:10` `PROGRAM_TABS[0].id` | 튜플이라 `[0]` 존재가 타입으로 보장됨 | `ProgramTab[]` → `[0]` 이 `undefined` 일 수 있는데 `noUncheckedIndexedAccess` 가 꺼져 있어 **타입 에러 없이 런타임에 터진다** | 스키마에서 `minLength 1` 강제 + 컴포넌트에 `?? ""` 방어 |
| `StoryTabs.tsx:12` `STORY_TABS[active]` | 동일 | 탭을 지우면 인덱스 범위 밖 → 런타임 크래시 | `minLength 1` + `active` 를 인덱스가 아니라 `id` 로 관리 |
| `Principles.tsx` `lg:grid-cols-3` | 데이터가 3개 | 관리자가 4개 만들면 레이아웃 깨짐 | 스키마에서 `length === 3` 고정, 관리자 UI 는 추가/삭제 버튼 없이 3칸 편집만 |
| `Services.tsx` `lg:grid-cols-4` | 데이터가 4개 | 동일 | 스키마 `length === 4` 권장 경고, 초과 시 관리자에서 막는다 |
| `AudienceRows.tsx` `i % 2` 좌우 교차 | 3개 | 개수가 바뀌면 교차 리듬이 깨짐 | `length === 3` 고정 |
| React key 5곳 | 편집 불가 상수 | 중복·빈 문자열 가능 | §1.2 `id` 도입 |

정리하면 **타입 추론으로 얻던 보장은 원래 크지 않았고, 진짜로 필요한 보장(개수·비어있지 않음·톤 유효성)은 지금도 없다.** 데이터를 관리자에게 넘기는 순간 이 보장은 **컴파일 타임이 아니라 런타임 검증**으로 옮겨가야 한다. 그래서 검증 라이브러리 판단이 필요하다.

#### 검증 라이브러리 — **승인 필요 (A1)**

Next 공식 문서는 폼·인증 예제 전반에서 zod 를 쓴다 [D3 § Form validation, D4 § 2. Validate form fields]. 하지만 이 프로젝트는 지금 의존성이 7개뿐이고 서버 코드가 0줄이다. 임의로 추가하지 않는다.

| 안 | 추가 용량 | 장점 | 단점 |
| --- | --- | --- | --- |
| **A. zod v4** | ~14KB(서버 전용, 클라 번들 영향 없음) | 스키마 하나로 타입 추론(`z.infer`) + 런타임 검증 동시 해결. 문서 예제가 전부 이 형태라 참고 코스트 0. 폼 검증(§4)에도 그대로 재사용 | 의존성 1개 증가 |
| **B. valibot** | ~2KB | 더 가볍고 API 유사 | 문서 예제 없음. 번역 비용. 서버 전용이라 용량 이점이 사실상 의미 없음 |
| **C. 직접 작성** | 0 | 의존성 0 | 15개 섹션 × 중첩 객체 검증기를 손으로 쓰고 유지해야 한다. 타입과 검증기가 따로 놀아서 스키마를 고칠 때 한쪽을 빠뜨리는 사고가 난다 |
| **D. 타입만 + 검증 없음** | 0 | 지금 당장 제일 빠름 | **채택 불가.** 관리자 입력과 디스크 JSON 은 신뢰할 수 없는 입력이다. 검증 없이 `JSON.parse` 결과를 `SiteContent` 로 단언하면 타입 시스템이 거짓말을 한다 |

**추천: A (zod v4).** 근거 — (1) `SiteContent` 스키마와 상담 폼 검증(§4.3)에서 두 번 쓰인다, (2) 스키마가 곧 타입이라 §1.4 표의 "개수 고정·비어있지 않음" 같은 제약을 **한 곳에** 적을 수 있다, (3) 전부 서버 전용 모듈이라 클라이언트 번들이 커지지 않는다.
설치는 대표 승인 후 `npm install zod --cache F:\_npm-cache` (AGENTS.md 규칙). 승인 전까지는 C 안으로도 §2 이후 설계가 그대로 성립한다 — 인터페이스는 바뀌지 않는다.

### 1.5 마이그레이션 경로

**한 번에 간다. 섹션별 점진 전환은 하지 않는다.**

근거: 점진 전환은 "일부 섹션은 `site.ts` 에서, 일부는 `content.json` 에서" 라는 이중 소스 상태를 만든다. 그 상태에서 `site.ts` 를 수정하면 어느 쪽이 반영되는지 사람이 추적해야 하고, `SITE` 처럼 여러 섹션이 공유하는 값(푸터·헤더·상담 섹션이 모두 `SITE.phone` 을 읽는다)은 애초에 쪼갤 수 없다. 반면 한 번에 가는 비용은 낮다 — 데이터가 이미 정적이고 파일 하나에 모여 있다.

**대신 스텝을 두 개로 나눈다. 각 스텝이 끝날 때마다 `npx tsc --noEmit` + `npm run build` 가 통과해야 한다.**

**M1 — 데이터 이동 (화면 변화 0)**
1. `schema.ts` 작성 (§1.2 구조)
2. `seed.ts` 에 현재 `site.ts` 값을 그대로 옮긴다. 이때 `id` 부여, `satHours` 개명, 토큰 링크 치환, `brandStory.tone` 추가를 수행한다
3. `seed` 를 스키마로 검증하는 스크립트를 돌려 옮기다 흘린 값이 없는지 확인한다
4. `content.json` 을 `seed` 로 생성 (`npm run content:init`)
5. **`site.ts` 는 아직 그대로 둔다.** 컴포넌트도 안 건드린다

**M2 — 읽기 전환 (파일 단위, 한 커밋)**
1. `getContent()` 구현
2. 서버 컴포넌트 9개를 `async` 로 전환
3. 클라이언트 컴포넌트 5개를 서버 래퍼 + 클라이언트 본체로 분리
4. `layout.tsx` 를 `generateMetadata()` 로 전환
5. `site.ts` **삭제**. 남아 있으면 반드시 누군가 다시 import 한다

M1 과 M2 사이에 리뷰를 한 번 넣는다(`/pm`). M1 은 값 대조가 전부라 기계적으로 검증 가능하고, M2 는 렌더 결과 비교가 필요하다.

**롤백**: `content.json` 을 git 에 커밋한다(§2.2). M2 이후 콘텐츠 사고가 나면 `git checkout <sha> -- data/content.json` 한 줄이 롤백이다. 이게 JSON 파일 어댑터의 가장 큰 실질 이점이다.

---

## 2. 저장소 어댑터

### 2.1 인터페이스

**저장소를 하나로 묶지 않고 셋으로 나눈다.** 접근 패턴이 서로 다르기 때문이다 — 콘텐츠는 단일 문서 전체 읽기/쓰기, 상담 신청은 추가 위주 컬렉션, 이미지는 바이너리. 하나로 묶으면 Supabase 전환 시 "콘텐츠는 DB, 이미지는 Storage" 같은 조합을 못 만든다.

```ts
// src/lib/content/store/types.ts
export interface ContentStore {
  /** 저장소 능력. 관리자 UI 가 저장 버튼을 켤지 결정한다 (§2.4) */
  readonly capabilities: { writable: boolean };

  read(): Promise<SiteContent>;

  /** 문서 전체 교체. expectedRevision 이 어긋나면 ConflictError */
  write(next: SiteContent, expectedRevision: number): Promise<SiteContent>;

  /** 섹션 단위 부분 갱신. 관리자 탭 1개 = 이 호출 1번 */
  updateSection<K extends SectionKey>(
    section: K,
    value: SiteContent[K],
    expectedRevision: number,
  ): Promise<SiteContent>;
}

export interface LeadStore {
  create(input: NewLead): Promise<Lead>;
  list(opts?: { limit?: number; before?: string }): Promise<Lead[]>;
  get(id: string): Promise<Lead | null>;
  setStatus(id: string, status: LeadStatus, memo?: string): Promise<void>;
  remove(id: string): Promise<void>;   // 개인정보 파기. 소프트 삭제 아님
  countNew(): Promise<number>;         // 대시보드 배지
}

export interface MediaStore {
  readonly capabilities: { writable: boolean };
  put(input: { bytes: Uint8Array; ext: string }): Promise<MediaObject>;
  remove(key: string): Promise<void>;
  list(): Promise<MediaObject[]>;
}

export type MediaObject = { key: string; url: string; bytes: number; createdAt: string };
```

설계 판단:

- **`updateSection` 을 둔 이유.** 관리자 탭이 섹션과 1:1 이므로, FAQ 탭에서 저장할 때 히어로 슬라이드까지 통째로 왕복시킬 이유가 없다. 그리고 부분 갱신이 있어야 **두 탭을 동시에 열어 놓고 각각 저장하는 상황**에서 서로를 덮어쓰지 않는다. 구현은 read → 해당 키만 교체 → write 지만, **호출자가 전체 문서를 만들지 않는다**는 게 요점이다.
- **`expectedRevision` 을 필수 인자로 둔 이유.** 낙관적 잠금. 관리자가 화면을 열 때 받은 `revision` 을 저장 시 되돌려 보내고, 디스크의 값과 다르면 거부한다. 파일 락보다 이게 먼저다 — 파일 락은 프로세스 충돌만 막지, "어제 열어둔 탭에서 오늘 저장" 같은 사람 실수를 못 막는다.
- **`remove` 는 진짜 삭제다.** 상담 신청은 개인정보고, 파기 요청은 파기여야 한다. 소프트 삭제 플래그를 두면 "파기했다"고 말할 수 없다. (보관 기간·파기 절차는 보안관 명세)
- **`capabilities.writable`** — §2.4 읽기 전용 환경 대응의 핵심.

### 2.2 JSON 파일 어댑터

```
F:\coaching\
  data/
    content.json        사이트 콘텐츠. git 커밋함
    content.json.bak    직전 성공 버전 1개
    leads.jsonl         상담 신청 (append-only). git 제외
    lead-meta.json      상담 상태·메모. git 제외
  public/
    uploads/            업로드 이미지. git 커밋함
```

**위치를 `data/`(저장소 루트)로 잡은 이유** — `src/` 하위에 두면 (1) Turbopack 파일 감시에 걸려서 저장할 때마다 dev 서버가 재컴파일하고, (2) 누군가 `import content from "./content.json"` 을 해버려서 빌드 타임에 고정돼 버린다(`tsconfig.json` 에 `resolveJsonModule: true` 가 켜져 있어 실제로 가능하다). 경로는 `CONTENT_DATA_DIR` 로 덮어쓸 수 있게 한다.

**git 정책**
- `data/content.json` — **커밋한다.** 콘텐츠 이력이 곧 감사 로그이자 undo 다(§1.5 롤백).
- `public/uploads/` — **커밋한다.** 안 하면 `content.json` 의 이미지 참조가 다른 머신에서 전부 깨진다.
- `data/leads.jsonl`, `data/lead-meta.json` — **`.gitignore` 에 추가한다.** 개인정보를 git 이력에 남기면 지울 수 없다. 되돌리기 어려운 실수라 M1 이전에 먼저 넣는다.

**원자적 쓰기**

```
1. 새 문서를 스키마로 검증한다. 실패하면 여기서 중단 (원본 무손상)
2. revision 비교. 어긋나면 ConflictError (원본 무손상)
3. 같은 디렉터리에 content.json.tmp-<random> 로 쓴다
4. 파일 핸들에 fsync 후 close
5. 현재 content.json 을 content.json.bak 으로 복사
6. fs.rename(tmp, content.json)
```

- **같은 디렉터리**에 임시 파일을 만드는 게 중요하다. 다른 볼륨이면 `rename` 이 원자적이지 않다(복사+삭제로 떨어진다).
- **어느 단계에서 실패해도 기존 `content.json` 은 온전하다.** truncate 하고 다시 쓰는 방식이었다면 4단계 실패 시 빈 파일이 남는다.
- **Windows 주의**: `fs.rename` 이 대상 파일을 덮어쓰긴 하지만, 다른 프로세스(백신 실시간 검사, 에디터, dev 서버 감시자)가 파일을 열고 있으면 `EPERM`/`EBUSY` 로 실패할 수 있다. **50ms 간격 3회 재시도**를 넣는다. 이건 F드라이브 로컬 개발 환경의 실제 위험이라 옵션이 아니다.

**동시 쓰기**

두 층으로 막는다.
1. **프로세스 내 직렬화** — 어댑터 모듈에 `let queue: Promise<unknown> = Promise.resolve()` 를 두고 모든 쓰기를 이 체인에 이어 붙인다. Node 는 싱글 스레드지만 `await` 지점에서 인터리브되므로 read-modify-write 가 겹칠 수 있다. 이걸 막는다.
2. **`revision` 낙관적 검사** — 프로세스가 둘 이상이거나(dev + start 동시 실행) 사람이 두 탭에서 저장하는 경우.

**크로스 프로세스 파일 락(`fs.mkdir` 기반 lockdir)은 넣지 않는다.** 운영자가 한 명이고, 프로세스가 둘인 상황은 개발 중 실수뿐이다. 그 경우 `revision` 검사가 "다른 곳에서 먼저 저장했습니다"로 잡아준다. 락을 넣으면 스테일 락 타임아웃·강제 해제 UI 같은 부수 복잡도가 딸려온다.

**손상 복구** — `read()` 가 `JSON.parse` 또는 스키마 검증에 실패하면: `content.json.bak` 을 시도 → 그것도 실패하면 `seed` 반환 + `console.error`. 관리자 화면은 `readForEdit()` 를 통해 원래 에러를 그대로 본다(§1.3).

### 2.3 상담 신청 저장 형식

`leads.jsonl` 은 **한 줄에 JSON 하나(JSON Lines)** 다. `content.json` 과 다른 방식을 쓰는 이유:

신청 저장은 `fs.appendFile` 한 번으로 끝난다. 배열 JSON 이었다면 read → parse → push → 전체 직렬화 → 원자적 교체가 필요하고, 그 사이에 다른 신청이 들어오면 하나가 사라진다. **상담 신청은 잃으면 안 되는 데이터**라 가장 단순한 쓰기 경로를 고른다.

상태 변경(연락함/종료)은 빈도가 낮고 관리자만 하므로 `lead-meta.json` 에 `{ [leadId]: { status, memo, updatedAt } }` 로 따로 두고 `content.json` 과 같은 원자적 쓰기를 쓴다. 조회는 두 파일을 합친다.

**파기**(`remove`)만 `leads.jsonl` 재작성이 필요하다. 해당 줄을 빼고 원자적 교체 + `lead-meta` 에서도 제거. 빈도가 극히 낮으므로 비용이 문제되지 않는다.

### 2.4 ⚠️ 치명적 제약 — 서버리스에서는 동작하지 않는다

> ## JSON 파일 어댑터는 **로컬 개발 전용이다.**
> Vercel 등 서버리스에 배포하면 **관리자 저장 기능이 전부 죽는다.**

**왜**

1. 서버리스 함수의 애플리케이션 디렉터리는 **읽기 전용**이다. 쓸 수 있는 건 `/tmp` 뿐이고 그마저 인스턴스마다 따로이며 언제든 사라진다. Next 문서도 같은 얘기를 한다 — "On ephemeral compute platforms (common serverless setups), local disk is often non-persistent or unavailable" [D13 § Configuring Caching].
2. `public/` 은 빌드 시점에 CDN 으로 업로드된다 [D12]. 런타임에 `public/uploads/` 에 파일을 써도 **아무도 그 파일을 못 받는다.**
3. 인스턴스가 여러 개면 각자 다른 파일을 보게 된다.

**배포하면 실제로 무슨 일이 일어나는가**

| 동작 | 결과 |
| --- | --- |
| 공개 페이지 조회 | **정상.** `content.json` 이 커밋돼 있으므로 빌드 산출물에 포함되고 읽기는 된다 |
| 관리자 로그인 | 정상 (쿠키만 쓴다) |
| 콘텐츠 저장 | `EROFS` 또는 `/tmp` 에 써지고 조용히 사라짐 — **후자가 훨씬 위험하다.** "저장됐습니다" 를 보고 나갔는데 없다 |
| 이미지 업로드 | 같은 문제. 업로드 성공 → 이미지 404 |
| 상담 신청 접수 | **가장 위험.** 신청이 접수된 것처럼 보이고 실제로는 유실된다 |

**감지·차단 3단**

1. **빌드 차단** — `instrumentation.ts` 의 `register()` 에서 [D18] 어댑터가 `json` 인데 `process.env.VERCEL` 또는 서버리스 지표가 있으면 **throw 해서 부팅을 막는다.** 조용히 실패하는 것보다 아예 안 뜨는 게 낫다. 비상 탈출구는 `ADMIN_ALLOW_WRITE_IN_PROD=1`.
   `register()` 는 서버 시작 시 한 번 실행되므로 요청마다 검사할 필요가 없다. `process.env.NEXT_RUNTIME === "nodejs"` 로 가드한다 [D18 § Specifying the runtime].
2. **런타임 방어** — JSON 어댑터의 모든 쓰기 진입점이 `capabilities.writable` 을 먼저 확인하고, 아니면 `StoreReadOnlyError` 를 던진다. 관리자 UI 는 이 에러를 **"이 환경에서는 저장할 수 없습니다. 저장소 설정을 확인해 주세요."** 로 보여준다 — 경로·스택·환경변수 이름을 노출하지 않는다.
3. **UI 선차단** — 관리자 레이아웃이 `store.capabilities.writable === false` 면 상단에 붉은 띠를 고정하고 저장 버튼을 비활성화한다. 저장을 눌러보고 알게 되는 게 아니라 들어가자마자 알게 한다.

**결론: 배포는 Supabase 어댑터가 준비된 다음이다.** 이건 순서 문제이지 선택 문제가 아니다. DEVNOTE §6 에 이미 같은 취지가 적혀 있고, 이 문서는 그걸 코드 레벨 가드로 옮긴다.

### 2.5 Supabase 어댑터 — 인터페이스 검증과 테이블 스케치

**지금 구현하지 않는다. Supabase 새 계정이 없다.** 계정·연결·MCP 호출은 하지 않는다(AGENTS.md). 여기서는 **§2.1 인터페이스가 Supabase 에서도 성립하는지만** 확인한다.

| 메서드 | Supabase 매핑 | 성립? |
| --- | --- | --- |
| `ContentStore.read()` | `select * from site_content order by revision desc limit 1` | ○ |
| `ContentStore.write(next, expected)` | `update site_content set doc=$1, revision=revision+1 where revision=$2` → 영향 행 0이면 Conflict | ○ **DB 쪽이 오히려 더 정확하다.** 파일 어댑터의 낙관적 검사가 DB 의 조건부 UPDATE 와 같은 의미가 되도록 시그니처를 맞춰 뒀다 |
| `ContentStore.updateSection` | `jsonb_set(doc, '{section}', $1)` 로 원자적 부분 갱신 | ○ |
| `LeadStore.create` | `insert into leads ... returning *` | ○ |
| `LeadStore.list({before})` | 커서 페이지네이션 (`created_at < $1`) | ○ — 그래서 `offset` 이 아니라 `before` 커서로 뒀다. `offset` 은 JSONL 에서는 쉽지만 삽입이 있는 테이블에서 항목을 건너뛴다 |
| `MediaStore.put` | Supabase Storage `upload` → public URL | ○ |
| `MediaStore.list` | Storage `list` | ○ |

**한 곳만 안 맞는다**: `MediaStore.put` 이 `Uint8Array` 를 받는다. 큰 파일은 스트림이 낫다. 하지만 이 사이트의 이미지는 상한 5MB(§3.2) 라 메모리 버퍼로 충분하고, 지금 스트림 시그니처를 도입하면 로컬 구현이 불필요하게 복잡해진다. **`Uint8Array` 로 확정한다.**

테이블 스케치 (마이그레이션은 대표 계정 생성 후):

```sql
-- 콘텐츠: 단일 행 + 이력
create table site_content (
  revision    bigint primary key generated always as identity,
  doc         jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  text
);
-- 이력을 남기려면 update 가 아니라 insert 로 append 하고 최신 revision 을 읽는다.
-- 파일 어댑터의 content.json.bak 1개보다 나은 지점.

create table leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  phone        text not null,
  preferred_time text,
  message      text,
  track        text not null default 'unknown',  -- adult|senior|leader|unknown
  status       text not null default 'new',      -- new|contacted|closed
  memo         text,
  consent_at   timestamptz not null,
  consent_version text not null
);
create index on leads (created_at desc);
-- 파일 어댑터의 leads.jsonl + lead-meta.json 이 여기서 한 테이블로 합쳐진다.
-- 인터페이스는 그대로다 — 저장소 내부 사정이라 호출자가 모른다.

-- RLS: 두 테이블 모두 활성화 + 정책 없음(anon/authenticated 접근 0).
-- 서버가 service role 키로만 접근한다. 상세는 보안관 명세.
```

### 2.6 캐시 무효화 — 저장하면 공개 페이지에 언제 반영되는가

**전제 확인**: `next.config.ts` 가 비어 있으므로 `cacheComponents` 는 꺼져 있다. 따라서 D8(이전 모델) 이 적용되고, `use cache` / `cacheTag` / `updateTag` 는 **사용 불가**다.

현재 `/` 는 정적 프리렌더된다(DEVNOTE §8). `getContent()` 가 request-time API 를 쓰지 않으므로 전환 후에도 그대로 정적 프리렌더 대상이고, **`content.json` 값은 빌드 시점에 HTML 로 구워진다.**

| 환경 | 저장 후 반영 시점 | 근거 |
| --- | --- | --- |
| `next dev` | **즉시.** 아무것도 안 해도 된다 | "In Development, Pages are _always_ rendered on-demand and are never cached" [D8 § revalidate Good to know] |
| `next build` + `next start` | Server Action 안에서 `revalidatePath("/", "layout")` 을 호출한 순간 | [D10] |

**Server Action 마지막에 `revalidatePath("/", "layout")` 을 호출한다.**

```ts
// src/app/(admin)/admin/_actions/content.ts
"use server";
import { revalidatePath } from "next/cache";

export async function saveSection(/* ... */) {
  await requireAdmin();          // §5.4
  // ... 검증 → store.updateSection(...)
  revalidatePath("/", "layout");
}
```

시그니처는 문서에서 확인했다: `revalidatePath(path: string, type?: 'page' | 'layout'): void` [D10 § Parameters].

- **`"layout"` 을 쓰는 이유**: 루트 레이아웃도 콘텐츠를 읽는다(`generateMetadata`, `Header`, `Footer`). `"page"` 로 하면 페이지만 갱신되고 헤더 전화번호는 옛 값이 남는다. 문서도 `revalidatePath('/', 'layout')` 을 "purge the Client Cache, and invalidate all cached data" 로 설명한다 [D10 § Revalidating all data].
- **Server Action 이라서 즉시 반영된다**: "Server Functions: Updates the UI immediately (if viewing the affected path)" [D10 § Good to know]. Route Handler 였다면 "다음 방문 시" 로 미뤄진다 — 이것도 §4.1에서 Server Action 을 고른 이유 중 하나다.
- **`refresh()` 는 쓰지 않는다.** `refresh()` 는 캐시를 무효화하지 않고 현재 라우트의 RSC 페이로드만 다시 가져온다 [D2 § Choosing a cache update]. 관리자가 저장한 결과는 **다른 라우트(`/`)** 에 반영돼야 하므로 맞지 않는다.
- **라우트 그룹 주의**: `(site)` 그룹을 도입해도 URL 은 `/` 그대로다. 문서에는 패턴형에 그룹을 쓰는 예(`revalidatePath('/(main)/blog/[slug]', 'page')`)가 있는데 [D10], 우리는 리터럴 경로 `/` 를 쓰므로 해당하지 않는다. 구현 시 `next start` 로 한 번 실측한다.

**Cache Components 전환 경로(지금 하지 않음)**: `cacheComponents: true` 를 켜면 `getContent()` 를 `'use cache'` + `cacheTag('content')` 로 감싸고, Server Action 에서 `updateTag('content')` 를 호출하는 게 정석이다 [D9]. 다만 이 플래그는 PPR 을 기본으로 만들고 **모든 비캐시 비동기 컴포넌트에 `<Suspense>` 를 요구한다** [D9 § How rendering works]. 14개 섹션 전부에 영향이 가므로 별도 과제다. 지금 인터페이스는 그때도 안 바뀐다 — `getContent()` 내부만 고치면 된다.

---

## 3. 이미지 업로드

### 3.1 저장 위치와 `next/image`

**로컬: `public/uploads/<yyyy>/<mm>/<24자 랜덤>.<ext>`**

- `public/` 하위여야 `/uploads/...` URL 로 바로 서빙된다 [D12]. 로컬 경로는 `next/image` 에서 추가 설정 없이 최적화된다(`remotePatterns` 는 원격 전용).
- **URL 에 쿼리스트링을 절대 붙이지 않는다.** v16 부터 쿼리스트링이 붙은 로컬 이미지는 `images.localPatterns.search` 설정을 요구한다 — "Local image sources with query strings now require `images.localPatterns.search` configuration to prevent enumeration attacks" [D17]. 따라서 캐시 무효화를 `?v=2` 로 하지 않고 **파일명 자체를 불변으로** 만든다.
- **덮어쓰지 않는다. 교체 = 새 파일 업로드 + 슬롯 참조 변경.** `public/` 의 기본 응답 헤더는 `Cache-Control: public, max-age=0` 이라 원본은 바로 갱신되지만 [D12], `_next/image` 최적화 결과는 **URL 기준으로 캐시된다.** 같은 경로에 다른 이미지를 덮어쓰면 옛 이미지가 계속 나온다. 불변 파일명이 이 문제를 원천 제거한다.
- 파일명은 **서버가 생성한다.** 클라이언트가 보낸 이름은 확장자 추출에도 쓰지 않는다(경로 순회·이중 확장자). MIME 과 매직 바이트로 확장자를 결정한다. → 검증 지점 **V4**(보안관).
- `<yyyy>/<mm>` 로 나누는 이유: 한 디렉터리에 수백 개가 쌓이면 탐색기·git status 가 느려진다. 21개 슬롯이지만 교체본이 계속 쌓인다(고아 파일을 즉시 지우지 않으므로 — §3.5).

### 3.2 업로드 전송 경로 — Route Handler

**Server Action 이 아니라 `POST /api/admin/media` Route Handler 를 쓴다.**

근거: **Server Action 요청 본문은 기본 1MB 로 제한된다** [D2 § Security, D14]. 히어로 배경 사진은 이 한도를 쉽게 넘는다. `serverActions.bodySizeLimit` 을 올릴 수는 있지만 [D14], 이 설정은 **앱 전체에 적용된다** — 즉 공개 상담 신청 액션(익명 접근 가능한 유일한 쓰기 엔드포인트)의 본문 한도까지 같이 커진다. 인증된 관리자 업로드 때문에 익명 엔드포인트의 DoS 표면을 넓히는 건 맞바꿀 가치가 없다.

Route Handler 는 Next 이 부과하는 본문 상한이 없다 [D11]. 그래서 **애플리케이션 레벨에서 직접 상한을 건다(5MB 제안, 보안관 확정)**. → 검증 지점 **V3**.

Route Handler 를 쓸 때 잃는 것과 대응:

| 잃는 것 | 대응 |
| --- | --- |
| Server Action 의 자동 CSRF(Origin/Host 대조) [D2] | 핸들러 안에서 `Origin` 헤더를 직접 대조 → **V7**(보안관) |
| 폼 액션 통합 | 업로더는 어차피 드래그앤드롭 + `fetch` 다. `<form action>` 이 아니다 |
| 자동 재검증 | 업로드는 파일만 만든다. **슬롯 참조 갱신은 별도 Server Action** 이고 거기서 `revalidatePath` 를 부른다 |

핸들러 개요 (시그니처는 [D11] 기준: `export async function POST(request: Request)`):

```ts
// src/app/api/admin/media/route.ts
export async function POST(request: Request) {
  // V1 세션 확인 — Proxy 를 믿지 않는다 (§5.4, [D6 § Execution order])
  // V7 Origin 대조
  // V3 Content-Length 선검사 → 본문 읽은 뒤 실제 크기 재검사
  // V2 매직 바이트 검사 (jpeg/png/webp만). V5 SVG 거부
  // V4 서버가 파일명 생성
  // MediaStore.put()
  // 200 { key, url, bytes } — 실패 시 내부 경로 노출 없는 짧은 메시지
}
```

### 3.3 오브젝트 스토리지 전환

`MediaStore`(§2.1) 뒤에 숨는다. 콘텐츠에는 **URL 문자열만** 저장한다 — 로컬이면 `"/uploads/2026/09/xxx.webp"`, 원격이면 `"https://<project>.supabase.co/storage/v1/object/public/..."`. `Photo` 컴포넌트는 둘 다 그대로 처리한다.

전환 시 필요한 코드 변경은 두 가지뿐이다.
1. `MediaStore` 구현 교체 (`store/media-supabase.ts`)
2. `next.config.ts` 에 `images.remotePatterns` 추가 — 원격 이미지는 등록된 패턴만 최적화된다 [D12 § Remote images]. `hostname` 을 프로젝트 도메인으로 좁게 잡는다.

**콘텐츠에 URL 전체를 저장할지, 키만 저장할지**: URL 전체로 간다. 키만 저장하면 렌더할 때마다 스토어에 물어 URL 을 조립해야 하고, 그러면 `Photo` 가 스토어를 알아야 한다 — §1.3에서 없애려던 결합이 이미지 쪽으로 되살아난다. 대신 스토리지를 옮길 때 `content.json` 의 URL 을 일괄 치환하는 마이그레이션 스크립트가 필요하다. 21개짜리 일회성 작업이라 감당 가능하다.

### 3.4 `image: ""` 와 슬롯 인벤토리

**연결 방식은 바꾸지 않는다.** 스키마의 `image` 는 `string`, 빈 문자열이 "미지정" 이다. `Photo` 는 이미 `if (!src)` 로 그라디언트 플레이스홀더를 띄우고 값이 있으면 `next/image`(fill + object-cover) 로 전환한다(`Photo.tsx:31-44`). **컴포넌트 변경 0.** 관리자 UI 는 빈 문자열을 "미지정 슬롯" 으로 표시하면 된다.

관리자가 "어느 슬롯에 어떤 사진이 들어가는지" 알려면 슬롯이 데이터로 열거돼야 한다. **슬롯 목록은 하드코딩하지 않고 콘텐츠에서 유도한다** — 섹션별로 `image` 필드 경로를 뽑는 `listImageSlots(content)` 를 두고, `/admin/media` 가 이걸 렌더한다. 하드코딩하면 항목을 추가할 때 두 곳을 고쳐야 한다.

| # | 슬롯 경로 | 섹션 | 화면에서의 역할 | 비율 / `sizes` | 오버레이 |
| --- | --- | --- | --- | --- | --- |
| 1 | `hero.slides[0].image` | 히어로 | 첫 화면 전체 배경 (`priority`) | 100svh 풀블리드 / `100vw` | 상하 스크림 |
| 2 | `hero.slides[1].image` | 히어로 | 두 번째 슬라이드 배경 | 동일 | 상하 스크림 |
| 3 | `audiences[adult].image` | 대상별 | 성인 코칭 행 사진 | 4:3 / lg 3:2, `54vw` | 없음(라벨 칩만) |
| 4 | `audiences[senior].image` | 대상별 | 시니어 코칭 행 사진 | 동일 | 없음 |
| 5 | `audiences[leader].image` | 대상별 | 리더십 코칭 행 사진 | 동일 | 없음 |
| 6 | `program.cards[0].image` | 프로그램 | Diagnosis Session 카드 | 4:3, `30vw / 70vw` | 없음 |
| 7 | `program.cards[1].image` | 프로그램 | Weekly Coaching 카드 | 동일 | 없음 |
| 8 | `program.cards[2].image` | 프로그램 | Online Coaching 카드 | 동일 | 없음 |
| 9 | `midBanner.image` | 중간 배너 | 풀블리드 배경 | min-h 380/520 / `100vw` | 검정 35% |
| 10 | `story.tabs[clarify].image` | 스토리 | Clarify 탭 사진 | 4:3 / lg 520px, `60vw` | 없음 |
| 11 | `story.tabs[practice].image` | 스토리 | Practice 탭 사진 | 동일 | 없음 |
| 12 | `story.tabs[review].image` | 스토리 | Review 탭 사진 | 동일 | 없음 |
| 13 | `services[0].image` | 서비스 | Free Consulting 썸네일 | 4:3 라운드, `24vw / 72vw` | 없음 |
| 14 | `services[1].image` | 서비스 | Session Note 썸네일 | 동일 | 없음 |
| 15 | `services[2].image` | 서비스 | Group Session 썸네일 | 동일 | 없음 |
| 16 | `services[3].image` | 서비스 | After Care 썸네일 | 동일 | 없음 |
| 17 | `brandStory.image` | 브랜드 스토리 | 풀블리드 배경 | min-h 350/450 / `100vw` | 검정 25% |
| 18 | `principles[0].image` | 원칙 | Your Answer 카드 | 3:4 / lg 4:3, `32vw` | 상단 검정 60%→10% |
| 19 | `principles[1].image` | 원칙 | Fact & Record 카드 | 동일 | 동일 |
| 20 | `principles[2].image` | 원칙 | Own Pace 카드 | 동일 | 동일 |
| 21 | `coach.image` | 코치 | 코치 인물 사진 | 4:5 / lg 560px, `38vw` | 없음 |

관리자 화면에는 이 표의 "역할 / 비율 / 오버레이" 를 그대로 보여준다. **오버레이 정보가 특히 중요하다** — DEVNOTE §5 에 "실제 사진으로 교체하면 밝기에 맞춰 스크림 농도를 재조정해야 한다" 고 적혀 있다. 밝은 사진을 9·17·1·2번 슬롯에 넣으면 흰 글자가 안 보인다. 슬롯 목록에 경고 문구를 단다.

### 3.5 삭제·교체와 고아 파일

**교체 시 옛 파일을 즉시 지우지 않는다.**

이유: `content.json` 은 git 에 있다(§2.2). 콘텐츠를 `git revert` 하면 옛 URL 이 되살아나는데 파일이 없으면 404 다. 즉시 삭제는 되돌릴 수 없는 작업이라 자동화하지 않는다.

대신:
- `listOrphans()` — `content.json` 전체를 훑어 참조되지 않는 `public/uploads/**` 파일을 찾는다. 문자열 매칭이면 충분하다(URL 이 콘텐츠에 그대로 들어 있으므로).
- `/admin/media` 에 "미사용 N개" 표시 + **수동 일괄 삭제** 버튼. 삭제 전 목록을 보여주고 확인을 받는다.
- 슬롯 "비우기" 는 `image: ""` 로 되돌리는 것이고 파일은 남는다.

**`content.json` 롤백과 파일 삭제를 같이 하지 않는다**는 게 원칙이다. 콘텐츠 되돌리기는 흔한 작업, 파일 삭제는 드물고 위험한 작업 — 두 개의 수명주기를 분리한다.

### 3.6 검증 지점 (보안관 담당)

구조만 만들고 규칙은 `docs/admin-security.md` 를 따른다. 코드에 아래 마커를 남긴다.

| 마커 | 위치 | 무엇을 검증하나 |
| --- | --- | --- |
| V1 | `POST /api/admin/media` 진입 | 관리자 세션 |
| V2 | 본문 파싱 직후 | 매직 바이트로 실제 이미지 타입 확인 (확장자·`Content-Type` 불신) |
| V3 | 본문 읽기 전/후 | 크기 상한 (제안 5MB) |
| V4 | 저장 직전 | 파일명·경로를 서버가 생성. 클라이언트 문자열이 경로에 닿지 않음 |
| V5 | V2 와 함께 | SVG 거부 (스크립트 실행 가능) |
| V6 | 저장 직전 | 재인코딩·EXIF 제거 여부 판단 (라이브러리 필요 시 승인 항목 A3) |
| V7 | 진입 | `Origin` 대조 (Route Handler 는 프레임워크 CSRF 보호가 없다 [D2]) |
| V8 | `/admin/media` 삭제 | 삭제 대상 키가 `uploads/` 내부인지 |

---

## 4. 상담 신청 저장

### 4.1 전송 방식 — Server Action

**Server Action 을 쓴다.** Route Handler 가 아니다. 근거는 넷이다.

1. **프레임워크가 CSRF 를 막아준다.** "The request's `Origin` is compared to the `Host` (or `X-Forwarded-Host`). Mismatches are rejected." [D2 § Security]. 공개 엔드포인트에서 이건 공짜로 받을 가치가 크다. Route Handler 였다면 직접 짜야 한다(§3.2 V7 처럼).
2. **본문이 작다.** 텍스트 5개 필드. 1MB 기본 상한 [D14] 안에 여유 있게 들어간다. §3.2의 이미지와 반대 상황이다.
3. **검증 에러 UI 가 문서의 표준 패턴과 일치한다.** `useActionState(action, initialState)` 가 `[state, formAction, pending]` 을 주고, `state.errors` 로 필드별 에러를, `pending` 으로 제출 중 상태를 렌더한다 [D3 § Validation errors, § Pending states]. 현재 `ConsultForm` 의 `submitting` / `error` / `done` 세 상태가 그대로 이 모델에 대응된다.
4. **점진적 향상.** 폼이 Server Action 을 호출하면 JS 로딩 전 제출도 큐잉된다 [D1 § Client Components]. 지금 `onSubmit` + `preventDefault` 방식은 JS 가 없으면 아무 일도 안 일어난다.

액션 시그니처는 `useActionState` 를 쓰므로 **첫 인자가 이전 상태**다 [D3 § Validation errors]:

```ts
// src/app/(site)/_actions/consult.ts
"use server";

export type ConsultState =
  | { status: "idle" }
  | { status: "error"; errors?: Record<string, string[]>; message?: string }
  | { status: "done" };

export async function submitConsult(
  _prev: ConsultState,
  formData: FormData,
): Promise<ConsultState> { /* ... */ }
```

`ConsultForm` 은 `useActionState(submitConsult, { status: "idle" })` 로 바꾸고, `done` 화면은 `state.status === "done"` 으로 분기한다. "다시 신청하기" 버튼은 로컬 `key` 를 바꿔 폼을 리마운트한다(액션 상태는 초기화 API 가 없다).

**재검증은 하지 않는다.** 상담 신청은 공개 페이지에 아무것도 안 보여준다. `revalidatePath` 를 부를 이유가 없다. 관리자 목록은 `/admin/leads` 를 열 때 새로 읽으면 된다.

### 4.2 데이터 구조

```ts
type Lead = {
  id: string;              // crypto.randomUUID()
  createdAt: string;       // ISO8601, 서버 시각
  name: string;
  phone: string;           // 숫자만 정규화해 저장 (010… 11자리)
  preferredTime: string;   // 선택
  message: string;         // 선택
  track: "adult" | "senior" | "leader" | "unknown";
  source: "web";
  status: "new" | "contacted" | "closed";
  memo: string;
  consentAt: string;       // 동의 시각 = createdAt
  consentVersion: string;  // 동의 문구 버전. 문구를 고치면 올린다
};
```

- **`track`** — DEVNOTE §6 "상담 트랙 구분: 대상별 CTA 가 전부 `#consult` 로만 간다. 폼 전송 붙일 때 hidden 필드로 처리". 대상별 CTA 링크를 `#consult?track=senior` 가 아니라 `#consult` + 클라이언트에서 hidden 필드 채우기로 간다(앵커에 쿼리를 붙이면 URL 이 지저분하고 뒤로가기 동작이 어색하다). **hidden 필드는 신뢰하지 않는다** — 서버에서 enum 검증하고 벗어나면 `unknown` 으로 떨군다.
- **`consentVersion`** — 동의 문구는 `ConsultForm.tsx:91-93` 에 하드코딩돼 있다("상담 종료 후 6개월 이내 파기"). 문구가 바뀌면 이전 신청자가 무엇에 동의했는지 알 수 없어진다. 버전 문자열을 같이 저장한다. (개인정보처리방침 페이지는 DEVNOTE §6 에 "폼 전송 연결 전에 필요" 로 적혀 있다 — 보안관 소관)
- **저장하지 않는 것**: IP, User-Agent, Referer. 최소 수집 원칙. 남용 대응에 필요하다고 보안관이 판단하면 짧은 보관 기간과 함께 추가한다.

### 4.3 서버측 재검증

현재 `ConsultForm` 의 검증은 전부 클라이언트에 있다(`ConsultForm.tsx:16-21`). **클라이언트 검증은 UX 용이고, 서버에서 처음부터 다시 한다.** Server Action 은 UI 를 거치지 않고 POST 로 직접 호출할 수 있다 [D1 § 경고, D2 § Security].

| 필드 | 서버 규칙 |
| --- | --- |
| `name` | trim 후 2–40자. 빈 문자열 거부 |
| `phone` | 숫자만 남기고 10–11자리. 아니면 거부 |
| `preferredTime` | 0–60자 |
| `message` | 0–1000자 |
| `agree` | 존재해야 함. 없으면 거부 (동의 없이 개인정보를 저장하지 않는다) |
| `track` | enum 4종. 벗어나면 `unknown` |
| 정의되지 않은 필드 | **무시한다.** `Object.fromEntries(formData)` 를 그대로 저장하지 않는다 — `$ACTION_*` 접두 필드가 섞여 들어온다 [D3 § Good to know] |

**스팸·남용 방어 (설계 지점만. 규칙은 보안관)**
- 허니팟 필드 — 봇이 채우면 성공 응답을 주고 저장하지 않는다(조용한 실패가 재시도를 줄인다)
- 최소 체류 시간 — 폼 렌더 시각을 HMAC 서명한 hidden 값으로 내려보내고, 3초 미만이면 거부. 서명하지 않으면 클라이언트가 조작한다
- Rate limit — IP + 시간 윈도우. **로컬 JSON 단계에서는 프로세스 메모리 `Map` 으로 충분하고, 서버리스로 가면 무의미해진다**(인스턴스마다 따로). Supabase 전환 시 테이블 기반으로 바꾼다. 이 한계를 코드 주석에 남긴다

**에러 응답**: 필드 에러는 사용자에게 보여주되, 저장 실패·검증 예외는 **"잠시 후 다시 시도해 주세요"** 한 줄로 통일한다. 파일 경로·스택·저장소 종류를 노출하지 않는다.

### 4.4 관리자 조회

`/admin/leads` (서버 컴포넌트) → `LeadStore.list()` → 최신순. 상세는 `/admin/leads/[id]`.

- **목록에서 연락처를 마스킹한다** (`010-****-5678`). 화면 공유·스크린샷 사고를 줄인다. 행을 펼치면 원문. 최종 규칙은 보안관.
- 상태 변경(연락함/종료)·메모는 Server Action. `requireAdmin()` 을 액션 안에서 다시 확인한다(§5.4).
- 파기 버튼 — 확인 다이얼로그 후 `LeadStore.remove()`. 진짜 삭제(§2.1).
- 대시보드(`/admin`)에 `countNew()` 배지.
- CSV 내보내기는 넣지 않는다. 개인정보가 관리 안 되는 파일로 빠져나가는 경로를 만들지 않는다. 필요하면 별도 요청으로 받는다.

### 4.5 알림 — **승인 필요 (A2)**

지금은 관리자가 `/admin/leads` 를 열어봐야만 신청을 안다. 첫 상담 무료 · "하루 안에 연락" 을 내걸고 있으므로(`TOP_MESSAGES`, `ConsultForm` 완료 문구) 실운영에서는 부족하다. **임의로 서비스를 붙이지 않는다.**

| 안 | 비용 | 준비물 | 장단점 |
| --- | --- | --- | --- |
| **A. 알림 없음** (현 설계 기본값) | 0 | 없음 | 지금 바로 됨. 대표가 주기적으로 관리자 페이지 확인. 로컬 개발 단계에서는 이걸로 충분 |
| **B. 텔레그램/슬랙 웹훅** | 0 | 봇 토큰 1개, 환경변수 1개 | 의존성 0(`fetch` 한 번). 즉시 푸시. **개인정보를 외부 메신저로 내보내는 문제** → 이름·연락처를 빼고 "새 신청 1건" 만 보내고 상세는 관리자 페이지에서 보게 하면 해소 |
| **C. 이메일 (Resend 등 API)** | 무료 티어 有 | 도메인, SPF/DKIM, API 키, 패키지 1개 | 표준적. **도메인이 아직 없다.** 발신 도메인 인증 없이 보내면 스팸함 직행 |
| **D. 이메일 (SMTP 직결)** | 0 | 메일 계정 앱 비밀번호, `nodemailer` | 도메인 불필요. 계정 비밀번호를 서버에 두는 부담. 서버리스에서 SMTP 연결이 불안정 |
| **E. 카카오 알림톡** | 건당 과금 | 사업자 등록, 채널 개설, 템플릿 심사 | 국내 도달률 최고. 준비 기간이 길고 사업자 정보가 아직 플레이스홀더(`SITE.bizNo`) |

**추천: 지금은 A, 배포 직전에 B.** 근거 — 도메인·사업자 정보가 확정되기 전에는 C/E 를 준비할 수 없고, B 는 나중에 C 로 갈아탈 때 버릴 코드가 `notify()` 함수 하나뿐이다. 어느 안이든 `LeadStore.create()` **성공 이후** 별도 함수로 호출하고, **알림 실패가 신청 접수를 실패시키지 않게** 한다(try/catch 삼킴 + 로그). 신청은 저장됐는데 알림이 안 갔다고 사용자에게 에러를 보여주면 중복 신청을 유발한다.

---

## 5. 관리자 인증 · 라우팅

### 5.1 라우트 그룹으로 레이아웃 분리

```
src/app/
  layout.tsx                     ← 유지. html/body/폰트 3종만. 화면 요소 없음
  globals.css
  (site)/
    layout.tsx                   ← TopBanner + Header + main + Footer  (현재 layout.tsx 에서 이동)
    page.tsx                     ← 현재 page.tsx 이동
    _actions/consult.ts
  (admin)/
    layout.tsx                   ← 관리자 셸. 좌측 탭 내비 + 읽기전용 경고 띠
    admin/
      login/page.tsx
      page.tsx                   대시보드
      site|banner|menu|hero|audience|program|mid-banner|
      story|service|coach|brand-story|principles|faq/page.tsx
      media/page.tsx
      leads/page.tsx
      leads/[id]/page.tsx
      _actions/*.ts
  api/admin/media/route.ts
proxy.ts                          ← 프로젝트 루트 또는 src/ [D6]
```

라우트 그룹은 폴더를 괄호로 감싸면 된다 — "Route groups can be created by wrapping a folder in parenthesis: `(folderName)`" [D15]. URL 에는 나타나지 않으므로 `/` 는 그대로 `/` 다.

**루트 레이아웃을 하나로 유지한다(다중 루트 레이아웃을 쓰지 않는다).** 문서는 그룹마다 `layout.js` 를 두고 각각에 `<html>`/`<body>` 를 넣는 방법도 제시한다 [D15]. 하지만 그러면 `next/font/google` 3종 설정을 두 벌 유지해야 하고, 두 개의 독립 폰트 인스턴스가 생긴다. 관리자 화면도 같은 폰트를 쓰므로 이득이 없다. 루트에는 문서 골격만 두고, **화면 요소(TopBanner/Header/Footer)를 `(site)/layout.tsx` 로 내린다** — 이게 지금 관리자 페이지에 공개 헤더가 딸려오는 걸 막는 최소 변경이다.

관리자 페이지는 각자 `export const metadata = { robots: { index: false, follow: false } }` 를 둔다.

### 5.2 로그인 흐름

```
1. GET /admin/*  →  proxy.ts 가 세션 쿠키 없음을 확인  →  /admin/login 으로 redirect
2. /admin/login 폼 (Server Action `login(prev, formData)`)
   ├ 비밀번호를 ADMIN_PASSWORD 와 상수 시간 비교
   ├ 실패: { status:"error", message:"비밀번호가 올바르지 않습니다" } 반환 (지연 삽입은 보안관 판단)
   └ 성공: 세션 쿠키 set → redirect("/admin")
3. 로그아웃: Server Action `logout()` → cookieStore.delete(...) → redirect("/admin/login")
```

`cookies()` 는 async 이고 `.set`/`.delete` 는 Server Action 또는 Route Handler 안에서만 가능하다 [D7]. 로그인/로그아웃 둘 다 Server Action 이므로 조건을 만족한다.

```ts
// 형태만. 쿠키 속성 확정값은 docs/admin-security.md
import { cookies } from "next/headers";
const cookieStore = await cookies();
cookieStore.set(SESSION_COOKIE, token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: /* 보안관 */,
});
```

지원되는 옵션 목록(`expires`·`maxAge`·`domain`·`path`·`secure`·`httpOnly`·`sameSite`·`priority`·`partitioned`)은 [D7 § Options] 에서 확인했다. `path` 만 기본값(`/`)이 있다.

**쿠키를 `/admin` path 로 좁히지 않는다.** 좁히면 Server Action POST 는 페이지 URL 로 가므로 대개 괜찮지만, 관리자 액션이 다른 경로에서 호출될 여지를 남기면 디버깅이 어려워진다. 최종 판단은 보안관.

### 5.3 세션 토큰 — **승인 필요 (A3)**

사용자가 하나뿐이고 역할도 하나라 세션에 담을 정보가 없다. 필요한 건 "이 쿠키를 우리 서버가 발급했고 아직 안 만료됐다" 뿐이다.

| 안 | 의존성 | 비고 |
| --- | --- | --- |
| **A. `node:crypto` HMAC 직접** | 0 | `base64url(exp.nonce) + "." + HMAC-SHA256` . 검증은 서명 재계산 + `timingSafeEqual` + `exp` 확인. 코드 30줄. Proxy 가 Node 런타임이므로 [D6 § Runtime] Proxy 안에서도 동작한다 |
| **B. `jose` (JWT)** | +1 | Next 문서 권장 [D4 § Encrypting and decrypting sessions]. 표준 JWT. 지금 담을 클레임이 없다 |
| **C. `iron-session`** | +1 | 문서 권장 [D4]. 암호화된 쿠키. 담을 비밀이 없으므로 암호화 이득 없음 |

**추천: A.** 근거 — 페이로드에 비밀이 없어 암호화가 불필요하고, JWT 의 표준성은 다른 시스템과 토큰을 주고받을 때 의미가 있는데 그럴 계획이 없다. 의존성 0 으로 끝나는 문제에 라이브러리를 넣지 않는다. **다만 직접 짠 암호 코드는 보안관 리뷰를 반드시 거친다.** 보안관이 B 를 요구하면 B 로 간다.

`ADMIN_SESSION_SECRET` 은 `openssl rand -base64 32` 로 만든다 — 문서가 세션 서명 키 생성에 제시하는 방법이다 [D4 § 1. Generating a secret key].

### 5.4 라우트 보호 — 3층. 하나라도 빼지 않는다

문서가 명확히 경고하는 지점이 셋 있다.

1. **레이아웃 단독 보호는 안 된다.** "Due to Partial Rendering, be cautious when doing checks in Layouts as these don't re-render on navigation, meaning the user session won't be checked on every route change." [D4 § Layouts and auth checks]
2. **Proxy 단독도 안 된다.** "While Proxy can be useful for initial checks, it should not be your only line of defense" [D4 § Optimistic checks with Proxy]. Proxy 에서는 **DB 조회를 하지 말고 쿠키만 읽으라**고 명시한다(모든 라우트에서, 프리페치 포함해 실행되므로).
3. **Server Action 은 Proxy 를 우회한다.** "Server Functions are not separate routes in this chain. They are handled as POST requests to the route where they are used, so a Proxy matcher that excludes a path will also skip Server Function calls on that path. … Always verify authentication and authorization inside each Server Function rather than relying on Proxy alone." [D6 § Execution order]

따라서:

**1층 — `proxy.ts` (UX 리다이렉트만)**
```ts
// proxy.ts  ※ 파일명이 middleware.ts 가 아니다 [D5, D6]
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin")) return NextResponse.next();
  if (path === "/admin/login") return NextResponse.next();

  // 쿠키 존재 + 서명·만료만 확인. 저장소 접근 없음
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
```
`matcher` 는 상수여야 정적 분석된다 [D6 § Matcher]. `matcher` 없이 두면 `_next/static`·`public/` 까지 전부 통과해 CSS·이미지가 막힐 수 있다 [D6 § Matcher 첫 문단] — 반드시 지정한다.

**2층 — DAL `requireAdmin()`**
```ts
// src/lib/auth/dal.ts
import "server-only";
import { cache } from "react";

export const requireAdmin = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);
  if (!session) redirect("/admin/login");
  return session;
});
```
React `cache()` 로 감싸는 건 문서의 DAL 패턴 그대로다 [D4 § Creating a Data Access Layer]. 한 렌더 패스에서 여러 번 불러도 한 번만 검증한다.

**모든 `/admin/**` 페이지가 첫 줄에서 `await requireAdmin()` 을 호출한다.** 레이아웃에 한 번 넣고 끝내지 않는다(경고 1).

**3층 — 모든 Server Action / Route Handler 진입부**
```ts
export async function saveSection(...) {
  "use server";
  await requireAdmin();   // ← 없으면 누구나 POST 로 콘텐츠를 바꿀 수 있다
  ...
}
```
경고 3 때문에 이게 **실질적인 유일한 보안 경계**다. 1·2층은 사용자 경험이고, 3층이 방어다.

---

## 6. 환경변수

**실제 값은 만들지 않는다.** 아래는 이름·형식·용도 정의다.

| 이름 | 필수 | 형식 / 예시 형태 | 용도 | 비고 |
| --- | --- | --- | --- | --- |
| `ADMIN_PASSWORD` | ✅ | 임의 문자열(20자 이상 권장) | 관리자 로그인 비밀번호 | 서버 전용. 상수 시간 비교 |
| `ADMIN_SESSION_SECRET` | ✅ | base64 32바이트 (`openssl rand -base64 32` [D4]) | 세션 쿠키 서명 HMAC 키 | 바꾸면 기존 세션 전부 무효 |
| `CONTENT_STORE` | ⬜ | `json` \| `supabase` (기본 `json`) | 저장소 어댑터 선택 | §2.4 가드가 이 값을 본다 |
| `CONTENT_DATA_DIR` | ⬜ | 경로 (기본 `./data`) | JSON 어댑터 데이터 위치 | **C드라이브 경로를 넣지 않는다** (AGENTS.md) |
| `MEDIA_UPLOAD_DIR` | ⬜ | 경로 (기본 `./public/uploads`) | 로컬 업로드 위치 | `public/` 밖으로 옮기면 서빙 안 됨 |
| `ADMIN_ALLOW_WRITE_IN_PROD` | ⬜ | `1` | §2.4 부팅 가드 우회 | 비상용. 평시 미설정 |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | 배포 시 | 문자열 | 인스턴스 간 액션 클로저 복호화 키 [D2 § Deployment considerations] | 다중 인스턴스 배포 전에 설정 |
| `NOTIFY_WEBHOOK_URL` | ⬜ | URL | §4.5 알림 (승인 후) | 승인 전에는 만들지 않는다 |
| `SUPABASE_URL` / `SUPABASE_SECRET_KEY` | — | — | Supabase 어댑터 | **계정이 없다. 지금 만들지 않는다** (AGENTS.md) |

**`NEXT_PUBLIC_*` 은 하나도 없다.** 관리자 기능에 브라우저가 알아야 할 값이 없다. 앞으로도 여기에 시크릿을 넣지 않는다.

**`.env.example` 은 작성한다.** 키와 주석만, 값은 비운다. 새 머신에서 뭘 채워야 하는지가 코드에 없으면 반드시 사고가 난다.

**`.gitignore` 를 먼저 고쳐야 한다.** 현재 `.gitignore:34` 가 `.env*` 라서 `.env.example` 도 무시된다. 예외를 추가한다:

```
.env*
!.env.example

# 개인정보 — 절대 커밋 금지
/data/leads.jsonl
/data/lead-meta.json
```

`data/content.json` 과 `public/uploads/` 는 **의도적으로 커밋한다**(§2.2).

---

## 7. 승인이 필요한 항목

구현 착수 전에 대표 확인이 필요하다. 승인 없이 진행하지 않는다.

| # | 항목 | 추천 | 대안 | 왜 승인이 필요한가 |
| --- | --- | --- | --- | --- |
| **A1** | 스키마 검증 라이브러리 도입 (§1.4) | **zod v4** (`npm install zod --cache F:\_npm-cache`) | valibot / 직접 작성 | 새 런타임 의존성. 다만 서버 전용이라 클라이언트 번들 영향 0 |
| **A2** | 상담 신청 알림 수단 (§4.5) | 지금은 **없음**, 배포 직전 **텔레그램/슬랙 웹훅** | 이메일(Resend/SMTP) / 카카오 알림톡 | 외부 서비스 연결 + 개인정보가 외부로 나가는 경로 |
| **A3** | 세션 토큰 구현 방식 (§5.3) | **`node:crypto` HMAC 직접** (의존성 0) | `jose` / `iron-session` | 직접 짠 암호 코드는 보안관 승인이 전제. 보안관이 라이브러리를 요구하면 그쪽 |
| **A4** | 이미지 재인코딩·EXIF 제거 (§3.6 V6) | 1차는 **하지 않음** (검증만) | `sharp` 도입 | `sharp` 는 네이티브 바이너리라 설치 용량이 크고 배포 플랫폼을 탄다 |
| **A5** | 관리자 로컬 편집 결과를 git 에 커밋하는 워크플로 (§2.2) | **커밋한다** — 이력이 곧 undo | 커밋 안 함 | 대표가 관리자에서 저장할 때마다 저장소가 dirty 해진다. 이 운영 방식에 동의가 필요 |
| **A6** | `Services` 4개 · `Principles` 3개 · `Audiences` 3개 **개수 고정** (§1.4) | **고정** | 자유 + 레이아웃 대응 | 관리자가 항목을 못 늘린다는 제약. 늘리려면 수진의 레이아웃 재설계가 선행 |

**승인 불필요(사실 확인 결과 그냥 따르는 것)**
- `middleware.ts` 가 아니라 `proxy.ts` [D5, D6]
- `unstable_cache` 미사용 [D16]
- `cacheComponents` 는 지금 켜지 않음 (§2.6)
- Vercel 배포는 Supabase 어댑터 이후 (§2.4)

---

## 8. 구현 순서

의존관계로 쪼갰다. **파일 소유가 겹치지 않게 갈랐다** — 데이브(서버·데이터)와 선우(UI)가 같은 파일을 동시에 만지지 않는다.

### P0 — 착수 전제 (구현 아님)
- A1~A6 승인
- 보안관 `docs/admin-security.md` · 수진 `docs/admin-ui.md` 확정
- `.gitignore` 수정 (§6) — **가장 먼저.** 개인정보 파일이 만들어지기 전에

### P1 — 콘텐츠 스키마와 시드 (데이브 단독)
> 화면 변화 0. 이 단계에서 선우는 P1 을 기다리지 않고 기존 작업을 계속한다.

| 파일 | 담당 |
| --- | --- |
| `src/lib/content/schema.ts` | 데이브 |
| `src/lib/content/seed.ts` | 데이브 |
| `scripts/content-init.mjs` | 데이브 |

완료 조건: `seed` 가 스키마 검증을 통과하고, `site.ts` 대비 값 누락이 없음. `npx tsc --noEmit` 통과.

### P2 — 저장소 어댑터 (데이브 단독)
| 파일 | 담당 |
| --- | --- |
| `src/lib/content/store/{types,json,index}.ts` | 데이브 |
| `src/lib/content/read.ts` (`getContent`) | 데이브 |
| `instrumentation.ts` (읽기전용 가드) | 데이브 |

완료 조건: 원자적 쓰기·revision 충돌·손상 복구를 수동으로 확인. Windows `EPERM` 재시도 경로 확인.

### P3 — 읽기 전환 (데이브 주도 · 선우 리뷰) ⚠️ 유일한 대규모 충돌 구간
`site.ts` 를 지우고 14개 컴포넌트를 전환한다(§1.5 M2). **이 단계는 한 사람이 한 번에 한다.** 선우는 이 커밋 동안 `src/components/**` 를 건드리지 않는다. 반나절 이하 작업이므로 병렬화 이득보다 충돌 비용이 크다.

완료 조건: `npm run build` 로 `/` 정적 프리렌더 유지 확인, 렌더 결과가 전환 전과 동일.

### P4 — 인증과 라우트 골격 (병렬)
| 파일 | 담당 |
| --- | --- |
| `src/lib/auth/{session,dal}.ts` | 데이브 |
| `proxy.ts` | 데이브 |
| `src/app/(site)/layout.tsx` 이동 | 데이브 |
| `src/app/(admin)/layout.tsx` (셸·경고 띠) | **선우** (수진 명세) |
| `src/app/(admin)/admin/login/page.tsx` | **선우** (폼 UI) |
| `src/app/(admin)/admin/_actions/auth.ts` | 데이브 |

### P5 — 상담 폼 (병렬)
| 파일 | 담당 |
| --- | --- |
| `src/app/(site)/_actions/consult.ts` | 데이브 |
| `src/lib/leads/store/*` | 데이브 |
| `src/components/sections/ConsultForm.tsx` → `useActionState` | **선우** |
| `src/app/(admin)/admin/leads/**` 조회 UI | **선우** |
| 위 조회 UI 가 쓰는 `_actions/leads.ts` | 데이브 |

액션 시그니처(§4.1 `ConsultState`)를 P5 시작 시점에 먼저 확정해서 양쪽이 동시에 진행한다.

### P6 — 이미지 (병렬)
| 파일 | 담당 |
| --- | --- |
| `src/lib/media/store/*`, `listImageSlots()` | 데이브 |
| `src/app/api/admin/media/route.ts` | 데이브 |
| 드래그앤드롭 업로더 컴포넌트 | **선우** |
| `src/app/(admin)/admin/media/page.tsx` | **선우** |

업로드 응답 형식 `{ key, url, bytes }` 을 먼저 고정한다.

### P7 — 섹션 에디터 13개 (완전 병렬)
섹션 하나당 두 파일. **섹션 단위로 쪼개면 서로 안 겹친다.**

| 섹션당 파일 | 담당 |
| --- | --- |
| `_actions/<section>.ts` (검증 + `updateSection` + `revalidatePath`) | 데이브 |
| `admin/<section>/page.tsx` (폼 UI) | **선우** |

순서 제안: `site` → `hero` → `audience` → `program` → `faq` → 나머지. 앞의 넷이 서로 다른 스키마 형태(단일 객체 / 배열 / 잠금 id 배열 / 탭+카드 이중 배열)를 커버하므로, 여기서 패턴이 잡히면 나머지 9개는 복제 작업이 된다.

### P8 — Supabase 전환 (대표가 계정을 만든 뒤)
- 테이블 마이그레이션 (§2.5 스케치 기준)
- `store/{content,leads,media}-supabase.ts`
- `content.json` → DB 데이터 이관 스크립트
- `public/uploads/**` → Storage 업로드 + `content.json` URL 일괄 치환
- `next.config.ts` 에 `images.remotePatterns` 추가
- 그 다음에야 배포 (§2.4)

**계정 생성·연결·MCP 호출은 에이전트가 하지 않는다.** 필요한 명령어만 제시하고 대표가 실행한다 (AGENTS.md).

---

## 9. DEVNOTE 반영 예정 (구현 시작 시)

이 문서는 설계만 다루므로 `DEVNOTE.md` 는 아직 고치지 않았다. P1 착수 시 §6 보류 표의 아래 항목을 갱신한다.

- 관리자 페이지 — 보류 → **설계 확정** (저장소: 교체 가능한 어댑터, 1차 JSON 파일)
- 콘텐츠 계층 분리 — 보류 → **설계 확정** (`getContent()` 단일 진입점)
- 상담 폼 전송 — 미구현 → Server Action + `LeadStore`
- 신규 항목: 스키마·환경변수 목록 (§1.2, §6)
