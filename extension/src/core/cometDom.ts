/**
 * COMET DOM helper functions
 * Selectors based on COMET_DOM_SPEC.md (v1.0)
 */

export interface CometDom {
  isOpen: () => boolean
  waitForElement: (selector: string, timeoutMs?: number) => Promise<Element | null>
  insertPrompt: (text: string) => Promise<void>
  submit: () => Promise<void>
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

  async waitForElement(selector: string, timeoutMs = 10000): Promise<Element | null> {
    const existing = document.querySelector(selector)
    if (existing) return existing

    return await new Promise((resolve) => {
      const timer = window.setTimeout(() => {
        observer.disconnect()
        resolve(null)
      }, timeoutMs)

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector)
        if (el) {
          clearTimeout(timer)
          observer.disconnect()
          resolve(el)
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
    })
  },

  async insertPrompt(text: string) {
    const input = (await this.waitForElement(INPUT_SELECTOR)) || (await this.waitForElement(INPUT_FALLBACK))
    if (!input) throw new Error('COMET input not found')

    ;(input as HTMLElement).focus()

    const success = document.execCommand('insertText', false, text)
    if (!success) {
      input.innerHTML = ''
      const p = document.createElement('p')
      p.setAttribute('dir', 'auto')
      p.textContent = text
      input.appendChild(p)
    }

    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  },

  async submit() {
    const button = (await this.waitForElement(SUBMIT_SELECTOR)) as HTMLButtonElement | null
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
