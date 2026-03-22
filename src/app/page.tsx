import Image from 'next/image'

import { ButtonLink } from '@/components/elements/button'
import { Screenshot } from '@/components/elements/screenshot'
import { GetEarlyAccessButton } from '@/components/get-early-access-button'
import { CheckmarkIcon } from '@/components/icons/checkmark-icon'
import { HeroLeftAlignedWithDemo } from '@/components/sections/hero-left-aligned-with-demo'

export default function Page() {
  return (
    <>
      <HeroLeftAlignedWithDemo
        id="hero"
        headline={
          <>
            Create draft GitHub PRs
            <br />
            with AI from your terminal.
          </>
        }
        subheadline={<p>Use aipr cli with your desired harness, without leaving the workflow you already have.</p>}
        cta={
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink
              href="https://github.com/thatbeautifuldream/aipr"
              target="_blank"
              rel="noreferrer"
              size="lg"
              className="gap-2"
            >
              View on GitHub
            </ButtonLink>
            <GetEarlyAccessButton size="lg" />
          </div>
        }
        demo={
          <>
            <Screenshot className="rounded-md lg:hidden" wallpaper="red" placement="bottom-right">
              <Image
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="AIPR mascot next to the command-driven workflow"
                width={1670}
                height={1408}
                className="rounded-lg rounded-b-none bg-white/75 md:hidden dark:hidden"
              />
              <Image
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="AIPR mascot next to the command-driven workflow"
                width={1670}
                height={1408}
                className="rounded-lg rounded-b-none bg-black/75 not-dark:hidden md:hidden"
              />
              <Image
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="AIPR mascot next to the command-driven workflow"
                width={2000}
                height={1408}
                className="rounded-lg rounded-b-none bg-white/75 max-md:hidden dark:hidden"
              />
              <Image
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="AIPR mascot next to the command-driven workflow"
                width={2000}
                height={1408}
                className="rounded-lg rounded-b-none bg-black/75 not-dark:hidden max-md:hidden"
              />
            </Screenshot>
            <Screenshot className="rounded-lg max-lg:hidden" wallpaper="red" placement="bottom">
              <Image
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="AIPR mascot next to the command-driven workflow"
                className="rounded-lg rounded-b-none bg-white/75 dark:hidden"
                width={3440}
                height={1990}
              />
              <Image
                className="rounded-lg rounded-b-none bg-black/75 not-dark:hidden"
                src="https://cdn.jsdelivr.net/gh/aipr-agent/cdn/aipr-agent-mascot.webp"
                alt="AIPR mascot next to the command-driven workflow"
                width={3440}
                height={1990}
              />
            </Screenshot>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
              <div className="overflow-hidden rounded-xl border border-brick-950/10 bg-[#111111] text-stone-100 shadow-[0_28px_120px_-48px_rgba(0,0,0,0.8)] dark:border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-rose-400" />
                    <span className="size-2.5 rounded-full bg-amber-300" />
                    <span className="size-2.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div className="bg-linear-to-b from-white/5 to-transparent p-5 sm:p-7">
                  <p className="font-mono text-sm whitespace-pre-wrap text-stone-100 sm:text-[15px]">
                    aipr-website on main is 📦 v0.0.1 via 🥟 v1.3.10
                  </p>
                  <p className="mt-4 font-mono text-sm text-emerald-300 sm:text-[15px]">
                    <span className="mr-2 text-stone-500">❯</span>
                    aipr harness list
                  </p>
                  <div className="mt-4 space-y-2 border-t border-white/10 pt-4 font-mono text-xs text-stone-300 sm:text-sm">
                    <p className="whitespace-pre-wrap">claude installed native-json 2.1.81 (Claude Code)</p>
                    <p className="whitespace-pre-wrap">codex installed prompt-json codex-cli 0.116.0</p>
                    <p className="whitespace-pre-wrap">gemini installed native-json 0.18.4</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <SignalCard
                  title="Terminal-native"
                  text="Generate a draft PR from your branch without leaving the command line."
                />
                <SignalCard
                  title="Works with your setup"
                  text="Use Claude Code, Codex CLI, or Gemini CLI in the same simple flow."
                />
              </div>
            </div>
          </>
        }
      />
    </>
  )
}

function SignalCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.75rem] border border-brick-950/10 bg-white/70 p-5 shadow-sm shadow-brick-950/5 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 inline-flex size-8 items-center justify-center rounded-full bg-brick-950 text-white dark:bg-brick-200 dark:text-brick-950">
        <CheckmarkIcon className="size-4" />
      </div>
      <h2 className="text-lg font-medium text-brick-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm/7 text-brick-700 dark:text-brick-300">{text}</p>
    </div>
  )
}
