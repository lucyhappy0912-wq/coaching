#!/usr/bin/env node
// 이 프로젝트는 GitHub·Vercel·Supabase를 전부 새 계정으로 새로 만든다 (2026-09-09 대표 지시).
// 사용자 전역 ~/.cursor/mcp.json 의 supabase 서버가 기존 계정 프로젝트에 인증된 채 살아 있고,
// execute_sql / apply_migration 같은 쓰기 도구를 노출한다. 서브에이전트는 부모의 MCP를 그대로 상속한다.
// Cursor에는 전역 MCP 서버를 프로젝트 단위로 끄는 설정이 없어서, 호출 자체를 여기서 막는다.

const DENIED_SERVER = /supabase/i;

// 서버명을 못 읽는 경우를 대비한 2차 방어. supabase MCP에만 있는 도구 이름들이다.
const DENIED_TOOLS = new Set([
  "execute_sql",
  "apply_migration",
  "deploy_edge_function",
  "create_branch",
  "delete_branch",
  "merge_branch",
  "reset_branch",
  "rebase_branch",
  "list_tables",
  "list_migrations",
  "list_edge_functions",
  "get_edge_function",
  "get_advisors",
  "query_logs",
  "get_project_url",
  "get_publishable_keys",
  "generate_typescript_types",
]);

const DENY_MESSAGE =
  "이 프로젝트는 새 Supabase 계정으로 새로 연결할 예정이라 기존 계정 MCP 호출을 차단했다. " +
  "DB 작업이 필요하면 멈추고 대표에게 확인을 요청해라.";

let raw = "";
let finished = false;

function finish() {
  if (finished) return;
  finished = true;

  let server = "";
  let tool = "";

  try {
    const input = JSON.parse(raw || "{}");
    server = String(input.mcp_server_name ?? "");
    tool = String(input.tool_name ?? "");
  } catch {
    // JSON이 깨져도 브라우저·Figma 같은 다른 MCP를 막지 않는다.
    process.stdout.write(JSON.stringify({ permission: "allow" }));
    return;
  }

  if (DENIED_SERVER.test(server) || (!server && DENIED_TOOLS.has(tool))) {
    process.stdout.write(
      JSON.stringify({
        permission: "deny",
        user_message: `Supabase MCP 호출을 차단했습니다 (${tool || "unknown"}). 기존 계정에 연결된 서버입니다.`,
        agent_message: DENY_MESSAGE,
      }),
    );
    return;
  }

  process.stdout.write(JSON.stringify({ permission: "allow" }));
}

process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", finish);
process.stdin.on("error", finish);
setTimeout(finish, 1500);
