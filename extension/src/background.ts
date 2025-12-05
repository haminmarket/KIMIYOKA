/**
 * Background Service Worker
 * Handles extension lifecycle events and message routing
 */

console.log('COMET Shortcuts: Background service worker loaded')

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
  // Placeholder: simply ack
  sendResponse({ success: true })
  return true // Keep message channel open for async response
})

// TODO: Monitor tab changes for domain-specific workflow notifications
// TODO: Coordinate between popup UI and content script
