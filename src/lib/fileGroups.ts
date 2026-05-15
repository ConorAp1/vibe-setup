import type { FileGroup } from '@/types'

export const FILE_GROUPS: FileGroup[] = [
  { id: 'core',  label: 'README + PRD',           files: ['README.md', 'docs/PRD.md'] },
  { id: 'tech',  label: 'Technical design',        files: ['docs/TECH_DESIGN.md', 'docs/DECISIONS.md'] },
  { id: 'ai',    label: 'AI agent config',          files: ['CLAUDE.md', 'AGENTS.md'] },
  { id: 'tools', label: 'Tool config + research',  files: ['.cursorrules', 'docs/RESEARCH.md'] },
  { id: 'mem',   label: 'Memory + context + plan', files: ['.claude/MEMORY.md', '.claude/CONTEXT.md', 'docs/plan.md'] },
  { id: 'std',   label: 'Standard repo files',     files: ['CONTRIBUTING.md', 'SECURITY.md', '.env.example'] },
]
