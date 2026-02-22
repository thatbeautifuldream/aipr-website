'use client'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { trpc } from '@/lib/trpc/client'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GitFork,
  Lock,
  Search,
} from 'lucide-react'
import { startTransition, useMemo, useState } from 'react'

const PER_PAGE_OPTIONS = [10, 20, 50, 100] as const

function TableRowSkeleton() {
  return (
    <TableRow className="border-mauve-950/8 dark:border-white/8">
      <TableCell className="py-3.5 pl-5">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </TableCell>
      <TableCell className="py-3.5 pr-5 text-right">
        <Skeleton className="inline-block h-[1.15rem] w-8 rounded-full" />
      </TableCell>
    </TableRow>
  )
}

export default function RepositoriesPage() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState<(typeof PER_PAGE_OPTIONS)[number]>(10)
  const [search, setSearch] = useState('')

  const utils = trpc.useUtils()
  const getAllRepos = trpc.repository.listFromGithub.useQuery({ page, perPage })

  const connectRepo = trpc.repository.connect.useMutation({
    onMutate: async (newRepo) => {
      await utils.repository.listFromGithub.cancel({ page, perPage })
      const previousData = utils.repository.listFromGithub.getData({ page, perPage })

      utils.repository.listFromGithub.setData({ page, perPage }, (old) => {
        if (!old) return old
        return {
          ...old,
          repos: old.repos.map((repo) => (repo.id === newRepo.repoId ? { ...repo, isTracked: true } : repo)),
        }
      })

      return { previousData }
    },
    onError: (_err, _newRepo, context) => {
      utils.repository.listFromGithub.setData({ page, perPage }, context?.previousData)
    },
    onSuccess: () => {
      utils.repository.listFromGithub.invalidate({ page, perPage })
    },
  })

  const disconnectRepo = trpc.repository.disconnect.useMutation({
    onMutate: async ({ id: databaseId }) => {
      await utils.repository.listFromGithub.cancel({ page, perPage })
      const previousData = utils.repository.listFromGithub.getData({ page, perPage })

      utils.repository.listFromGithub.setData({ page, perPage }, (old) => {
        if (!old) return old
        return {
          ...old,
          repos: old.repos.map((repo) =>
            repo.databaseId === databaseId ? { ...repo, isTracked: false, databaseId: undefined } : repo,
          ),
        }
      })

      return { previousData }
    },
    onError: (_err, _variables, context) => {
      utils.repository.listFromGithub.setData({ page, perPage }, context?.previousData)
    },
    onSuccess: () => {
      utils.repository.listFromGithub.invalidate({ page, perPage })
    },
  })

  const filteredRepos = useMemo(() => {
    const repos = getAllRepos.data?.repos ?? []
    if (!search.trim()) return repos
    const q = search.toLowerCase()
    return repos.filter((r) => r.name.toLowerCase().includes(q))
  }, [getAllRepos.data?.repos, search])

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage as (typeof PER_PAGE_OPTIONS)[number])
    setPage(1)
  }

  const handleConnect = (repoId: number) => {
    const repo = getAllRepos.data?.repos?.find((r) => r.id === repoId)
    if (!repo) return

    startTransition(() => {
      connectRepo.mutate({
        repoId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        private: repo.private,
        htmlUrl: repo.html_url,
        description: repo.description,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
      })
    })
  }

  const handleDisconnect = (databaseId: number) => {
    startTransition(() => {
      disconnectRepo.mutate({ id: databaseId })
    })
  }

  return (
    <div className="flex flex-col gap-0 px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-mauve-950 dark:text-white">
            Repositories
          </h1>
          <p className="mt-0.5 text-sm text-mauve-950/50 dark:text-white/50">
            Manage which repositories are accessible to AiPR.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 w-72">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-mauve-950/35 dark:text-white/35" />
        <Input
          placeholder="Search repositories"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 rounded-lg border-mauve-950/12 bg-white pl-9 text-sm placeholder:text-mauve-950/35 dark:border-white/12 dark:bg-mauve-950/40 dark:placeholder:text-white/35"
        />
      </div>

      {/* Error */}
      {getAllRepos.isError && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200/60 bg-red-50/80 px-4 py-3 dark:border-red-900/30 dark:bg-red-950/20">
          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
          <p className="text-sm text-red-800 dark:text-red-300">
            {getAllRepos.error.message || 'Failed to fetch repositories'}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-mauve-950/10 bg-white dark:border-white/8 dark:bg-mauve-950/30">
        <Table>
          <TableHeader>
            <TableRow className="border-mauve-950/10 hover:bg-transparent dark:border-white/8">
              <TableHead className="py-3 pl-5 text-xs font-semibold tracking-wide text-mauve-950/60 uppercase dark:text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  Repository
                  <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                </span>
              </TableHead>
              <TableHead className="py-3 pr-5 text-right text-xs font-semibold tracking-wide text-mauve-950/60 uppercase dark:text-white/60">
                Tracking
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getAllRepos.isLoading &&
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={`skeleton-row-${i}`} />)}

            {getAllRepos.isSuccess && filteredRepos.length === 0 && (
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <GitFork className="h-8 w-8 text-mauve-950/20 dark:text-white/20" />
                    <p className="text-sm text-mauve-950/45 dark:text-white/45">
                      {search ? 'No repositories match your search' : 'No repositories found'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {getAllRepos.isSuccess &&
              filteredRepos.map((repo) => (
                <TableRow
                  key={repo.id}
                  className="border-mauve-950/8 transition-colors hover:bg-mauve-950/2 dark:border-white/8 dark:hover:bg-white/3"
                >
                  <TableCell
                    className="py-3.5 pl-5"
                    onClick={() => window.open(repo.html_url, '_blank', 'noopener noreferrer')}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="cursor-pointer font-display text-sm font-semibold text-mauve-950 hover:underline dark:text-white">
                        {repo.name}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                          repo.private
                            ? 'border-mauve-950/20 text-mauve-950/55 dark:border-white/20 dark:text-white/55'
                            : 'border-mauve-950/15 text-mauve-950/45 dark:border-white/15 dark:text-white/45'
                        }`}
                      >
                        {repo.private ? <Lock className="h-2.5 w-2.5" /> : null}
                        {repo.private ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-right">
                    <Switch
                      checked={repo.isTracked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleConnect(repo.id)
                        } else {
                          if (repo.databaseId) {
                            handleDisconnect(repo.databaseId)
                          }
                        }
                      }}
                      size="default"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {getAllRepos.isSuccess && filteredRepos.length > 0 && (
        <div className="mt-3 flex items-center justify-end gap-5 text-sm text-mauve-950/55 dark:text-white/55">
          <label className="flex items-center gap-2">
            <span className="text-xs">Rows per page</span>
            <div className="relative">
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                disabled={getAllRepos.isFetching}
                className="appearance-none rounded-md border border-mauve-950/15 bg-white py-1 pr-6 pl-2.5 text-xs text-mauve-950 focus:ring-2 focus:ring-mauve-950/15 focus:outline-none disabled:opacity-40 dark:border-white/15 dark:bg-mauve-950/40 dark:text-white dark:focus:ring-white/15"
              >
                {PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute top-1/2 right-1.5 h-3 w-3 -translate-y-1/2 rotate-90 opacity-50" />
            </div>
          </label>

          <span className="text-xs">Page {getAllRepos.data.pagination.page}</span>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={!getAllRepos.data.pagination.hasPrevPage || getAllRepos.isFetching}
              className="flex h-8 w-8 items-center justify-center rounded-md text-mauve-950/50 transition-colors hover:bg-mauve-950/6 disabled:pointer-events-none disabled:opacity-30 dark:text-white/50 dark:hover:bg-white/6"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!getAllRepos.data.pagination.hasPrevPage || getAllRepos.isFetching}
              className="flex h-8 w-8 items-center justify-center rounded-md text-mauve-950/50 transition-colors hover:bg-mauve-950/6 disabled:pointer-events-none disabled:opacity-30 dark:text-white/50 dark:hover:bg-white/6"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!getAllRepos.data.pagination.hasNextPage || getAllRepos.isFetching}
              className="flex h-8 w-8 items-center justify-center rounded-md text-mauve-950/50 transition-colors hover:bg-mauve-950/6 disabled:pointer-events-none disabled:opacity-30 dark:text-white/50 dark:hover:bg-white/6"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={!getAllRepos.data.pagination.hasNextPage || getAllRepos.isFetching}
              className="flex h-8 w-8 items-center justify-center rounded-md text-mauve-950/50 transition-colors hover:bg-mauve-950/6 disabled:pointer-events-none disabled:opacity-30 dark:text-white/50 dark:hover:bg-white/6"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
