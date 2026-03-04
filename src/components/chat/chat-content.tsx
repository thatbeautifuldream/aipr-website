'use client'

import { trpc } from '@/lib/trpc/client'
import type { TExtendedUIMessage } from '@/types/chat'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { useChat } from '@ai-sdk/react'
import { Bot } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ChatInput } from './chat-input'
import { ChatMessage } from './chat-message'

type TChatContentProps = {
  sessionId: number
  repositoryId: number
}

export function ChatContent({ sessionId }: TChatContentProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const utils = trpc.useUtils()

  const { data: history = [] } = trpc.chat.getHistory.useQuery({ sessionId })
  const saveMessages = trpc.chat.saveMessages.useMutation()

  const initialMessages: UIMessage[] = history.map((msg) => ({
    id: String(msg.id),
    role: msg.role as 'user' | 'assistant',
    parts: [{ type: 'text' as const, text: typeof msg.content === 'string' ? msg.content : '' }],
  }))

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat/stream',
      body: { sessionId },
    }),
    messages: initialMessages,
    onFinish: () => utils.chat.getHistory.invalidate({ sessionId }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    saveMessages.mutate({ sessionId, messages: [{ role: 'user', content: text }] })
    setInput('')
    sendMessage({ text })
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const extendedMessages: TExtendedUIMessage[] = messages.map((msg) => ({ ...msg, createdAt: undefined }))

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <Bot className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-foreground">Chat with your repo</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Ask anything about the codebase.</p>
            </div>
          </div>
        )}

        {extendedMessages.map((msg, i) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isStreaming={isLoading && i === extendedMessages.length - 1 && msg.role === 'assistant'}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        input={input}
        isLoading={isLoading}
        hasMessages={messages.length > 0}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
