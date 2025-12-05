# COMET Shortcuts Chrome Extension

웹에이전트 숏컷 크롬 확장 - COMET 어시스턴트와 연동하여 도메인별 워크플로우를 실행합니다.

## 📦 프로젝트 개요

특정 도메인(사이트)에 들어갔을 때 사용 가능한 "웹에이전트 숏컷(프롬프트)"을 추천하고, 버튼 한 번으로 COMET 어시스턴트 입력창에 프롬프트를 자동 입력해주는 크롬 확장입니다.

### 핵심 기능

- 🎯 **도메인별 숏컷 추천**: 현재 페이지에서 사용 가능한 워크플로우 표시
- ⚡ **원클릭 실행**: COMET 어시스턴트에 프롬프트 자동 입력
- 📊 **실행 로그**: Supabase에 사용 내역 저장
- 👥 **멤버십 구분**: Free/Pro 플랜별 차별화된 기능 제공

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18+
- pnpm 8+
- Chrome 브라우저

### 설치

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cd extension
cp .env.example .env
# .env 파일 편집 - Supabase Dashboard → Settings → API 에서 credentials 획득
# ⚠️ 주의: 서비스 롤 키는 절대 확장에 넣지 말 것!

# 개발 모드 실행 (from project root)
cd ..
pnpm dev
```

> **Environment Variables**: See `extension/.env.example` for required keys. Never commit real credentials or service role keys. Public/anon keys only!

### Chrome에 확장 로드

1. `chrome://extensions/` 접속
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `extension/dist/` 폴더 선택

## 📚 문서

### 개발자용 가이드

- **[CLAUDE.md](./CLAUDE.md)**: 프로젝트 전체 구조 및 빌드/테스트 명령
- **[PRD.txt](./PRD.txt)**: 제품 요구사항 문서
- **[agent_docs/](./agent_docs/)**: Progressive Disclosure 문서 세트
  - [building_the_project.md](./agent_docs/building_the_project.md) - 빌드 가이드
  - [running_tests.md](./agent_docs/running_tests.md) - 테스트 가이드
  - [feature_checklist_guide.md](./agent_docs/feature_checklist_guide.md) - 개발 워크플로우

### 개발 워크플로우

1. `features.json`에서 `todo` 상태인 기능 선택
2. 기능 상태를 `in_progress`로 변경
3. 3-5단계로 계획 수립
4. 구현 + 테스트
5. 상태를 `done`으로 변경 및 커밋
6. `claude-progress.md`에 진행 상황 기록

## 🧪 테스트

```bash
# 전체 테스트 실행
pnpm test

# Watch 모드
pnpm test:watch

# 커버리지 리포트
pnpm test:coverage
```

## 🏗️ 프로젝트 구조

```
.
├── extension/                 # 크롬 확장 소스
│   ├── src/
│   │   ├── api/              # Supabase API 클라이언트
│   │   ├── core/             # 핵심 로직 (COMET DOM, workflows)
│   │   ├── popup/            # 팝업 UI
│   │   ├── options/          # 옵션 페이지
│   │   └── utils/            # 유틸리티 함수
│   ├── public/               # 정적 파일 (icons, manifest)
│   └── dist/                 # 빌드 결과물 (git-ignored)
│
├── tests/                     # 테스트 파일
│   ├── unit/                 # 단위 테스트
│   └── fixtures/             # 테스트용 mock 데이터
│
├── agent_docs/               # Progressive Disclosure 문서
├── features.json             # 기능 체크리스트
└── claude-progress.md        # 개발 진행 로그
```

## 🔧 기술 스택

- **Frontend**: TypeScript, Vanilla JS/HTML/CSS (No React)
- **Extension**: Chrome Manifest V3
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Build**: Vite
- **Test**: Vitest, jsdom
- **Package Manager**: pnpm

## 📋 개발 상태

**Single Source of Truth**: [features.json](./features.json)

Current milestone: M1 (Foundation)

For detailed progress, see:
- [features.json](./features.json) - Feature checklist with status
- [claude-progress.md](./claude-progress.md) - Session-by-session development log

## 🤝 기여

이 프로젝트는 1인 운영 MVP입니다.

- Extension 개발: Claude (이 LLM)
- Supabase 백엔드: 별도 LLM 담당

## 📄 라이센스

Private project - Not for public distribution
