# 개발노트 — coaching

작업 이력과 결정사항을 기록한다. 새 작업을 시작할 때 이 문서를 먼저 읽는다.

최종 갱신: 2026-09-09

---

## 재개 지점 (2026-09-09 12:13 중단)

**관리자 페이지를 만들던 중 설계 단계에서 멈췄다.** 여기부터 이어서 하면 된다.

### 대표가 확정한 것

- 관리 대상: 섹션 텍스트 전부 + 이미지 + 상담 신청 목록
- 저장소: **교체 가능한 어댑터, 지금은 JSON 파일.** 나중에 Supabase로 교체 (새 계정 미개설)
- 상담 신청 실제 전송·저장 **포함**. 개인정보처리방침 페이지도 함께 만든다
- 이미지는 관리자에서 **파일 직접 업로드** (드래그앤드롭, 미리보기, 교체)
- 관리자 인증: 환경변수 비밀번호 1개 + 쿠키 세션
- 요구 수준: "아주 완벽한 UI, 홈페이지 관리에 최적화된 디자인"

### 진행 상태

| 단계 | 담당 | 산출물 | 상태 |
| --- | --- | --- | --- |
| 1 | 보안관 | `docs/admin-security.md` | 완료 |
| 1 | 수진 | `docs/admin-ui.md` | 완료 |
| 1 | 데이브 | `docs/admin-architecture.md` | 완료 |
| 2 | 데이브 | 서버 구현 — 인증·저장소 어댑터·Server Action·폼 전송 | 미착수 |
| 2 | 로보 | `site.ts` → 콘텐츠 스키마/시드 데이터 전환 + 개인정보처리방침 | 미착수 |
| 2 | 선우 | 관리자 UI 구현 — 섹션 편집·이미지 업로드·신청 목록 | 미착수 |
| 3 | 보안관 → 자비스 | 재검 후 커밋 | 미착수 |

### 다시 시작할 때

1. **`.gitignore` 부터 고친다.** 현재 `.env*` 패턴이 `.env.example` 까지 무시하고, 상담 신청 데이터 파일 제외 규칙이 아예 없다. **개인정보 파일이 만들어지기 전에** 넣어야 되돌릴 수 없는 사고를 막는다
2. 세 설계 문서를 읽고 **서로 충돌하는 결정이 없는지** 먼저 맞춘다. 특히 상담 신청 목록의 연락처 노출 여부(보안관 ↔ 수진), 저장 방식과 캐시 무효화(데이브 ↔ 수진)
3. 승인 항목을 대표에게 확인받는다. 데이브 문서 7절의 A1~A6(zod 도입 / 알림 수단 / 세션 토큰 구현 / 이미지 재인코딩 / 관리자 저장분의 git 커밋 운영 / 섹션 개수 고정)와 보안관·수진 문서 끝의 확인 항목
4. 그 다음 데이브 문서의 P0~P8 순서로 구현한다. 파일 소유가 데이브/선우로 갈라져 있고, P3(읽기 전환)만 병렬화하지 않는다 — 14개 컴포넌트를 동시에 만지면 충돌 비용이 더 크다

### 데이브가 Next 16 문서에서 확인한 제약 (기억이 아니라 실제 문서)

- `middleware.ts` → **`proxy.ts`** 로 변경. v16부터 기본 런타임이 Node.js이고 `runtime` 세그먼트 설정을 쓰면 에러가 난다
- `cacheComponents` 가 꺼져 있어 `use cache`·`cacheTag`·`updateTag` 를 쓸 수 없다. 재검증은 Server Action 안의 `revalidatePath("/", "layout")`. `"layout"` 인 이유는 루트 레이아웃도 콘텐츠를 읽기 때문(`generateMetadata`·Header·Footer)
- **Server Action 본문은 기본 1MB 제한.** 그래서 상담 폼은 Server Action(프레임워크가 CSRF Origin/Host 대조를 해준다), 이미지 업로드만 Route Handler로 분리했다. `bodySizeLimit` 을 전역으로 올리면 익명 상담 엔드포인트의 DoS 표면까지 커진다

### `as const` 를 잃을 때 깨지는 곳

컴파일 에러로 잡히는 건 `tone` → `PhotoTone` 하나뿐이다(8개 파일). `PROGRAM_CARDS` 가 이미 `ProgramCard[]` 명시 타입으로 해결한 선례가 있다.
**타입이 안 잡아주는 쪽이 더 위험하다** — `ProgramTabs.tsx:10` 의 `PROGRAM_TABS[0].id` 와 `StoryTabs.tsx:12` 의 `STORY_TABS[active]` 는 지금 튜플이라 존재가 보장되지만 배열이 되면 `noUncheckedIndexedAccess` 가 꺼져 있어 런타임에 터진다. `Principles` 3개·`Services` 4개는 `grid-cols-3/4` 에 묶여 있고, React key로 편집 가능한 제목을 쓰는 곳이 5군데다.

### 보안관이 이미 찾은 배포 차단급 문제 3가지

- **Vercel 서버리스는 파일시스템이 읽기 전용**이라 JSON 어댑터가 동작하지 않는다. 최악은 폼이 "접수되었습니다"를 띄우면서 데이터가 사라지는 것 — 신청자는 연락을 기다리고 대표는 신청이 없다고 생각한다. 배포 전 반드시 결론이 필요하다
- **Next.js 16은 `middleware.ts` 가 `proxy.ts` 로 바뀌었고, 그것만으로 관리자를 못 막는다.** Server Function은 독립 라우트가 아니라 그 함수를 쓰는 페이지로 가는 POST다. 관리자 액션을 공개 페이지에서 import 하면 `/admin` 보호가 통째로 우회된다. **모든 관리자 액션 첫 줄에 `requireAdmin()`** 이 필수
- **현재 동의 문구가 실제 폼과 어긋난다.** 문구는 "이름·연락처"만 말하는데 폼은 희망시간·고민되는 점도 받는다. 그리고 "상담 종료 후 6개월"은 **미상담 건의 파기 시점을 정의하지 못해** 무기한 보관이 된다

---

## 1. 프로젝트 개요

- 위치: `F:\coaching` (git 저장소, 기본 브랜치 `main`, 원격 없음)
- 성격: 코칭 브랜드 소개 + 무료 상담 신청 중심의 원페이지 랜딩
- **타깃: 성인 코칭 · 시니어 코칭 · 리더십 프로그램.** 학원·학습코칭·아동·학부모 대상이 아니다 (2026-09-09 정정)
- 디자인 레퍼런스: [hinok.life](https://hinok.life/) — 구조와 디자인 시스템을 분석해 그대로 적용
- 현재 단계: 초기 디자인 완료. 실제 콘텐츠(브랜드명·사진·연락처) 미확정

## 2. 기술 스택

| 항목 | 버전 / 선택 |
| --- | --- |
| Next.js | 16.2.10 (App Router, Turbopack, `src/` 디렉터리) |
| React | 19.2.4 |
| Tailwind CSS | v4 (`@theme` 기반 토큰, PostCSS 플러그인) |
| TypeScript | 5.x, `strict` |
| 애니메이션 | framer-motion 13 |
| 아이콘 | lucide-react |
| 유틸 | clsx + tailwind-merge (`cn()`) |

> **주의**: 이 Next.js 버전은 학습 데이터와 다르다. 코드 작성 전 `node_modules/next/dist/docs/` 의 해당 가이드를 읽는다 (`AGENTS.md` 규칙).

### 명령어

```bash
npm run dev     # 개발 서버 (작업 시 -p 3100 사용)
npm run build   # 프로덕션 빌드 (정적 프리렌더 확인)
npm run lint    # eslint
npx tsc --noEmit
```

## 3. 히녹에서 추출한 디자인 시스템

원본 HTML과 테마 CSS(`optimizer_user.php`)를 직접 내려받아 값을 추출했다. 눈대중이 아니라 실제 값이다.

### 폰트

- 세리프(로고·제목·버튼·가격·푸터): **Cormorant** — 원본과 동일
- 본문 라틴: **Mulish** — 원본 `muli`(Adobe Typekit)의 구글폰트 대응
- 본문 한글: **Noto Sans KR** — 원본 `SpoqaHanSansNeo`는 구글폰트에 없어 대체
- `next/font/google`로 셀프 호스팅. CSS 변수 `--font-cormorant` / `--font-mulish` / `--font-noto-sans-kr`

### 컬러 (`src/app/globals.css` 의 `@theme`)

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `forest` | `#003A40` | 브랜드 기본 · 본문 글자색 |
| `stem` | `#6B8B8D` | 라벨 · 보조 텍스트 |
| `grass` | `#9DB4AB` | 세이지 포인트 |
| `grass-20` | `#EBF0EE` | 상단 띠 배너 · 상담 섹션 배경 |
| `grass-10` | `#F5F7F7` | 서비스 · FAQ 섹션 배경 |
| `ink` ~ `ink-02` | `#212121` ~ `#F9F9F9` | 검정 농도(%) 기준 회색 스케일 |

**본문 색 하한은 `ink-70`이다.** `ink-60`(#797979)은 흰 배경에서 4.35:1로 WCAG AA(4.5:1)에 미달한다. `ink-50` 이하는 본문에 쓰지 않는다. UI 경계선(입력 밑줄·체크박스)은 `ink-50`이 하한(3:1).
`stem`(#6B8B8D)도 3.7:1로 미달이라 **장식용 eyebrow에만** 쓴다. 기능 텍스트(폼 라벨 등)에는 `forest-70`(4.95:1)을 쓴다.

### 타이포 스케일 (데스크톱 / 1024px 이하)

`.t1` 40/32 · `.t2` 34/26 · `.t3` 28/22 · `.t4` 24/20 · `.b1` 20/18 · `.b2` 18/16 · `.b3` 16/15 · `.c1` 13/12 (px)

제목은 `line-height:120%` + `font-weight:400` + 세리프, 본문은 `line-height:160%`.

2026-09-09에 시니어가 주 타깃에 들어오면서 본문 하한을 올렸다(`.b3` 12/14 → 15/16px). `.t1`/`.t2`는 페이지 인상을 만드는 단계라 고정하고, 그 사이 단계만 위계가 겹치지 않게 밀어 올렸다.

### 레이아웃 규칙

- 브레이크포인트 **1024px 단일 기준** (원본과 동일)
- CSS 변수로 반응형 처리: `--gutter` 40/20px, `--header-h` 84/62px, `--banner-h` 60/40px
- 섹션 상하 여백 80px(모바일 64px), 좌우는 `--gutter`
- 최대폭 제한 없는 풀블리드. `Container`는 좌우 여백만 담당
- `.lined` 유틸 = 히녹의 `btn_line.lined` (1px 밑줄 텍스트 링크). 사이트 전반의 주요 CTA
- 데스크톱 그리드는 모바일에서 `snap-x` 가로 스크롤 슬라이더로 전환

## 4. 파일 구조

```
src/
  app/
    layout.tsx        폰트 3종, metadata, TopBanner + Header + main + Footer
    page.tsx          섹션 조립 (히녹 순서)
    globals.css       디자인 토큰 + 타이포 스케일 + .lined/.serif/.no-scrollbar
  components/
    layout/
      TopBanner.tsx   상단 띠 배너, 문구 4초 순환, KR/EN 표기
      Header.tsx      히어로 위 투명 → 스크롤 시 흰 배경, 가운데 세리프 내비 + 메가메뉴
      Footer.tsx      흰색→세이지 그라데이션, 세리프, 3단 컬럼
    sections/
      HeroSlider.tsx    풀블리드 100svh 슬라이더, 좌하단 카피, 선형 페이지네이션
      AudienceRows.tsx  성인/시니어/리더십 좌우 교차 3행 (추가 섹션)
      ProgramTabs.tsx   Start/1:1/Online 탭 + 가로 카드 슬라이더 (화면 밖으로 흘림)
      MidBanner.tsx     풀블리드 다크 배너, 좌 제목 / 우 본문 분할
      StoryTabs.tsx     이미지 + 비활성 탭 15% 투명도 (원본 with_hinok)
      Services.tsx      연한 세이지 배경, 서비스 4종, 라운드 썸네일
      CoachBand.tsx     코치 소개 (코칭 사이트용 추가 섹션)
      BrandStory.tsx    풀블리드 다크, 중앙 워드마크 + 밑줄 링크
      Principles.tsx    하단 3분할 오버레이 카드 (원본 Clean Made 계열)
      Faq.tsx           details/summary 아코디언, +/× 아이콘 (추가 섹션)
      ConsultSection.tsx / ConsultForm.tsx   상담 신청 (추가 섹션)
    ui/
      Photo.tsx       사진 자리 표시 + src 있으면 next/image 전환
      Buttons.tsx     PillButton(solid/white/outline) + LinedLink
      Container.tsx   좌우 여백 컨테이너
      Reveal.tsx      스크롤 진입 페이드업 (framer-motion)
  lib/
    site.ts         모든 문구·가격·연락처·이미지 경로의 단일 소스
    utils.ts        cn()
```

### 섹션 순서

Hero → **Audience(성인·시니어·리더십)** → Program 탭 → Mid Banner → Story 탭 → Service → **Coach** → Brand Story → Principles → **FAQ** → **Consult** → Footer

굵은 항목은 코칭 사이트에 필요해서 추가한 섹션. 나머지는 히녹 원본 구조 그대로.

`AudienceRows` 를 히어로 직후에 둔 이유: 자기가 어느 트랙인지 모르는 사람에게 가격표(Program)부터 보여주는 건 순서가 거꾸로다. 트랙을 정한 직후에는 가격이 바로 필요하므로 `ProgramTabs` 는 제거하지 않고 한 칸 밀었다.
3단 그리드가 아니라 좌우 교차 3행인 것도 의도다. 3단 그리드는 "셋 중 하나 고르세요"라는 상품 진열 문법인데, 세 대상은 SKU가 아니라 서로 다른 실무다. 우선순위는 순서로만 표현한다.

## 5. 사진 처리 방식 (중요)

촬영본이 없어서 `Photo` 컴포넌트가 브랜드 팔레트 그라데이션으로 자리를 채운다. 톤은 `sage` / `paper` / `mist` / `dusk` / `forest` 5종.

실제 사진 적용 방법:

1. `public/images/` 에 파일을 넣는다
2. `src/lib/site.ts` 의 해당 항목 `image: ""` 에 경로를 채운다
3. `Photo`가 자동으로 `next/image`(fill + object-cover)로 전환된다

밝은 톤 위에 흰 글자가 올라가는 히어로·배너·원칙 카드에는 스크림(그라데이션 오버레이)이 걸려 있다. 실제 사진으로 교체하면 밝기에 맞춰 스크림 농도를 재조정해야 한다.

## 6. 결정사항 / 보류 항목

| 항목 | 상태 | 메모 |
| --- | --- | --- |
| Supabase 연동 | **보류** | 사용자 요청으로 제외. 관련 패키지도 설치하지 않음 |
| GitHub 원격 | **보류** | 사용자 요청으로 제외. 로컬 커밋만 유지 |
| 관리자 페이지 | **보류** | 저장소 방식(JSON 파일 임시 / Supabase) 미결정 |
| 관리자 인증 | 방향 확정 | 환경변수 비밀번호 1개 + 쿠키 세션 |
| 콘텐츠 계층 분리 | **보류** | 저장소 결정과 묶여 있음. 지금은 `site.ts` 하드코딩 |
| 상담 폼 전송 | 미구현 | 입력 검증 + 완료 화면까지만. DB·알림 미연결 |
| 개인정보처리방침 페이지 | **없음** | 게시 의무 대상. 폼 전송 연결 전에 필요 |
| 보안 헤더 | 미설정 | `next.config.ts` 비어 있음. CSP·HSTS 등 미적용 |
| 학생용 카피 전면 교체 | 완료 | 2026-09-09. `site.ts` 전면 재작성 |
| 프로그램 가격 | 미확정 | 3종 모두 `"상담 후 안내"`. 실제 금액 미정 |
| 코치 실명·이력 | 미확정 | 학원 계열 이력 폐기. 코칭 자격·경력 확인 필요 |
| 그룹 세션 · After Care | 미확정 | 실제 운영 여부 확인 전. 안 하면 카드 제거 |
| 운영시간 | 임시값 | `Mon-Fri 10:00-20:00` 은 로보가 정한 임시값 |
| 상담 트랙 구분 | 미구현 | 대상별 CTA가 전부 `#consult` 로만 간다. 폼 전송 붙일 때 hidden 필드로 처리 |
| B2B / 기업 문의 | **보류** | 사용자 요청으로 이번 범위 제외 |
| 작업 드라이브 | **F 고정** | C 여유 24GB(10%). npm 캐시는 `F:\_npm-cache`(1GB)로 이미 이전됨 |
| 계정 전략 | **전면 신규** | GitHub·Vercel·Supabase 모두 새로 가입. 기존 계정 연결 금지 (2026-09-09 지시) |

### 계정·드라이브 감사 (2026-09-09)

강제 규칙은 `AGENTS.md` 에 있다. 여기에는 배경만 남긴다.

**드라이브** — 걱정했던 것과 달리 이 프로젝트가 C에 쓰는 양은 1MB 미만이다. npm 캐시(1GB)와 `node_modules`(449MB)·`.next`(276MB)는 전부 이미 F에 있다. 남은 C 유출 경로는 셋뿐이다.

- `%TEMP%` 가 여전히 `C:\Users\sungh\AppData\Local\Temp`(현재 4.82GB)를 가리킨다. `npm install` 과 `next build` 가 여기를 스크래치로 쓴다. `F:\_tmp` 는 존재하지만 연결돼 있지 않다
- **Cursor 터미널이 `npm_config_cache` 환경변수를 `%TEMP%\cursor-sandbox-cache\<해시>\npm` 으로 설정한다.** 환경변수가 `.npmrc` 보다 우선하므로 사용자·프로젝트 `.npmrc` 의 F 경로가 **Cursor 안에서는 무력화된다.** `npm config list` 에 `overridden by env` 로 표시된다. Cursor 터미널에서 설치할 때는 `npm install --cache F:\_npm-cache` 로 명시해야 한다 (`AGENTS.md` 에 규칙으로 박아뒀다)
- npm 전역 prefix가 C다. 이 프로젝트는 전역 설치를 안 쓰므로 급하지 않다
- `~/.cursor` 는 Cursor가 홈 디렉터리를 강제해서 **옮길 수 없다.** 이 프로젝트 몫은 1MB 미만이라 문제 없다

**계정 연결 잔재** — 실제 위험은 드라이브가 아니라 이쪽이었다.

- **Supabase MCP**가 사용자 전역 설정(`~/.cursor/mcp.json`)에 기존 계정 프로젝트로 인증된 채 살아 있다. 이 저장소는 Supabase 패키지를 제거했지만 MCP 통로는 열려 있었고, 서브에이전트가 그대로 상속한다. Cursor에는 전역 MCP를 프로젝트 단위로 끄는 설정이 없어서, `.cursor/hooks.json` 의 `beforeMCPExecution` 훅(`failClosed: true`)으로 호출을 차단했다. 서버 로딩 자체를 막는 건 아니라 도구 목록은 여전히 보인다
- Vercel CLI 설정(`%APPDATA%\com.vercel.cli\Data\config.json`)에 이전 팀 포인터 `currentTeam` 이 남아 있다. `auth.json` 은 없어 로그인 상태는 아니다. 새 계정 첫 배포 전에 제거해야 한다
- git 전역 정체성은 의도적으로 비어 있다. 커밋은 `-c user.name=... -c user.email=...` 주입으로 해 왔고 author는 전부 `sungh <sungh@local>` 이다. 새 계정 확정 후 **로컬에만** 설정한다
- `gh` CLI는 미설치, git 원격 없음, `.env*` 없음, 관련 환경변수 없음

**미확인**: Windows 자격증명 관리자의 GitHub 항목. `cmdkey /list` 가 샌드박스에 막혀 확인하지 못했다. 남아 있으면 새 계정 push 시 옛 자격증명이 자동으로 붙는다.
| 브랜드명·연락처·가격 | 임시값 | `site.ts` 전체가 플레이스홀더 |

### 관리자 페이지를 시작할 때

콘텐츠를 단일 데이터 소스로 옮기고 페이지는 `getContent()`로만 읽게 한다. 저장소를 교체 가능한 모듈로 두면 나중에 Supabase 전환 시 페이지 코드는 건드리지 않는다. 관리자 탭은 섹션과 1:1로 나눈다 (히어로 슬라이드 / 프로그램 카드 / 중간 배너 / 스토리 / 서비스 / 코치 / 원칙 카드 / FAQ / 회사 정보).

**주의**: JSON 파일 저장 방식은 Vercel 등 서버리스에 배포하면 파일 시스템이 읽기 전용이라 동작하지 않는다. 운영 전에는 Supabase로 옮겨야 한다.

## 7. 알려진 이슈 / 함정

- **하이드레이션 경고**: 개발 중 Cursor 내장 브라우저로 열면 `data-cursor-ref` 속성을 DOM에 주입해 hydration mismatch 경고가 뜬다. 코드 문제가 아니다. 일반 브라우저에서는 발생하지 않는다.
- **PowerShell에서 dev 서버 실행**: `npx next dev | Out-String` 으로 파이프하면 출력이 버퍼링되어 로그가 보이지 않는다. 파이프 없이 실행한다.
- **npm 의존성**: `vitest` 최신 버전은 `@types/node@^20`과 peer 충돌(ERESOLVE)이 난다. 테스트를 도입하려면 `vitest@^4` 를 쓰거나 `@types/node`를 올린다. 충돌 후 트리가 깨지면(`edgesOut` 에러) `node_modules` + `package-lock.json` 삭제 후 재설치가 필요하다.
- `create_project` MCP 도구는 내부적으로 `/bin/sh`를 호출해 Windows에서 git 초기화가 실패한다. `git init`을 직접 실행했다.

## 8. 검증 상태

- `npm run lint`, `npx tsc --noEmit`, `npx next build` 모두 통과 (`/` 정적 프리렌더)

아래는 **2026-09-07 시점**의 육안 확인이다. 이후 `AudienceRows` 추가와 타이포 스케일 상향이 있었으므로 재확인이 필요하다.

- 데스크톱 1024px 폭 전 섹션 육안 확인
- 모바일 390×844 확인: 햄버거 메가메뉴 개폐, 가로 슬라이더 스냅, 폰트 스케일 축소
- FAQ 아코디언, 상담 폼 검증·완료 화면 동작 확인

미확인: `AudienceRows` 의 1024px 경계 좌우 교차, `TopBanner` 320px(고정 높이 40px에 여유 11px + KR/EN 표기 겹침 가능성)

## 9. 서브에이전트

`.cursor/agents/` 에 정의되어 있다. Cursor가 자동으로 인식하며 `/이름` 으로 직접 호출한다.

| 이름 | 페르소나 | 담당 | 쓰기 |
| --- | --- | --- | --- |
| `frontend` | 선우 | 컴포넌트 구현, 반응형, 애니메이션, 성능 | 가능 |
| `designer` | 수진 | `@theme` 토큰, 레이아웃 설계, 히녹 톤 유지 | 가능 |
| `content` | 로보 | `site.ts` 카피, 메타데이터·SEO, alt 텍스트 | 가능 |
| `marketing` | 얌얌 | 히어로 카피, CTA, 상담 신청 퍼널 전환율 | 가능 |
| `backend` | 데이브 | 폼 전송, Route Handler, 저장소 구현 | 가능 |
| `security` | 보안관 | 개인정보·인증·시크릿·보안 헤더·취약점 | 가능 |
| `pm` | 자비스 | 커밋 전 점검·감사·우선순위 정리 | **읽기 전용** |

호출 예: `/pm 커밋 전 전체 점검해줘`, `/designer 히어로 스크림 농도 조정`

Cursor 내장 `security-review` 는 변경 diff만 보는 단발성 리뷰다. `보안관` 은 이 프로젝트의 개인정보 요건까지 아는 상시 담당이므로 역할이 다르다.

기존 collavue 프로젝트(`F:\Dev\collavueV2\collavue_v2\agents\*.md`)는 Cursor가 인식하는 형식이 아니라 참조용 마크다운 문서였다. 페르소나만 계승하고 내용은 이 프로젝트 스택에 맞게 새로 작성했다.

- frontmatter 필드는 `name` / `description` / `model` / `readonly` / `is_background` 다섯 개뿐이다. `tools` 필드는 존재하지 않으며, 툴 제한은 `readonly: true` 로만 가능하다
- 서브에이전트는 부모의 툴(MCP 포함)을 그대로 상속한다
- 프롬프트를 길게 쓰지 않는다. 공식 문서 권고사항이며 초점이 흐려진다
- 오케스트레이션은 메인 채팅이 담당한다. `pm` 은 조율자가 아니라 감사자다
