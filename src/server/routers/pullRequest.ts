import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../api/trpc'
import { db } from '../db'
import { repository } from '../db/schema'
import { getGithubAccessToken, getPullRequest, listPullRequests } from '../services/github'

export const pullRequest = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        repositoryId: z.number(),
        prNumber: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { repositoryId, prNumber } = input

      const repositoryFromDb = await db.select().from(repository).where(eq(repository.id, repositoryId))

      if (!repositoryFromDb.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Repository not found',
        })
      }

      const userId = ctx.session.user.id
      const userAccessToken = await getGithubAccessToken(userId)

      if (!userAccessToken) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User is not authorized to access the resource',
        })
      }

      const [owner, name] = repositoryFromDb[0].fullName.split('/')

      const pullRequest = await getPullRequest(userAccessToken, owner, name, prNumber)

      if (!pullRequest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Pull request not found',
        })
      }

      return pullRequest
    }),

  list: protectedProcedure
    .input(
      z.object({
        repositoryId: z.number(),
        state: z.enum(['open', 'closed', 'all']).optional().default('open'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { repositoryId, state } = input

      const repositoryFromDb = await db.select().from(repository).where(eq(repository.id, repositoryId))

      if (!repositoryFromDb.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Repository not found',
        })
      }

      const userId = ctx.session.user.id
      const userAccessToken = await getGithubAccessToken(userId)

      if (!userAccessToken) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User is not authorized to access the resource',
        })
      }

      const [owner, name] = repositoryFromDb[0].fullName.split('/')

      const pullRequests = await listPullRequests(userAccessToken, owner, name, state)

      return pullRequests
    }),
})
