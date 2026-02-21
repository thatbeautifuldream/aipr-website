import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../api/trpc'
import { getchGithubRepos, getGithubAccessToken } from '../services/github'

export const repository = createTRPCRouter({
  list: protectedProcedure
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
