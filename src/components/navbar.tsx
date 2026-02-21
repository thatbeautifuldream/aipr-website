'use client'

import { NavbarLogo } from '@/components/sections/navbar-with-logo-actions-and-left-aligned-links'
import { SignInButton } from '@/components/sign-in-button'
import { UserMenu } from '@/components/user-menu'
import { useSession } from '@/lib/auth-client'

export function Navbar() {
  const { data, isPending } = useSession()

  return (
    <header className="sticky top-0 z-10 bg-mauve-100 dark:bg-mauve-950">
      <style>{`:root { --scroll-padding-top: 5.25rem }`}</style>
      <nav>
        <div className="mx-auto flex h-(--scroll-padding-top) max-w-7xl items-center gap-4 px-6 lg:px-10">
          <div className="flex flex-1 items-center gap-12">
            <div className="flex items-center">
              <NavbarLogo href="/">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">AIPR</span>
                </div>
              </NavbarLogo>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex shrink-0 items-center gap-5">
              {!isPending && (data ? <UserMenu /> : <SignInButton />)}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
