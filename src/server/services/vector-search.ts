import { sql } from 'drizzle-orm'
import type { TContextChunk } from '../db/schema'
import { repositoryContent } from '../db/schema'
import { db } from '../db'
import { generateEmbedding } from './embeddings'

export async function searchRepository(repositoryId: number, query: string, limit = 5): Promise<TContextChunk[]> {
  const queryEmbedding = await generateEmbedding(query)
  const embeddingStr = `[${queryEmbedding.join(',')}]`

  const results = await db
    .select({
      id: repositoryContent.id,
      filePath: repositoryContent.filePath,
      fileName: repositoryContent.fileName,
      content: repositoryContent.content,
      lineStart: repositoryContent.lineStart,
      lineEnd: repositoryContent.lineEnd,
    })
    .from(repositoryContent)
    .where(sql`${repositoryContent.repositoryId} = ${repositoryId}`)
    .orderBy(sql`${repositoryContent.embedding} <=> ${embeddingStr}::vector`)
    .limit(limit)

  return results
}
