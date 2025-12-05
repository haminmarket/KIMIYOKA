# Building the Project

## Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **pnpm**: v8+ (install via `npm install -g pnpm`)
- **Chrome Browser**: For testing the extension

## Installation

### 1. Install dependencies

```bash
pnpm install
```

This installs dependencies for the extension.

### 2. Configure Environment Variables

Create `.env` file in `extension/` directory:

```bash
# extension/.env
APP_ENV=development
SUPABASE_PROJECT_REF=YOUR_PROJECT_REF
SUPABASE_ANON_KEY=your-public-anon-key-here
```

**⚠️ IMPORTANT**:
- Never commit real credentials to Git
- Use `.env.example` as template
- Get credentials from Supabase dashboard (not your responsibility - handled by Supabase LLM)

### 3. Build the Extension

#### Development Build (with watch mode)

```bash
cd extension
pnpm dev
```

This will:
- Compile TypeScript to JavaScript
- Watch for file changes and rebuild automatically
- Output to `extension/dist/`

#### Production Build

```bash
cd extension
pnpm build
```

Creates optimized build in `extension/dist/` ready for packaging.

## Loading the Extension in Chrome

### Load Unpacked (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `extension/dist/` directory
5. Extension should appear in your extensions list

### Package for Distribution

```bash
cd extension
pnpm build
pnpm pack
```

Creates `extension-{version}.zip` in `extension/` directory.

## Verifying the Build

After loading the extension:

1. **Check Extension Icon**: Should appear in Chrome toolbar
2. **Open Popup**: Click extension icon → should show popup UI
3. **Check Console**: Right-click extension icon → "Inspect popup" → check for errors
4. **Test Options Page**: Right-click extension icon → "Options" → verify options UI loads

## Common Build Issues

### Issue: "Module not found" errors

**Solution**: Run `pnpm install` in project root to ensure all dependencies installed.

### Issue: Extension not updating after code changes

**Solution**:
1. Go to `chrome://extensions/`
2. Click refresh icon on your extension card
3. Or toggle: disable → enable

### Issue: TypeScript compilation errors

**Solution**: Run `pnpm typecheck` to see detailed error messages.

### Issue: Environment variables not loading

**Solution**:
1. Verify `.env` file exists in `extension/` directory
2. Check file has correct format (no quotes around values unless needed)
3. Restart dev server after changing `.env`

## Directory Structure After Build

```
extension/
├── dist/                    # Build output (Git-ignored)
│   ├── background.js       # Service worker
│   ├── content.js          # Content script
│   ├── popup.html          # Popup UI
│   ├── popup.js            # Popup logic
│   ├── options.html        # Options page
│   ├── options.js          # Options logic
│   └── manifest.json       # Extension manifest
├── src/                     # Source files
│   ├── background.ts
│   ├── content.ts
│   ├── popup/
│   ├── options/
│   ├── api/
│   └── core/
└── package.json
```

## COMET Assistant Integration

The extension integrates with COMET assistant (Perplexity Sidecar). Key integration points:

**Input Field**: `#ask-input[role="textbox"][contenteditable="true"]`
**Submit Button**: `button[data-testid="submit-button"]`

Content script automatically detects COMET presence via:
- `html[data-erp="sidecar"]`
- `main#root` element
- `#ask-input` existence

See `extension/src/core/cometDom.ts` for DOM manipulation logic.

## Next Steps

After successful build:
- See `running_tests.md` for testing instructions
- See `feature_checklist_guide.md` for development workflow
- See `CLAUDE.md` for overall project structure
