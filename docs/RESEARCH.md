# Research
# Vibe Code Setup Assistant

## Problem Validation

The pain point is real and well-documented in the 2026 vibe coding community. Key signals:

- The single most-cited failure mode in vibe coding is context drift - the AI loses track of project conventions across sessions. The fix is documentation files (CLAUDE.md, AGENTS.md) but most developers don't write them properly or at all.
- "AI-generated code has 70% more issues when there's no architectural context to guide it" (CodeRabbit, 2025) - the docs aren't optional, they're multipliers.
- The community has converged on a set of standard files (CLAUDE.md, AGENTS.md, MEMORY.md, PRD, TECH_DESIGN, DECISIONS) but there's no automated tooling that generates them for a specific project.

## Existing Solutions and Gaps

**Manual writing** - Most developers write these files themselves. Time-consuming, inconsistent quality, often skipped.

**`/init` in Claude Code** - Generates a CLAUDE.md from an existing codebase. Only works after you already have code; doesn't help at project start.

**Cursor's project setup** - Creates a basic `.cursorrules` but nothing else in the scaffold.

**Boilerplates/templates** - Generic templates exist on GitHub (e.g., `vibe-coding-prompt-template`) but they're not project-specific. You still have to fill everything in manually.

**No tool** currently takes a raw idea and generates project-specific scaffold files through a guided conversation. That's the gap.

## Technical Feasibility

- Claude Sonnet 4 is capable of generating high-quality, project-specific documentation
- Server-side API calls in Next.js are straightforward with the Anthropic SDK
- The XML parsing approach for file extraction is reliable
- Total generation time (~45-60 seconds) is acceptable for the value delivered

## Market Positioning

This is a developer tool targeting the fast-growing vibe coding market. The target user has:
- An Anthropic API key (pays for Claude)
- Experience with Claude Code, Cursor, or Windsurf
- One or more projects they want to start faster

The tool's value proposition is time savings + quality: what takes 2-3 hours of manual writing takes under 3 minutes.

## Post-MVP Opportunities

1. **GitHub integration** - Auto-create repo and push generated files
2. **Stack presets** - Optimised prompts for specific stacks (Next.js, Django, Go, etc.)
3. **Save and share** - Persist generated projects with shareable URLs
4. **Team templates** - Customise the generation prompts to match team conventions
5. **Regenerate single file** - Re-generate one file without redoing the whole interview
