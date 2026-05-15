import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { GenerateRequest, GenerateResponse } from '@/types'
import { FILE_GROUPS } from '@/lib/fileGroups'
import { buildGenerationPrompt } from '@/lib/prompts'
import { parseFiles } from '@/lib/parseFiles'

const client = new Anthropic()

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse | { error: string }>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = body as Partial<GenerateRequest>

  if (!parsed.groupId || typeof parsed.groupId !== 'string') {
    return NextResponse.json({ error: 'groupId is required' }, { status: 400 })
  }

  const pd = parsed.projectData
  if (
    !pd ||
    typeof pd.name !== 'string' ||
    typeof pd.description !== 'string' ||
    typeof pd.problem !== 'string' ||
    typeof pd.users !== 'string' ||
    !Array.isArray(pd.features) ||
    typeof pd.stack !== 'string' ||
    typeof pd.constraints !== 'string'
  ) {
    return NextResponse.json({ error: 'projectData is missing required fields' }, { status: 400 })
  }

  const group = FILE_GROUPS.find(g => g.id === parsed.groupId)
  if (!group) {
    return NextResponse.json({ error: `Unknown groupId: ${parsed.groupId}` }, { status: 400 })
  }

  const prompt = buildGenerationPrompt(pd, group.files)

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const block = response.content[0]
    if (block.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type from Claude' }, { status: 500 })
    }

    const files = parseFiles(block.text)

    return NextResponse.json({ files, groupId: parsed.groupId })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Anthropic API error: ${message}` }, { status: 500 })
  }
}
