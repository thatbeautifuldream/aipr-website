'use client'

import { UserCircleIcon } from '@/components/icons/user-circle-icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut, useSession } from '@/lib/auth-client'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import * as React from 'react'

export function UserMenu() {
  const { data, isPending } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/'
        },
      },
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center rounded-full transition-colors hover:bg-accent hover:text-accent-foreground"
        >
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
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{data?.user?.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{data?.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isPending}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
