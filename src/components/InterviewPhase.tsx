'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Message, ProjectData } from '@/types'
import MessageBubble from './MessageBubble'

interface Props {
  onComplete: (projectData: ProjectData) => void
}

export default function InterviewPhase({ onComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  const sendMessage = useCallback(async (content: string, history: Message[]) => {
    const userMessage: Message = { role: 'user', content }
    const newMessages = [...history, userMessage]
    setMessages(newMessages)
    setIsTyping(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const data = await res.json() as { text: string; isComplete: boolean; projectData?: ProjectData }
      const assistantMessage: Message = { role: 'assistant', content: data.text }
      const updatedMessages = [...newMessages, assistantMessage]
      setMessages(updatedMessages)

      if (data.isComplete && data.projectData) {
        setTimeout(() => onComplete(data.projectData!), 800)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection failed'
      setError(message)
    } finally {
      setIsTyping(false)
    }
  }, [onComplete])

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    sendMessage('start', [])
  }, [sendMessage])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return
    setInput('')
    sendMessage(trimmed, messages)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full px-4">
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#161b22] border border-[#21262d] rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
            {error}
            <button
              onClick={() => sendMessage(messages[messages.length - 1]?.content ?? 'start', messages.slice(0, -1))}
              className="ml-3 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="py-4 border-t border-[#21262d]">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            rows={1}
            className="flex-1 bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-sm text-[#e6edf3] placeholder-[#8b949e] resize-none focus:outline-none focus:border-green-400/50 transition-colors"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={isTyping}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isTyping}
            className="px-4 py-3 bg-green-400/10 border border-green-400/30 text-green-400 rounded-xl text-sm font-medium hover:bg-green-400/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-[#8b949e] mt-2">Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  )
}
