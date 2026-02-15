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
        headline="Code reviews without the noise."
        subheadline={
          <p>
            Automates code reviews using top-tier AI models. No vendor lock-in, just expert-level feedback on every pull
            request.
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
                src="/img/logos/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - the AIPR mascot carefully examining the codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
                width={1670}
                height={1408}
                className="rounded-lg bg-white/75 md:hidden dark:hidden"
              />
              <Image
                src="/img/logos/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - the AIPR mascot carefully examining the codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
                width={1670}
                height={1408}
                className="rounded-lg bg-black/75 not-dark:hidden md:hidden"
              />
              <Image
                src="/img/logos/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - the AIPR mascot carefully examining the codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
                width={2000}
                height={1408}
                className="rounded-lg bg-white/75 max-md:hidden dark:hidden"
              />
              <Image
                src="/img/logos/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - the AIPR mascot carefully examining the codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
                width={2000}
                height={1408}
                className="rounded-lg bg-black/75 not-dark:hidden max-md:hidden"
              />
            </Screenshot>
            <Screenshot className="rounded-lg max-lg:hidden" wallpaper="green" placement="bottom">
              <Image
                src="/img/logos/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - the AIPR mascot carefully examining the codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
                className="rounded-lg bg-white/75 dark:hidden"
                width={3440}
                height={1990}
              />
              <Image
                className="rounded-lg bg-black/75 not-dark:hidden"
                src="/img/logos/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - the AIPR mascot carefully examining the codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
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
              who hate noisy comments and demand control over their reviews.
            </p>
          </div>
        }
      />
    </>
  )
}
