import Image from 'next/image'

import { Screenshot } from '@/components/elements/screenshot'
import { GetEarlyAccessButton } from '@/components/get-early-access-button'
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
        cta={<GetEarlyAccessButton size="lg" />}
        demo={
          <>
            <Screenshot className="rounded-md lg:hidden" wallpaper="purple" placement="bottom-right">
              <Image
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - AIPR mascot carefully examining codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
                width={1670}
                height={1408}
                className="rounded-lg rounded-b-none bg-white/75 md:hidden dark:hidden"
              />
              <Image
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - AIPR mascot carefully examining codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
                width={1670}
                height={1408}
                className="rounded-lg rounded-b-none bg-black/75 not-dark:hidden md:hidden"
              />
              <Image
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - AIPR mascot carefully examining codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
                width={2000}
                height={1408}
                className="rounded-lg rounded-b-none bg-white/75 max-md:hidden dark:hidden"
              />
              <Image
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - AIPR mascot carefully examining codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
                width={2000}
                height={1408}
                className="rounded-lg rounded-b-none bg-black/75 not-dark:hidden max-md:hidden"
              />
            </Screenshot>
            <Screenshot className="rounded-lg max-lg:hidden" wallpaper="purple" placement="bottom">
              <Image
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - AIPR mascot carefully examining codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
                className="rounded-lg rounded-b-none bg-white/75 dark:hidden"
                width={3440}
                height={1990}
              />
              <Image
                className="rounded-lg rounded-b-none bg-black/75 not-dark:hidden"
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="Viewing, analyzing, commenting - AIPR mascot carefully examining codebase, performing detailed analysis on potential issues, and providing thoughtful review comments with expert insights"
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
