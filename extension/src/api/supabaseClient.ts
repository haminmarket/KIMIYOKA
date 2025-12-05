import { createClient } from '@supabase/supabase-js'
import {
  FUNCTION_ENDPOINTS,
  SUPABASE_ANON_KEY,
  SUPABASE_URL
} from '../config'
import {
  CheckLicenseRequest,
  CheckLicenseResponse,
  LogIngestRequest,
  LogIngestResponse,
  LogMeta,
  LogStatus,
  Workflow
} from './types'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false
  }
})

/** Fetch workflows for a domain (auth required) */
export async function fetchWorkflows(domain: string) {
  const { data, error } = await supabase
    .from('workflows')
    .select('id,title,domain,summary,plan,prompt,success_rate')
    .eq('domain', domain)
  if (error) throw error
  return (data || []) as Workflow[]
}

/** Insert started log and return id */
export async function insertStartedLog(params: {
  userId: string
  workflowId: string
  url: string
  domain: string
}) {
  const { data, error } = await supabase
    .from('logs')
    .insert({
      user_id: params.userId,
      workflow_id: params.workflowId,
      url: params.url,
      domain: params.domain,
      status: 'started' satisfies LogStatus,
      meta: { source: 'extension' } satisfies LogMeta
    })
    .select('id')
    .single()
  if (error) throw error
  return data.id as string
}

/** Update log status/meta by id */
export async function updateLogStatus(logId: string, status: LogStatus, meta?: LogMeta) {
  const { error } = await supabase
    .from('logs')
    .update({ status, meta })
    .eq('id', logId)
  if (error) throw error
}

/** Call edge function to check license */
export async function checkLicense(body: CheckLicenseRequest): Promise<CheckLicenseResponse> {
  const res = await fetch(FUNCTION_ENDPOINTS.CHECK_LICENSE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`checkLicense failed: ${res.status}`)
  return (await res.json()) as CheckLicenseResponse
}

/** Call edge function to ingest log payload */
export async function sendLog(req: LogIngestRequest): Promise<LogIngestResponse> {
  const res = await fetch(FUNCTION_ENDPOINTS.LOG_INGEST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  })
  if (!res.ok) throw new Error(`sendLog failed: ${res.status}`)
  return (await res.json()) as LogIngestResponse
}
