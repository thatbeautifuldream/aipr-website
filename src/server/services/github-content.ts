import { Octokit } from 'octokit'

const INDEXABLE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.rb', '.go', '.rs', '.java', '.kt', '.swift',
  '.c', '.cpp', '.h', '.hpp', '.cs',
  '.md', '.mdx', '.txt', '.rst',
  '.json', '.yaml', '.yml', '.toml', '.env.example',
  '.sh', '.bash', '.zsh',
  '.css', '.scss', '.sass', '.less',
  '.html', '.xml', '.svg',
  '.sql',
  'Dockerfile', 'Makefile', 'Gemfile', 'Rakefile',
])

const MAX_FILE_SIZE_BYTES = 100 * 1024 // 100KB

function isIndexable(path: string): boolean {
  const lower = path.toLowerCase()
  // Skip common binary/generated dirs
  if (
    lower.includes('node_modules/') ||
    lower.includes('.git/') ||
    lower.includes('dist/') ||
    lower.includes('build/') ||
    lower.includes('.next/') ||
    lower.includes('__pycache__/') ||
    lower.includes('.venv/') ||
    lower.includes('vendor/')
  ) {
    return false
  }

  const lastSegment = path.split('/').pop() ?? path
  if (INDEXABLE_EXTENSIONS.has(lastSegment)) return true

  const dotIndex = lastSegment.lastIndexOf('.')
  if (dotIndex === -1) return false
  const ext = lastSegment.slice(dotIndex)
  return INDEXABLE_EXTENSIONS.has(ext)
}

export type TGitHubFile = {
  path: string
  sha: string
}

export async function getRepoFileTree(accessToken: string, owner: string, repo: string): Promise<TGitHubFile[]> {
  const octokit = new Octokit({ auth: accessToken })

  // Get default branch
  const { data: repoData } = await octokit.rest.repos.get({ owner, repo })
  const defaultBranch = repoData.default_branch

  // Get full tree recursively
  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: defaultBranch,
    recursive: '1',
  })

  return (treeData.tree ?? [])
    .filter((item) => item.type === 'blob' && item.path && isIndexable(item.path) && (item.size ?? 0) <= MAX_FILE_SIZE_BYTES)
    .map((item) => ({ path: item.path!, sha: item.sha! }))
}

export async function getFileContent(accessToken: string, owner: string, repo: string, filePath: string): Promise<string | null> {
  const octokit = new Octokit({ auth: accessToken })

  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: filePath })

    if (Array.isArray(data) || data.type !== 'file') return null
    if (!data.content) return null

    const decoded = Buffer.from(data.content, 'base64').toString('utf-8')
    return decoded
  } catch {
    return null
  }
}
