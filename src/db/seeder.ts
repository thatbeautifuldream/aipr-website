import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { waitlists } from './schema'

const seedData = [
  { email: 'rohitprajapat@outlook.in', createdAt: 1771191452 },
  { email: 'kumarrohit6324@gmail.com', createdAt: 1771212275 },
  { email: 'duanand6@gmail.com', createdAt: 1771221074 },
  { email: 'vishantbatta99@gmail.com', createdAt: 1771248213 },
  { email: 'gordonb95@yahoo.com', createdAt: 1771530228 },
]

async function seed() {
  console.log('Starting database seeding...')

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is missing.')
  }

  const sql = neon(connectionString)
  const db = drizzle({ client: sql })

  try {
    await db.insert(waitlists).values(seedData).onConflictDoNothing()
    console.log('✅ Successfully inserted all waitlist records.')
  } catch (error) {
    console.error('❌ Error seeding the database:', error)
  }
}

seed()
