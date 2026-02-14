'use client'

import { ButtonLink } from '@/components/elements/button'
import { NavbarLogo } from '@/components/sections/navbar-with-logo-actions-and-left-aligned-links'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()
  const showCta = pathname === '/'

  return (
    <header className="sticky top-0 z-10 bg-olive-100 dark:bg-olive-950">
      <style>{`:root { --scroll-padding-top: 5.25rem }`}</style>
      <nav>
        <div className="mx-auto flex h-(--scroll-padding-top) max-w-7xl items-center gap-4 px-6 lg:px-10">
          <div className="flex flex-1 items-center gap-12">
            <div className="flex items-center">
              <NavbarLogo href="/">
                <span className="text-lg font-bold text-neutral-900 dark:text-white">@aipr</span>
              </NavbarLogo>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            {showCta && (
              <div className="flex shrink-0 items-center gap-5">
                <ButtonLink href="#footer" size="md">
                  Get Early Access
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
