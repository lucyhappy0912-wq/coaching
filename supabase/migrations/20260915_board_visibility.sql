-- 일반 게시판. published = 공개, password_hash 가 있으면 비밀글.

alter table board_questions add column if not exists password_hash text not null default '';
alter table board_questions add column if not exists views integer not null default 0;
