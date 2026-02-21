import { count } from 'drizzle-orm'
import { db } from './index'
import { waitlists } from './schema'

export async function getWaitlistCount() {
  const result = await db.select({ count: count() }).from(waitlists)
  return result[0].count
}

export async function addToWaitlist(data: { email: string }) {
  const newEntry = await db
    .insert(waitlists)
    .values({ email: data.email, createdAt: Math.floor(Date.now() / 1000) })
    .returning()
  return newEntry[0]
}
