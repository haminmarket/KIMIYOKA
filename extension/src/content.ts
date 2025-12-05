/**
 * Content Script
 * Runs on all web pages to detect COMET and inject prompts
 */

console.log('COMET Shortcuts: Content script loaded')

import { cometDom } from '@/core/cometDom'

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message)

  if (message.type === 'INSERT_PROMPT') {
    try {
      cometDom.insertPrompt(message.prompt || '')
      cometDom.submit()
      sendResponse({ success: true })
    } catch (err) {
      console.error(err)
      sendResponse({ success: false, error: (err as Error).message })
    }
  } else if (message.type === 'CHECK_COMET') {
    sendResponse({ cometAvailable: cometDom.isOpen() })
  } else if (message.type === 'RUN_WORKFLOW') {
    try {
      if (!cometDom.isOpen()) throw new Error('COMET assistant not found')
      cometDom.insertPrompt(message.prompt || '')
      cometDom.submit()
      sendResponse({ success: true })
    } catch (err) {
      sendResponse({ success: false, error: (err as Error).message })
    }
  }

  return true
})

// TODO: Detect when COMET assistant becomes available
// TODO: Send notification to background when COMET is detected
