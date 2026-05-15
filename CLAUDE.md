# Vibe Code Setup Assistant - Claude Agent Config

## Project Overview
A Next.js 15 web app that interviews developers about their project via a conversational UI, then uses the Anthropic API (server-side) to generate a complete repo scaffold of 13 project files, displayed in an interactive file explorer.

## Stack
- **Framework** - Next.js 15 App Router (NOT Pages Router - never use pages/)
- **Language** - TypeScript with strict mode enabled
- **Styling** - Tailwind CSS v4 (use utility classes, no custom CSS files unless necessary)
- **AI** - Anthropic SDK via server-side API routes only
- **Runtime** - Node.js (not edge runtime - we use the Anthropic SDK which needs Node)
- **Deploy** - Vercel

## Commands
```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
npm run typecheck # tsc --noEmit
```

## Architecture Rules
- All Anthropic API calls go through `/api/chat` or `/api/generate` route handlers ONLY
- Never import or use the Anthropic SDK in client components - API key must stay server-side
- Client components fetch from our own API routes, never directly to api.anthropic.com
- Use the App Router file conventions: page.tsx, layout.tsx, route.ts
- All API routes return typed JSON responses

## File Conventions
- Components: PascalCase, one component per file, in `/src/components/`
- API routes: `/src/app/api/[name]/route.ts`
- Lib utilities: camelCase functions, pure where possible, in `/src/lib/`
- Types: all shared types in `/src/types/index.ts`

## Coding Conventions
- Always use TypeScript - no `any` types, ever
- Handle all errors explicitly - no silent catch blocks
- Use `const` by default, `let` only when reassignment is needed
- API routes must validate request body before processing
- Use Zod for any input validation in API routes
- Prefer named exports over default exports for utilities and types
- Default export only for page components and route handlers

## Component Conventions
- Mark client components with `'use client'` at the top
- Server components by default (no directive needed)
- Keep client components focused on interactivity - fetch data in server components where possible
- For this app: InterviewPhase, GeneratingPhase, ExplorerPhase are all client components (they manage state)

## State Management
- Use React useState and useEffect - no external state library needed for this app
- App-level state (phase, projectData, generatedFiles) lives in the root page component
- Pass state down as props, lift state up when needed

## Styling Rules
- Use Tailwind utility classes throughout
- Dark theme: bg-[#0d1117] as base, bg-[#161b22] as surface, border-[#21262d]
- Primary accent: text-green-400 / border-green-400/30 / bg-green-400/10
- User messages: blue accent (text-blue-400 family)
- Monospace font (JetBrains Mono) for file content and paths, Outfit for UI
- Load fonts via next/font or Google Fonts in layout.tsx

## API Route Structure

### POST /api/chat
- Request: `{ messages: Message[], phase: 'interview' }`
- Response: `{ text: string, isComplete: boolean, projectData?: ProjectData }`
- Handles the interview conversation with the interview system prompt
- Detects SETUP_COMPLETE signal and parses projectData from it

### POST /api/generate
- Request: `{ projectData: ProjectData, groupId: string }`
- Response: `{ files: Record<string, string>, groupId: string }`
- Generates one FILE_GROUP worth of files per call
- Parses XML file tags from Claude's response

## Known Gotchas
- Next.js 15 App Router: use `params` as a Promise in dynamic routes (async params)
- Tailwind v4: config is in CSS, not tailwind.config.js
- The Anthropic SDK streaming is available but not needed for MVP - use non-streaming
- max_tokens for interview responses: 700. For generation: 4000
- Generation calls can take 10-20 seconds each - show clear loading states

## Security
- ANTHROPIC_API_KEY must be in .env.local only, never committed
- Validate all incoming request bodies in API routes
- No user data is stored - this is a stateless app
- Rate limiting is a post-MVP concern

## Imports
See @docs/PRD.md for full product requirements
See @docs/TECH_DESIGN.md for architecture detail
See @docs/plan.md for current build tasks
See @.claude/MEMORY.md for session history
