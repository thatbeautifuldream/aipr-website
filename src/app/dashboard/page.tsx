'use client'

import { Button } from '@/components/elements/button'
import { signIn, signOut, useSession } from '@/lib/auth-client'

export default function DashboardPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <p className="text-sm text-brick-950/60 dark:text-white/60">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <h1 className="text-2xl font-bold text-brick-950 dark:text-white">Dashboard</h1>
        <p className="mt-4 text-sm text-brick-950/60 dark:text-white/60">
          You need to sign in to view your session data.
        </p>
        <div className="mt-6">
          <Button onClick={() => signIn.social({ provider: 'github' })}>Sign in with GitHub</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brick-950 dark:text-white">Dashboard</h1>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-brick-950 dark:text-white">Session Data</h2>
        <pre className="mt-4 overflow-auto rounded-lg bg-brick-950/5 p-4 text-sm text-brick-950 dark:bg-white/5 dark:text-white">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  )
}
