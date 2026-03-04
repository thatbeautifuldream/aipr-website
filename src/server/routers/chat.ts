import { TRPCError } from '@trpc/server'
import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../api/trpc'
import { db } from '../db'
import { chatMessage, chatSession, repositoryContent, repository } from '../db/schema'
import { indexRepository } from '../services/indexing'

export const chat = createTRPCRouter({
  createSession: protectedProcedure
    .input(z.object({ repositoryId: z.number(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const [newSession] = await db
        .insert(chatSession)
        .values({ repositoryId: input.repositoryId, userId, title: input.title })
        .returning()

      return newSession!
    }),

  listSessions: protectedProcedure
    .input(z.object({ repositoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      return db
        .select()
        .from(chatSession)
        .where(and(eq(chatSession.userId, userId), eq(chatSession.repositoryId, input.repositoryId)))
        .orderBy(desc(chatSession.updatedAt))
    }),

  getSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const sessions = await db
        .select()
        .from(chatSession)
        .where(and(eq(chatSession.id, input.sessionId), eq(chatSession.userId, userId)))
        .limit(1)

      if (!sessions[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found' })
      return sessions[0]
    }),

  getHistory: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      // Verify session ownership
      const sessions = await db
        .select()
        .from(chatSession)
        .where(and(eq(chatSession.id, input.sessionId), eq(chatSession.userId, userId)))
        .limit(1)

      if (!sessions[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found' })

      return db
        .select()
        .from(chatMessage)
        .where(eq(chatMessage.sessionId, input.sessionId))
        .orderBy(asc(chatMessage.createdAt))
    }),

  saveMessages: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
            contextChunks: z.any().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      // Verify session ownership
      const sessions = await db
        .select()
        .from(chatSession)
        .where(and(eq(chatSession.id, input.sessionId), eq(chatSession.userId, userId)))
        .limit(1)

      if (!sessions[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found' })

      await db.insert(chatMessage).values(
        input.messages.map((msg) => ({
          sessionId: input.sessionId,
          role: msg.role,
          content: msg.content,
          contextChunks: msg.contextChunks ?? null,
        })),
      )

      return { success: true }
    }),

  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      await db
        .delete(chatSession)
        .where(and(eq(chatSession.id, input.sessionId), eq(chatSession.userId, userId)))

      return { success: true }
    }),

  indexRepository: protectedProcedure
    .input(z.object({ repositoryId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      // Verify repository ownership
      const repos = await db
        .select()
        .from(repository)
        .where(and(eq(repository.id, input.repositoryId), eq(repository.userId, userId)))
        .limit(1)

      if (!repos[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'Repository not found' })

      await indexRepository(input.repositoryId, userId)

      return { success: true }
    }),

  getIndexStatus: protectedProcedure
    .input(z.object({ repositoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      // Verify repository ownership
      const repos = await db
        .select()
        .from(repository)
        .where(and(eq(repository.id, input.repositoryId), eq(repository.userId, userId)))
        .limit(1)

      if (!repos[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'Repository not found' })

      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(repositoryContent)
        .where(eq(repositoryContent.repositoryId, input.repositoryId))

      const chunkCount = Number(result?.count ?? 0)
      return { indexed: chunkCount > 0, chunkCount }
    }),
})
