/**
 * Popup UI Logic
 * Displays domain-specific workflows and handles user interactions
 */

console.log('COMET Shortcuts: Popup loaded')

import { fetchWorkflows } from '@/api/supabaseClient'
import { Workflow } from '@/api/types'
import { extractDomain } from '@/utils/domainExtractor'

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
    const domain = extractDomain(tab.url) || 'unknown'
    domainElement.textContent = domain
  }
}

// Load workflows for current domain
async function loadWorkflows() {
  const container = document.getElementById('workflows-container')
  if (!container) return

  container.innerHTML = '<p class="placeholder">Loading workflows...</p>'

  const tab = await getCurrentTab()
  const domain = tab.url ? extractDomain(tab.url) : null
  if (!domain) {
    container.innerHTML = '<p class="placeholder">Cannot determine domain</p>'
    return
  }

  try {
    const workflows = await fetchWorkflows(domain)
    renderWorkflows(container, workflows)
  } catch (err) {
    console.error('Failed to load workflows', err)
    container.innerHTML = '<p class="placeholder">Login required or network error</p>'
  }
}

function renderWorkflows(container: HTMLElement, workflows: Workflow[]) {
  if (!workflows.length) {
    container.innerHTML = '<p class="placeholder">No shortcuts available for this domain</p>'
    return
  }

  container.innerHTML = ''
  workflows.forEach(wf => {
    const card = document.createElement('div')
    card.className = 'workflow-card'
    card.innerHTML = `
      <div class="workflow-head">
        <span class="wf-title">${wf.title}</span>
        <span class="wf-badge ${wf.plan === 'PRO' ? 'pro' : 'free'}">${wf.plan}</span>
      </div>
      <p class="wf-summary">${wf.summary || ''}</p>
      <button class="run-btn" data-wid="${wf.id}">Run</button>
    `
    container.appendChild(card)
  })

  container.querySelectorAll<HTMLButtonElement>('.run-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const workflowId = btn.dataset.wid
      const prompt = workflows.find(w => w.id === workflowId)?.prompt || ''
      runWorkflow(prompt)
    })
  })
}

async function runWorkflow(prompt: string) {
  const tab = await getCurrentTab()
  if (!tab.id) return

  chrome.tabs.sendMessage(tab.id, { type: 'RUN_WORKFLOW', prompt }, (resp) => {
    if (chrome.runtime.lastError) {
      console.error('Message failed', chrome.runtime.lastError)
      alert('Failed to reach content script (is COMET tab loaded?)')
      return
    }
    if (!resp?.success) {
      alert(resp?.error || 'Failed to run workflow')
    }
  })
}

// Handle settings button click
document.getElementById('open-options')?.addEventListener('click', () => {
  chrome.runtime.openOptionsPage()
})

// Initialize popup
displayCurrentDomain()
loadWorkflows()
