# LLM Development Context

This folder contains reference documents for AI-assisted development. These files provide context and specifications to LLMs working on this project.

## 📁 Files

### Product & Requirements
- **`PRD.txt`** - Product Requirements Document (Korean)
  - Business goals and feature specifications
  - User flows and use cases
  - Milestone breakdown

### Technical Specifications
- **`CLAUDE.MD`** - Project overview and structure map
  - Tech stack summary
  - Directory layout
  - Core flows

- **`COMET어시스턴트_DOM예시_요약문서.txt`** - COMET DOM specification (summary)
  - Simplified DOM structure for token efficiency
  - Key selectors for input field and submit button
  - Log collection approach

- **`COMET어시스턴트_DOM예시_원본_토큰폭발.HTML`** - COMET DOM specification (full)
  - Complete HTML structure (high token usage)
  - Use only when detailed debugging needed

### Backend & Integration
- **`SUPABASE_RULE.txt`** - Supabase development rules
  - Database schema guidelines
  - Edge Function patterns
  - RLS policies

- **`SUPA_환경변수,스켈레톤,예시API.txt`** - Supabase API contracts
  - Environment variable strategy
  - TypeScript type skeletons
  - API endpoint patterns

- **`LEMONSQUEEZY.txt`** - LemonSqueezy integration spec
  - Webhook handling
  - License validation (Phase 2)

## 🎯 Usage Guidelines

### For Extension Development (Claude - this LLM)
**Primary references**:
- `CLAUDE.MD` - Project structure
- `COMET어시스턴트_DOM예시_요약문서.txt` - DOM integration
- `PRD.txt` - Feature requirements

**Avoid unless necessary**:
- `COMET어시스턴트_DOM예시_원본_토큰폭발.HTML` - Only for debugging

### For Supabase Development (Separate LLM)
**Primary references**:
- `SUPABASE_RULE.txt` - Development rules
- `SUPA_환경변수,스켈레톤,예시API.txt` - API specs
- `PRD.txt` - Feature requirements

## 🔄 Maintenance

When updating these documents:
1. Update the relevant file
2. Document changes in `claude-progress.md`
3. If API contracts change, update both sides (extension + Supabase)
4. Keep summary and full versions in sync

## 🚫 Do Not Commit

These files are context only. Do NOT reference them in production code.
Use `agent_docs/` for actual developer documentation.
