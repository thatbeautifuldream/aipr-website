'use client'

import { useSession } from '@/lib/auth-client'

export default function DashboardPage() {
  const { data: session, isPending } = useSession()

  if (!session) {
    return null
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <p className="text-sm text-brick-950/60 dark:text-white/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <pre className="mt-4 overflow-auto rounded-lg bg-brick-950/5 p-4 text-sm text-brick-950 dark:bg-white/5 dark:text-white">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  )
}
