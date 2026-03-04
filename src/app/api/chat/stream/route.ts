import { auth } from '@/lib/auth'
import { db } from '@/server/db'
import { chatMessage, chatSession, repository } from '@/server/db/schema'
import { getFileContent } from '@/server/services/github-content'
import { getGithubAccessToken } from '@/server/services/github'
import { searchRepository } from '@/server/services/vector-search'
import { openai } from '@ai-sdk/openai'
import { and, eq } from 'drizzle-orm'
import { convertToModelMessages, stepCountIs, streamText, tool } from 'ai'
import { z } from 'zod'
import { headers } from 'next/headers'

export const maxDuration = 30

export async function POST(req: Request) {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { sessionId, messages } = await req.json()

  if (!sessionId || !messages) {
    return new Response('Missing sessionId or messages', { status: 400 })
  }

  // Verify session belongs to user
  const chatSessions = await db
    .select()
    .from(chatSession)
    .where(and(eq(chatSession.id, sessionId), eq(chatSession.userId, session.user.id)))
    .limit(1)

  const currentSession = chatSessions[0]
  if (!currentSession) {
    return new Response('Session not found', { status: 404 })
  }

  // Get repository info for file reading
  const repos = await db.select().from(repository).where(eq(repository.id, currentSession.repositoryId)).limit(1)
  const repo = repos[0]

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are an expert software engineer helping users understand a GitHub repository.
You have access to tools to search the repository's codebase and read specific files.
When answering questions, always search the codebase first to find relevant code.
Cite specific files and line numbers when referencing code.
Be concise and technical in your responses.`,
    messages: modelMessages,
    tools: {
      searchRepository: tool({
        description: 'Search the repository codebase for relevant code using semantic search',
        inputSchema: z.object({
          query: z.string().describe('The search query to find relevant code'),
        }),
        execute: async (input) => {
          const chunks = await searchRepository(currentSession.repositoryId, input.query, 5)
          return chunks.map((chunk) => ({
            file: chunk.filePath,
            lines: `${chunk.lineStart}-${chunk.lineEnd}`,
            content: chunk.content,
          }))
        },
      }),
      readFile: tool({
        description: 'Read the full content of a specific file from the repository',
        inputSchema: z.object({
          filePath: z.string().describe('The path to the file in the repository'),
        }),
        execute: async (input) => {
          if (!repo) return { error: 'Repository not found' }

          const accessToken = await getGithubAccessToken(session.user.id)
          if (!accessToken) return { error: 'GitHub access token not found' }

          const [owner, repoName] = repo.fullName.split('/')
          if (!owner || !repoName) return { error: 'Invalid repository' }

          const content = await getFileContent(accessToken, owner, repoName, input.filePath)
          return content ? { filePath: input.filePath, content } : { error: `File not found: ${input.filePath}` }
        },
      }),
    },
    stopWhen: stepCountIs(5),
    onFinish: async ({ text }) => {
      if (text) {
        await db.insert(chatMessage).values({
          sessionId,
          role: 'assistant',
          content: text,
        })
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
