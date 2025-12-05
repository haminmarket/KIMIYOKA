/**
 * COMET DOM helper functions
 * Selectors based on COMET_DOM_SPEC.md (v1.0)
 */

export interface CometDom {
  isOpen: () => boolean
  insertPrompt: (text: string) => void
  submit: () => void
  getQueryTitle: () => string | null
  getTimeline: () => string[]
  getFinalGoalText: () => string | null
}

const INPUT_SELECTOR = '#ask-input[role="textbox"][contenteditable="true"]'
const INPUT_FALLBACK = '#ask-input[contenteditable="true"]'
const SUBMIT_SELECTOR = 'button[data-testid="submit-button"]'
// Use attribute contains selector to avoid CSS escape issues with class "group/goal"
const TIMELINE_SELECTOR = 'div[role="listitem"][class*="group/goal"]'
const FINAL_GOAL_SELECTOR = 'div[role="listitem"]#final-goal'

export const cometDom: CometDom = {
  isOpen() {
    const input = document.querySelector(INPUT_SELECTOR) || document.querySelector(INPUT_FALLBACK)
    return Boolean(input)
  },

  insertPrompt(text: string) {
    const input = document.querySelector<HTMLInputElement | HTMLElement>(INPUT_SELECTOR)
    if (!input) throw new Error('COMET input not found')

    input.innerHTML = ''
    const p = document.createElement('p')
    p.setAttribute('dir', 'auto')
    p.textContent = text
    input.appendChild(p)

    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  },

  submit() {
    const button = document.querySelector<HTMLButtonElement>(SUBMIT_SELECTOR)
    if (!button) throw new Error('Submit button not found')
    if (button.disabled) throw new Error('Submit button disabled')
    button.click()
  },

  getQueryTitle() {
    const span = document.querySelector('h1.group/query span.select-text')
    return span?.textContent?.trim() || null
  },

  getTimeline() {
    const items = document.querySelectorAll(TIMELINE_SELECTOR)
    return Array.from(items).map((item) => item.textContent?.trim() || '')
  },

  getFinalGoalText() {
    const node = document.querySelector(FINAL_GOAL_SELECTOR)
    return node?.textContent?.trim() || null
  }
}
