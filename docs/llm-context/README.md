# LLM Development Context

This folder contains reference documents for AI-assisted development. These files provide context and specifications to LLMs working on this project.

## 📁 Files Overview

| File | Version | Last Updated | Priority |
|------|---------|--------------|----------|
| AUTH_FLOW_DECISION.md | 1.0 | 2025-12-05 | 🔴 **CRITICAL** |
| COMET_DOM_SPEC.md | 1.0 | 2025-12-05 | 🟢 Primary |
| PRD.txt | - | Initial | 🟢 Primary |
| CLAUDE.MD | - | Initial | 🟡 Reference |
| SUPABASE_RULE.txt | - | Initial | 🟢 Primary |
| SUPA_환경변수,스켈레톤,예시API.txt | - | Initial | 🟢 Primary |
| COMET어시스턴트_DOM예시_요약문서.txt | - | Initial | 🟡 Deprecated → Use COMET_DOM_SPEC.md |
| COMET어시스턴트_DOM예시_원본_토큰폭발.HTML | - | Initial | 🚫 **FORBIDDEN** |
| LEMONSQUEEZY.txt | - | Initial | ⚪ Phase 2 |

## 🔴 Critical Documents (Read First)

### **`AUTH_FLOW_DECISION.md`** ⭐ **START HERE**
- **Purpose**: Official auth/membership strategy decision
- **Status**: AUTHORITATIVE - Overrides conflicting info in other docs
- **Key Decision**: MVP uses Supabase Auth, NOT license keys
- **Who Should Read**: Both Extension and Supabase LLMs

### Product & Requirements
- **`PRD.txt`** - Product Requirements Document (Korean)
  - Business goals and feature specifications
  - User flows and use cases
  - Milestone breakdown
  - ⚠️ Note: Auth sections override by AUTH_FLOW_DECISION.md

## 🟢 Primary References

### Technical Specifications
- **`COMET_DOM_SPEC.md`** ⭐ **Use This for COMET**
  - Token-efficient DOM specification
  - Versioned with capture date
  - Selector fallback strategies
  - Complete code examples
  - ✅ Replaces old txt version

- **`CLAUDE.MD`** - Project overview and structure map
  - Tech stack summary
  - Directory layout
  - Core flows

### Backend & Integration
- **`SUPABASE_RULE.txt`** - Supabase development rules
  - Database schema guidelines
  - Edge Function patterns
  - RLS policies

- **`SUPA_환경변수,스켈레톤,예시API.txt`** - Supabase API contracts
  - Environment variable strategy
  - TypeScript type skeletons
  - API endpoint patterns
  - ⚠️ Secret/Public separation rules

## 🚫 Forbidden/Deprecated Files

### 🚫 **`COMET어시스턴트_DOM예시_원본_토큰폭발.HTML`**
- **DO NOT READ** this file unless absolutely necessary
- **Token Cost**: ~15K tokens (極高)
- **Reason**: Complete HTML snapshot with all markup
- **When to Use**: Only for debugging specific edge cases
- **Alternative**: Always try COMET_DOM_SPEC.md first

### 🟡 **`COMET어시스턴트_DOM예시_요약문서.txt`**
- **Status**: Deprecated
- **Replacement**: Use COMET_DOM_SPEC.md instead
- **Reason**: New version has versioning, fallbacks, and better structure

## ⚪ Phase 2 Documents

- **`LEMONSQUEEZY.txt`** - LemonSqueezy integration spec
  - Webhook handling
  - License validation
  - **Status**: Reference only - Not needed for MVP
  - **Contains**: Sensitive API information
  - **Security**: Do not expose in extension code

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
