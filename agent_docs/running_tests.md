# Running Tests

## Test Structure

This project uses a focused testing approach:

- **Unit Tests**: Test individual functions and modules
- **Integration Tests**: Test chrome APIs and data flows
- **E2E Tests**: Test full user workflows in Chrome browser (later phase)

## Prerequisites

- Extension built successfully (see `building_the_project.md`)
- Chrome browser installed
- Dependencies installed (`pnpm install`)

## Running Unit Tests

### Quick Run

```bash
pnpm test
```

Runs all unit tests using Vitest.

### Watch Mode (Development)

```bash
pnpm test:watch
```

Auto-reruns tests when files change.

### Coverage Report

```bash
pnpm test:coverage
```

Generates coverage report in `coverage/` directory.

## Test Organization

```
tests/
├── unit/
│   ├── api/
│   │   └── supabaseClient.test.ts    # Supabase API client tests
│   ├── core/
│   │   ├── cometDom.test.ts          # COMET DOM manipulation tests
│   │   └── workflows.test.ts          # Workflow logic tests
│   └── utils/
│       └── domainExtractor.test.ts    # Domain extraction tests
└── fixtures/
    ├── mockCometDom.html              # Mock COMET HTML structure
    └── sampleWorkflows.json           # Sample workflow data
```

## Running E2E Tests (Future)

E2E tests will use Playwright to simulate real user interactions.

**Planned test scenarios**:
1. Extension loads successfully
2. User can open popup
3. Domain detection works
4. Workflows display correctly
5. Shortcut execution inserts prompt
6. Logs are saved

Currently not implemented - will be added in later milestone.

## Key Test Scenarios

### Scenario 1: COMET DOM Detection

**What it tests**:
- Content script detects COMET assistant presence
- Identifies input field and submit button correctly
- Handles missing COMET gracefully

**Files**: `tests/unit/core/cometDom.test.ts`

### Scenario 2: Prompt Injection

**What it tests**:
- Prompt text inserted into COMET input correctly
- Submit button triggered properly
- contenteditable element updated with correct structure

**Expected**:
- ✅ Text inserted in `<p dir="auto">` format
- ✅ Input events dispatched
- ✅ Submit button clickable

### Scenario 3: Domain Extraction

**What it tests**:
- Extract domain from various URL formats
- Handle edge cases (localhost, IP, subdomains)

**Examples**:
```typescript
extractDomain('https://www.youtube.com/watch?v=123') // → 'youtube.com'
extractDomain('https://notion.so/page/123') // → 'notion.so'
extractDomain('http://localhost:3000') // → 'localhost'
```

### Scenario 4: API Client

**What it tests**:
- Correct request format to Supabase functions
- Response parsing
- Error handling

**Note**: These are unit tests with mocked fetch - actual Supabase integration handled by separate LLM.

## Debugging Failed Tests

### Check Test Output

Vitest provides detailed error messages:

```bash
pnpm test --reporter=verbose
```

### Run Single Test File

```bash
pnpm test tests/unit/core/cometDom.test.ts
```

### Run Tests Matching Pattern

```bash
pnpm test --grep "prompt injection"
```

### Common Issues

#### Issue: "Document is not defined"

**Cause**: DOM manipulation code running in Node environment

**Solution**: Use jsdom or happy-dom in test setup:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom'
  }
})
```

#### Issue: "Fetch is not defined"

**Cause**: Node doesn't have fetch by default in older versions

**Solution**: Use Node 18+ or polyfill fetch in tests

#### Issue: Mock data not loading

**Cause**: Incorrect fixture path

**Solution**: Use absolute paths or `__dirname` in test files

## Test Data Management

### Mock COMET DOM

Location: `tests/fixtures/mockCometDom.html`

Simplified version of COMET assistant HTML containing:
- Input field: `#ask-input[contenteditable]`
- Submit button: `button[data-testid="submit-button"]`
- Query title area: `h1.group/query`

### Sample Workflows

Location: `tests/fixtures/sampleWorkflows.json`

```json
[
  {
    "id": "wf-001",
    "title": "유튜브 영상 요약",
    "domain": "youtube.com",
    "summary": "영상 내용을 요약하고 핵심 포인트를 추출합니다",
    "prompt": "이 영상을 요약해주세요...",
    "plan": "FREE",
    "success_rate": 0.85
  }
]
```

## Performance Benchmarks

Target performance for tests:

- **Unit tests**: <3 seconds total
- **Integration tests**: <5 seconds total
- **E2E tests**: <30 seconds total (when implemented)

If tests exceed these times:
- Check for unnecessary async waits
- Review fixture loading strategy
- Consider parallelization

## Continuous Integration

Tests run automatically on:
- Every commit (via Git hooks)
- Pull requests (via GitHub Actions)

CI configuration will be added in later phase.

## What NOT to Test

To keep tests focused and maintainable:

❌ **Don't test**:
- Supabase internal behavior (that's their job)
- Chrome API implementation details
- Third-party library internals

✅ **Do test**:
- Our integration with Chrome APIs
- Our DOM manipulation logic
- Our business logic (workflow filtering, domain matching)
- Error handling and edge cases

## Next Steps

- See `feature_checklist_guide.md` for feature development workflow
- See `building_the_project.md` for build troubleshooting
- See `CLAUDE.md` for overall project architecture
