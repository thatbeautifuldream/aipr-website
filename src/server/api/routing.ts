import { chat } from '@/server/routers/chat'
import { pullRequest } from '@/server/routers/pullRequest'
import { repository } from '@/server/routers/repository'
import { waitlist } from '@/server/routers/waitlist'
import { createCallerFactory, createTRPCRouter, publicProcedure } from './trpc'

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return { status: 'OK', timestamp: Date.now() }
  }),
  waitlist,
  repository,
  pullRequest,
  chat,
})

export const AppRouter = typeof appRouter
export const createCaller = createCallerFactory(appRouter)
