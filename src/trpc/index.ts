import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { waitlistRouter } from './routers/waitlist'
import { createTRPCRouter } from './server'

export const appRouter = createTRPCRouter({
  waitlist: waitlistRouter,
})

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
