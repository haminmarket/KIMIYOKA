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

## 남은 작업 제안
- `claude-progress.md`에 Fifth Session 내용 수동 반영 필요(타임아웃으로 미반영)
- Edge Functions: MVP에서는 로그용 함수 불필요, Phase 2에서 license/webhook 분리 예정
- 환경변수/키 정리: LemonSqueezy 키 노출 파일 제거 및 재발급 필요 (`docs/llm-context/LEMONSQUEEZY.txt`)
- 계약 테스트 추가: anon 키로 `workflows` read, 인증 유저로 `logs` insert 확인 스크립트 준비

