import { and, eq } from 'drizzle-orm'
import { Octokit } from 'octokit'
import { db } from '../db'
import { account } from '../db/schema'

export async function getGithubAccessToken(userId: string) {
  const userAccessToken = await db
    .select({
      accessToken: account.accessToken,
    })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, 'github')))
    .limit(1)

  return userAccessToken[0]?.accessToken
}

export async function getchGithubRepos(accessToken: string, page: number, perPage: number) {
  const octokit = new Octokit({
    auth: accessToken,
  })

  const { data: userRepos, headers } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: 'updated',
    page,
    per_page: perPage,
  })

  return {
    userRepos,
    headers,
  }
}

export async function getPullRequest(accessToken: string, owner: string, repo: string, prNumber: number) {
  const octokit = new Octokit({
    auth: accessToken,
  })

  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  })

  return pullRequest
}

export async function listPullRequests(
  accessToken: string,
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'open',
) {
  const octokit = new Octokit({
    auth: accessToken,
  })

  const { data: pullRequests } = await octokit.rest.pulls.list({
    owner,
    repo,
    state,
  })

  return pullRequests
}
