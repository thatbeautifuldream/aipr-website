import { db } from '@/server/db'
import * as schema from '@/server/db/schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { getBaseUrl } from './utils'

export const auth = betterAuth({
  baseURL: getBaseUrl(),

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ['read:user', 'user:email', 'repo'],
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['github'],
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  trustedOrigins: [getBaseUrl()],

  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
