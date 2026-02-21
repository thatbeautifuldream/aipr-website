'use client'

import { Button, SoftButton } from '@/components/elements/button'
import { trpc } from '@/lib/trpc/client'
import { ChevronLeft, ChevronRight, GitFork, Lock, RefreshCw, Star } from 'lucide-react'
import { useState } from 'react'

const PER_PAGE_OPTIONS = [10, 20, 50, 100] as const

export default function DemoPage() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const getAllRepos = trpc.listRepository.getAll.useQuery({
    page,
    perPage,
  })

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (getAllRepos.data?.pagination.hasNextPage) {
      setPage(page + 1)
    }
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setPage(1)
  }

  const handleRefresh = () => {
    getAllRepos.refetch()
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-brick-950 dark:text-white">GitHub Repositories</h1>
        <Button onClick={handleRefresh} disabled={getAllRepos.isFetching} size="lg">
          {getAllRepos.isFetching ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {getAllRepos.isError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/20 dark:bg-red-950/20">
          <p className="text-sm text-red-900 dark:text-red-200">
            Error: {getAllRepos.error.message || 'Failed to fetch repositories'}
          </p>
        </div>
      )}

      {getAllRepos.isSuccess && getAllRepos.data?.repos && getAllRepos.data.repos.length > 0 && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {getAllRepos.data.repos.map((repo: any) => (
              <div
                key={repo.id}
                className="rounded-lg border border-brick-950/10 bg-white p-6 dark:border-white/10 dark:bg-brick-950/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-brick-950 dark:text-white">{repo.name}</h3>
                      {repo.private && <Lock className="h-4 w-4 text-brick-950/50 dark:text-white/50" />}
                    </div>
                    {repo.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-brick-950/70 dark:text-white/70">
                        {repo.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brick-950/60 dark:text-white/60">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      {repo.forks_count}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-brick-950 hover:text-brick-950/70 dark:text-white dark:hover:text-white/70"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-lg border border-brick-950/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-brick-950/50">
            <div className="flex flex-wrap items-center gap-4 text-sm text-brick-950/60 dark:text-white/60">
              <span>Page {getAllRepos.data.pagination.page}</span>
              <span className="flex items-center gap-2">
                <label htmlFor="per-page" className="font-medium">
                  Show:
                </label>
                <select
                  id="per-page"
                  value={perPage}
                  onChange={(e) => handlePerPageChange(Number(e.target.value))}
                  disabled={getAllRepos.isFetching}
                  className="rounded-lg border border-brick-950/20 bg-transparent px-3 py-1.5 text-sm focus:ring-2 focus:ring-brick-950/20 focus:outline-none disabled:opacity-50 dark:border-white/20 dark:focus:ring-white/20"
                >
                  {PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option} per page
                    </option>
                  ))}
                </select>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <SoftButton
                onClick={handlePreviousPage}
                disabled={!getAllRepos.data.pagination.hasPrevPage || getAllRepos.isFetching}
              >
                {getAllRepos.isFetching && page === getAllRepos.data.pagination.page - 1 ? (
                  <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <ChevronLeft className="mr-1 h-4 w-4" />
                )}
                Previous
              </SoftButton>
              <SoftButton
                onClick={handleNextPage}
                disabled={!getAllRepos.data.pagination.hasNextPage || getAllRepos.isFetching}
              >
                Next
                {getAllRepos.isFetching && page === getAllRepos.data.pagination.page + 1 ? (
                  <RefreshCw className="ml-1 h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="ml-1 h-4 w-4" />
                )}
              </SoftButton>
            </div>
          </div>
        </>
      )}

      {getAllRepos.isSuccess && (!getAllRepos.data?.repos || getAllRepos.data.repos.length === 0) && (
        <div className="mt-8 text-center text-sm text-brick-950/60 dark:text-white/60">No repositories found</div>
      )}

      {getAllRepos.isLoading && (
        <div className="mt-8 text-center text-sm text-brick-950/60 dark:text-white/60">Loading repositories...</div>
      )}
    </div>
  )
}
