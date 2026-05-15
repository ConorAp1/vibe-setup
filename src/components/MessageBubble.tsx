'use client'

import type { Message } from '@/types'

interface Props {
  message: Message
}

function renderContent(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

export default function MessageBubble({ message }: Props) {
  const isAssistant = message.role === 'assistant'

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? 'bg-[#161b22] border border-[#21262d] text-[#e6edf3]'
            : 'bg-blue-600/20 border border-blue-500/30 text-blue-100'
        }`}
      >
        {isAssistant ? renderContent(message.content) : message.content}
      </div>
    </div>
  )
}
