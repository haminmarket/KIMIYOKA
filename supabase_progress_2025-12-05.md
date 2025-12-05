# Supabase 작업 로그 (2025-12-05)

## 환경
- 프로젝트: KIMIYOKA (project_id: uywktbgxohacydxiokth)
- 방법: MCP Supabase 서버 (`@supabase/mcp-server-supabase`)
- 접근 권한: service_role 사용 안 함, 기본 연결로 DDL 수행

## 수행 내역
1) 스키마 점검
- `list_tables` 결과: 초기엔 테이블 없음

2) 마이그레이션 적용 (`init_core_tables_v2`)
- 생성: `users`, `workflows`, `logs`
- 인덱스: `workflows.domain`, `logs(user_id, ran_at desc)`, `logs.domain`
- 시드 데이터: workflows 2건 (YouTube/FREE, Notion/PRO)
- auth.users 트리거: 가입 시 `public.users`에 id/email 자동 삽입

3) RLS 설정
- `users`: 본인 조회/삽입 허용, 업데이트는 `service_role`만
- `workflows`: 인증 사용자 조회 허용, 쓰기는 `service_role`만
- `logs`: 본인 행 조회/삽입 허용

4) 실패/재시도 기록
- 첫 마이그레이션에서 `policy if not exists` 구문 오류 → `init_core_tables_v2`로 수정 후 성공
- `claude-progress.md` 패치 시도 2회 타임아웃으로 실패 (내용 반영 안 됨)

5) 현재 상태 확인
- `list_tables` 결과: `users` 0행, `workflows` 2행, `logs` 0행, RLS 활성화 확인

6) 후속 반영 (2025-12-05 18:50)
- 마이그레이션 `update_logs_status_final_goal` 적용
  - `logs.status` 체크 제약: `started | success | error | timeout`
  - `logs.meta` 컬럼 주석: turns, duration_ms, final_goal_text, timeline_snippet, errorMessage, source

7) 문서 동결 규칙 추가 (2025-12-05 19:05)
- `SUPABASE_RULE.txt`에 스키마 동결 문구 추가:
  - MVP 스키마(users/workflows/logs)는 동결 상태
  - 스키마 변경은 상위 문서(AUTH_FLOW_DECISION, PRD, COMET_DOM_SPEC) 업데이트 후에만 수행
  - 단순 로깅 포맷 변경은 `logs.meta` JSONB 안에서 처리, 새 컬럼 추가는 지양

8) 빠른 검증 스모크 (수동 실행용)
- 익명키로 workflows 읽기 (기존 정책 확인):
  ```sql
  select id, title, domain, plan from public.workflows limit 5;
  ```
- 인증 사용자 세션으로 logs started→success 업데이트 플로우:
  ```sql
  -- started
  insert into public.logs (user_id, workflow_id, url, domain, status, meta)
  values ('<auth.uid>', '<workflow_id>', 'https://youtube.com', 'youtube.com', 'started', jsonb_build_object('source','extension'))
  returning id;

  -- complete (simulate final-goal)
  update public.logs
    set status = 'success',
        meta = jsonb_build_object(
          'source','extension',
          'turns', 5,
          'duration_ms', 4200,
          'final_goal_text', '영상 요약 완료',
          'timeline_snippet', array['탭 생성','페이지 텍스트 가져오기','요약 완료']
        )
  where id = '<returned id>'
  returning *;
  ```

9) 스모크 테스트 상태 (필수)
- 실행 결과 (2025-12-05):
  - anon REST `/workflows?select=id,title,domain,plan&limit=5` → 응답 200, 결과 `[]` (비인증 읽기 불가)
  - 테스트 계정 생성/로그인: `codexsmoke5678@proton.me` (email 확인 요구 해제 후 signUp 시 access_token 발급, user_id=`d48922a6-028d-411e-874b-6f839a9b4de7`)
  - workflows 조회 (auth) 성공: 2건 확인 (YouTube/Notion)
  - logs insert (status='started') 성공: id=`2b7183a1-1d25-4ea0-ae12-7bb5015bd609`
  - RLS 개선 후 logs update(status='success', meta 확장) 성공 → status 전환·메타 반영 확인
- 다음 조치 옵션:
  - 추가 조치 없음 (UPDATE 경로 정상 동작). 필요 시 서비스 롤로 admin update도 가능.

## 남은 작업 및 우선순위
- Edge Functions 동기화 (높음): `extension-log-ingest`, `extension-check-license` 응답/검증 로직이 status/meta 스펙을 따르는지 확인하고 필요 시 수정.
- 로컬/스테이징 스모크 테스트 (높음): anon 키로 `workflows` read, 인증 세션으로 logs started→success 업데이트 수행(위 SQL) 후 RLS/제약 확인.
- DDL 파일화 (중간): 현재 스키마를 `infra/supabase/migrations/001_init.sql` 등으로 버전 관리해 재현성 확보.
- 환경변수/키 정리 (중간): `docs/llm-context/LEMONSQUEEZY.txt` 노출 키 제거 및 재발급, ENV 가이드 업데이트.
- 시드/데이터 관리 (낮음): workflows 시드 확장 시 JSON/SQL 템플릿 작성.
