import { db } from '@/db'
import { auth } from '@/lib/auth'
import { initTRPC, TRPCError } from '@trpc/server'
import { headers } from 'next/headers'
import superjson from 'superjson'
import { ZodError } from 'zod'

export interface TRPCContext {
  db: typeof db
  headers: Headers
  session: typeof auth.$Infer.Session | null
}

export const createTRPCContext = async (): Promise<TRPCContext> => {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })
  return { db, headers: headersList, session }
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  }
  return next({
    ctx: {
      session: { ...ctx.session },
    },
  })
})
