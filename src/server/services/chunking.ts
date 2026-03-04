export type TChunk = {
  content: string
  lineStart: number
  lineEnd: number
  chunkIndex: number
}

export function chunkFile(content: string, _filePath: string, chunkSize = 100, overlap = 10): TChunk[] {
  const lines = content.split('\n')

  if (lines.length === 0) return []

  const chunks: TChunk[] = []
  let chunkIndex = 0
  let start = 0

  while (start < lines.length) {
    const end = Math.min(start + chunkSize, lines.length)
    const chunkLines = lines.slice(start, end)
    const chunkContent = chunkLines.join('\n').trim()

    if (chunkContent.length > 0) {
      chunks.push({
        content: chunkContent,
        lineStart: start,
        lineEnd: end - 1,
        chunkIndex,
      })
      chunkIndex++
    }

    if (end >= lines.length) break
    start = end - overlap
  }

  return chunks
}
