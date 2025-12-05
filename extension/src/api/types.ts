export type PlanId = 'FREE' | 'PRO'
export type LogStatus = 'started' | 'success' | 'error' | 'timeout'

export interface Workflow {
  id: string
  title: string
  domain: string
  summary?: string
  plan: PlanId
  prompt?: string
  success_rate?: number | null
}

export interface CheckLicenseRequest {
  licenseKey: string
}

export interface CheckLicenseResponse {
  active: boolean
  plan: PlanId
  expiresAt: string | null
}

export interface LogMeta {
  source: 'extension'
  turns?: number
  duration_ms?: number
  final_goal_text?: string
  timeline_snippet?: string[] | string
  errorMessage?: string
}

export interface LogIngestRequest {
  licenseKey: string
  type: 'extension-run'
  payload: {
    status: LogStatus
    workflow_id?: string
    url?: string
    domain?: string
    meta?: LogMeta
  }
}

export interface LogIngestResponse {
  ok: boolean
}
