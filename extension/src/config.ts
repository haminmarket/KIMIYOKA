// Centralized config values injected via Vite env
// Public values only. Never place service_role or other secrets here.

export const APP_ENV = (import.meta.env?.VITE_APP_ENV || 'development') as
  | 'development'
  | 'staging'
  | 'production'

export const SUPABASE_URL: string = import.meta.env?.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY: string = import.meta.env?.VITE_SUPABASE_ANON_KEY || ''
export const SUPABASE_FUNCTION_BASE_URL: string =
  import.meta.env?.VITE_SUPABASE_FUNCTION_BASE_URL ||
  (SUPABASE_URL ? SUPABASE_URL.replace('.supabase.co', '.functions.supabase.co') : '')

export const ENV_READY = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
if (!ENV_READY) {
  // Do not throw to avoid breaking the extension; popup will show a friendly message.
  console.warn('Missing SUPABASE_URL or SUPABASE_ANON_KEY in env. Supabase features disabled.')
}

export const FUNCTION_ENDPOINTS = {
  CHECK_LICENSE: `${SUPABASE_FUNCTION_BASE_URL}/extension-check-license`,
  LOG_INGEST: `${SUPABASE_FUNCTION_BASE_URL}/extension-log-ingest`
} as const
