# FOUNDER TRANSITION CHECK — 서버·저장 설계

작성: 데이브(backend) · 2026-09-10 · **설계 문서. 구현 없음.**

`/check` 개별 라우트, 제출 후 서버 계산 분석지, 응답 저장·조회, 나중에 홈에 얹기.
관리자 화면은 **지금 만들지 않는다.** 조회 인터페이스와 파일 위치만 예약한다.

콘텐츠·화면 카피는 로보·수진·선우 영역이다. 이 문서는 스키마·신뢰 경계·저장소·토큰·구현 순서만 다룬다.
보안 요건의 최종 문구·보유기간 숫자는 보안관(`docs/admin-security.md`)이 확정한다. 충돌하면 보안관이 우선한다.

전제: Supabase MCP 호출 없음. 외부 서비스 도입 없음. 실행 코드 없음.

---

## 0. 근거로 삼은 문서

Next.js **16.2.10**. 아래 표시는 `docs/admin-architecture.md` 의 `[D1]`~`[D18]`, `docs/pages-architecture.md` 의 `[R1]`~`[R16]` 을 그대로 가리킨다. 이 버전에서 설계에 직접 영향하는 사실만 다시 적는다.

| 이 설계에서 쓰는 사실 | 출처 |
| --- | --- |
| Server Action 이 Origin/Host CSRF 를 막는다. 본문 기본 1MB | D1, D2, D14 |
| `useActionState` 첫 인자는 이전 상태, 본문에 `$ACTION_*` 가 섞인다 | D3 |
| `cookies()` 는 async. `.set` 은 Action/Route Handler 안에서만 | D7 |
| `middleware.ts` → `proxy.ts`. Server Function 은 Proxy matcher 를 우회할 수 있다 | D5, D6 |
| `cacheComponents` 꺼짐. `unstable_cache` / `use cache` 쓰지 않음 | D8, D16 |
| `params` / `searchParams` 는 Promise. `searchParams` 를 읽으면 동적 렌더 | R1, R2 |
| `generateStaticParams` 없는 동적 세그먼트는 요청 시 생성. 쓰레기 slug 는 `notFound()` | R2, R5, R6 |
| JSON 파일 어댑터는 로컬 전용. 서버리스 디스크는 비영속 | D13, 관리자 설계 §2.4 |
| 저장소는 접근 패턴별로 나눈다 (Content / Lead / Media) | 관리자 설계 §2.1 |

문항 본문·구간 해석의 원본:

- `F:\_tmp\founder-check\FOUNDER_TRANSITION_CHECK_문항별_점수해석.md`
- `F:\_tmp\founder-check\FOUNDER_TRANSITION_CHECK_점수대별_진단_가이드.txt`

런타임에 `F:\_tmp` 를 읽지 않는다. 구현 시 카탈로그를 저장소 안으로 옮긴다(§7 P1).

---

## 1. 무엇을 만들고 무엇을 안 만드는가

| 한다 | 안 한다 (지금) |
| --- | --- |
| 공개 라우트 `/check` (홈 메뉴·메가메뉴에 넣지 않음) | `/admin/checks` 화면 |
| 제출 Server Action → 서버가 총점·영역·고득점 문항을 계산 | 클라이언트 총점을 믿거나 쿼리스트링으로 결과 전달 |
| 분석지 `/check/r/[token]` | 홈 히어로·메뉴에 체크 CTA (나중) |
| JSONL 어댑터로 21문항 저장 | 상담 `leads.jsonl` 에 같은 줄로 섞기 |
| 관리자용 `CheckStore` 메서드 예약 (list / getById / stats) | 알림 웹훅, 캡차, Supabase, 새 npm 패키지 |

`docs/pages-architecture.md` §1.1 공개 색인 표에 `/check` 는 아직 없다. 승인 항목 **C6** 에서 색인 여부를 정한 뒤 그 문서에 한 줄 추가한다. 결과 URL 은 어떤 경우에도 사이트맵·`ROUTES.index` 에 넣지 않는다.

---

## 2. 도메인 — 문항·영역·구간

21문항 Likert 1~5. 영역 7 × 3문항. 총점 범위 21~105.

점수가 높을수록 역량이 낮다는 뜻이 아니다. **전환 신호의 밀도**다. 해석 원문이 그렇게 못 박는다. 서버 카탈로그와 결과 카피도 이 전제를 따른다.

### 2.1 문항 키 (안정 식별자)

번호는 표시용이다. 저장·해석은 **키**로 한다. 나중에 문항을 끼워 넣어도 옛 레코드가 밀리지 않는다.

| # | 영역 | 키 | 짧은 라벨 (원문 제목) |
| --- | --- | --- | --- |
| 1 | VALUE | `VALUE_SHIFT` | VALUE SHIFT |
| 2 | VALUE | `PURPOSE_AWARENESS` | PURPOSE AWARENESS |
| 3 | VALUE | `VALUE_BASED_DECISION` | VALUE-BASED DECISION |
| 4 | ROLE | `ROLE_TRANSITION` | ROLE TRANSITION |
| 5 | ROLE | `ROLE_CLARITY` | ROLE CLARITY |
| 6 | ROLE | `ROLE_BOUNDARY` | ROLE BOUNDARY |
| 7 | BEING | `IDENTITY` | IDENTITY |
| 8 | BEING | `SOURCE_OF_FULFILLMENT` | SOURCE OF FULFILLMENT |
| 9 | BEING | `SELF_WORTH` | SELF-WORTH |
| 10 | LEADERSHIP | `LEADERSHIP_TRANSITION` | LEADERSHIP TRANSITION |
| 11 | LEADERSHIP | `INFLUENCE` | INFLUENCE |
| 12 | LEADERSHIP | `LEADER_CAPABILITY` | LEADER CAPABILITY |
| 13 | ORGANIZATION | `LEADERSHIP_IMPACT` | LEADERSHIP IMPACT |
| 14 | ORGANIZATION | `FOUNDER_DEPENDENCY` | FOUNDER DEPENDENCY |
| 15 | ORGANIZATION | `ORGANIZATIONAL_AUTONOMY` | ORGANIZATIONAL AUTONOMY |
| 16 | DECISION | `DECISION_OVERLOAD` | DECISION OVERLOAD |
| 17 | DECISION | `FOUNDER_FOCUS` | FOUNDER FOCUS |
| 18 | DECISION | `DECISION_AUTHORITY` | DECISION AUTHORITY |
| 19 | LIFE | `LIFE_NEGLECT` | LIFE NEGLECT |
| 20 | LIFE | `LIFE_TO_LEADERSHIP_SPILLOVER` | LIFE-TO-LEADERSHIP SPILLOVER |
| 21 | LIFE | `LIFE_SUSTAINABILITY` | LIFE SUSTAINABILITY |

```
AreaId = VALUE | ROLE | BEING | LEADERSHIP | ORGANIZATION | DECISION | LIFE
Likert = 1 | 2 | 3 | 4 | 5
```

영역 합 = 해당 3문항의 합. 범위 3~15.

### 2.2 총점 구간

코드는 짧은 키, 화면 라벨은 가이드 원문.

| 총점 | `band` | 화면 라벨 |
| --- | --- | --- |
| 21–41 | `STABLE` | STABLE |
| 42–62 | `SIGNAL` | TRANSITION SIGNAL |
| 63–83 | `NEEDED` | TRANSITION NEEDED |
| 84–105 | `PRIORITY` | TRANSITION PRIORITY |

경계는 닫힌 구간이다. 41은 STABLE, 42는 SIGNAL. 계산 함수 밖에 구간을 두지 않는다.

### 2.3 서버만 계산하는 파생값

클라이언트가 `total` / `band` / `areas` 를 보내도 **버린다.** 원본은 21개 Likert 뿐이다.

```
compute(answers) →
  total          21개 합
  band           위 표
  areas          AreaId → 3~15
  highKeys       값이 4 또는 5인 문항 키[]
  midKeys        값이 3인 문항 키[]
  topAreas       영역 합이 가장 높은 1~2개 (동점이면 키 고정 순: VALUE→…→LIFE)
```

결과 페이지 본문 순서(해석 원문 「리포트에 쓰는 순서」):

1. 총점 + 구간 가이드
2. `topAreas` 1~2개의 영역 해석
3. `highKeys` 문항 해석 + Transition Point
4. `midKeys` 는 “아직 판단이 열린 지점” 한 줄
5. 1–2점 문항은 기본 생략. 영역 3문항이 모두 1–2일 때만 “이 축은 신호가 적다” 한 줄

의학·심리 진단이 아니라는 고지는 결과 페이지 하단에 고정 카피로 둔다. 관리자 편집 대상이 아니다.

---

## 3. 제출 스키마

식별 필드는 전부 옵션이다. **21개 점수는 이름·연락처가 없어도 레코드가 성립한다.**

### 3.1 타입

```ts
type Likert = 1 | 2 | 3 | 4 | 5;

type ItemKey =
  | "VALUE_SHIFT" | "PURPOSE_AWARENESS" | "VALUE_BASED_DECISION"
  | "ROLE_TRANSITION" | "ROLE_CLARITY" | "ROLE_BOUNDARY"
  | "IDENTITY" | "SOURCE_OF_FULFILLMENT" | "SELF_WORTH"
  | "LEADERSHIP_TRANSITION" | "INFLUENCE" | "LEADER_CAPABILITY"
  | "LEADERSHIP_IMPACT" | "FOUNDER_DEPENDENCY" | "ORGANIZATIONAL_AUTONOMY"
  | "DECISION_OVERLOAD" | "FOUNDER_FOCUS" | "DECISION_AUTHORITY"
  | "LIFE_NEGLECT" | "LIFE_TO_LEADERSHIP_SPILLOVER" | "LIFE_SUSTAINABILITY";

type AreaId =
  | "VALUE" | "ROLE" | "BEING" | "LEADERSHIP"
  | "ORGANIZATION" | "DECISION" | "LIFE";

type Band = "STABLE" | "SIGNAL" | "NEEDED" | "PRIORITY";

type CheckIdentity = {
  name: string | null;       // trim 후 2–40. 없으면 null
  phone: string | null;      // 숫자만 10–11자리. 없으면 null
  consentAt: string | null;  // ISO8601. 식별 필드가 하나라도 있으면 필수
  consentVersion: string | null;
};

type CheckRecord = {
  id: string;                          // crypto.randomUUID() — 관리자·파기 로그용
  createdAt: string;                   // 서버 시각 ISO8601
  instrument: "founder-transition-check";
  instrumentVersion: "2026-09-10";
  answers: Record<ItemKey, Likert>;    // 21키 전부 필수
  identity: CheckIdentity;             // 값 없이도 객체는 둔다 (필드 안정)
  resultTokenHash: string;             // SHA-256(hex) of resultToken. 원문은 저장하지 않음 (§5)
  source: "web";
  purgeAt: string;                     // 서버가 계산해 저장
};

// 디스크에 같이 쓸 수도 있는 파생 캐시. 원본이 아니다.
type CheckScores = {
  total: number;
  band: Band;
  areas: Record<AreaId, number>;
};
```

JSONL 한 줄에는 `CheckRecord` + 선택적 `scores` 캐시를 둔다. 읽기 시 `compute(answers)` 와 캐시가 다르면 **answers 를 이긴다.** 캐시는 목록·통계용 힌트일 뿐이다.

### 3.2 저장 레코드 JSON 예시

식별 없음 (최소 성립 레코드):

```json
{
  "id": "7c2e0b1a-4d9f-4a11-9c3e-2f8a6b1d0e44",
  "createdAt": "2026-09-10T08:12:03.441Z",
  "instrument": "founder-transition-check",
  "instrumentVersion": "2026-09-10",
  "answers": {
    "VALUE_SHIFT": 4,
    "PURPOSE_AWARENESS": 3,
    "VALUE_BASED_DECISION": 4,
    "ROLE_TRANSITION": 5,
    "ROLE_CLARITY": 4,
    "ROLE_BOUNDARY": 5,
    "IDENTITY": 2,
    "SOURCE_OF_FULFILLMENT": 3,
    "SELF_WORTH": 2,
    "LEADERSHIP_TRANSITION": 4,
    "INFLUENCE": 3,
    "LEADER_CAPABILITY": 4,
    "LEADERSHIP_IMPACT": 3,
    "FOUNDER_DEPENDENCY": 5,
    "ORGANIZATIONAL_AUTONOMY": 4,
    "DECISION_OVERLOAD": 5,
    "FOUNDER_FOCUS": 4,
    "DECISION_AUTHORITY": 4,
    "LIFE_NEGLECT": 3,
    "LIFE_TO_LEADERSHIP_SPILLOVER": 2,
    "LIFE_SUSTAINABILITY": 3
  },
  "identity": {
    "name": null,
    "phone": null,
    "consentAt": null,
    "consentVersion": null
  },
  "resultTokenHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "source": "web",
  "purgeAt": "2027-03-09T08:12:03.441Z",
  "scores": {
    "total": 76,
    "band": "NEEDED",
    "areas": {
      "VALUE": 11,
      "ROLE": 14,
      "BEING": 7,
      "LEADERSHIP": 11,
      "ORGANIZATION": 12,
      "DECISION": 13,
      "LIFE": 8
    }
  }
}
```

위 예시에서 서버가 다시 계산하면 `topAreas = ["ROLE", "DECISION"]`, `highKeys` 는 4–5점 문항이다. 클라이언트가 `scores.total` 을 99로 바꿔 보내도 저장 경로에 그 필드가 없다.

식별 있음 (옵션 필드만 채움):

```json
{
  "identity": {
    "name": "김대표",
    "phone": "01012345678",
    "consentAt": "2026-09-10T08:12:03.441Z",
    "consentVersion": "check-identity-2026-09-10"
  }
}
```

나머지 필드는 위와 같다. **이메일은 받지 않는다.** 상담 폼과 같은 최소수집(보안관 PII, 이메일 추가 금지).

### 3.3 서버 검증 규칙

클라이언트 검증은 UX 용이다. Action 은 UI 없이 POST 로 호출된다 [D1, D2]. 서버에서 처음부터 다시 한다.

| 필드 | 규칙 |
| --- | --- |
| `answers[ItemKey]` | 21키 전부 존재. 정수 1~5. 문자열 `"4"` 는 정수로 좁히되 그 외는 거부 |
| 정의되지 않은 필드 | **무시.** `Object.fromEntries(formData)` 를 저장하지 않는다 (`$ACTION_*`, 위조 `total`) |
| `name` | 비었으면 null. 있으면 trim 2–40, 제어문자 제거 |
| `phone` | 비었으면 null. 있으면 숫자만 10–11자리 |
| `agree` | `name` 또는 `phone` 이 있으면 필수. 둘 다 없으면 검사하지 않음 |
| `honeypot` | 비어 있어야 함. 값이 있으면 성공처럼 보이고 저장하지 않음 (RATE-1) |
| `renderedAt` + 서명 | RATE-2. 2초 미만 거부, 2시간 초과 만료. 키는 `FORM_TOKEN_SECRET` + 접두어 `check-form:` |

저장하지 않는 것: IP, User-Agent, Referer, 클라이언트 `total`/`band`, 결과 토큰 원문.

에러 응답: 필드 에러는 문항 번호 수준으로만. 저장 실패는 “잠시 후 다시 시도해 주세요”. 경로·스택·파일명 없음.

### 3.4 동의·보유 — 상담과 다른 점

상담은 이름·연락처가 **필수**라 매 건이 개인정보다. 체크는 두 층이다.

| 레코드 | 개인정보로 다루는가 | 동의 |
| --- | --- | --- |
| 점수 21개만 | 단독으로 특정 개인을 가리키기 어렵다. 그래도 git 제외·공개 API 없음·보유기간은 적용 | 체크박스 없음. **저장된다는 고지**는 폼 하단에 둔다 (C1) |
| 이름 또는 연락처가 있는 건 | 상담과 같은 PII 규칙 | 체크박스 필수. 처리방침 링크. 만 14세 고지 |

`purgeAt` 초안 (보안관 확정 전, 승인 **C2**):

```
식별 없음 : createdAt + 180일
식별 있음 : createdAt + 180일
절대 상한 : createdAt + 365일
```

상담의 `closedAt + 180일` 규칙은 여기 없다. 체크는 “상담 종료”가 없다. 미구현 관리자에서 상태를 올리기 시작하면 그때 보안관이 규칙을 다시 쓴다.

지연 파기(PII-11)는 `CheckStore` 의 모든 읽기/쓰기 앞에서 `purgeAt < now` 인 줄을 진짜 삭제한다. 소프트 삭제 없음. 파기 로그는 `{ recordId, purgedAt, reason }` 만 (`data/check-purge-log.jsonl`).

식별 필드를 나중에 같은 레코드에 붙이는 흐름은 **만들지 않는다.** 제출 시점에 있거나, 없다.

---

## 4. 결과 페이지 — 서버가 계산해서 렌더

### 4.1 왜 클라이언트를 못 믿는가

`/check` 는 공개 쓰기 엔드포인트다. 브라우저가 보낸 `total=21` 을 그대로 보여주면 분석지가 조작된다. hidden 필드, 쿼리스트링(`?band=STABLE`), `localStorage` 전부 같은 구멍이다.

유일한 원본은 **서버가 검증한 `answers` 21개**다. 결과 페이지는 토큰으로 레코드를 읽고 `compute()` 를 다시 돌린 뒤 카탈로그를 입힌다.

### 4.2 전송 — Server Action

상담과 같은 이유(관리자 설계 §4.1): CSRF 공짜, 본문이 작다(숫자 21 + 짧은 텍스트 ≪ 1MB), `useActionState` 패턴, JS 없이도 제출 큐잉.

Route Handler 로 두지 않는다. JSON API 를 하나 더 열 이유가 없다.

```
src/app/(site)/check/_actions/submit.ts
```

시그니처 초안 (`useActionState` [D3]):

```ts
"use server";

export type CheckFormState =
  | { status: "idle" }
  | { status: "error"; errors?: Record<string, string[]>; message?: string };

export async function submitCheck(
  _prev: CheckFormState,
  formData: FormData,
): Promise<CheckFormState> { /* 검증 → compute → store.create → redirect */ }
```

성공 시 상태를 반환하지 않고 `redirect("/check/r/" + token)` 한다. 토큰 원문은 이 한 번과 응답 `Location` 에만 존재한다.

재검증(`revalidatePath`)은 하지 않는다. 공개 페이지에 남의 점수를 보여주지 않는다.

### 4.3 라우트와 렌더

```
(site)/check/page.tsx                 폼. 동적 (RATE-2 서명 토큰)
(site)/check/r/[token]/page.tsx       분석지. 동적. generateStaticParams 금지
(site)/check/r/layout.tsx             metadata.robots = noindex, nofollow, noarchive
```

`/check` 는 `/consult` 와 같다. 서명 토큰 때문에 요청 시점 값이 필요하고, 그 비용은 이 페이지에만 둔다. 랜딩 `/` 는 정적 프리렌더를 유지한다 (pages 설계 §1.6, 보안관 RATE-2).

결과 페이지:

1. `const { token } = await params` [R2]
2. `token` 형식(base64url, 고정 길이)이 아니면 `notFound()` — 디스크를 치기 전
3. `sha256(token)` 으로 조회. 없거나 `purgeAt` 지났으면 `notFound()` (존재 여부를 에러 문구로 가르지 않음)
4. `compute(record.answers)` + 해석 카탈로그로 뷰모델 생성
5. Server Component 가 HTML 렌더. 점수 원본을 Client Component 에 편집 가능하게 넘기지 않음

`dynamicParams` 는 기본 `true` 로 둔다 [R6]. `false` 로 두면 토큰이 빌드 목록에 없어 전부 404다. 쓰레기 토큰 차단은 `notFound()` 책임이다.

`generateStaticParams` 는 **절대 쓰지 않는다.** 토큰을 빌드 산출물에 구우면 분석지가 정적 자산이 된다 (보안관 P8 과 같은 종류의 사고).

헤더·푸터는 `(site)` 레이아웃을 그대로 쓴다. 결과에서 `/consult` 로 가는 CTA 자리는 남긴다. 카피·전환은 얌얌. **체크 점수를 상담 신청에 자동으로 복사하지 않는다.**

결과 HTML 에 `identity.phone` 을 넣지 않는다. 토큰 URL 은 링크만 있으면 누구나 열 수 있다(§5). 이름은 “○○ 님의 결과” 정도만, 있어도 되고 없어도 된다.

---

## 5. 결과 링크 토큰

### 5.1 결정

| 항목 | 값 |
| --- | --- |
| URL | `/check/r/<token>` |
| 토큰 | 32바이트 CSPRNG → base64url (43자). `id`(UUID)와 **다름** |
| 디스크 | `resultTokenHash` (SHA-256 hex) 만. 원문 미저장 |
| 권한 | 토큰을 아는 사람 = 그 분석지를 볼 수 있음 (bearer) |
| 수명 | `purgeAt` 까지. 별도 짧은 TTL 은 두지 않음 (C3 에서 바꿀 수 있음) |
| 재발급 | 원문을 저장하지 않으므로 관리자도 옛 링크를 복원할 수 없음. 필요하면 새 토큰 해시로 교체하는 액션을 **나중에** 둠 |

`id` 와 토큰을 분리하는 이유: 관리자 목록 URL 은 `/admin/checks/[id]` 가 된다(나중). 같은 UUID 를 공개 경로에 쓰면 화면 공유 한 장이 곧 분석지 주소다. 공개 bearer 와 관리자 식별자를 갈라 둔다.

해시를 저장하는 이유: `data/checks.jsonl` 이 유출돼도 결과 URL 을 바로 만들 수 없다. 조회는 `hash(제시된 토큰)` 과 저장된 해시를 비교한다.

### 5.2 하지 않는 것

- `?total=76&band=NEEDED` 같은 쿼리. 위조 + 서버 로그·Referer·히스토리에 점수 남음 (PII-15 와 같은 구멍)
- 쿠키만으로 결과 유지. 기기 바뀌면 분석지가 사라지고, 공유할 주소가 없다
- HMAC(id+만료) 단독. 재발급은 쉽지만 시크릿 로테이션 시 전 링크가 죽고, 조회는 결국 `id` 로 파일을 연다. 해시 저장보다 이득이 없다
- 순번 `/check/r/1`. 열거 가능

### 5.3 공개 결과 페이지의 잔여 위험

토큰 URL 은 북마크·카톡·Referer 에 남는다. 이건 구조적으로 없앨 수 없다. 완화:

- `robots` noindex · 사이트맵 제외
- 전화번호 미렌더
- 토큰 엔트로피 256비트
- 나중에 관리자 “링크 무효화”(해시 교체) 자리를 인터페이스에만 남김

보안관에게 넘길 문장: **결과 URL 은 비밀 링크이고, 식별 정보가 붙은 건 특히 그렇다.**

---

## 6. JSON 어댑터 — 상담과 같은 패턴, 다른 파일

### 6.1 재사용하는 것

관리자 설계 §2.1~§2.4 를 그대로 가져온다.

- 저장소를 콘텐츠·상담·미디어와 **네 번째로** 나눈다. 접근 패턴이 다르다 (추가 + 토큰 조회 + 집계)
- 위치는 `CONTENT_DATA_DIR`(기본 `./data`). `src/` 금지 (Turbopack 감시·`resolveJsonModule` 고정)
- append-only JSONL. 신청(응답)을 잃으면 안 되므로 배열 JSON read-modify-write 를 쓰지 않는다
- 프로세스 내 쓰기 큐 + Windows `rename` 3회 재시도
- `capabilities.writable` + `instrumentation.ts` 서버리스 부팅 차단 (관리자 설계 §2.4)
- 배포 전 Supabase 어댑터가 필요하다는 결론도 동일. **지금 어댑터를 구현하지 않고, 인터페이스만 맞춰 둔다**

```ts
export interface CheckStore {
  readonly capabilities: { writable: boolean };

  create(input: NewCheck): Promise<{ record: CheckRecord; resultToken: string }>;
  getByTokenHash(hash: string): Promise<CheckRecord | null>;
  getById(id: string): Promise<CheckRecord | null>;     // 관리자. 호출 전에 requireAdmin
  list(opts?: { limit?: number; before?: string }): Promise<CheckListItem[]>;
  stats(): Promise<CheckStats>;
  rotateToken(id: string): Promise<{ resultToken: string }>; // 나중
  remove(id: string): Promise<void>;                    // 진짜 삭제
}
```

`NewCheck` 는 `answers` + `identity` + `purgeAt` 계산에 필요한 서버 시각뿐이다. `id`·해시·`createdAt` 은 스토어가 만든다.

`getById` / `list` / `stats` / `remove` / `rotateToken` 구현은 P4에서 스토어에 넣는다. **페이지는 만들지 않는다.**

### 6.2 상담 파일에 쓰지 않는다

`leads.jsonl` 에 체크를 섞지 않는다. 이유:

1. 스키마가 다르다. 상담은 이름·전화 필수, 체크는 21점수가 필수
2. 질의 패턴이 다르다. 상담은 상태·연락, 체크는 토큰 조회·영역 평균
3. 파기 규칙이 다르다. `closedAt` 이 체크에 없다
4. 한 줄을 두 타입 유니온으로 읽으면 파서가 한 쪽 버그에 같이 죽는다
5. 나중에 테이블도 둘이다 (`leads` / `check_responses`). 지금 파일을 갈라 두면 이전이 복사다

```
data/
  content.json              사이트 콘텐츠. git 커밋 (기존 설계)
  leads.jsonl               상담. git 제외
  lead-meta.json            상담 상태. git 제외
  checks.jsonl              체크 응답. git 제외     ★신규
  check-purge-log.jsonl     파기 대장. git 제외     ★신규
```

### 6.3 gitignore

`.gitignore` 는 이미 `/data/submissions/` 를 막아 두었다. **파일명이 바뀌면 규칙이 빗나간다.** 체크 착수 전에 구체 경로를 추가한다. 개인정보 파일이 생기기 **전**에 해야 한다 (DEVNOTE 재개 지점, PII-6).

```
# 개인정보·응답 — 절대 커밋 금지
/data/leads.jsonl
/data/lead-meta.json
/data/checks.jsonl
/data/check-purge-log.jsonl
```

`data/content.json` 은 계속 커밋 대상(콘텐츠 undo). 응답 파일과 섞지 않는 이유가 여기에도 있다.

`public/` 하위에 JSON 을 두지 않는다 (보안관 P6).

### 6.4 배포 후

JSON 어댑터는 로컬 전용이다. Vercel 에 올리면 “분석지가 나왔는데 디스크에 없다”가 된다. 가드는 상담과 공유한다.

1. `instrumentation.ts` — `CONTENT_STORE=json` 이고 `VERCEL` 이면 throw
2. `CheckStore.create` 가 `writable === false` 면 저장하지 않고 일반 에러
3. 배포는 Supabase(또는 동등한 영속 저장소) 어댑터 이후. 계정은 대표가 신규로 만든다. 에이전트는 연결하지 않는다

Supabase 스케치 (구현·MCP 없음):

```
check_responses
  id uuid pk
  created_at timestamptz
  instrument_version text
  answers jsonb not null          -- Record<ItemKey, Likert>
  name text null
  phone text null
  consent_at timestamptz null
  consent_version text null
  result_token_hash text unique not null
  purge_at timestamptz not null
```

`CheckStore` 시그니처는 그대로다. RLS 켜고 정책 0, 서버 service role 만. 테이블을 지금 만들지 않는다.

### 6.5 로컬 최소 쓰기 경로

```
1. 스키마 검증 실패 → 원본 파일 손대지 않음
2. token = random 32B, hash = sha256(token)
3. 한 줄을 JSON.stringify + "\n"
4. fs.appendFile(checks.jsonl)
```

상담과 같다. 파기·토큰 교체만 해당 줄을 빼고 원자적 교체.

---

## 7. 관리자 조회 — `/admin` 을 지금 만들지 않는다

관리자 인증·`(admin)` 그룹·`proxy.ts` 는 관리자 설계 P4 이후다. 체크 때문에 그 일정을 앞당기지 않는다.

지금은 **호출 위치만 고정**해서, 나중에 화면을 얹을 때 공개 페이지에 조회 함수가 새지 않게 한다.

| 용도 | 위치 | 언제 |
| --- | --- | --- |
| 공개 제출 | `(site)/check/_actions/submit.ts` | P3 |
| 공개 결과 읽기 | `(site)/check/r/[token]/page.tsx` → `getByTokenHash` 만 | P3 |
| 관리자 목록·상세·파기 Action | `(admin)/admin/_actions/checks.ts` — 첫 줄 `requireAdmin()` | 관리자 P4 이후 |
| 관리자 화면 | `(admin)/admin/checks/page.tsx`, `checks/[id]/page.tsx` | 위와 같음 |
| 집계 | `CheckStore.stats()` — Action 이 아니라 관리자 서버 페이지가 직접 호출 | 위와 같음 |

공개 Route Handler `GET /api/checks` 는 만들지 않는다. 토큰 조회를 API 로 열면 크롤러·로그 표면만 늘어난다.

`CheckStore` 모듈은 `import "server-only"`. `getById` / `list` 는 함수 안에서 `requireAdmin()` 을 부를 수 있을 때만 export 한다. 관리자 DAL 이 생기기 전에는 `list`/`getById` 를 **같은 파일에 쓰되 페이지에서 import 하지 않는다.** 실수로 `(site)` 가 import 하면 컴파일은 되지만 런타임에 세션이 없다 → P4에서 DAL 이 생긴 뒤 연결한다.

Proxy matcher 는 `/admin` 만 유지한다 [D6]. `/check` 를 matcher 에 넣지 않는다 — 공개 폼이다.

---

## 8. 접수 통계 — 개인 점수 없이 영역 평균

“누가 어떻게 답했는지”는 저장된다. 기본 조회 화면(나중 대시보드)은 **집계만** 보여서 개인 점수를 보지 않고도 경향을 볼 수 있게 한다.

```ts
type CheckStats = {
  collectedAt: string;
  n: number;                         // purge 후 유효 건수
  identified: number;                // name 또는 phone 이 있는 건수
  band: Record<Band, number>;
  total: { mean: number; min: number; max: number };
  areas: Record<AreaId, { mean: number }>;
};
```

규칙:

- `answers` 21개, 이름, 전화를 **반환하지 않는다**
- 평균은 소수점 2자리. n=0 이면 숫자 대신 빈 통계
- 공개 페이지에 “이번 달 평균 72점” 을 올리지 않는다 (보안관 PII-7: 읽기 경로를 늘리지 않음)
- 개인 상세는 `getById` — 명시적 클릭. 목록 기본은 마스킹된 식별 + `band` + `hasIdentity` 정도. 21문항 펼침은 상세만 (PII-14 정신)

JSONL 단계 집계는 파일을 한 번 훑는다. 건수가 수백이면 충분하다. 인덱스는 만들지 않는다.

---

## 9. 흐름 — 체크 vs 상담

```
체크 (자기성찰)                         상담 (리드)
──────────────                         ──────────
GET /check  동적 폼                    GET /consult 또는 /#consult
  RATE-2 서명 토큰                       동일
  21 Likert 필수                        이름·전화 필수
  이름·전화 옵션                         희망시간·고민 옵션
POST submitCheck                       POST submitConsult
  서버 compute                          서버 정규화
  checks.jsonl append                   leads.jsonl append
redirect /check/r/<token>              같은 페이지 Thank you
  분석지 렌더                            “하루 안에 연락”
  전화 걸 의무 없음                      연락 의무(카피) 있음
```

나중에 홈에 얹을 때:

- 메뉴에 `RouteId: "check"` 추가 (pages 설계 §3.1). 지금은 `ROUTES` 에도 안 넣어도 동작한다 — `/check` 는 파일 시스템 라우트다
- 결과 CTA → `/consult?track=leadership` 또는 `#consult`. 토큰을 쿼리에 넣지 않는다
- 상담 레코드에 `checkId` 를 자동 결합하지 않는다. 필요하면 상담 폼 hidden `checkToken` 을 **옵션**으로 두고 서버가 해시로만 확인 (C7)

공통:

- Server Action, honeypot, 서명 체류시간, 에러 한 줄, `server-only` 스토어
- 서버리스에서 메모리 rate limit 은 인스턴스 로컬. 주석으로 한계를 남긴다

다른 점:

|  | 체크 | 상담 |
| --- | --- | --- |
| 성공 화면 | 다른 URL (토큰) | 같은 폼의 `done` 상태 |
| 중복 제출 | 익명이라 전화 기준 RATE-4 를 못 씀. 연속 제출은 별 레코드. IP 메모리 한도는 보안관 | 같은 전화 10분 흡수 (RATE-4) |
| 관리자 목적 | 패턴·코칭 단서 | 오늘 전화할 사람 |

---

## 10. Next 16 제약 체크리스트 (이 기능)

- [x] 제출은 Server Action. `bodySizeLimit` 올리지 않음
- [x] `proxy.ts` 에 `/check` 를 넣지 않음. 관리자 액션을 `(site)` 에서 import 하지 않음
- [x] 결과 `params` 는 `await`. `generateStaticParams` 없음
- [x] `/check` 만 동적. `/` 를 `searchParams` 로 오염시키지 않음
- [x] `cookies().set` 이 필요하면 Action 안. 1차 설계는 쿠키 없이 `redirect`
- [x] `unstable_cache` / `use cache` 없음. 결과 페이지를 캐시 태깅하지 않음
- [x] 스토어는 `server-only`
- [x] 서버리스 쓰기 가드는 기존 instrumentation 에 체크 경로를 얹음 (구현 시)

---

## 11. 구현 순서 P0–P4

관리자 설계 P4~P8, 다페이지 S1~S8 과 **파일 소유가 겹치지 않게** 갈랐다. 체크 P3 는 `(site)/check/**` 와 `src/lib/checks/**` 만 만진다. `site.ts`·랜딩 섹션·`(admin)` 을 건드리지 않는다.

### P0 — 착수 전제 (코드 없음)

- 아래 §12 승인 (특히 C1 동의 층, C2 보유기간, C6 색인)
- `.gitignore` 에 §6.3 경로 추가. **파일 생성보다 먼저**
- 보안관이 체크용 동의 고지·결과 URL 위험을 한 단락으로 확정
- 홈 메뉴·관리자 UI 를 이 과제에 넣지 않음을 유지

### P1 — 도메인 카탈로그 (데이브, 화면 0)

| 파일 | 역할 |
| --- | --- |
| `src/lib/checks/keys.ts` | `ItemKey` · `AreaId` · 문항→영역 맵 |
| `src/lib/checks/score.ts` | `compute()` 순수 함수. 클라이언트 번들 금지(`server-only` 또는 순수라 어디든, **저장은 서버에서만**) |
| `src/lib/checks/interpret.ts` | 구간 가이드 + 문항 1–2/3/4–5 본문. `_tmp` 원문을 구조화해 이전 |
| `src/lib/checks/schema.ts` | 제출 검증 (zod 승인 전이면 손 검증. A1 과 동일) |

완료: `compute` 가 예시 21개에 대해 total/band/areas 가 해석 원문과 맞음. `_tmp` 런타임 의존 0.

### P2 — 저장소 (데이브)

| 파일 | 역할 |
| --- | --- |
| `src/lib/checks/token.ts` | CSPRNG 토큰 + SHA-256 |
| `src/lib/checks/store/types.ts` | `CheckStore` |
| `src/lib/checks/store/json.ts` | JSONL 어댑터 |
| `src/lib/checks/store/index.ts` | `CONTENT_STORE` 로 선택. 지금은 json 만 |
| `.gitignore` | §6.3 (P0에서 못 했으면 여기서) |

완료: 로컬에서 create → hash 조회 → 없는 토큰 null. `writable` 가드. Windows append.

### P3 — 공개 라우트 (데이브 액션 + 선우 폼/분석지)

| 파일 | 담당 |
| --- | --- |
| `src/app/(site)/check/page.tsx` | 선우 셸, 데이브가 서명 토큰 props |
| `src/app/(site)/check/_actions/submit.ts` | 데이브 |
| `src/components/check/CheckForm.tsx` | 선우 (`useActionState`) |
| `src/app/(site)/check/r/[token]/page.tsx` | 데이브 조회 + 선우 마크업 |
| `src/app/(site)/check/r/layout.tsx` | noindex |
| `src/lib/checks/view-model.ts` | 렌더용 DTO. 전화 필드 없음 |

완료: `/check` 제출 → 분석지. 쿼리스트링 없이 총점·영역·고득점 문항이 서버와 일치. 홈 메뉴 변화 0. `next build` 에서 `/` 정적 유지, `/check/r/[token]` 이 정적 프리렌더 목록에 **안** 박힘.

### P4 — 관리자 조회 준비 (데이브, 화면 없음)

| 파일 | 역할 |
| --- | --- |
| `src/lib/checks/store/json.ts` | `list` / `getById` / `stats` / `remove` 구현 |
| `src/lib/checks/admin.ts` | 나중에 `requireAdmin()` 을 감쌀 진입점. 지금은 주석과 시그니처만으로도 됨 |

완료: 스토어 메서드가 로컬 JSONL 에 대해 동작함을 스크립트 또는 수동으로 확인. `(admin)/` 파일 0개.

P4 다음(이 문서 범위 밖): 관리자 설계 P4(인증) → `(admin)/admin/checks/**` + `_actions/checks.ts`. 홈 얹기(메뉴 `RouteId`, 랜딩 티저)는 별 승인.

---

## 12. 승인이 필요한 항목

승인 없이 구현에 들어가지 않는다. 외부 서비스·새 계정은 여기 없다.

| # | 항목 | 추천 | 대안 | 왜 승인이 필요한가 |
| --- | --- | --- | --- | --- |
| **C1** | 익명 21점수 저장 + 식별 시에만 동의 체크박스 | 이 문서 §3.4 | 전원 동의 필수 / 익명 저장 안 함(결과만 메모리) | 개인정보 처리 근거. 보안관·[법률 검토]. 익명 저장을 안 하면 결과 링크·나중에 “누가 답했는지” 조회가 성립하지 않음 |
| **C2** | 보유기간 `createdAt + 180일` (식별 여부 동일) | 180일 | 90일 / 365일만 | 처리방침·고지 문구와 글자가 같아야 함. `/privacy` 본문이 아직 없음 |
| **C3** | 결과 URL = bearer 토큰, 해시만 저장, 전화는 결과 HTML 에 없음 | 이 문서 §5 | 쿠키 세션만 / HMAC 토큰 | 링크를 가진 제3자가 분석지를 봄. 식별 건은 특히 민감 |
| **C4** | `checks.jsonl` 을 `leads.jsonl` 과 분리 | 분리 | 한 파일 유니온 | 운영·파기·이전 비용. 한 번 섞으면 나누기 어려움 |
| **C5** | `/check` 폼 페이지 검색 색인 | **색인함** (도구 공개) / 결과만 noindex | 폼도 noindex (초대 링크만) | 홈 메뉴에 없어도 URL 이 색인되면 유입이 생긴다. 마케팅 결정 |
| **C6** | 홈·메뉴에 지금 안 넣음 | 안 넣음 | 푸터에만 조용히 | 대표 지시와 동일. 번복이면 pages 설계 `ROUTES`·수진 메뉴가 같이 움직임 |
| **C7** | 상담 레코드와 체크 자동 결합 안 함 | 안 함 | hidden `checkToken` | 결합하면 상담 한 건이 21점수 PII 묶음이 됨 |
| **A1 재사용** | 검증 라이브러리 | 관리자 설계와 같이 zod 또는 손 검증 | — | 새 의존성이면 대표 승인. 체크만으로 zod 를 먼저 넣지 않음 |

**승인 불필요 (이미 문서에 있는 사실)**

- JSON 파일은 로컬 전용, 배포는 영속 어댑터 이후
- Supabase MCP·기존 계정 연결 금지
- `proxy.ts`, Server Action CSRF, `params` Promise
- 관리자 페이지를 이 과제에서 만들지 않음
- 캡차·알림 웹훅 도입 안 함 (관리자 설계 A2, 보안관 RATE-6)

---

## 13. 지금 로컬에서 동작하는 최소 구현 범위

P0 승인 + P1~P3 까지가 **로컬 `next dev` 에서 대표가 만져 볼 수 있는 최소**다.

되면:

- `http://localhost:3100/check` 에 21문항 (+ 옵션 이름·전화)
- 제출 후 `/check/r/…` 에서 총점·구간·높은 영역·4–5점 문항 해석
- `F:\coaching\data\checks.jsonl` 에 한 줄 추가 (git 제외)
- 같은 토큰으로 새로고침해도 같은 분석지
- 홈 `/` 메뉴·랜딩 변화 없음
- `/admin` 없음

안 되면 (의도):

- 배포 환경 저장
- 관리자 목록·통계 화면
- 메일/웹훅
- 홈 CTA
- 상담 신청과 점수 자동 연결
- 결과 링크 재발급 UI

로컬 확인 방법(구현 후): 문항을 전부 1로 내면 21 / STABLE, 전부 5로 내면 105 / PRIORITY. 영역 3칸만 5로 내면 그 축이 `topAreas` 에 오는지. 쿼리 `?total=21` 을 붙여도 숫자가 바뀌지 않는지.

---

## 14. 다른 설계 문서에 나중에 반영할 한 줄

구현 착수 전에 고치지 않는다. 승인 후:

- `docs/pages-architecture.md` §1.1 표에 `/check` 행, `/check/r/[token]` 은 색인 ×
- `docs/pages-architecture.md` `RouteId` 에 `"check"` (결과 토큰은 RouteId 가 아님)
- `docs/admin-architecture.md` §2.1 에 `CheckStore`, §2.2 파일 목록, §6 gitignore
- `docs/admin-security.md` 에 체크 동의 층·결과 bearer URL 단락 (보안관)
- `DEVNOTE.md` §6 에 체크 라우트·스키마·환경변수 (`FORM_TOKEN_SECRET` 재사용, 신규 시크릿 없음)

환경변수 **신규 없음.** RATE-2 는 상담과 같은 `FORM_TOKEN_SECRET`. `CONTENT_DATA_DIR` 가 `data/checks.jsonl` 위치. `NEXT_PUBLIC_*` 없음.

---

## 15. DEVNOTE 반영 예정 (P1 착수 시)

- 신규 공개 라우트 `/check` (메뉴 미포함), 결과 `/check/r/[token]`
- 저장: `CheckStore` + `data/checks.jsonl` (상담 파일과 분리, git 제외)
- 스키마: §3.1. 식별 옵션, 점수 21 필수
- 관리자 조회: 스토어만 예약. 화면은 관리자 설계 이후
