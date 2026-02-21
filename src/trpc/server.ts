import { db } from '@/db'
import { initTRPC } from '@trpc/server'
import { headers } from 'next/headers'
import superjson from 'superjson'
import { ZodError } from 'zod'

export interface TRPCContext {
  db: typeof db
  headers: Headers
}

export const createTRPCContext = async (): Promise<TRPCContext> => {
  const headersList = await headers()
  return { db, headers: headersList }
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
