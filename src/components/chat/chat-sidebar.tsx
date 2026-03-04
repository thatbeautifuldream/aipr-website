'use client'

import { trpc } from '@/lib/trpc/client'
import { ChevronDown, Database, GitFork, Loader2, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ChatSessionList } from './chat-session-list'

type TTrackedRepo = {
  id: number
  name: string
  fullName: string
}

type TChatSidebarProps = {
  selectedRepo: TTrackedRepo | null
  activeSessionId: number | null
  onSelectRepo: (repo: TTrackedRepo) => void
  onSelectSession: (sessionId: number) => void
  onNewSession: () => void
}

export function ChatSidebar({
  selectedRepo,
  activeSessionId,
  onSelectRepo,
  onSelectSession,
  onNewSession,
}: TChatSidebarProps) {
  const [repoDropdownOpen, setRepoDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: reposData } = trpc.repository.list.useQuery({ page: 1, perPage: 100 })
  const repos: TTrackedRepo[] = (reposData?.repos ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    fullName: r.fullName,
  }))

  const indexStatus = trpc.chat.getIndexStatus.useQuery(
    { repositoryId: selectedRepo?.id ?? 0 },
    { enabled: !!selectedRepo },
  )

  const indexRepo = trpc.chat.indexRepository.useMutation({
    onSuccess: () => indexStatus.refetch(),
  })

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRepoDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelectRepo = (repo: TTrackedRepo) => {
    onSelectRepo(repo)
    setRepoDropdownOpen(false)
  }

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      {/* Repository label */}
      <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Repository</p>

      {/* Repo selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setRepoDropdownOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
        >
          <GitFork className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-foreground">{selectedRepo?.name ?? 'Select repository'}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>

        {repoDropdownOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-md">
            {repos.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">No tracked repos</p>
            )}
            {repos.map((repo) => (
              <button
                key={repo.id}
                type="button"
                onClick={() => handleSelectRepo(repo)}
                className="flex w-full items-center px-3 py-1.5 text-left text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="truncate">{repo.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Index status */}
      {selectedRepo && (
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {indexStatus.isLoading
                  ? 'Checking…'
                  : indexStatus.data?.indexed
                    ? `${indexStatus.data.chunkCount} chunks indexed`
                    : 'Not indexed'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => indexRepo.mutate({ repositoryId: selectedRepo.id })}
              disabled={indexRepo.isPending}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background py-1 text-xs text-foreground transition-colors hover:bg-accent disabled:opacity-50"
              title={indexStatus.data?.indexed ? 'Re-index' : 'Index repository'}
            >
              {indexRepo.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              <span>{indexRepo.isPending ? 'Indexing…' : indexStatus.data?.indexed ? 'Re-index' : 'Index'}</span>
            </button>
          </div>
          {indexRepo.isError && (
            <p className="mt-1 text-xs text-destructive">{indexRepo.error.message}</p>
          )}
        </div>
      )}

      {/* Session list */}
      {selectedRepo ? (
        <div className="flex-1 overflow-y-auto">
          <ChatSessionList
            repositoryId={selectedRepo.id}
            activeSessionId={activeSessionId}
            onSelectSession={onSelectSession}
            onNewSession={onNewSession}
          />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center text-xs text-muted-foreground">Select a repository to begin</p>
        </div>
      )}
    </div>
  )
}
