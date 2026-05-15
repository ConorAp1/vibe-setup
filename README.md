# Vibe Code Setup Assistant

A conversational web app that interviews you about your project idea and generates a complete, production-ready repo scaffold - all the .md files, AI agent configs, and planning docs you need to start vibe coding immediately.

## What It Does

1. **Interview** - Claude asks you targeted questions about your project one at a time
2. **Generate** - Produces 13 project files specific to your idea (PRD, TECH_DESIGN, CLAUDE.md, AGENTS.md, memory files, cursorrules, plan, contributing, security, .env.example)
3. **Export** - Browse generated files in a tree explorer, copy individually or all at once

## Quick Start

```bash
git clone <repo-url>
cd vibe-setup
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

- **Framework** - Next.js 15 App Router
- **Language** - TypeScript (strict)
- **Styling** - Tailwind CSS v4
- **AI** - Anthropic SDK (server-side, key never exposed to client)
- **Deploy** - Vercel

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Root page - renders main app shell
│   ├── layout.tsx            # Root layout with fonts and metadata
│   └── api/
│       ├── chat/route.ts     # Interview conversation endpoint
│       └── generate/route.ts # File generation endpoint
├── components/
│   ├── InterviewPhase.tsx    # Chat UI for the interview
│   ├── GeneratingPhase.tsx   # Progress screen during generation
│   ├── ExplorerPhase.tsx     # File tree + viewer
│   ├── MessageBubble.tsx     # Single chat message
│   └── FileTree.tsx          # Recursive file tree component
├── lib/
│   ├── prompts.ts            # All system prompts and generation prompts
│   ├── fileGroups.ts         # FILE_GROUPS config (what gets generated)
│   └── parseFiles.ts         # XML file content parser
└── types/
    └── index.ts              # Shared TypeScript types
```

## Environment Variables

See `.env.example` for all required variables.

## Architecture

See `docs/TECH_DESIGN.md` for full architecture detail.

## Contributing

See `CONTRIBUTING.md`.
