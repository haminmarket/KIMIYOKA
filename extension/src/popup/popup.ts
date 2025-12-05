/**
 * Popup UI Logic
 * Displays domain-specific workflows and handles user interactions
 */

console.log('COMET Shortcuts: Popup loaded')

import { fetchWorkflows, insertStartedLog, supabase, updateLogStatus } from '@/api/supabaseClient'
import { Workflow } from '@/api/types'
import { extractDomain } from '@/utils/domainExtractor'

// Get current tab info
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
}

// Display current domain
let currentDomain: string | null = null
let currentTabUrl: string | null = null
let currentWorkflows: Workflow[] = []
let currentLogId: string | null = null
let currentUserPlan: 'FREE' | 'PRO' = 'FREE'

async function getSessionUser() {
  const { data } = await supabase.auth.getSession()
  return data.session?.user || null
}

async function displayCurrentDomain() {
  const tab = await getCurrentTab()
  const domainElement = document.getElementById('current-domain')

  if (domainElement && tab.url) {
    const domain = extractDomain(tab.url) || 'unknown'
    domainElement.textContent = domain
    currentDomain = domain
    currentTabUrl = tab.url
  }
}

// Load workflows for current domain
async function loadWorkflows() {
  const container = document.getElementById('workflows-container')
  if (!container) return

  container.innerHTML = '<p class="placeholder">Loading workflows...</p>'

  const user = await getSessionUser()
  if (!user) {
    container.innerHTML = '<p class="placeholder">Please log in from Options</p>'
    return
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()
    if (!error && data?.plan) currentUserPlan = data.plan as 'FREE' | 'PRO'
  } catch (e) {
    console.warn('Could not fetch user plan; defaulting FREE', e)
    currentUserPlan = 'FREE'
  }

  const tab = await getCurrentTab()
  const domain = tab.url ? extractDomain(tab.url) : null
  if (!domain) {
    container.innerHTML = '<p class="placeholder">Cannot determine domain</p>'
    return
  }

  try {
    const workflows = await fetchWorkflows(domain)
    currentWorkflows = workflows
    renderWorkflows(container, workflows)
    await setBadge(workflows.length)
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
    const locked = wf.plan === 'PRO' && currentUserPlan !== 'PRO'
    const card = document.createElement('div')
    card.className = 'workflow-card'
    card.innerHTML = `
      <div class="workflow-head">
        <span class="wf-title">${wf.title}</span>
        <span class="wf-badge ${wf.plan === 'PRO' ? 'pro' : 'free'}">${wf.plan}</span>
      </div>
      <p class="wf-summary">${wf.summary || ''}</p>
      <button class="run-btn" data-wid="${wf.id}" ${locked ? 'disabled' : ''}>
        ${locked ? 'Pro only' : 'Run'}
      </button>
    `
    container.appendChild(card)
  })

  container.querySelectorAll<HTMLButtonElement>('.run-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const workflowId = btn.dataset.wid
      const wf = workflows.find(w => w.id === workflowId)
      if (!wf) return
      runWorkflow(wf, btn)
    })
  })
}

async function runWorkflow(workflow: Workflow, btn: HTMLButtonElement) {
  const tab = await getCurrentTab()
  if (!tab.id) return

  const user = await getSessionUser()
  if (!user) {
    alert('Please log in from Options first')
    return
  }

  try {
    const logId = await insertStartedLog({
      userId: user.id,
      workflowId: workflow.id,
      url: currentTabUrl || tab.url || '',
      domain: currentDomain || extractDomain(tab.url || '') || ''
    })
    currentLogId = logId
  } catch (err) {
    console.error('Failed to log started', err)
  }

  const startedAt = Date.now()
  btn.disabled = true
  btn.textContent = 'Running...'

  chrome.tabs.sendMessage(tab.id, { type: 'CHECK_COMET' }, async (check) => {
    if (chrome.runtime.lastError || !check?.cometAvailable) {
      alert('COMET assistant not found on this page')
      await updateLogStatusSafe('error', { errorMessage: 'COMET not available' })
      btn.disabled = false
      btn.textContent = 'Run'
      return
    }

    chrome.tabs.sendMessage(tab.id, { type: 'RUN_WORKFLOW', prompt: workflow.prompt, logId: currentLogId, startedAt }, async (resp) => {
      if (chrome.runtime.lastError) {
        console.error('Message failed', chrome.runtime.lastError)
        alert('Failed to reach content script (is COMET tab loaded?)')
        await updateLogStatusSafe('error', { errorMessage: 'content script not reachable' })
        btn.disabled = false
        btn.textContent = 'Run'
        return
      }
      if (!resp?.success) {
        alert(resp?.error || 'Failed to run workflow')
        await updateLogStatusSafe('error', { errorMessage: resp?.error || 'run failed' })
        btn.disabled = false
        btn.textContent = 'Run'
        return
      }
      // success path: final-goal observer will update log; optimistic UI reset
      btn.disabled = false
      btn.textContent = 'Run'
    })
  })
}

async function updateLogStatusSafe(status: 'success' | 'error', meta: any) {
  if (!currentLogId) return
  try {
    await updateLogStatus(currentLogId, status, meta)
  } catch (err) {
    console.error('Failed to update log status', err)
  }
}

async function setBadge(count: number) {
  chrome.runtime.sendMessage({ type: 'SET_BADGE', count }).catch(() => {})
}

// Handle settings button click
document.getElementById('open-options')?.addEventListener('click', () => {
  chrome.runtime.openOptionsPage()
})

// Initialize popup
displayCurrentDomain()
loadWorkflows()
