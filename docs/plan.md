# Implementation Plan - Sprint 1 (Full MVP)
Date: 2026-05-15
Goal: Working end-to-end app from interview through file explorer

---

## Objective
Build the complete Vibe Code Setup Assistant MVP. A user opens the app, gets interviewed by Claude, watches files generate, then browses and copies their project scaffold.

---

## Step 1 - Project setup

**Files to create:**
- `package.json` - Next.js 15 + TypeScript + Tailwind + Anthropic SDK
- `tsconfig.json` - Strict TypeScript config
- `next.config.ts` - Minimal Next.js config
- `.env.local` - ANTHROPIC_API_KEY (not committed)
- `.gitignore` - Standard Next.js gitignore
- `src/app/globals.css` - Tailwind v4 setup + font imports
- `src/app/layout.tsx` - Root layout with metadata and fonts

**Commands:**
```bash
npx create-next-app@latest vibe-setup --typescript --tailwind --app --src-dir --no-turbopack
cd vibe-setup
npm install @anthropic-ai/sdk
```

---

## Step 2 - Types and lib

**Files to create:**
- `src/types/index.ts` - All shared types (Phase, Message, ProjectData, FileGroup, etc.)
- `src/lib/fileGroups.ts` - FILE_GROUPS array
- `src/lib/parseFiles.ts` - XML file tag parser
- `src/lib/prompts.ts` - INTERVIEW_SYSTEM prompt + buildGenerationPrompt function

**Definition of done:** TypeScript compiles with no errors (`npm run typecheck`)

---

## Step 3 - API routes

**Files to create:**
- `src/app/api/chat/route.ts` - Interview conversation handler
- `src/app/api/generate/route.ts` - File generation handler

**Each route must:**
- Validate request body (return 400 if invalid)
- Use Anthropic SDK (import from `@anthropic-ai/sdk`)
- Return typed JSON responses
- Handle Anthropic API errors gracefully (return 500 with message)

**Test with:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "start"}]}'
```

**Definition of done:** Both routes return correct JSON when called with valid bodies

---

## Step 4 - Core components

**Files to create:**
- `src/components/MessageBubble.tsx` - Single message display
- `src/components/InterviewPhase.tsx` - Full interview UI
- `src/components/GeneratingPhase.tsx` - Progress display
- `src/components/FileTree.tsx` - File tree with expandable dirs
- `src/components/ExplorerPhase.tsx` - Tree + viewer layout

**InterviewPhase requirements:**
- Auto-kicks off on mount (calls /api/chat with "start" message)
- Shows typing indicator while waiting for response
- Enter to send (Shift+Enter for newline)
- Auto-scrolls to latest message
- Transitions to GeneratingPhase when isComplete is true

**GeneratingPhase requirements:**
- Renders a row per FILE_GROUP with status icon
- Sequentially calls /api/generate for each group
- Updates parent with files as each group completes
- Transitions to ExplorerPhase when all groups are done

**ExplorerPhase requirements:**
- Left panel: FileTree
- Right panel: file content viewer in JetBrains Mono
- Copy file button with "✓ Copied" confirmation
- Copy all button in footer
- File count in footer

---

## Step 5 - Root page

**Files to create/edit:**
- `src/app/page.tsx` - Root page managing phase state

**Manages:**
- `phase: Phase` - current phase
- `messages: Message[]` - interview messages
- `projectData: ProjectData | null`
- `generatedFiles: Record<string, string>`

**Renders:** header + the correct phase component based on current phase

---

## Step 6 - Visual polish

Apply the design spec from TECH_DESIGN.md:
- Dark theme colors
- Outfit font for UI, JetBrains Mono for file content
- Animated typing indicator (3 bouncing dots)
- Animated status icons in generation phase
- Smooth phase transitions (fade in)
- Correct accent colors (green for AI/success, blue for user messages)

---

## Definition of Done (Full MVP)

- [ ] Interview: Claude asks questions one at a time, conversation flows naturally
- [ ] Interview: Correctly detects completion and transitions to generation
- [ ] Generation: All 6 groups run sequentially with live status updates
- [ ] Generation: Generated files are specific to the project (name, features, stack used throughout)
- [ ] Explorer: File tree shows all generated files grouped by directory
- [ ] Explorer: Clicking a file shows its content
- [ ] Explorer: Copy file and copy all work correctly
- [ ] API key never appears in client-side code or network requests to Anthropic
- [ ] TypeScript compiles with no errors
- [ ] App works end-to-end on localhost
- [ ] Deployed to Vercel

---

## Commit Checkpoints

Commit after each step:
```bash
git add -A && git commit -m "step 1: project setup"
git add -A && git commit -m "step 2: types and lib"
git add -A && git commit -m "step 3: api routes"
git add -A && git commit -m "step 4: components"
git add -A && git commit -m "step 5: root page"
git add -A && git commit -m "step 6: visual polish"
```
