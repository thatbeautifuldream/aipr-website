'use client'

import { SoftButton } from '@/components/elements/button'
import { UserCircleIcon } from '@/components/icons/user-circle-icon'
import { signOut, useSession } from '@/lib/auth-client'
import Image from 'next/image'

export function UserMenu() {
  const { data, isPending } = useSession()

  const handleSignOut = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/'
        },
      },
    })
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        {data?.user?.image ? (
          <Image
            src={data.user.image}
            alt={data.user.name || 'User'}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <UserCircleIcon className="h-8 w-8 text-neutral-500" />
        )}
        <span className="text-neutral-700 dark:text-neutral-200">{data?.user?.name || 'User'}</span>
      </div>
      <SoftButton onClick={handleSignOut} disabled={isPending}>
        Sign Out
      </SoftButton>
    </div>
  )
}
