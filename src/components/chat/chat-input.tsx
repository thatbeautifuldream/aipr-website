'use client'

import { Loader2, Send } from 'lucide-react'
import type { FormEvent, KeyboardEvent } from 'react'

const STARTER_PROMPTS = [
  'Explain the overall architecture',
  'What does this repository do?',
  'Show me the main entry point',
  'What are the key dependencies?',
]

type TChatInputProps = {
  input: string
  isLoading: boolean
  hasMessages: boolean
  onInputChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
}

export function ChatInput({ input, isLoading, hasMessages, onInputChange, onSubmit }: TChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as FormEvent)
      }
    }
  }

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      {!hasMessages && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onInputChange(prompt)}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the codebase…"
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
          style={{ minHeight: '40px', maxHeight: '160px' }}
          onInput={(e) => {
            const el = e.currentTarget
            el.style.height = 'auto'
            el.style.height = `${Math.min(el.scrollHeight, 160)}px`
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  )
}
