import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const waitlists = pgTable('waitlists', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: integer('created_at').notNull(),
})
