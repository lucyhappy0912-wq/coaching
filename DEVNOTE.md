# 개발노트 — coaching

작업 이력과 결정사항을 기록한다. 새 작업을 시작할 때 이 문서를 먼저 읽는다.

최종 갱신: 2026-09-07

---

## 1. 프로젝트 개요

- 위치: `F:\coaching` (git 저장소, 기본 브랜치 `main`, 원격 없음)
- 성격: 코칭 브랜드 소개 + 무료 상담 신청 중심의 원페이지 랜딩
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

### 타이포 스케일 (데스크톱 / 1024px 이하)

`.t1` 40/32 · `.t2` 34/26 · `.t3` 28/20 · `.t4` 22/18 · `.b1` 18/16 · `.b2` 16/15 · `.b3` 14/12 · `.c1` 12/11 (px)

제목은 `line-height:120%` + `font-weight:400` + 세리프, 본문은 `line-height:160%`.

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
      ProgramTabs.tsx   New/Best/Event 탭 + 가로 카드 슬라이더 (화면 밖으로 흘림)
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

### 섹션 순서 (히녹 메인과 동일)

Hero → Program 탭 → Mid Banner → Story 탭 → Service → **Coach** → Brand Story → Principles → **FAQ** → **Consult** → Footer

굵은 항목은 코칭 사이트에 필요해서 추가한 섹션. 나머지는 원본 구조 그대로.

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
- 데스크톱 1024px 폭 전 섹션 육안 확인
- 모바일 390×844 확인: 햄버거 메가메뉴 개폐, 가로 슬라이더 스냅, 폰트 스케일 축소
- FAQ 아코디언, 상담 폼 검증·완료 화면 동작 확인

## 9. 서브에이전트

`.cursor/agents/` 에 정의되어 있다. Cursor가 자동으로 인식하며 `/이름` 으로 직접 호출한다.

| 이름 | 페르소나 | 담당 | 쓰기 |
| --- | --- | --- | --- |
| `frontend` | 선우 | 컴포넌트 구현, 반응형, 애니메이션, 성능 | 가능 |
| `designer` | 수진 | `@theme` 토큰, 레이아웃 설계, 히녹 톤 유지 | 가능 |
| `content` | 로보 | `site.ts` 카피, 메타데이터·SEO, alt 텍스트 | 가능 |
| `marketing` | 얌얌 | 히어로 카피, CTA, 상담 신청 퍼널 전환율 | 가능 |
| `backend` | 데이브 | 폼 전송, Route Handler, 저장소, 보안 | 가능 |
| `pm` | 자비스 | 커밋 전 점검·감사·우선순위 정리 | **읽기 전용** |

호출 예: `/pm 커밋 전 전체 점검해줘`, `/designer 히어로 스크림 농도 조정`

기존 collavue 프로젝트(`F:\Dev\collavueV2\collavue_v2\agents\*.md`)는 Cursor가 인식하는 형식이 아니라 참조용 마크다운 문서였다. 페르소나만 계승하고 내용은 이 프로젝트 스택에 맞게 새로 작성했다.

- frontmatter 필드는 `name` / `description` / `model` / `readonly` / `is_background` 다섯 개뿐이다. `tools` 필드는 존재하지 않으며, 툴 제한은 `readonly: true` 로만 가능하다
- 서브에이전트는 부모의 툴(MCP 포함)을 그대로 상속한다
- 프롬프트를 길게 쓰지 않는다. 공식 문서 권고사항이며 초점이 흐려진다
- 오케스트레이션은 메인 채팅이 담당한다. `pm` 은 조율자가 아니라 감사자다
