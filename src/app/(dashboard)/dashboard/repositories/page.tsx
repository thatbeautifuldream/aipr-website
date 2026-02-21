'use client'

import { Button, SoftButton } from '@/components/elements/button'
import { trpc } from '@/lib/trpc/client'
import { ChevronLeft, ChevronRight, GitFork, Globe, Lock, RefreshCw, Star } from 'lucide-react'
import { useState } from 'react'

const PER_PAGE_OPTIONS = [10, 20, 50, 100] as const

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-sky-500',
  Rust: 'bg-orange-500',
  Go: 'bg-cyan-400',
  Ruby: 'bg-red-500',
  Java: 'bg-amber-600',
  'C++': 'bg-pink-500',
  C: 'bg-slate-500',
  Swift: 'bg-orange-400',
  Kotlin: 'bg-violet-500',
  Dart: 'bg-teal-400',
  Shell: 'bg-green-500',
  HTML: 'bg-rose-500',
  CSS: 'bg-indigo-500',
  Vue: 'bg-emerald-500',
}

function RepoCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-mauve-950/8 bg-white p-5 dark:border-white/8 dark:bg-mauve-950/40">
      <div className="absolute inset-y-0 left-0 w-0.5 bg-mauve-200 dark:bg-white/10" />
      <div className="space-y-3">
        <div className="h-5 w-2/3 animate-pulse rounded-md bg-mauve-950/8 dark:bg-white/8" />
        <div className="h-3.5 w-full animate-pulse rounded-md bg-mauve-950/6 dark:bg-white/6" />
        <div className="h-3.5 w-4/5 animate-pulse rounded-md bg-mauve-950/6 dark:bg-white/6" />
        <div className="flex gap-3 pt-1">
          <div className="h-3 w-12 animate-pulse rounded-md bg-mauve-950/6 dark:bg-white/6" />
          <div className="h-3 w-8 animate-pulse rounded-md bg-mauve-950/6 dark:bg-white/6" />
        </div>
      </div>
    </div>
  )
}

function RepoCard({
  repo,
}: {
  repo: {
    id: number
    name: string
    description: string | null
    private: boolean
    language: string | null
    stargazers_count: number
    forks_count: number
    html_url: string
  }
}) {
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? 'bg-mauve-400') : null

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-xl border border-mauve-950/8 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-mauve-950/15 hover:shadow-sm dark:border-white/8 dark:bg-mauve-950/40 dark:hover:border-white/15 dark:hover:bg-mauve-950/60"
    >
      {/* Left accent bar */}
      <div
        className={`absolute inset-y-0 left-0 w-0.5 transition-opacity duration-200 ${langColor ?? 'bg-mauve-400'} opacity-30 group-hover:opacity-70`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-base font-semibold text-mauve-950 dark:text-white">
              {repo.name}
            </h3>
            {repo.private ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-mauve-950/6 px-2 py-0.5 text-xs font-medium text-mauve-950/50 dark:bg-white/6 dark:text-white/50">
                <Lock className="h-2.5 w-2.5" />
                Private
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-mauve-950/6 px-2 py-0.5 text-xs font-medium text-mauve-950/40 dark:bg-white/6 dark:text-white/40">
                <Globe className="h-2.5 w-2.5" />
                Public
              </span>
            )}
          </div>

          {repo.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-mauve-950/55 dark:text-white/55">
              {repo.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-mauve-950/45 dark:text-white/45">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${langColor ?? 'bg-mauve-400'}`} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {repo.stargazers_count.toLocaleString()}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            {repo.forks_count.toLocaleString()}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-mauve-950/35 transition-colors group-hover:text-mauve-950/60 dark:text-white/35 dark:group-hover:text-white/60">
        View on GitHub
        <ChevronRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
      </div>
    </a>
  )
}

export default function DemoPage() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const getAllRepos = trpc.repository.list.useQuery({ page, perPage })

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (getAllRepos.data?.pagination.hasNextPage) setPage(page + 1)
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setPage(1)
  }

  const totalRepos = getAllRepos.data?.repos?.length ?? 0

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-medium tracking-widest text-mauve-500 uppercase dark:text-mauve-400">
              GitHub
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-mauve-950 dark:text-white">
              Repositories
            </h1>
            {getAllRepos.isSuccess && (
              <p className="mt-1.5 text-sm text-mauve-950/50 dark:text-white/50">
                Showing {totalRepos} of {getAllRepos.data?.pagination?.perPage ?? totalRepos} repositories
              </p>
            )}
          </div>

          <Button
            onClick={() => getAllRepos.refetch()}
            disabled={getAllRepos.isFetching}
            size="lg"
            className="self-start"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${getAllRepos.isFetching ? 'animate-spin' : ''}`} />
            {getAllRepos.isFetching ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>

        {/* Divider */}
        <div className="mt-6 h-px bg-mauve-950/8 dark:bg-white/8" />
      </div>

      {/* Error */}
      {getAllRepos.isError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200/60 bg-red-50/80 px-4 py-3.5 dark:border-red-900/30 dark:bg-red-950/20">
          <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
          <p className="text-sm text-red-800 dark:text-red-300">
            {getAllRepos.error.message || 'Failed to fetch repositories'}
          </p>
        </div>
      )}

      {/* Skeleton loading */}
      {getAllRepos.isLoading && (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: perPage > 6 ? 6 : perPage }).map((_, i) => (
            <RepoCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Repo grid */}
      {getAllRepos.isSuccess && getAllRepos.data?.repos && getAllRepos.data.repos.length > 0 && (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {getAllRepos.data.repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex flex-col gap-3 rounded-xl border border-mauve-950/8 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/8 dark:bg-mauve-950/40">
            <div className="flex flex-wrap items-center gap-3 text-sm text-mauve-950/50 dark:text-white/50">
              <span className="font-medium">Page {getAllRepos.data.pagination.page}</span>
              <span className="h-3.5 w-px bg-mauve-950/15 dark:bg-white/15" />
              <label className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={perPage}
                  onChange={(e) => handlePerPageChange(Number(e.target.value))}
                  disabled={getAllRepos.isFetching}
                  className="rounded-lg border border-mauve-950/15 bg-transparent px-2.5 py-1 text-sm text-mauve-950 focus:ring-2 focus:ring-mauve-950/20 focus:outline-none disabled:opacity-40 dark:border-white/15 dark:text-white dark:focus:ring-white/20"
                >
                  {PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span>per page</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <SoftButton
                onClick={handlePreviousPage}
                disabled={!getAllRepos.data.pagination.hasPrevPage || getAllRepos.isFetching}
                size="md"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </SoftButton>
              <SoftButton
                onClick={handleNextPage}
                disabled={!getAllRepos.data.pagination.hasNextPage || getAllRepos.isFetching}
                size="md"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </SoftButton>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {getAllRepos.isSuccess && (!getAllRepos.data?.repos || getAllRepos.data.repos.length === 0) && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-mauve-950/10 bg-white dark:border-white/10 dark:bg-mauve-950/40">
            <GitFork className="h-5 w-5 text-mauve-950/30 dark:text-white/30" />
          </div>
          <p className="font-display text-base font-medium text-mauve-950/50 dark:text-white/50">
            No repositories found
          </p>
          <p className="mt-1 text-sm text-mauve-950/35 dark:text-white/35">
            Connect your GitHub account to see your repos here.
          </p>
        </div>
      )}
    </div>
  )
}
