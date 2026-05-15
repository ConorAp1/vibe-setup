# Contributing

## Setup

```bash
git clone <repo-url>
cd vibe-setup
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

## Before Submitting a PR

- [ ] `npm run typecheck` passes (no TypeScript errors)
- [ ] `npm run lint` passes (no ESLint errors)
- [ ] `npm run build` succeeds
- [ ] Manual test: full flow works end-to-end (interview → generation → explorer)
- [ ] No API key or secrets in committed code

## Branch Naming

```
feature/short-description
fix/short-description
refactor/short-description
```

## Commit Format

```
type: short description

feat: add copy-all button to explorer
fix: handle malformed XML in file parser
refactor: extract MessageBubble component
```

## Key Rules

- Never import `@anthropic-ai/sdk` in a client component
- No `any` TypeScript types
- All new components need `'use client'` if they use state or browser APIs
- Error states must be visible to the user - no silent failures
