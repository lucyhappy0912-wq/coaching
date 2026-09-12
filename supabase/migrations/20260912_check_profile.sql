-- 문답표 시작 정보: 업종, 창업 기간. 대표가 SQL Editor에서 실행한다.

alter table check_responses
  add column if not exists industry text not null default '',
  add column if not exists founder_journey text not null default '';
