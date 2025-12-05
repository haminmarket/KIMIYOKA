# COMET Assistant DOM Specification (Summary)

**Version**: 1.0
**Captured**: 2025-12-05
**Source**: Perplexity Sidecar Assistant
**Status**: Mock-first implementation (real spec pending)

> ⚠️ **Token-Efficient Version**: This is the summary. For full HTML, see `COMET어시스턴트_DOM예시_원본_토큰폭발.HTML` (use sparingly!)

---

## 1. Overall Structure

COMET assistant is a **Perplexity Sidecar** panel rendered on the right side of the browser.

**Root Detection**:
```html
<html data-erp="sidecar" data-color-scheme="light" dir="ltr">
  <main id="root">
    <!-- Assistant UI -->
  </main>
</html>
```

**Presence Check**:
```typescript
const isCometOpen = () => {
  return (
    document.documentElement.getAttribute('data-erp') === 'sidecar' &&
    document.getElementById('root') !== null &&
    document.getElementById('ask-input') !== null
  )
}
```

---

## 2. Input Area (Prompt Injection Target)

### Input Field

**Primary Selector**: `#ask-input[role="textbox"][contenteditable="true"]`

```html
<div
  id="ask-input"
  role="textbox"
  contenteditable="true"
  data-lexical-editor="true"
  aria-placeholder="무엇이든 물어보세요…"
  spellcheck="true"
>
  <p dir="auto"><br/></p>
</div>
```

**Fallback Selectors** (in priority order):
1. `#ask-input[contenteditable="true"]`
2. `[role="textbox"][data-lexical-editor="true"]`
3. `div[contenteditable="true"][id*="input"]`

**Insertion Method**:
```typescript
const insertPrompt = (text: string) => {
  const input = document.getElementById('ask-input')
  if (!input) throw new Error('COMET input not found')

  // Clear existing content
  input.innerHTML = ''

  // Insert new prompt
  const p = document.createElement('p')
  p.setAttribute('dir', 'auto')
  p.textContent = text
  input.appendChild(p)

  // Dispatch events for framework reactivity
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
}
```

### Submit Button

**Primary Selector**: `button[data-testid="submit-button"][aria-label="Submit"]`

```html
<button
  aria-label="Submit"
  data-testid="submit-button"
  type="button"
  class="bg-subtle text-quiet ...">
  <!-- SVG icon -->
</button>
```

**Fallback Selectors**:
1. `button[data-testid="submit-button"]`
2. `button[aria-label="Submit"]`
3. `button[type="button"]` (near input field)

**Trigger Method**:
```typescript
const triggerSubmit = () => {
  const button = document.querySelector('button[data-testid="submit-button"]')
  if (!button) throw new Error('Submit button not found')
  if ((button as HTMLButtonElement).disabled) {
    throw new Error('Submit button is disabled')
  }
  button.click()
}
```

---

## 3. Query Title (User's Main Request)

**Location**: Top of content area, below header

**Selector**: `h1.group/query span.select-text`

```html
<h1 class="group/query ...">
  <div class="flex ...">
    <span class="select-text">
      어시스턴트로 해당 작업을 진행해. 최근자 레딧의 ...
    </span>
  </div>
</h1>
```

**Extract Method**:
```typescript
const getQueryTitle = (): string | null => {
  const span = document.querySelector('h1.group/query span.select-text')
  return span?.textContent?.trim() || null
}
```

---

## 4. Timeline/Log Area (Execution Steps)

**Purpose**: Track assistant's actions and status changes

**Structure**: List of timeline items

```html
<div class="erp-sidecar:min-h-[var(--sidecar-content-height)]">
  <div class="gap-sm flex flex-col">
    <div class="group/goal" role="listitem" id="1">
      <!-- Timeline item 1 -->
      <span>탭 생성 중</span>
    </div>
    <div class="group/goal" role="listitem" id="2">
      <!-- Timeline item 2 -->
      <span>페이지 텍스트 가져오기</span>
    </div>
  </div>
</div>
```

**Extract Method**:
```typescript
const getTimelineItems = (): string[] => {
  const items = document.querySelectorAll('div[role="listitem"].group/goal')
  return Array.from(items).map(item => item.textContent?.trim() || '')
}
```

**Use Case**: Log extraction for Supabase `logs.meta` field

```typescript
{
  query: getQueryTitle(),
  timeline: getTimelineItems(),
  timestamp: new Date().toISOString()
}
```

### Final Goal Detection (Execution Completion)

* Primary marker: `div[role="listitem"].group/goal#final-goal`.
* Semantics: treated as the **last timeline item summarizing the run**. When it first appears, the extension marks the execution complete.
* Data captured on appearance:
  * `final_goal_text`: full text content of `#final-goal`
  * `turns`: total count of `div[role="listitem"].group/goal` items from start through `#final-goal`
  * `duration_ms`: elapsed time from execution start until `#final-goal` first renders
  * `status`: `success` by default; if `final_goal_text` contains failure keywords ("실패", "에러", "오류", "failed"), set `error`; if `#final-goal` never appears within timeout (e.g., 60s), set `timeout`
* Fallback: if future DOM changes remove `#final-goal`, use the **last** `div[role="listitem"].group/goal` as a backup signal, but current version prioritizes `#final-goal`.

---

## 5. Complete Integration Example

```typescript
// extension/src/core/cometDom.ts

export interface CometDom {
  isOpen: () => boolean
  insertPrompt: (text: string) => void
  submit: () => void
  getQueryTitle: () => string | null
  getTimeline: () => string[]
}

export const cometDom: CometDom = {
  isOpen() {
    return (
      document.documentElement.getAttribute('data-erp') === 'sidecar' &&
      !!document.getElementById('root') &&
      !!document.getElementById('ask-input')
    )
  },

  insertPrompt(text: string) {
    const input = document.getElementById('ask-input')
    if (!input) throw new Error('COMET input not found')

    input.innerHTML = ''
    const p = document.createElement('p')
    p.setAttribute('dir', 'auto')
    p.textContent = text
    input.appendChild(p)

    input.dispatchEvent(new Event('input', { bubbles: true }))
  },

  submit() {
    const button = document.querySelector<HTMLButtonElement>(
      'button[data-testid="submit-button"]'
    )
    if (!button) throw new Error('Submit button not found')
    if (button.disabled) throw new Error('Submit disabled')
    button.click()
  },

  getQueryTitle() {
    const span = document.querySelector('h1.group/query span.select-text')
    return span?.textContent?.trim() || null
  },

  getTimeline() {
    const items = document.querySelectorAll('div[role="listitem"].group/goal')
    return Array.from(items).map(item => item.textContent?.trim() || '')
  }
}
```

---

## 6. Maintenance & Updates

### When DOM Structure Changes

1. **Capture new HTML snapshot**
2. **Update this document** with new selectors
3. **Test fallback selectors** still work
4. **Update version and date** at top
5. **Log changes** in `claude-progress.md`

### Selector Stability Strategy

- **Prefer**: `id` and `data-testid` attributes (most stable)
- **Acceptable**: `role` and `aria-*` attributes
- **Avoid**: Tailwind classes (subject to change)

### Testing Checklist

- [ ] Input field detection works
- [ ] Text insertion preserves formatting
- [ ] Submit button clickable
- [ ] Query title extraction accurate
- [ ] Timeline parsing complete

---

## 7. Known Limitations

- **Locale Dependence**: `aria-placeholder` text changes with language
- **Class Volatility**: Tailwind classes may change between versions
- **Framework Updates**: Lexical editor structure may evolve
- **Network Delay**: Timeline may not be complete immediately after submission

---

**For Full Details**: See `COMET어시스턴트_DOM예시_원본_토큰폭발.HTML`
**For Questions**: Refer to actual COMET DOM when it becomes available
**Mock Data**: `tests/fixtures/mockCometDom.html`
