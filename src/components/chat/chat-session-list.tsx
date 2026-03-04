'use client'

import { trpc } from '@/lib/trpc/client'
import type { TChatSession } from '@/server/db/schema'
import { MessageSquare, Plus, Trash2 } from 'lucide-react'

type TChatSessionListProps = {
  repositoryId: number
  activeSessionId: number | null
  onSelectSession: (sessionId: number) => void
  onNewSession: () => void
}

export function ChatSessionList({
  repositoryId,
  activeSessionId,
  onSelectSession,
  onNewSession,
}: TChatSessionListProps) {
  const utils = trpc.useUtils()
  const { data: sessions = [], isLoading } = trpc.chat.listSessions.useQuery({ repositoryId })

  const deleteSession = trpc.chat.deleteSession.useMutation({
    onSuccess: () => utils.chat.listSessions.invalidate({ repositoryId }),
  })

  const handleDelete = (e: React.MouseEvent, session: TChatSession) => {
    e.stopPropagation()
    deleteSession.mutate({ sessionId: session.id })
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="mb-1 flex items-center justify-between px-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Sessions</span>
        <button
          type="button"
          onClick={onNewSession}
          className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          title="New session"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {isLoading && (
        <div className="space-y-1 px-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      )}

      {!isLoading && sessions.length === 0 && (
        <div className="flex flex-col items-center gap-1.5 py-6 text-center">
          <MessageSquare className="h-5 w-5 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">No sessions yet</p>
          <button
            type="button"
            onClick={onNewSession}
            className="text-xs text-foreground underline-offset-2 hover:underline"
          >
            Start one
          </button>
        </div>
      )}

      {sessions.map((session) => (
        <button
          key={session.id}
          type="button"
          onClick={() => onSelectSession(session.id)}
          className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${
            activeSessionId === session.id
              ? 'bg-accent text-accent-foreground'
              : 'text-foreground hover:bg-accent/60 hover:text-accent-foreground'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-xs">{session.title}</span>
          <span
            onClick={(e) => handleDelete(e, session)}
            className="hidden h-4 w-4 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-destructive group-hover:flex"
            role="button"
            tabIndex={0}
          >
            <Trash2 className="h-3 w-3" />
          </span>
        </button>
      ))}
    </div>
  )
}
