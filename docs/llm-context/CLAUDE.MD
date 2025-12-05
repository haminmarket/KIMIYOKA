\# CLAUDE.md



\## WHAT – Project Map



This repo is a \*\*“Chrome extension + Supabase backend”\*\* project.



The product is a browser extension that surfaces domain-specific “web-agent shortcuts” (pre-built prompts) and runs them via COMET, while logging usage to Supabase.



\*\*Tech stack (1-year MVP scope)\*\*



\- Client:  

&nbsp; - Chrome Extension (Manifest V3)  

&nbsp; - TypeScript + vanilla JS/HTML/CSS (no React for now)

\- Backend / Data:

&nbsp; - Supabase (Postgres + Auth + RLS)

&nbsp; - `@supabase/supabase-js` from the extension (no separate Node server)

\- Tooling:

&nbsp; - Node.js

&nbsp; - pnpm (or npm/yarn, but assume `pnpm` by default)

&nbsp; - Vitest/Jest for tests (when added)



\*\*Directory layout (intended)\*\*



\- `extension/`

&nbsp; - Chrome extension source

&nbsp; - Popup UI, background/service worker, content script, options page

&nbsp; - Supabase client + simple API helpers

\- `supabase/`

&nbsp; - SQL migrations for:

&nbsp;   - `workflows` (shortcut definitions)

&nbsp;   - `logs` (execution history)

&nbsp;   - optional `pins` (favorites)

&nbsp; - RLS policies

\- `tests/`

&nbsp; - Unit/integration/e2e tests for the extension and basic data flows

\- `features.json`

&nbsp; - Feature checklist \& status (source of truth for what’s in/out)

\- `claude-progress.md`

&nbsp; - Per-session work log / what changed



Do \*\*not\*\* dump detailed implementation docs here. This file is just the “map” so you (Claude) know where you are and what this repo is for.



---



\## WHY – Product Purpose \& Core Flows



\### Purpose



This service exists to:



\- Show users \*\*which web-agent shortcuts are available on the current domain\*\* (YouTube, Notion, etc.), based on templates stored in Supabase.

\- Let them \*\*run a chosen shortcut with one click\*\*, by injecting a pre-defined prompt into the COMET assistant’s input DOM.

\- \*\*Log every run\*\* (who ran what, where, and how it went) into Supabase for later analysis and productization.



All shortcuts (prompts, expected outcome, domain, plan) live in Supabase.  

The extension is a thin client that:



\- authenticates the user via Supabase Auth,

\- reads `workflows`,

\- writes to `logs`.



\### Core User Flows (MVP)



1\. \*\*Browse → See shortcuts for this site\*\*



&nbsp;  - User installs the extension and logs in (Supabase Auth) via popup/options.

&nbsp;  - User visits `https://some-domain.com`.

&nbsp;  - Extension reads the current domain, queries `workflows` filtered by `domain`.

&nbsp;  - In the popup, user sees a list:

&nbsp;    - title, summary (what it does / expected outcome),

&nbsp;    - favicon for that domain,

&nbsp;    - success rate,

&nbsp;    - Free/Pro badge,

&nbsp;    - “Run” button.

&nbsp;  - Non-logged-in users can see the list but must log in to run.



2\. \*\*Run shortcut → COMET prompt injection → log\*\*



&nbsp;  - User clicks “Run” on a shortcut.

&nbsp;  - Extension (content script) finds COMET’s assistant input DOM.

&nbsp;  - The shortcut’s `prompt` from Supabase is inserted into that input field

&nbsp;    (ideally auto-submit; otherwise user presses Enter).

&nbsp;  - Extension writes an entry to `logs`:

&nbsp;    - `user\_id`, `workflow\_id`, `url`, `domain`, `status` (success/error),

&nbsp;    - `ran\_at`, and `meta` (turn count, etc. when available).



3\. \*\*Domain visit → “Shortcuts available” indicator\*\*



&nbsp;  - User navigates to a supported domain (e.g., `youtube.com`).

&nbsp;  - Extension checks Supabase for available `workflows` on that domain.

&nbsp;  - If any exist, show a small signal:

&nbsp;    - badge on the extension icon and/or

&nbsp;    - lightweight in-page notification that shortcuts are available.

&nbsp;  - Clicking it opens the popup with the filtered shortcut list.



That’s enough context for you to understand \*\*why\*\* the code exists and what matters:

\- Do not invent complex dashboards or servers.

\- Stick to: \*\*extension ↔ Supabase tables (`workflows`, `logs`)\*\*.



---



\## HOW – Commands \& Conventions



\### Dev / Build



\- \*\*Extension dev (HMR or rebuild)\*\*  

&nbsp; ```bash

&nbsp; cd extension

&nbsp; pnpm dev       # or: pnpm watch / npm run dev (check package.json)

````



\* \*\*Extension build (for packing into a .zip)\*\*



&nbsp; ```bash

&nbsp; cd extension

&nbsp; pnpm build

&nbsp; ```



\### Tests



\* \*\*Unit / integration tests\*\*



&nbsp; ```bash

&nbsp; pnpm test

&nbsp; ```



\* \*\*e2e tests (if/when added)\*\*



&nbsp; ```bash

&nbsp; pnpm test:e2e

&nbsp; # internally may call scripts/run\_e2e\_tests.sh

&nbsp; ```



\### Extra pointers for you (Claude)



\* For detailed build/test behavior, prefer:



&nbsp; \* `agent\_docs/building\_the\_project.md`

&nbsp; \* `agent\_docs/running\_tests.md`

\* For feature scope and current status, use \*\*`features.json` as the primary source\*\*.

\* Follow existing code style and whatever the linter/formatter enforces:



&nbsp; \* \*\*Do not\*\* invent new style rules here.

&nbsp; \* Infer from current files and tooling.



Keep the stack \*\*simple\*\*:



\* No new major frameworks unless absolutely necessary.

\* Extension stays thin:



&nbsp; \* Auth via `@supabase/supabase-js`.

&nbsp; \* `workflows` read, `logs` write.

&nbsp; \* DOM injection into COMET for running shortcuts.



```

::contentReference\[oaicite:0]{index=0}

