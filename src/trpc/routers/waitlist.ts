import { waitlists } from '@/db/schema'
import { count, eq } from 'drizzle-orm'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../server'

export const waitlistRouter = createTRPCRouter({
  add: publicProcedure.input(z.object({ email: z.string().email() })).mutation(async ({ ctx, input }) => {
    try {
      const [result] = await ctx.db
        .insert(waitlists)
        .values({ email: input.email, createdAt: Math.floor(Date.now() / 1000) })
        .returning()
      return result
    } catch (error) {
      console.error('Failed to add to waitlist:', error)
      throw new Error('Failed to add to waitlist')
    }
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(waitlists).orderBy(waitlists.createdAt)
  }),

  checkEmail: publicProcedure.input(z.object({ email: z.string().email() })).query(async ({ ctx, input }) => {
    const result = await ctx.db.select().from(waitlists).where(eq(waitlists.email, input.email)).limit(1)
    return result.length > 0
  }),

  count: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select({ count: count() }).from(waitlists)
    return result[0].count
  }),
})
