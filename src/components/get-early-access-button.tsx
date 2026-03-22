'use client'

import { Button } from '@/components/elements/button'

export function GetEarlyAccessButton({ size }: { size?: 'md' | 'lg' }) {
  return (
    <Button size={size} onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
      Get Updates
    </Button>
  )
}
