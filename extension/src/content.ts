/**
 * Content Script
 * Runs on all web pages to detect COMET and inject prompts
 */

console.log('COMET Shortcuts: Content script loaded')

// TODO: Import COMET DOM module
// import { cometDom } from '@/core/cometDom'

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message)

  if (message.type === 'INSERT_PROMPT') {
    // TODO: Use cometDom.insertPrompt() to inject prompt
    // TODO: Trigger COMET submission
    sendResponse({ success: true })
  } else if (message.type === 'CHECK_COMET') {
    // TODO: Use cometDom.isOpen() to check if COMET is available
    sendResponse({ cometAvailable: false }) // Placeholder
  }

  return true
})

// TODO: Detect when COMET assistant becomes available
// TODO: Send notification to background when COMET is detected
