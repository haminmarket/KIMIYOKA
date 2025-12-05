import { createClient } from '@supabase/supabase-js'
import {
  ENV_READY,
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

export const supabase = ENV_READY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null

// MVP 정책: logs 기록은 Edge Function 대신 direct table insert/update로 처리 (RLS 보호)

/** Fetch workflows for a domain (auth required) */
export async function fetchWorkflows(domain: string) {
  if (!supabase) throw new Error('Supabase env not configured')
  const { data, error } = await supabase
    .from('workflows')
    .select('id,title,domain,summary,plan,prompt,success_rate')
    .eq('domain', domain)
  if (error) throw error
  return (data as unknown as Workflow[] | null) || []
}

/** Insert started log and return id */
export async function insertStartedLog(params: {
  userId: string
  workflowId: string
  url: string
  domain: string
}) {
  if (!supabase) throw new Error('Supabase env not configured')
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
  return (data as any).id as string
}

/** Update log status/meta by id */
export async function updateLogStatus(logId: string, status: LogStatus, meta?: LogMeta) {
  if (!supabase) throw new Error('Supabase env not configured')
  const { error } = await supabase
    .from('logs')
    .update({ status, meta })
    .eq('id', logId)
  if (error) throw error
}

/** Call edge function to check license */
export async function checkLicense(body: CheckLicenseRequest): Promise<CheckLicenseResponse> {
  if (!ENV_READY) throw new Error('Supabase env not configured')
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
  if (!ENV_READY) throw new Error('Supabase env not configured')
  const res = await fetch(FUNCTION_ENDPOINTS.LOG_INGEST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  })
  if (!res.ok) throw new Error(`sendLog failed: ${res.status}`)
  return (await res.json()) as LogIngestResponse
}
