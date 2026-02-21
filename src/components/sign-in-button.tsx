'use client'

import { Button } from '@/components/elements/button'
import { GitHubIcon } from '@/components/icons/social/github-icon'
import { signIn, useSession } from '@/lib/auth-client'

export function SignInButton({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const { isPending } = useSession()

  const handleSignIn = () => {
    signIn.social({
      provider: 'github',
      callbackURL: `${window.location.origin}/dashboard`,
    })
  }

  return (
    <Button onClick={handleSignIn} disabled={isPending} size={size}>
      <GitHubIcon className="size-5" />
      Sign in with GitHub
    </Button>
  )
}
