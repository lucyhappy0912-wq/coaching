<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 작업 위치와 계정 정책 (절대 규칙)

2026-09-09 대표 지시. 어길 경우 되돌리기 어려운 피해가 발생한다.

## F드라이브 고정

C드라이브 여유는 24GB(10%)뿐이다. 이 프로젝트의 모든 산출물은 F드라이브에 남는다.

- 캐시·임시파일·빌드 산출물 경로를 C로 돌리는 설정을 추가하지 않는다 (`distDir`, `cacheDir`, `TMPDIR` 등)
- `npm install -g` 를 쓰지 않는다. 전역 prefix가 C를 가리킨다
- 스크래치 파일이 필요하면 `F:\_tmp` 에 만든다
- **`npm install` 은 반드시 `--cache F:\_npm-cache` 를 붙여서 실행한다.** Cursor 터미널이 `npm_config_cache` 환경변수를 C드라이브 샌드박스 경로로 덮어써서, `.npmrc` 의 설정이 무시된다. 실행 전 `npm config get cache` 로 확인해라

## 계정은 전부 신규

GitHub · Vercel · Supabase 모두 **새로 가입해서 연결한다. 기존 계정에 절대 연결하지 않는다.**

- `git remote add`, `vercel link`, `vercel deploy`, `gh auth login` 을 에이전트가 실행하지 않는다. 대표가 직접 한다
- **Supabase MCP 도구를 호출하지 않는다.** 사용자 전역 설정의 서버가 기존 계정 프로젝트에 인증된 채 살아 있고, 서브에이전트는 부모의 MCP를 그대로 상속한다. `.cursor/hooks.json` 이 호출을 차단하지만 애초에 시도하지 않는다
- git 커밋은 이 저장소의 로컬 정체성으로만 한다. 전역 git 정체성을 설정하지 않는다
- 계정·토큰·원격이 필요한 작업을 만나면 **멈추고 대표에게 확인을 요청한다.** 알아서 진행하지 않는다
