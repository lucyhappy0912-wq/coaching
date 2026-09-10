-- 문답표 응답. RLS 켜고 정책 없음. 브라우저는 접근 불가. 서버 service_role만 사용.

create table if not exists check_responses (
  id uuid primary key,
  created_at timestamptz not null,
  instrument text not null,
  instrument_version text not null,
  answers jsonb not null,
  name text not null,
  phone text not null,
  email text not null,
  contact_consent boolean not null,
  consent_at timestamptz not null,
  consent_version text not null,
  result_token_hash text not null unique,
  source text not null,
  purge_at timestamptz not null,
  total integer not null,
  band text not null,
  areas jsonb not null
);

create index if not exists check_responses_created_at_idx on check_responses (created_at desc);
create index if not exists check_responses_purge_at_idx on check_responses (purge_at);

create table if not exists check_purge_log (
  record_id uuid not null,
  purged_at timestamptz not null,
  reason text not null
);

alter table check_responses enable row level security;
alter table check_purge_log enable row level security;

revoke all on table check_responses from anon, authenticated, public;
revoke all on table check_purge_log from anon, authenticated, public;
grant all on table check_responses to service_role;
grant all on table check_purge_log to service_role;
