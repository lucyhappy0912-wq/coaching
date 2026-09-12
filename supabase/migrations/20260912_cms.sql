-- 관리자 콘텐츠·게시판·회원. RLS 켜고 정책 없음. 서버 service_role만 사용.

create table if not exists cms_content (
  id text primary key,
  data jsonb not null,
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists cms_posts (
  id uuid primary key,
  title text not null,
  body text not null,
  published boolean not null default false,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index if not exists cms_posts_created_at_idx on cms_posts (created_at desc);

create table if not exists cms_members (
  id uuid primary key,
  name text not null,
  phone text not null default '',
  email text not null default '',
  note text not null default '',
  source text not null default 'manual',
  created_at timestamptz not null
);

alter table cms_content enable row level security;
alter table cms_posts enable row level security;
alter table cms_members enable row level security;

revoke all on table cms_content from anon, authenticated, public;
revoke all on table cms_posts from anon, authenticated, public;
revoke all on table cms_members from anon, authenticated, public;
grant all on table cms_content to service_role;
grant all on table cms_posts to service_role;
grant all on table cms_members to service_role;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
