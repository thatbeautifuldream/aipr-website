import { and, eq } from 'drizzle-orm'
import { Octokit } from 'octokit'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../api/trpc'
import { account } from '../db/schema'

export const listRepositoryRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).optional().default(1),
        perPage: z.number().min(1).max(100).optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const userAccount = await ctx.db
        .select({
          accessToken: account.accessToken,
        })
        .from(account)
        .where(and(eq(account.userId, userId), eq(account.providerId, 'github')))
        .limit(1)

      if (!userAccount[0]?.accessToken) {
        throw new Error('GitHub account not linked or access token not found')
      }

      const octokit = new Octokit({
        auth: userAccount[0].accessToken,
      })

      const { data: userRepos, headers } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        page: input.page,
        per_page: input.perPage,
      })

      const linkHeader = (headers as Record<string, unknown>)['link'] || ''
      const hasNextPage = String(linkHeader).includes('rel="next"')
      const hasPrevPage = String(linkHeader).includes('rel="prev"')

      return {
        repos: userRepos,
        pagination: {
          page: input.page,
          perPage: input.perPage,
          hasNextPage: !!hasNextPage,
          hasPrevPage: !!hasPrevPage,
        },
      }
    }),
})
