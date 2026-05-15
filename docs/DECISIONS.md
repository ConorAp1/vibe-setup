# Architecture Decisions
# Vibe Code Setup Assistant

---

## 2026-05-15 - Server-side only Anthropic API calls

**Decision:** All Anthropic API calls go through Next.js API routes. The Anthropic SDK is imported only in server-side code.

**Alternatives considered:** Calling the Anthropic API directly from client components using fetch.

**Reason:** Exposing the API key to the browser is a security risk. Any user could extract the key from network requests and use it against our account.

**Consequence:** Every AI interaction requires a round-trip to our API route. Acceptable latency for this use case.

**Do not revisit:** This is a firm security requirement.

---

## 2026-05-15 - Sequential generation, not parallel

**Decision:** Generate FILE_GROUPS one at a time sequentially, not in parallel.

**Alternatives considered:** Promise.all() to generate all 6 groups simultaneously.

**Reason:** Parallel generation would hit Anthropic rate limits on a standard API key (6 simultaneous 4000-token requests). Sequential also gives better UX - users see progress step by step rather than everything happening at once then finishing together.

**Consequence:** Total generation time is ~45-60 seconds. Acceptable for the value delivered.

---

## 2026-05-15 - XML tags for file parsing, not JSON

**Decision:** Ask Claude to wrap generated files in XML tags (`<file path="...">...</file>`) rather than returning a JSON object.

**Alternatives considered:** JSON response with file paths as keys and content as values.

**Reason:** File content often contains special characters, quotes, and newlines that reliably break JSON parsing. XML tags with a regex parser are robust against this. Claude also reliably produces well-formed XML tags when instructed to.

**Consequence:** We need the parseFiles() utility. Minor complexity, much higher reliability.

---

## 2026-05-15 - No streaming for MVP

**Decision:** Use standard (non-streaming) Anthropic API responses.

**Alternatives considered:** Streaming responses for real-time file content display.

**Reason:** Streaming adds significant implementation complexity (SSE handling, partial state management). For MVP, showing a "generating..." state per group is sufficient UX. Streaming is a clear post-MVP upgrade.

**Do not revisit until v2.**

---

## 2026-05-15 - No database or persistence

**Decision:** The app is fully stateless. No generated projects are saved.

**Alternatives considered:** Supabase to persist generated projects with a shareable URL.

**Reason:** Persistence adds auth complexity, storage costs, and privacy considerations (storing user project ideas). The core value is generation, not storage. Users copy what they need immediately.

**Post-MVP:** Add "save project" with a shareable link once core generation is solid.

---

## 2026-05-15 - Next.js App Router, not Pages Router

**Decision:** Use Next.js 15 App Router exclusively.

**Alternatives considered:** Pages Router (more familiar to some developers).

**Reason:** App Router is the current standard, supports React Server Components, has better Vercel integration, and is what Claude Code knows best.

**Do not revisit:** Pages Router is legacy. All routes use App Router conventions.

---

## 2026-05-15 - Tailwind CSS v4

**Decision:** Use Tailwind v4.

**Alternatives considered:** Tailwind v3, plain CSS modules.

**Reason:** v4 is the current version, config lives in CSS (not a JS config file), better performance. No significant migration overhead for a new project.

**Note:** v4 config syntax differs from v3. Config goes in `app/globals.css`, not `tailwind.config.js`.
