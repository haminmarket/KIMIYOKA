/**
 * Options Page Logic
 * Handles user authentication and settings
 */

console.log('COMET Shortcuts: Options page loaded')

// TODO: Import Supabase client
// import { supabase } from '@/api/supabaseClient'

// Check authentication status
async function checkAuthStatus() {
  // TODO: Check Supabase auth session
  const authStatus = document.getElementById('auth-status')

  if (authStatus) {
    authStatus.innerHTML = '<p>Not logged in (Supabase integration pending)</p>'
  }
}

// Handle login form submission
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = (document.getElementById('email') as HTMLInputElement).value
  // @ts-ignore - password will be used when Supabase Auth is integrated
  const password = (document.getElementById('password') as HTMLInputElement).value

  console.log('Login attempt:', { email })

  // TODO: Implement Supabase Auth login
  // const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  alert('Login functionality pending Supabase integration')
})

// Initialize options page
checkAuthStatus()
