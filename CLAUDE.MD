# CLAUDE.md

## WHAT – Project Map

This repo is a **Chrome extension + Supabase backend** project.

The product is a browser extension that surfaces domain-specific "web-agent shortcuts" (pre-built prompts) and runs them via COMET assistant, while logging usage to Supabase.

**Tech stack (1-year MVP scope)**

- Client:
  - Chrome Extension (Manifest V3)
  - TypeScript + vanilla JS/HTML/CSS (no React for now)
- Backend / Data:
  - Supabase (Postgres + Auth + RLS)
  - API calls from extension (no separate Node server)
- Tooling:
  - Node.js (v18+)
  - pnpm (package manager)
  - Vitest for tests

**Directory layout**

- `extension/src/` - Chrome extension source
  - Popup UI, background/service worker, content script, options page
  - Supabase client + API helpers
- `tests/` - Unit/integration tests
- `dist/` - Build output (git-ignored)
- `docs/llm-context/` - LLM development context docs (reference only)
- `agent_docs/` - Progressive Disclosure docs for development workflow
- `features.json` - Feature checklist & status (source of truth)
- `claude-progress.md` - Per-session work log

Do **not** dump detailed implementation docs here. This file is the "map" so you (Claude) know where you are and what this repo is for.

---

## WHY – Product Purpose & Core Flows

### Purpose

This service exists to:

- Show users **which web-agent shortcuts are available on the current domain** (YouTube, Notion, etc.)
- Let them **run a chosen shortcut with one click**, by injecting a pre-defined prompt into the COMET assistant's input
- **Log every run** (who ran what, where, and how it went) to Supabase

All shortcuts (prompts, expected outcome, domain, plan) live in Supabase.
The extension is a thin client that authenticates users and executes workflows.

### Core User Flows (MVP)

1. **Browse → See shortcuts for this site**
   - User installs extension and logs in via Supabase Auth
   - User visits a supported domain
   - Extension shows available shortcuts in popup
   - Non-logged-in users see list but must login to run

2. **Run shortcut → COMET prompt injection → log**
   - User clicks "Run" on a shortcut
   - Extension finds COMET's input field
   - Inserts prompt and triggers submission
   - Logs execution to Supabase

3. **Domain visit → "Shortcuts available" indicator**
   - User navigates to supported domain
   - Extension checks for available shortcuts
   - Shows badge or notification if shortcuts exist

---

## HOW – Commands & Conventions

### Dev / Build

- **Extension dev (watch mode)**
  ```bash
  pnpm dev
  ```

- **Extension build (production)**
  ```bash
  pnpm build
  ```

- **Package extension**
  ```bash
  pnpm pack
  # Creates extension.zip in project root
  ```

### Tests

- **Unit tests**
  ```bash
  pnpm test
  ```

- **Watch mode**
  ```bash
  pnpm test:watch
  ```

- **Coverage**
  ```bash
  pnpm test:coverage
  ```

### Code Quality

- **Lint**
  ```bash
  pnpm lint
  pnpm lint:fix
  ```

- **Format**
  ```bash
  pnpm format
  pnpm format:check
  ```

### Extra Pointers

For detailed build/test behavior, see:
- `agent_docs/building_the_project.md`
- `agent_docs/running_tests.md`

For feature scope and current status, use **`features.json`** as the primary source.

Follow existing code style and linter/formatter rules.

Keep the stack **simple**:
- No new major frameworks unless absolutely necessary
- Extension stays thin: Auth via Supabase, DOM injection for COMET

---

## Multi-language Support

This extension supports **English (en)** and **Korean (ko)**.

- Default language: English
- Language switching in options page
- All UI strings use i18n system (to be implemented)
- Documentation primarily in English
- PRD and context docs may be in Korean (for LLM reference)
