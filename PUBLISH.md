# Publishing Guide for OpenAI Agent StarterKit

## Pre-Publish Checklist

Run the comprehensive verification script to ensure everything works:

```bash
npm run verify
```

This will run:
- ✅ TypeScript type checking
- ✅ ESLint code quality checks  
- ✅ Unit tests
- ✅ Integration tests (generates test project and runs its tests)

## Publishing Commands

### First Time Publishing (v1.0.0)
```bash
npm publish
```

### Patch Release (1.0.0 → 1.0.1)
```bash
npm run publish:patch
```

### Minor Release (1.0.0 → 1.1.0)
```bash
npm run publish:minor
```

### Major Release (1.0.0 → 2.0.0)
```bash
npm run publish:major
```

## Manual Publishing (if you prefer more control)

### 1. Verify everything works
```bash
npm run verify
```

### 2. Version bump (choose one)
```bash
npm run version:patch  # 1.0.0 → 1.0.1
npm run version:minor  # 1.0.0 → 1.1.0  
npm run version:major  # 1.0.0 → 2.0.0
```

### 3. Publish to npm
```bash
npm publish
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run verify` | Run all checks (typecheck, lint, test, integration) |
| `npm run build` | Build the project |
| `npm run test:run` | Run unit tests once |
| `npm run test:integration:full` | Generate test project and run its tests |
| `npm run lint` | Check code quality |
| `npm run typecheck` | Check TypeScript types |
| `npm run check-version` | Check current vs published version |
| `npm run publish:patch` | Bump patch version and publish |
| `npm run publish:minor` | Bump minor version and publish |
| `npm run publish:major` | Bump major version and publish |

## Notes

- The `prepublishOnly` script automatically runs verification and build before publishing
- All checks must pass before publishing
- The package is configured for public access on npm
- Integration tests ensure generated projects work correctly
- GitHub Actions have been removed - all publishing is done locally for better control
- You must be logged in to npm (`npm whoami` should show your username)
