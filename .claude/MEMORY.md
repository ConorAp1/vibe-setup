# Agent Memory
# Vibe Code Setup Assistant

_This file is written and maintained by the AI agent. Updated at the end of each session._

## Architectural Decisions Made
- All Anthropic calls are server-side via /api/chat and /api/generate
- Sequential file generation (not parallel) to avoid rate limits
- XML file tags for parsing generated file content (more reliable than JSON)
- No streaming for MVP - standard API responses only
- No database - fully stateless app

## Corrections (Do Not Repeat)
_AI agent adds to this list when the developer corrects a mistake_

## Completed Features
_AI agent updates this as features are completed_

## Session Log
_AI agent appends a one-line summary after each session_
