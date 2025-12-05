/**
 * Popup UI Logic
 * Displays domain-specific workflows and handles user interactions
 */

console.log('COMET Shortcuts: Popup loaded')

// TODO: Import domain extractor
// import { extractDomain } from '@/utils/domainExtractor'

// Get current tab info
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
}

// Display current domain
async function displayCurrentDomain() {
  const tab = await getCurrentTab()
  const domainElement = document.getElementById('current-domain')

  if (domainElement && tab.url) {
    // TODO: Use extractDomain() utility
    const url = new URL(tab.url)
    domainElement.textContent = url.hostname
  }
}

// Load workflows for current domain
async function loadWorkflows() {
  // TODO: Get domain from current tab
  // TODO: Query Supabase for workflows matching domain
  // TODO: Filter by user's plan (FREE/PRO)
  // TODO: Render workflow cards

  console.log('TODO: Load workflows from Supabase')
}

// Handle settings button click
document.getElementById('open-options')?.addEventListener('click', () => {
  chrome.runtime.openOptionsPage()
})

// Initialize popup
displayCurrentDomain()
loadWorkflows()
