# Feature Checklist Guide

## Purpose

`features.json` is the **single source of truth** for what work needs to be done. This file drives all development sessions and ensures nothing is forgotten.

## Golden Rule

**📌 One feature at a time, from start to finish.**

Never start a new feature until the current one is `done` or explicitly `blocked`.

## features.json Structure

```json
[
  {
    "id": "unique-feature-id",
    "description": "Clear description of what this feature does",
    "status": "todo | in_progress | done | blocked",
    "notes": "Optional notes, blockers, or context",
    "dependencies": ["other-feature-id"],
    "milestone": "M1 | M2 | M3 | M4"
  }
]
```

### Status Values

- **`todo`**: Feature not started, ready to work on
- **`in_progress`**: Currently being worked on (only ONE feature should have this status)
- **`done`**: Feature complete, tested, committed
- **`blocked`**: Can't proceed due to external dependency or blocker

### Best Practices

1. **Atomic Features**: Each feature should be completable in one coding session (1-3 hours)
2. **Clear Descriptions**: Write what the feature does, not how to implement it
3. **Dependencies**: List other features that must be done first
4. **Notes Field**: Use for blockers, technical decisions, or links to related docs

## Development Workflow

### Starting a Session

1. **Read the checklist**:
   ```bash
   cat features.json
   ```

2. **Pick next `todo` feature**:
   - Check dependencies are met
   - Verify no blockers
   - Ensure fits current milestone

3. **Update status to `in_progress`**:
   ```json
   {
     "id": "ext-popup-workflow-list",
     "status": "in_progress",
     "notes": "Started 2025-12-05"
   }
   ```

4. **Commit the status change**:
   ```bash
   git add features.json
   git commit -m "Start: ext-popup-workflow-list"
   ```

### During Development

1. **Break down into 3-5 steps**:
   - Design/plan
   - Implement core logic
   - Add error handling
   - Write tests
   - Update docs

2. **Use TodoWrite tool** to track sub-tasks within the feature

3. **Test thoroughly** before marking done

### Completing a Feature

1. **Verify completion criteria**:
   - ✅ Code written and working
   - ✅ Tests pass
   - ✅ No console errors
   - ✅ Documented (if public API)

2. **Update status to `done`**:
   ```json
   {
     "id": "ext-popup-workflow-list",
     "status": "done",
     "notes": "Completed 2025-12-05. Tested with youtube.com and notion.so"
   }
   ```

3. **Commit with clear message**:
   ```bash
   git add .
   git commit -m "feat: popup workflow list display

   - Added workflow list component
   - Filtered by current domain
   - Showed Free/Pro badges
   - Tested with 5+ domains

   Closes: ext-popup-workflow-list"
   ```

4. **Update `claude-progress.md`** (see next section)

## Handling Blockers

If you encounter a blocker:

1. **Update status to `blocked`**:
   ```json
   {
     "id": "ext-comet-prompt-injection",
     "status": "blocked",
     "notes": "Blocked: Waiting for actual COMET DOM spec. Using mock for now."
   }
   ```

2. **Document the blocker** clearly in notes

3. **Move to next available `todo`** feature

4. **Update blocker when resolved**:
   - Change status back to `todo`
   - Clear or update notes

## Feature Granularity Examples

### ✅ Good Granularity

```json
{
  "id": "ext-domain-detection",
  "description": "Extract domain from current tab URL and store in state"
}
```

Small, focused, testable.

### ❌ Too Large

```json
{
  "id": "ext-complete-popup",
  "description": "Build entire popup UI with all features"
}
```

Should be split into: domain detection, workflow list, login state, etc.

### ❌ Too Small

```json
{
  "id": "ext-add-import-statement",
  "description": "Add import for supabaseClient"
}
```

Too granular - should be part of a larger feature.

## Milestone Guidelines

Features are grouped into milestones matching PRD:

- **M1**: Foundation (2 weeks)
  - Project setup, basic structure, git workflow

- **M2**: Core Extension (4 weeks)
  - Popup, options, domain detection, COMET integration

- **M3**: Polish & Membership (3 weeks)
  - Free/Pro distinction, notifications, error handling

- **M4**: Stabilization (ongoing)
  - Bug fixes, performance, monitoring

## Integration with Other Tools

### With TodoWrite

- `features.json`: High-level features (one per day or session)
- `TodoWrite`: Sub-tasks within current feature (track progress during session)

### With claude-progress.md

- `features.json`: What work exists
- `claude-progress.md`: What work was completed and when

### With Git Commits

- Feature ID should appear in commit message
- Use conventional commits: `feat:`, `fix:`, `test:`, etc.

## Example Workflow Session

```bash
# 1. Start session
cat features.json | grep "todo"
# Pick: ext-options-auth-ui

# 2. Update status
# Edit features.json → status: "in_progress"
git add features.json
git commit -m "Start: ext-options-auth-ui"

# 3. Work on feature
# ... implement auth UI ...
# ... write tests ...
# ... verify in Chrome ...

# 4. Complete feature
# Edit features.json → status: "done", notes: "Tested with test@example.com"
git add .
git commit -m "feat: options page auth UI

- Email/password input fields
- Login/logout buttons
- Display current user email
- Error messages for invalid credentials

Closes: ext-options-auth-ui"

# 5. Log progress
# Add entry to claude-progress.md

# 6. Pick next feature
cat features.json | grep "todo"
```

## Common Mistakes to Avoid

❌ **Starting multiple features** simultaneously
✅ **One feature** from `todo` → `in_progress` → `done`

❌ **Vague feature descriptions**
✅ **Clear, testable descriptions**

❌ **Forgetting to update status**
✅ **Update status** at start and completion

❌ **Skipping dependencies**
✅ **Check dependencies** before starting

❌ **Leaving features in `in_progress`** indefinitely
✅ **Finish or block** within one session

## Questions to Ask Before Starting

1. Are all dependencies `done`?
2. Is there exactly ONE feature `in_progress` (this one)?
3. Can I complete this in one session?
4. Do I understand the acceptance criteria?
5. Are there any known blockers?

If all yes → proceed. If any no → clarify or pick different feature.

## Next Steps

- See `building_the_project.md` for build instructions
- See `running_tests.md` for testing guidelines
- See `CLAUDE.md` for overall project context
