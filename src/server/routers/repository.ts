import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
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
        .select({ repoId: repositoryTable.repoId })
        .from(repositoryTable)
        .where(eq(repositoryTable.userId, userId))

      const trackedIds = new Set(trackedRepos.map((r) => r.repoId))

      const reposWithTrackedStatus = userRepos.map((repo) => ({
        ...repo,
        isTracked: trackedIds.has(repo.id),
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

  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const trackedRepos = await db.select().from(repositoryTable).where(eq(repositoryTable.userId, userId))

    return trackedRepos
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
