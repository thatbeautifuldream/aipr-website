'use client'

import type { TExtendedUIMessage } from '@/types/chat'
import { getToolName, isToolUIPart, type UIMessagePart, type UIDataTypes, type UITools } from 'ai'
import { ChevronDown, ChevronRight, FileText, Search } from 'lucide-react'
import { useState } from 'react'
import { Streamdown } from 'streamdown'

type TToolPartProps = {
  toolName: string
  state: string
  input: unknown
  output: unknown
}

function ToolPart({ toolName, state, input, output }: TToolPartProps) {
  const [open, setOpen] = useState(false)
  const label = toolName === 'searchRepository' ? 'Searched codebase' : toolName === 'readFile' ? 'Read file' : toolName
  const Icon = toolName === 'searchRepository' ? Search : FileText
  const isDone = state === 'output-available'

  return (
    <div className="my-1.5 rounded-lg border border-border bg-muted/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-xs font-medium text-foreground">{label}</span>
        {!isDone && <span className="text-xs text-muted-foreground">Running…</span>}
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border px-3 py-2 space-y-2">
          {input != null && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Input</p>
              <pre className="overflow-auto rounded-md bg-background/60 p-2 text-xs text-foreground">
                {typeof input === 'string' ? input : JSON.stringify(input, null, 2)}
              </pre>
            </div>
          )}
          {output != null && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Result</p>
              <pre className="max-h-40 overflow-auto rounded-md bg-background/60 p-2 text-xs text-foreground">
                {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type TChatMessageProps = {
  message: TExtendedUIMessage
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming = false }: TChatMessageProps) {
  const isUser = message.role === 'user'

  const renderPart = (part: UIMessagePart<UIDataTypes, UITools>, i: number) => {
    if (part.type === 'text') {
      if (isUser) {
        return (
          <div key={i} className="rounded-2xl bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
            <p className="whitespace-pre-wrap break-words">{part.text}</p>
          </div>
        )
      }
      return (
        <div key={i} className="rounded-2xl bg-muted px-4 py-2.5 text-foreground">
          <Streamdown className="md-content" isAnimating={isStreaming}>
            {part.text}
          </Streamdown>
        </div>
      )
    }

    if (isToolUIPart(part)) {
      const name = getToolName(part)
      const inp = 'input' in part ? part.input : undefined
      const out = 'output' in part ? part.output : undefined
      return <ToolPart key={i} toolName={name} state={part.state} input={inp} output={out} />
    }

    return null
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex max-w-[85%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {message.parts?.map(renderPart)}
        {message.createdAt && (
          <span className="px-1 text-[10px] text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  )
}
