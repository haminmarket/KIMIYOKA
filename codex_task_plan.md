# codex_task_plan

## Phase 1 — Supabase 안정화 & 계약 정리
- 백엔드 상태 고정
  - [x] logs.status lifecycle 반영 (`started|success|error|timeout`)
  - [x] logs RLS: 본인 행 UPDATE 허용 정책 추가 (`logs_update_own`)
  - [ ] Edge Functions(license/log) 응답 스펙 점검 및 필요 시 수정
- 스모크/운영 가이드
  - [x] REST 스모크: workflows(auth) read, logs started→success update 검증
  - [ ] 실패 경로 스모크: status=error / timeout 업데이트 케이스 추가 확인
  - [x] scripts/sql/supabase_smoke.sql 작성
- 보안/ENV
  - [x] 서비스 롤 키 프런트 금지, LZ 키 정리 경고 문서화
  - [ ] `infra/supabase/migrations/` 실제 DDL 파일화 (001_init.sql 등)
- 기록
  - [x] supabase_progress_2025-12-05.md 최신화
  - [x] SUPABASE_RULE RLS 요약 갱신

## Phase 2 — Chrome 확장 핵심 플로우 구현
- 인증/환경설정
  - [x] options 페이지에서 이메일/패스워드 로그인·세션 유지 구현 (supabase.auth)
  - [x] `.env`/config 주입으로 SUPABASE_URL/ANON_KEY 사용 (service role 금지)
- 메시징·도메인
  - [x] background ↔ popup ↔ content 기본 메시지 라우팅 (RUN_WORKFLOW, SET_BADGE, FINAL_GOAL)
  - [x] domainExtractor 유틸 구현 및 popup에 적용
- 워크플로우 목록 & 실행
  - [x] 현재 도메인 식별 → workflows 리스트 fetch(auth)
  - [x] Free/Pro 필터링 및 Pro 잠금 표시
  - [x] 실행 시 COMET DOM에 프롬프트 삽입 + submit (content.ts + cometDom)
- 로깅 연동
  - [x] 실행 클릭 시 logs status='started' insert
  - [x] final-goal 감지 후 status/meta 업데이트 (turns/duration_ms/final_goal_text)
  - [x] 오류/타임아웃 규칙 적용
- UI/UX 최소 요구
  - [ ] popup open/detect COMET 없을 때 친절 에러 (기본 alert, 추가 개선 필요)
  - [x] 로딩 인디케이터(텍스트) 적용
  - [x] 배지: 해당 도메인 워크플로우 존재 시 ON (숫자)
- 테스트 기반 작업
  - [x] Vitest 설정 확인 및 기본 unit 테스트 추가 (domain extractor, cometDom)
  - [ ] mock COMET DOM fixture 확장 및 submit/observer 시나리오 추가

## Phase 3 — 테스트/하드닝 & 운영 준비
- 테스트 시나리오 정리
  - [ ] test-scenarios.json에서 구현 완료 항목 passes=true 반영
  - [ ] log-002 실패 경로, comet-005 final-goal-logging 등 통합 E2E 작성/검증
  - [ ] perf/ui/storage/upgrade 항목은 post-MVP 태깅 유지
- 데이터/시드
  - [ ] workflows 시드 템플릿 확장(JSON/SQL) 및 다중 도메인 예제 추가
- 운영/배포 가이드
  - [ ] infra/supabase/README.md에 reset/push/keys 절차 정리
  - [ ] Edge Function 배포/롤백 절차 문서화
  - [ ] 보안 점검 체크리스트(키 노출, RLS 정책, 로그 포함 정보)

> 진행 순서는 Phase 1 → 2 → 3을 권장. Phase 2 일부(로그 연동)와 Phase 1(Edge Function 점검)은 병행 가능.
