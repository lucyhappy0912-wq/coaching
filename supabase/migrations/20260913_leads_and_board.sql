-- 상담 신청·질문 게시판. RLS 켜고 정책 없음. 서버 secret key만 사용.

create table if not exists leads (
  id uuid primary key,
  name text not null,
  phone text not null,
  preferred_time text not null default '',
  message text not null default '',
  status text not null default 'new',
  received_at timestamptz not null,
  closed_at timestamptz,
  purge_at timestamptz not null,
  consent_version text not null
);

create index if not exists leads_received_at_idx on leads (received_at desc);
create index if not exists leads_purge_at_idx on leads (purge_at);

create table if not exists board_questions (
  id uuid primary key,
  name text not null,
  title text not null,
  body text not null,
  answer text not null default '',
  published boolean not null default false,
  created_at timestamptz not null,
  answered_at timestamptz
);

create index if not exists board_questions_created_at_idx on board_questions (created_at desc);

alter table leads enable row level security;
alter table board_questions enable row level security;

revoke all on table leads from anon, authenticated, public;
revoke all on table board_questions from anon, authenticated, public;
grant all on table leads to service_role;
grant all on table board_questions to service_role;
