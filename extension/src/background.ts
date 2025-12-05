/**
 * Background Service Worker
 * Handles extension lifecycle events and message routing
 */

console.log('COMET Shortcuts: Background service worker loaded')

import { updateLogStatus } from '@/api/supabaseClient'

// Listen for extension installation
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    console.log('COMET Shortcuts: Extension installed')
    // TODO: Open options page for first-time setup
  } else if (details.reason === 'update') {
    console.log('COMET Shortcuts: Extension updated')
  }
})

// Listen for messages from popup/content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Background received message:', message)
  if (message.type === 'SET_BADGE') {
    const text = message.count > 0 ? `${message.count}` : ''
    chrome.action.setBadgeText({ text })
    chrome.action.setBadgeBackgroundColor({ color: '#111827' })
    sendResponse({ success: true })
    return true
  }

  if (message.type === 'FINAL_GOAL') {
    // { logId, status, meta }
    const { logId, status, meta } = message
    updateLogStatus(logId, status, meta)
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }))
    return true
  }

  sendResponse({ success: true })
  return true // Keep message channel open for async response
})

// TODO: Monitor tab changes for domain-specific workflow notifications
// TODO: Coordinate between popup UI and content script
