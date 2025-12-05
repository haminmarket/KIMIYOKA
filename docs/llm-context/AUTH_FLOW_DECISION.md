# Auth & Membership Flow - Official Decision

**Last Updated**: 2025-12-05
**Status**: ACTIVE - This is the authoritative source

## 🎯 Official MVP Strategy

### Authentication (How users log in)
**Method**: Supabase Auth (Email + Password)

```typescript
// User logs in through options page
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Session stored by Supabase client
// user.id available from supabase.auth.getUser()
```

**Why**:
- ✅ Simplest MVP implementation
- ✅ Built-in session management
- ✅ Secure by default (RLS policies)
- ✅ No custom token management needed

### Membership/Plan Management (Free vs Pro)
**Storage**: Supabase `users.plan` field

```sql
-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'FREE', -- 'FREE' | 'PRO'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Initial Setup**: Manual updates via Supabase Dashboard
**Phase 2**: Auto-sync with LemonSqueezy webhooks

### Workflow Execution Flow

```
1. User opens extension popup
2. Extension checks: supabase.auth.getUser()
   - Not logged in? → Show login prompt
   - Logged in? → Continue
3. Extension fetches user.plan from Supabase
4. Filter workflows by plan (FREE/PRO)
5. User clicks "Run" → Insert prompt → Log to Supabase
```

## ❌ What We're NOT Doing (MVP)

### License Key Flow (Phase 2+)
The original PRD mentions license keys:
```
Request: { licenseKey: string }
```

**Decision**: This is deferred to Phase 2

**Reasoning**:
- License keys add complexity (storage, validation, sync)
- Supabase Auth is simpler and more secure
- License keys better suited for post-purchase flow integration

**Future Path** (when we add LemonSqueezy):
1. User purchases on LemonSqueezy
2. Webhook updates Supabase `users.plan`
3. Optional: Store license key in `users.license_key` for support
4. Extension still uses Supabase Auth (no license key input needed)

## 📋 API Contracts (Current)

### NOT USED (MVP):
```typescript
// ❌ This is Phase 2
POST /extension-check-license
Request: { licenseKey: string }
```

### USED (MVP):
```typescript
// ✅ Regular Supabase client queries
const { data: user } = await supabase
  .from('users')
  .select('plan')
  .eq('id', authUser.id)
  .single()

// ✅ Log ingest (no license key)
POST /extension-log-ingest
Request: {
  user_id: string,
  workflow_id: string,
  type: 'run' | 'error',
  payload: unknown
}
```

## 🔄 Migration Path (When LemonSqueezy Added)

**Phase 1 (MVP - NOW)**:
- Auth: Supabase email/password
- Plans: Manual assignment in `users.plan`
- No license keys

**Phase 2 (LemonSqueezy Integration)**:
- Auth: Still Supabase (no change)
- Plans: Auto-updated via LZ webhooks
- Optional: Store license keys for support

**Phase 3 (Advanced)**:
- Consider license key validation for offline scenarios
- Add license key display in options (read-only)

## 📖 Document Alignment

### Documents to Update
- [x] This document (AUTH_FLOW_DECISION.md) - Source of truth
- [ ] PRD.txt - Add reference to this document
- [ ] SUPABASE_RULE.txt - Remove license key Edge Function
- [ ] CLAUDE.MD (llm-context) - Clarify auth flow
- [ ] claude-progress.md - Log this decision

### Key Message to Maintain
**"MVP uses Supabase Auth for login. Plans stored in Supabase. License keys deferred to Phase 2."**

## 🚨 Common Pitfalls to Avoid

1. **Don't mix auth methods**: No "login with license key" in MVP
2. **Don't create Edge Functions for license validation**: Use Supabase client queries
3. **Don't store service role keys in extension**: Only anon keys
4. **Don't build LemonSqueezy integration in MVP**: Manual plan assignment is fine

## ✅ Summary for LLMs

**For Extension Development (Claude)**:
```typescript
// Login
await supabase.auth.signInWithPassword({ email, password })

// Check plan
const { data: user } = await supabase
  .from('users')
  .select('plan')
  .eq('id', authUser.id)
  .single()

// Filter workflows
const workflows = allWorkflows.filter(w =>
  w.plan === 'FREE' || (w.plan === 'PRO' && user.plan === 'PRO')
)
```

**For Supabase Development (Other LLM)**:
- Create `users` table with `plan` field
- RLS: users can only read their own row
- No license key Edge Functions needed for MVP
- LemonSqueezy webhook is Phase 2

---

**Decision Authority**: Project Owner (코베니)
**Last Reviewed**: 2025-12-05
**Next Review**: When starting Phase 2 planning
