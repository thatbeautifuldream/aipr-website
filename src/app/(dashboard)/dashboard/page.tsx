'use client'

import { Button } from '@/components/elements/button'
import { useSession } from '@/lib/auth-client'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, isPending } = useSession()

  if (!session) {
    return null
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <p className="text-sm text-mauve-950/60 dark:text-white/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <Link href="/dashboard/repositories">
        <Button>Repositories</Button>
      </Link>
      <pre className="mt-4 overflow-auto rounded-lg bg-mauve-950/5 p-4 text-sm text-mauve-950 dark:bg-white/5 dark:text-white">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  )
}
