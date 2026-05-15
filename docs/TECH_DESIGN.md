# Technical Design
# Vibe Code Setup Assistant

## Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 15 App Router | Server components, API routes, Vercel-native |
| Language | TypeScript (strict) | Type safety, better AI code generation |
| Styling | Tailwind CSS v4 | Utility-first, no runtime overhead |
| AI | Anthropic SDK | Server-side only, claude-sonnet-4-20250514 |
| Fonts | Google Fonts (Outfit + JetBrains Mono) | Via next/font |
| Deploy | Vercel | Zero-config Next.js hosting |

## Architecture

### Data Flow

```
Browser (client component)
  │
  ├── Interview phase
  │   └── POST /api/chat { messages, phase }
  │       └── Anthropic SDK → Claude (interview system prompt)
  │       └── Returns { text, isComplete, projectData? }
  │
  └── Generation phase
      └── For each FILE_GROUP:
          POST /api/generate { projectData, groupId }
          └── Anthropic SDK → Claude (generation prompt)
          └── Returns { files: Record<string, string>, groupId }
```

### Client State Machine

```
Phase: 'interview' → 'generating' → 'explorer'

interview:
  - messages: Message[]
  - input: string
  - isTyping: boolean

generating:
  - projectData: ProjectData
  - generationLog: GenerationLogItem[]
  - generatedFiles: Record<string, string> (fills as groups complete)

explorer:
  - generatedFiles: Record<string, string>
  - selectedFile: string | null
  - expandedDirs: Record<string, boolean>
```

## TypeScript Types

```typescript
// src/types/index.ts

export type Phase = 'interview' | 'generating' | 'explorer'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ProjectData {
  name: string
  description: string
  problem: string
  users: string
  features: string[]
  stack: string
  constraints: string
}

export interface FileGroup {
  id: string
  label: string
  files: string[]
}

export type GenerationStatus = 'waiting' | 'generating' | 'done' | 'error'

export interface GenerationLogItem {
  id: string
  label: string
  status: GenerationStatus
  fileCount?: number
}

// API request/response types

export interface ChatRequest {
  messages: Message[]
}

export interface ChatResponse {
  text: string
  isComplete: boolean
  projectData?: ProjectData
}

export interface GenerateRequest {
  projectData: ProjectData
  groupId: string
}

export interface GenerateResponse {
  files: Record<string, string>
  groupId: string
}
```

## API Routes

### POST /api/chat

**Purpose:** Handles interview conversation. Applies the interview system prompt, returns Claude's response. Detects the SETUP_COMPLETE signal and extracts projectData.

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "start" }
  ]
}
```

**Response:**
```json
{
  "text": "What are you building?",
  "isComplete": false,
  "projectData": null
}
```

When interview is complete:
```json
{
  "text": "Got everything I need...",
  "isComplete": true,
  "projectData": {
    "name": "...",
    "description": "...",
    ...
  }
}
```

**Implementation notes:**
- Use Anthropic SDK with `system` parameter for interview system prompt
- max_tokens: 700 for interview responses
- Detect `SETUP_COMPLETE:` prefix in response, parse JSON after it
- Return isComplete: true + projectData when detected
- Validate messages array is non-empty

### POST /api/generate

**Purpose:** Generates one group of files. Called 6 times (once per FILE_GROUP) from the client sequentially.

**Request body:**
```json
{
  "projectData": { ... },
  "groupId": "core"
}
```

**Response:**
```json
{
  "files": {
    "README.md": "# My Project\n...",
    "docs/PRD.md": "# Product Requirements\n..."
  },
  "groupId": "core"
}
```

**Implementation notes:**
- Look up group by groupId from FILE_GROUPS config
- Build generation prompt with projectData and file list
- max_tokens: 4000 for generation
- Parse XML file tags from response using parseFiles utility
- Validate projectData shape before calling API

## File Groups Config

```typescript
// src/lib/fileGroups.ts
export const FILE_GROUPS: FileGroup[] = [
  { id: 'core',  label: 'README + PRD',           files: ['README.md', 'docs/PRD.md'] },
  { id: 'tech',  label: 'Technical design',        files: ['docs/TECH_DESIGN.md', 'docs/DECISIONS.md'] },
  { id: 'ai',    label: 'AI agent config',          files: ['CLAUDE.md', 'AGENTS.md'] },
  { id: 'tools', label: 'Tool config + research',  files: ['.cursorrules', 'docs/RESEARCH.md'] },
  { id: 'mem',   label: 'Memory + context + plan', files: ['.claude/MEMORY.md', '.claude/CONTEXT.md', 'docs/plan.md'] },
  { id: 'std',   label: 'Standard repo files',     files: ['CONTRIBUTING.md', 'SECURITY.md', '.env.example'] },
]
```

## File Parser

```typescript
// src/lib/parseFiles.ts
export function parseFiles(text: string): Record<string, string> {
  const out: Record<string, string> = {}
  const re = /<file path="([^"]+)">([\s\S]*?)<\/file>/g
  let match
  while ((match = re.exec(text)) !== null) {
    out[match[1]] = match[2].trim()
  }
  return out
}
```

## Prompt Architecture

```typescript
// src/lib/prompts.ts

export const INTERVIEW_SYSTEM = `...` // Full interview system prompt

export function buildGenerationPrompt(projectData: ProjectData, files: string[]): string {
  // Returns the full generation prompt for a group of files
}
```

## UI Component Breakdown

### `app/page.tsx` (server component shell, client state)
- Renders the correct phase component based on state
- Passes state and handlers down as props
- Note: needs `'use client'` because it manages state

### `InterviewPhase.tsx`
- Message list with scroll-to-bottom
- Typing indicator animation
- Textarea input with Enter-to-send
- Calls POST /api/chat on each message
- Transitions to generating when isComplete is true

### `GeneratingPhase.tsx`
- Shows project name
- Renders GenerationLogItem for each FILE_GROUP
- Status icons: waiting (·), generating (spinner), done (✓), error (✕)
- Drives sequential generation by calling POST /api/generate per group
- Updates parent state as each group completes

### `ExplorerPhase.tsx`
- Renders FileTree + FileViewer side by side
- Manages selectedFile and expandedDirs state
- Copy file and copy all handlers

### `FileTree.tsx`
- Groups files by directory
- Expandable dir rows
- Highlights selected file

### `MessageBubble.tsx`
- Renders assistant and user messages differently
- Handles bold markdown (`**text**`) in assistant messages

## Visual Design

**Theme:** Dark terminal aesthetic
- Base: `#0d1117`
- Surface: `#161b22`
- Border: `#21262d`
- Text primary: `#e6edf3`
- Text secondary: `#8b949e`
- Accent green: `#3fb950`
- Accent blue: `#388bfd`

**Fonts:**
- UI text: Outfit (Google Fonts)
- File content, paths, monospace: JetBrains Mono (Google Fonts)

## Environment Variables

```
ANTHROPIC_API_KEY=        # Required. Get from console.anthropic.com
```

No other environment variables needed for MVP.

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Add ANTHROPIC_API_KEY as environment variable
4. Deploy

No build configuration needed - Vercel detects Next.js automatically.
