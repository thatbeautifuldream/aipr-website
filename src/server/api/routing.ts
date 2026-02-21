import { waitlistRouter } from '@/server/routers/waitlist'
import { createCallerFactory, createTRPCRouter, publicProcedure } from './trpc'

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return { status: 'OK', timestamp: Date.now() }
  }),
  waitlist: waitlistRouter,
})

export const AppRouter = typeof appRouter
export const createCaller = createCallerFactory(appRouter)
