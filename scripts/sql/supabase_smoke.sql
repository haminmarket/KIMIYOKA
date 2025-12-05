-- Supabase smoke tests (run manually)
-- Purpose: validate RLS + status/meta lifecycle for logs

-- 1) Anon key (no auth)
-- Expect: workflows readable (RLS allows authenticated only? adjust if needed)
select id, title, domain, plan
from public.workflows
limit 5;

-- 2) Authenticated session (replace placeholders)
-- Set your auth UID and a real workflow_id from workflows table
\set auth_uid '00000000-0000-0000-0000-000000000000'
\set wf_id '00000000-0000-0000-0000-000000000000'

-- started
insert into public.logs (user_id, workflow_id, url, domain, status, meta)
values (:'auth_uid', :'wf_id', 'https://youtube.com', 'youtube.com', 'started',
        jsonb_build_object('source','extension'))
returning id;

-- success update (simulate final-goal)
\set log_id 'REPLACE_WITH_RETURNED_ID'
update public.logs
  set status = 'success',
      meta = jsonb_build_object(
        'source','extension',
        'turns', 5,
        'duration_ms', 4200,
        'final_goal_text', '영상 요약 완료',
        'timeline_snippet', array['탭 생성','페이지 텍스트 가져오기','요약 완료']
      )
where id = :'log_id'
returning id, status, meta;

-- cleanup (optional)
-- delete from public.logs where id = :'log_id';
