'use client'

import { ChatContent } from '@/components/chat/chat-content'
import { ChatSidebar } from '@/components/chat/chat-sidebar'
import { trpc } from '@/lib/trpc/client'
import { MessageSquare, PanelLeft, X } from 'lucide-react'
import { useState } from 'react'

type TTrackedRepo = {
  id: number
  name: string
  fullName: string
}

export default function ChatPage() {
  const [selectedRepo, setSelectedRepo] = useState<TTrackedRepo | null>(null)
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const utils = trpc.useUtils()
  const createSession = trpc.chat.createSession.useMutation({
    onSuccess: (session) => {
      setActiveSessionId(session.id)
      setMobileSidebarOpen(false)
      if (selectedRepo) utils.chat.listSessions.invalidate({ repositoryId: selectedRepo.id })
    },
  })

  const handleSelectRepo = (repo: TTrackedRepo) => {
    setSelectedRepo(repo)
    setActiveSessionId(null)
  }

  const handleSelectSession = (sessionId: number) => {
    setActiveSessionId(sessionId)
    setMobileSidebarOpen(false)
  }

  const handleNewSession = () => {
    if (!selectedRepo) return
    createSession.mutate({
      repositoryId: selectedRepo.id,
      title: `Chat ${new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
    })
  }

  const sidebar = (
    <ChatSidebar
      selectedRepo={selectedRepo}
      activeSessionId={activeSessionId}
      onSelectRepo={handleSelectRepo}
      onSelectSession={handleSelectSession}
      onNewSession={handleNewSession}
    />
  )

  return (
    // Escape the layout's p-4 and fill remaining viewport below the header (h-14 = 3.5rem)
    <div className="-m-4 flex h-[calc(100dvh-3.5rem)] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card md:flex">{sidebar}</aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card md:hidden">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-sm font-medium text-foreground">Chat</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebar}</div>
          </aside>
        </>
      )}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-foreground">{selectedRepo ? selectedRepo.name : 'Chat'}</span>
        </div>

        {activeSessionId && selectedRepo ? (
          <div className="flex-1 overflow-hidden">
            <ChatContent key={activeSessionId} sessionId={activeSessionId} repositoryId={selectedRepo.id} />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="max-w-xs">
              <p className="font-display text-sm font-semibold text-foreground">
                {selectedRepo ? 'No session selected' : 'Select a repository'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedRepo
                  ? 'Choose a session from the sidebar or start a new one.'
                  : 'Pick a tracked repository from the sidebar to start chatting.'}
              </p>
              {selectedRepo && (
                <button
                  type="button"
                  onClick={handleNewSession}
                  disabled={createSession.isPending}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {createSession.isPending ? 'Creating…' : 'New Session'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
