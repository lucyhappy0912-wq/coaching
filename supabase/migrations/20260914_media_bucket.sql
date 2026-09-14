-- 관리자 사진 업로드용 Storage 버킷.
-- 에이전트는 원격에 적용하지 않는다. 대표가 Supabase SQL Editor에서 이 파일 전체를 실행한다.
--
-- 20260912_cms.sql 끝에 buckets insert 가 있으나, 표 마이그레이션만 돌리면 버킷이 빠진다.
-- Vercel uploadMedia 는 POST /storage/v1/object/media/<파일> 을 쓰므로 버킷이 없으면 거절한다.
-- 서버는 SUPABASE_SECRET_KEY(service_role)만 쓴다. anon 쓰기 정책은 열지 않는다.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
on storage.objects
for select
to public
using (bucket_id = 'media');
