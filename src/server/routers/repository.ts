import { TRPCError } from '@trpc/server'
import { and, desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../api/trpc'
import { db } from '../db'
import { repository as repositoryTable } from '../db/schema'
import { getchGithubRepos, getGithubAccessToken } from '../services/github'

export const repository = createTRPCRouter({
  listFromGithub: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).optional().default(1),
        perPage: z.number().min(1).max(100).optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const userAccessToken = await getGithubAccessToken(userId)

      if (!userAccessToken) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'GitHub account not linked or access token not found',
        })
      }

      const { userRepos, headers } = await getchGithubRepos(userAccessToken, input.page, input.perPage)

      const hasNextPage = headers['link']?.includes('rel="next"')
      const hasPrevPage = headers['link']?.includes('rel="prev"')

      const trackedRepos = await db
        .select({ id: repositoryTable.id, repoId: repositoryTable.repoId })
        .from(repositoryTable)
        .where(eq(repositoryTable.userId, userId))

      const trackedMap = new Map(trackedRepos.map((r) => [r.repoId, r.id]))

      const reposWithTrackedStatus = userRepos.map((repo) => ({
        ...repo,
        isTracked: trackedMap.has(repo.id),
        databaseId: trackedMap.get(repo.id),
      }))

      return {
        repos: reposWithTrackedStatus,
        pagination: {
          page: input.page,
          perPage: input.perPage,
          hasNextPage: !!hasNextPage,
          hasPrevPage: !!hasPrevPage,
        },
      }
    }),

  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).optional().default(1),
        perPage: z.number().min(1).max(100).optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { page, perPage } = input
      const offset = (page - 1) * perPage

      const [repos, totalCount] = await Promise.all([
        db
          .select()
          .from(repositoryTable)
          .where(eq(repositoryTable.userId, userId))
          .orderBy(desc(repositoryTable.createdAt))
          .limit(perPage)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(repositoryTable)
          .where(eq(repositoryTable.userId, userId))
          .then((result) => result[0]?.count ?? 0),
      ])

      const totalPages = Math.ceil(totalCount / perPage)

      const reposWithTrackingStatus = repos.map((repo) => ({
        ...repo,
        html_url: repo.htmlUrl,
        full_name: repo.fullName,
        stargazers_count: repo.stargazersCount,
        forks_count: repo.forksCount,
        isTracked: true,
      }))

      return {
        repos: reposWithTrackingStatus,
        pagination: {
          page,
          perPage,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }
    }),

  connect: protectedProcedure
    .input(
      z.object({
        repoId: z.number(),
        name: z.string(),
        fullName: z.string(),
        private: z.boolean(),
        htmlUrl: z.string(),
        description: z.string().nullable(),
        language: z.string().nullable(),
        stargazersCount: z.number(),
        forksCount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const existing = await db.select().from(repositoryTable).where(eq(repositoryTable.repoId, input.repoId))

      if (existing.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Repository already tracked',
        })
      }

      await db.insert(repositoryTable).values({
        userId,
        repoId: input.repoId,
        name: input.name,
        fullName: input.fullName,
        private: input.private,
        htmlUrl: input.htmlUrl,
        description: input.description,
        language: input.language,
        stargazersCount: input.stargazersCount,
        forksCount: input.forksCount,
      })

      return { success: true }
    }),

  disconnect: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    await db.delete(repositoryTable).where(and(eq(repositoryTable.id, input.id), eq(repositoryTable.userId, userId)))

    return { success: true }
  }),
})
