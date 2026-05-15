import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { ChatRequest, ChatResponse, ProjectData } from '@/types'
import { INTERVIEW_SYSTEM } from '@/lib/prompts'

const client = new Anthropic()

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | { error: string }>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = body as Partial<ChatRequest>
  if (!Array.isArray(parsed.messages) || parsed.messages.length === 0) {
    return NextResponse.json({ error: 'messages must be a non-empty array' }, { status: 400 })
  }

  const messages = parsed.messages

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 700,
      system: INTERVIEW_SYSTEM,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })

    const block = response.content[0]
    if (block.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type from Claude' }, { status: 500 })
    }

    const text = block.text
    const completionIndex = text.indexOf('SETUP_COMPLETE:')

    if (completionIndex === -1) {
      return NextResponse.json({ text, isComplete: false })
    }

    const jsonStr = text.slice(completionIndex + 'SETUP_COMPLETE:'.length).trim()
    const displayText = text.slice(0, completionIndex).trim()

    let projectData: ProjectData
    try {
      projectData = JSON.parse(jsonStr) as ProjectData
    } catch {
      return NextResponse.json({ error: 'Failed to parse project data from Claude response' }, { status: 500 })
    }

    return NextResponse.json({ text: displayText, isComplete: true, projectData })
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('authentication_error')) {
      return NextResponse.json({ error: 'Invalid API key. Add your ANTHROPIC_API_KEY to .env.local and restart the server.' }, { status: 500 })
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Anthropic API error: ${message}` }, { status: 500 })
  }
}
