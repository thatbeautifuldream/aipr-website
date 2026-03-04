import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'

export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embeddingModel('text-embedding-3-small'),
    value: text,
  })
  return embedding
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const results = await Promise.all(texts.map((text) => generateEmbedding(text)))
  return results
}
