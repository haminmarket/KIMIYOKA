import { describe, expect, it } from 'vitest'
import { cometDom } from '@/core/cometDom'

describe('cometDom', () => {
  it('detects open state via selectors', () => {
    document.documentElement.setAttribute('data-erp', 'sidecar')
    document.body.innerHTML = `
      <main id="root"></main>
      <div id="ask-input" role="textbox" contenteditable="true"></div>
    `
    expect(cometDom.isOpen()).toBe(true)
  })

  it('inserts prompt text', () => {
    document.documentElement.setAttribute('data-erp', 'sidecar')
    document.body.innerHTML = `
      <div id="ask-input" role="textbox" contenteditable="true"></div>
      <button data-testid="submit-button"></button>
    `
    cometDom.insertPrompt('hello')
    expect(document.querySelector('#ask-input')?.textContent).toBe('hello')
  })
})
