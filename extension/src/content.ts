/**
 * Content Script
 * Runs on all web pages to detect COMET and inject prompts
 */

console.log('COMET Shortcuts: Content script loaded')

import { cometDom } from '@/core/cometDom'

const FINAL_GOAL_SELECTOR = 'div[role="listitem"].group/goal#final-goal'
const TIMELINE_SELECTOR = 'div[role="listitem"].group/goal'

function observeFinalGoal(logId?: string, startedAt?: number) {
  if (!logId) return
  const start = startedAt || Date.now()
  let timeoutId: number | undefined

  const finalize = (status: 'success' | 'error' | 'timeout', meta: any) => {
    clearTimeout(timeoutId)
    chrome.runtime.sendMessage({ type: 'FINAL_GOAL', logId, status, meta }).catch(() => {})
    chrome.runtime.sendMessage({ type: 'RUN_RESULT', status, meta }).catch(() => {})
    observer.disconnect()
  }

  const observer = new MutationObserver(() => {
    const finalGoal = document.querySelector(FINAL_GOAL_SELECTOR)
    if (finalGoal) {
      const text = finalGoal.textContent?.trim() || ''
      const items = document.querySelectorAll(TIMELINE_SELECTOR)
      const duration = Date.now() - start
      const isError = /실패|에러|오류|failed/i.test(text)
      finalize(isError ? 'error' : 'success', {
        source: 'extension',
        final_goal_text: text,
        turns: items.length,
        duration_ms: duration,
        timeline_snippet: Array.from(items).slice(-3).map(i => i.textContent?.trim() || '')
      })
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })

  timeoutId = window.setTimeout(() => {
    finalize('timeout', { source: 'extension', duration_ms: Date.now() - start })
  }, 60000)
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message)
  const handler = async () => {
    if (message.type === 'INSERT_PROMPT') {
      await cometDom.insertPrompt(message.prompt || '')
      await cometDom.submit()
      return { success: true }
    }

    if (message.type === 'CHECK_COMET') {
      return { cometAvailable: cometDom.isOpen() }
    }

    if (message.type === 'RUN_WORKFLOW') {
      if (!cometDom.isOpen()) throw new Error('COMET assistant not found')
      await cometDom.insertPrompt(message.prompt || '')
      await cometDom.submit()
      observeFinalGoal(message.logId, message.startedAt)
      return { success: true }
    }

    return { success: true }
  }

  handler()
    .then((res) => sendResponse(res))
    .catch((err: Error) => {
      console.error(err)
      sendResponse({ success: false, error: err.message })
    })

  return true
})

// TODO: Detect when COMET assistant becomes available
// TODO: Send notification to background when COMET is detected
