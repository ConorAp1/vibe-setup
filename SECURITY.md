# Security Policy

## Key Security Rules

**API Key Protection**
- `ANTHROPIC_API_KEY` must only ever be in `.env.local` (gitignored)
- The Anthropic SDK is imported only in server-side API routes
- Client components never call `api.anthropic.com` directly
- Never log the API key, even partially

**Input Validation**
- All API route request bodies are validated before processing
- Invalid requests return 400 before any Anthropic API call is made

**Data Handling**
- This app stores no user data - it is fully stateless
- No database, no sessions, no cookies with sensitive data
- Generated project content exists only in the browser's memory

## Reporting a Vulnerability

If you find a security issue - especially anything that could expose the Anthropic API key - please open a private GitHub issue or email directly rather than filing a public bug report.
