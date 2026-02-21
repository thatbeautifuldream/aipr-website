# AIPR Website

## Database Setup (Drizzle + Neon)

This project uses Drizzle ORM with Neon PostgreSQL.

### Environment Variables

The `DATABASE_URL` is already configured in `.env`.

### Database Commands

```bash
# Generate migration files
bun run db:generate

# Apply migrations to database
bun run db:migrate

# Push schema changes directly (development only)
bun run db:push

# Open Drizzle Studio (database GUI)
bun run db:studio
```

### Database Schema

Schema is defined in `src/db/schema.ts`. Currently includes a `waitlists` table.

### Usage

```tsx
import { db } from '@/db'
import { waitlists } from '@/db/schema'

const allWaitlists = await db.select().from(waitlists)
```

### API Routes

Database queries can be used in API routes under `src/app/api/`.

## Development

```bash
bun run dev
```

## Build

```bash
bun run build
```
