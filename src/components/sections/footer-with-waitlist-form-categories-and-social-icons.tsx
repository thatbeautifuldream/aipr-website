'use client'

import Link from 'next/link'

import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { useState } from 'react'
import { Container } from '../elements/container'
import { ArrowNarrowRightIcon } from '../icons/arrow-narrow-right-icon'

export function FooterCategory({ title, children, ...props }: { title: ReactNode } & ComponentProps<'div'>) {
  return (
    <div {...props}>
      <h3>{title}</h3>
      <ul role="list" className="mt-2 flex flex-col gap-2">
        {children}
      </ul>
    </div>
  )
}

export function FooterLink({ href, className, ...props }: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <li className={clsx('text-olive-700 dark:text-olive-400', className)}>
      <Link href={href} {...props} />
    </li>
  )
}

export function SocialLink({
  href,
  name,
  className,
  ...props
}: {
  href: string
  name: string
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <Link
      href={href}
      target="_blank"
      aria-label={name}
      className={clsx('text-olive-950 *:size-6 dark:text-white', className)}
      {...props}
    />
  )
}

async function addToWaitlist(email: string) {
  const response = await fetch('https://aipr.jabhi465.workers.dev/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  return response
}

export function WaitlistForm({
  headline,
  subheadline,
  className,
  ...props
}: {
  headline: ReactNode
  subheadline: ReactNode
} & ComponentProps<'form'>) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await addToWaitlist(email)

      if (response.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        if (response.status === 409) {
          setErrorMessage('You are already on the waitlist.')
        } else if (response.status === 429) {
          setErrorMessage('Too many requests. Please try again later.')
        } else {
          setErrorMessage('Something went wrong. Please try again.')
        }
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form className={clsx('flex max-w-sm flex-col gap-2', className)} onSubmit={handleSubmit} {...props}>
      <p>{headline}</p>
      <div className="flex flex-col gap-4 text-olive-700 dark:text-olive-400">{subheadline}</div>
      {status === 'success' ? (
        <p className="text-olive-700 dark:text-olive-400">You&apos;re on the list! 🎉</p>
      ) : (
        <>
          <div className="flex items-center border-b border-olive-950/20 py-2 has-[input:focus]:border-olive-950 dark:border-white/20 dark:has-[input:focus]:border-white">
            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="flex-1 text-olive-950 focus:outline-hidden disabled:opacity-50 dark:text-white"
            />
            <button
              type="submit"
              aria-label="Join"
              disabled={status === 'loading' || !email}
              className="relative inline-flex size-7 items-center justify-center rounded-full after:absolute after:-inset-2 hover:bg-olive-950/10 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10 after:pointer-fine:hidden"
            >
              {status === 'loading' ? (
                <div className="size-4 animate-spin rounded-full border-2 border-olive-950 border-t-transparent dark:border-white" />
              ) : (
                <ArrowNarrowRightIcon />
              )}
            </button>
          </div>
          {status === 'error' && <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}
        </>
      )}
    </form>
  )
}

export function FooterWithWaitlistFormCategoriesAndSocialIcons({
  cta,
  links,
  fineprint,
  socialLinks,
  className,
  ...props
}: {
  cta: ReactNode
  links: ReactNode
  fineprint: ReactNode
  socialLinks?: ReactNode
} & ComponentProps<'footer'>) {
  return (
    <footer className={clsx('pt-16', className)} {...props}>
      <div className="bg-olive-950/2.5 py-16 text-olive-950 dark:bg-white/5 dark:text-white">
        <Container className="flex flex-col gap-16">
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 text-sm/7 lg:grid-cols-2">
            {cta}
            <nav className="grid grid-cols-2 gap-6 sm:has-[>:last-child:nth-child(3)]:grid-cols-3 sm:has-[>:nth-child(5)]:grid-cols-3 md:has-[>:last-child:nth-child(4)]:grid-cols-4 lg:max-xl:has-[>:last-child:nth-child(4)]:grid-cols-2">
              {links}
            </nav>
          </div>
          <div className="flex items-center justify-between gap-10 text-sm/7">
            <div className="text-olive-600 dark:text-olive-500">{fineprint}</div>
            {socialLinks && <div className="flex items-center gap-4 sm:gap-10">{socialLinks}</div>}
          </div>
        </Container>
      </div>
    </footer>
  )
}
