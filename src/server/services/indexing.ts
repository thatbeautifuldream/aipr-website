import { eq } from 'drizzle-orm'
import { db } from '../db'
import { repository, repositoryContent } from '../db/schema'
import { getGithubAccessToken } from './github'
import { getRepoFileTree, getFileContent } from './github-content'
import { chunkFile } from './chunking'
import { generateEmbedding } from './embeddings'

export async function indexRepository(repositoryId: number, userId: string): Promise<void> {
  // Get repository record
  const repos = await db.select().from(repository).where(eq(repository.id, repositoryId)).limit(1)
  const repo = repos[0]
  if (!repo) throw new Error('Repository not found')

  const [owner, repoName] = repo.fullName.split('/')
  if (!owner || !repoName) throw new Error('Invalid repository fullName')

  // Get GitHub access token
  const accessToken = await getGithubAccessToken(userId)
  if (!accessToken) throw new Error('GitHub access token not found')

  // Delete existing content for this repository
  await db.delete(repositoryContent).where(eq(repositoryContent.repositoryId, repositoryId))

  // Get file tree
  const files = await getRepoFileTree(accessToken, owner, repoName)

  // Process files in batches to avoid rate limits
  const BATCH_SIZE = 5
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE)

    await Promise.all(
      batch.map(async (file) => {
        const content = await getFileContent(accessToken, owner, repoName, file.path)
        if (!content) return

        const fileName = file.path.split('/').pop() ?? file.path
        const chunks = chunkFile(content, file.path)

        for (const chunk of chunks) {
          const embedding = await generateEmbedding(chunk.content)

          await db.insert(repositoryContent).values({
            repositoryId,
            filePath: file.path,
            fileName,
            content: chunk.content,
            embedding,
            lineStart: chunk.lineStart,
            lineEnd: chunk.lineEnd,
            chunkIndex: chunk.chunkIndex,
          })
        }
      }),
    )
  }
}
