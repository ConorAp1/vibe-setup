# Vibe Code Setup Assistant - Agent Config

## Project
A Next.js 15 web app that interviews developers about a project idea and generates a complete repo scaffold (13 files) via the Anthropic API. Three-phase UI: interview → generating → file explorer.

## Stack
- Next.js 15 App Router + TypeScript strict
- Tailwind CSS v4
- Anthropic SDK (server-side only)
- Vercel deployment

## Commands
```bash
npm run dev        # dev server
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Architecture
- API routes in `/src/app/api/` handle all Anthropic calls server-side
- Client components in `/src/components/` handle UI and state
- Never call the Anthropic API directly from client code
- All shared types in `/src/types/index.ts`
- All prompts in `/src/lib/prompts.ts`

## Code Conventions
- TypeScript everywhere, no `any`
- Named exports for utilities, default exports for page/route components
- `'use client'` directive on any component using state or browser APIs
- Tailwind utility classes only - no custom CSS unless unavoidable
- Explicit error handling in all API routes
- Validate API request bodies before processing

## Folder Structure
```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── api/
│       ├── chat/route.ts
│       └── generate/route.ts
├── components/
│   ├── InterviewPhase.tsx
│   ├── GeneratingPhase.tsx
│   ├── ExplorerPhase.tsx
│   ├── MessageBubble.tsx
│   └── FileTree.tsx
├── lib/
│   ├── prompts.ts
│   ├── fileGroups.ts
│   └── parseFiles.ts
└── types/
    └── index.ts
```

## Security
- ANTHROPIC_API_KEY server-side only, in .env.local
- Validate all request bodies
- No persistent storage - fully stateless

## Do Not
- Use Pages Router (`/pages/` directory)
- Import Anthropic SDK in client components
- Use `any` TypeScript type
- Leave TODO comments or incomplete implementations
- Use edge runtime (breaks Anthropic SDK)
