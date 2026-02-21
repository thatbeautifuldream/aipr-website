import { db } from './index'
import { waitlists } from './schema'

export async function getWaitlists() {
  const allWaitlists = await db.select().from(waitlists)
  return allWaitlists
}

export async function addToWaitlist(data: { email: string }) {
  const newEntry = await db
    .insert(waitlists)
    .values({ email: data.email, createdAt: Math.floor(Date.now() / 1000) })
    .returning()
  return newEntry[0]
}
