import { relations } from 'drizzle-orm'
import { boolean, index, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { vector } from 'drizzle-orm/pg-core'

export const reviewStatusEnum = pgEnum('review_status', ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'])

export const waitlists = pgTable('waitlists', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: integer('created_at').notNull(),
})

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
)

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

export const repository = pgTable('repository', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  repoId: integer('repo_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 500 }).notNull(),
  private: boolean('private').default(false).notNull(),
  htmlUrl: text('html_url').notNull(),
  description: text('description'),
  language: varchar('language', { length: 100 }),
  stargazersCount: integer('stargazers_count').default(0).notNull(),
  forksCount: integer('forks_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const review = pgTable(
  'review',
  {
    id: serial('id').primaryKey(),
    repositoryId: integer('repository_id')
      .notNull()
      .references(() => repository.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    prNumber: integer('pr_number').notNull(),
    prTitle: text('pr_title').notNull(),
    prUrl: text('pr_url').notNull(),
    status: reviewStatusEnum('status').default('PENDING').notNull(),
    summary: text('summary'),
    riskScore: integer('risk_score'),
    comments: integer('comments'),
    error: text('error'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('review_repositoryId_idx').on(table.repositoryId),
    index('review_userId_idx').on(table.userId),
    index('review_status_idx').on(table.status),
  ],
)

export const repositoryContent = pgTable(
  'repository_content',
  {
    id: serial('id').primaryKey(),
    repositoryId: integer('repository_id')
      .notNull()
      .references(() => repository.id, { onDelete: 'cascade' }),
    filePath: text('file_path').notNull(),
    fileName: text('file_name').notNull(),
    content: text('content').notNull(),
    language: varchar('language', { length: 50 }),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    lineStart: integer('line_start').default(0).notNull(),
    lineEnd: integer('line_end').default(0).notNull(),
    chunkIndex: integer('chunk_index').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('repository_content_repository_idx').on(table.repositoryId)],
)

export const chatSession = pgTable(
  'chat_session',
  {
    id: serial('id').primaryKey(),
    repositoryId: integer('repository_id')
      .notNull()
      .references(() => repository.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('chat_session_user_repository_idx').on(table.userId, table.repositoryId)],
)

export const chatMessage = pgTable(
  'chat_message',
  {
    id: serial('id').primaryKey(),
    sessionId: integer('session_id')
      .notNull()
      .references(() => chatSession.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 20 }).notNull(),
    content: text('content').notNull(),
    contextChunks: jsonb('context_chunks'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('chat_message_session_idx').on(table.sessionId)],
)

// Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  repositories: many(repository),
  chatSessions: many(chatSession),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const repositoryRelations = relations(repository, ({ one, many }) => ({
  user: one(user, {
    fields: [repository.userId],
    references: [user.id],
  }),
  reviews: many(review),
  chatSessions: many(chatSession),
  content: many(repositoryContent),
}))

export const reviewRelations = relations(review, ({ one }) => ({
  repository: one(repository, {
    fields: [review.repositoryId],
    references: [repository.id],
  }),
}))

export const repositoryContentRelations = relations(repositoryContent, ({ one }) => ({
  repository: one(repository, { fields: [repositoryContent.repositoryId], references: [repository.id] }),
}))

export const chatSessionRelations = relations(chatSession, ({ one, many }) => ({
  repository: one(repository, { fields: [chatSession.repositoryId], references: [repository.id] }),
  user: one(user, { fields: [chatSession.userId], references: [user.id] }),
  messages: many(chatMessage),
}))

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
  session: one(chatSession, { fields: [chatMessage.sessionId], references: [chatSession.id] }),
}))

// Types
export type TContextChunk = {
  id: number
  filePath: string
  fileName: string
  content: string
  lineStart: number
  lineEnd: number
}

export type TChatSession = typeof chatSession.$inferSelect
export type TNewChatSession = typeof chatSession.$inferInsert
export type TChatMessage = typeof chatMessage.$inferSelect
export type TNewChatMessage = typeof chatMessage.$inferInsert
export type TRepositoryContent = typeof repositoryContent.$inferSelect
export type TNewRepositoryContent = typeof repositoryContent.$inferInsert
