import Image from 'next/image'

import { ButtonLink } from '@/components/elements/button'
import { Screenshot } from '@/components/elements/screenshot'
import { HeroLeftAlignedWithDemo } from '@/components/sections/hero-left-aligned-with-demo'

export default function Page() {
  return (
    <>
      {/* Hero */}
      <HeroLeftAlignedWithDemo
        id="hero"
        headline="Code reviews that actually understand."
        subheadline={
          <p>
            Agent-agnostic automation that switches between Claude 3.5, GPT-4o, and OpenAI. No provider lock-in, just
            senior-level critiques on every PR.
          </p>
        }
        cta={
          <ButtonLink href="#footer" size="lg">
            Get Early Access
          </ButtonLink>
        }
        demo={
          <>
            <Screenshot className="rounded-md lg:hidden" wallpaper="green" placement="bottom-right">
              <Image
                src="/img/screenshots/1-left-1670-top-1408.webp"
                alt=""
                width={1670}
                height={1408}
                className="bg-white/75 md:hidden dark:hidden"
              />
              <Image
                src="/img/screenshots/1-color-olive-left-1670-top-1408.webp"
                alt=""
                width={1670}
                height={1408}
                className="bg-black/75 not-dark:hidden md:hidden"
              />
              <Image
                src="/img/screenshots/1-left-2000-top-1408.webp"
                alt=""
                width={2000}
                height={1408}
                className="bg-white/75 max-md:hidden dark:hidden"
              />
              <Image
                src="/img/screenshots/1-color-olive-left-2000-top-1408.webp"
                alt=""
                width={2000}
                height={1408}
                className="bg-black/75 not-dark:hidden max-md:hidden"
              />
            </Screenshot>
            <Screenshot className="rounded-lg max-lg:hidden" wallpaper="green" placement="bottom">
              <Image
                src="/img/screenshots/1.webp"
                alt=""
                className="bg-white/75 dark:hidden"
                width={3440}
                height={1990}
              />
              <Image
                className="bg-black/75 not-dark:hidden"
                src="/img/screenshots/1-color-olive.webp"
                alt=""
                width={3440}
                height={1990}
              />
            </Screenshot>
          </>
        }
        footer={
          <div className="max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
            <p className="mb-2">
              <strong className="text-neutral-700 dark:text-neutral-200">Developer Note:</strong> Built for engineers
              who hate noisy AI comments. aipr focuses on architectural decisions, not style nitpicks.
            </p>
          </div>
        }
      />
    </>
  )
}
