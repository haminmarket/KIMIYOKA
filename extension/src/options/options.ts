/**
 * Options Page Logic
 * Handles user authentication and settings
 */

console.log('COMET Shortcuts: Options page loaded')

import { supabase } from '@/api/supabaseClient'
import { SUPABASE_URL } from '@/config'

// Check authentication status
async function checkAuthStatus() {
  const authStatus = document.getElementById('auth-status')

  if (!supabase) {
    if (authStatus) authStatus.innerHTML = '<p>Supabase env not configured</p>'
    return
  }

  const { data } = await supabase.auth.getSession()
  const user = data.session?.user

  if (!authStatus) return

  if (user) {
    authStatus.innerHTML = `<p>Logged in as <strong>${user.email}</strong></p><button id="logout-btn">Log Out</button>`
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
      if (!supabase) return
      await supabase.auth.signOut()
      await checkAuthStatus()
    })
  } else {
    authStatus.innerHTML = '<p>Not logged in</p>'
  }
}

// Handle login form submission
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = (document.getElementById('email') as HTMLInputElement).value
  const password = (document.getElementById('password') as HTMLInputElement).value

  console.log('Login attempt:', { email })

  if (!supabase) {
    alert('Supabase env not configured')
    return
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    alert(`Login failed: ${error.message}`)
    return
  }

  await checkAuthStatus()
  alert('Logged in')
})

// Initialize options page
checkAuthStatus()

// Debug info (non-sensitive)
const info = document.createElement('p')
info.className = 'env-hint'
info.textContent = `Project: ${SUPABASE_URL}`
document.querySelector('main')?.appendChild(info)
