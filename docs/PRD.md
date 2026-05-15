# Product Requirements Document
# Vibe Code Setup Assistant

## Problem Statement
Developers starting a vibe coding project waste significant time on tedious scaffolding - creating PRDs, CLAUDE.md files, tech designs, memory files, and cursorrules from scratch every time. They either skip these files (leading to poor AI output quality) or spend hours writing them manually before they can start building. This kills momentum at the most important moment: project start.

## Target Users
Developers who use AI-assisted coding tools (Claude Code, Cursor, Windsurf) and want to start new projects quickly with the proper documentation scaffold in place. Specifically: people who understand vibe coding, have an API key, and want to get to building faster.

## MVP Scope

### In Scope (v1)
- [ ] **Interview phase** - Conversational UI where Claude asks targeted questions one at a time to understand the project
- [ ] **File generation phase** - Uses Anthropic API (server-side) to generate all 13 scaffold files, shown with real-time progress per group
- [ ] **File explorer phase** - Tree view of generated files with syntax-highlighted content viewer, copy individual file or copy all
- [ ] **API key security** - All Anthropic calls server-side, key never exposed to client
- [ ] **Project-specific output** - Generated files use the actual project name, features, stack, and users throughout - no generic placeholders

### Explicitly Out of Scope (v1)
- User accounts or authentication
- Saving/persisting generated projects
- Editing generated files in-browser
- GitHub integration (auto-create repo, push files)
- Multiple simultaneous projects
- Template selection (fixed output format for MVP)
- Streaming generation responses
- Mobile-optimised layout

## User Stories

### Interview Phase
- As a developer, I want to describe my project idea in natural language so that I don't have to think about document structure upfront
- As a developer, I want Claude to ask me one question at a time so that the process feels like a conversation, not a form
- As a developer, I want Claude to push back if I list too many MVP features so that I'm forced to cut scope appropriately

### Generation Phase
- As a developer, I want to see which file groups are being generated in real time so that I know the tool is working
- As a developer, I want each generated file to be specific to my project so that I don't have to do find-and-replace on placeholders

### Explorer Phase
- As a developer, I want to browse all generated files in a tree so that I can see exactly what was created
- As a developer, I want to copy individual files or all files at once so that I can quickly get them into my repo
- As a developer, I want to see each file's content clearly so that I can verify quality before using it

## Files Generated (13 total)

| File | Purpose |
|------|---------|
| `README.md` | Project overview and quick start |
| `docs/PRD.md` | Product requirements document |
| `docs/TECH_DESIGN.md` | Architecture, stack, data models |
| `docs/DECISIONS.md` | Architecture decision log |
| `docs/RESEARCH.md` | Market context and validation |
| `docs/plan.md` | First sprint implementation plan |
| `CLAUDE.md` | Claude Code agent config |
| `AGENTS.md` | Universal AI agent config |
| `.cursorrules` | Cursor IDE behavioral rules |
| `.claude/MEMORY.md` | Agent long-term memory template |
| `.claude/CONTEXT.md` | Current session context template |
| `CONTRIBUTING.md` | Contribution guidelines |
| `SECURITY.md` | Security policy |
| `.env.example` | Environment variable template |

## Acceptance Criteria

### Interview
- Claude asks exactly one question at a time
- The conversation collects: name, description, problem, users, features (max 5), stack, constraints
- When collection is complete, app transitions automatically to generation phase
- If connection fails, user sees a clear error message

### Generation
- Each of the 6 file groups shows a status: waiting → generating → done/failed
- All 13 files are generated (or failed with clear indication)
- Generated content uses the actual project name and details throughout
- Total generation time under 60 seconds on standard connection

### Explorer
- All generated files appear in the tree, grouped by directory
- Clicking a file shows its content
- Copy file button copies the file content to clipboard and shows confirmation
- Copy all button copies all files with clear path headers and shows confirmation
- File count is shown in the footer

## Edge Cases
- User gives more than 5 MVP features: Claude explicitly asks which 5 are non-negotiable
- API connection fails during interview: show error, allow retry
- One file group fails to generate: mark it as failed, continue with rest, show partial results
- Generated JSON is malformed from Claude: fallback parsing, surface error clearly
- User tries to copy before generation is complete: button disabled until explorer phase

## Success Metrics (MVP)
- A developer can go from blank page to 13 generated, project-specific files in under 3 minutes
- Generated CLAUDE.md is specific enough that Claude Code can start building without additional context
- Zero API keys exposed to the browser
