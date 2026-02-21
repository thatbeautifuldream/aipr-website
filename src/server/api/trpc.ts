import { Session } from '@/lib/auth'
import { db } from '@/server/db'
import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'
import { ZodError } from 'zod'

export const createTrpcContext = (opts: { headers: Headers; session: Session }) => {
  return {
    db,
    opts: opts.headers,
    session: opts.session,
  }
}

const t = initTRPC.context<typeof createTrpcContext>().create({
  transformer: SuperJSON,
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
