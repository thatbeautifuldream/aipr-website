import Image from 'next/image'

import { ButtonLink, SoftButtonLink } from '@/components/elements/button'
import { Document } from '@/components/elements/document'
import { Screenshot } from '@/components/elements/screenshot'
import { GetEarlyAccessButton } from '@/components/get-early-access-button'
import { CheckmarkIcon } from '@/components/icons/checkmark-icon'
import { DocumentLeftAligned } from '@/components/sections/document-left-aligned'
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
        subheadline={
          <>
            <p>Use Claude Code, Codex CLI, or Gemini CLI as harness without leaving the workflow you already have.</p>
          </>
        }
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
              <div className="overflow-hidden rounded-[2rem] border border-brick-950/10 bg-[#111111] text-stone-100 shadow-[0_28px_120px_-48px_rgba(0,0,0,0.8)] dark:border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-rose-400" />
                    <span className="size-2.5 rounded-full bg-amber-300" />
                    <span className="size-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs tracking-[0.28em] text-stone-400 uppercase">terminal workflow</p>
                </div>
                <div className="space-y-6 bg-linear-to-b from-white/5 to-transparent p-5 sm:p-7">
                  <CommandBlock
                    label="Quick start"
                    command="npx aipr --base-branch main"
                    output={[
                      'Harness: codex',
                      'Base: main',
                      'Head: feat/branch-aware-copy',
                      'Draft PR ready and opened with gh',
                    ]}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <CommandChip
                      command="aipr --base-branch main --dry-run"
                      detail="Preview the generated title and body."
                    />
                    <CommandChip
                      command="aipr --base-branch main --harness codex"
                      detail="Pin the harness for a given run."
                    />
                    <CommandChip command="aipr harness list" detail="See which harnesses are installed locally." />
                    <CommandChip command="aipr doctor" detail="Check git, gh, and harness readiness." />
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <SignalCard
                  title="What it does"
                  text="Reads the commits ahead of your base branch, asks your preferred coding harness for a PR title and description, then opens a draft PR with GitHub CLI."
                />
                <SignalCard
                  title="Supported harnesses"
                  text="Claude Code, Codex CLI, and Gemini CLI all work with the same terminal-first flow."
                />
                <SignalCard
                  title="Why teams use it"
                  text="Skip manual PR writing, keep output consistent across contributors, and stay inside git, your AI tool, and GitHub."
                />
              </div>
            </div>
          </>
        }
        footer={
          <div className="max-w-3xl rounded-[1.75rem] border border-brick-950/10 bg-white/70 p-5 text-sm text-brick-700 shadow-sm shadow-brick-950/5 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-brick-300">
            <p>
              <strong className="text-brick-950 dark:text-white">
                Built for engineers who already live in the terminal.
              </strong>{' '}
              No bouncing between git history, an AI prompt, and the GitHub PR form just to explain the same branch one
              more time.
            </p>
          </div>
        }
      />

      <DocumentLeftAligned
        id="how-it-works"
        headline="How it works"
        subheadline={
          <>
            <p>Every step maps directly to how the CLI behaves in a real repository.</p>
          </>
        }
      >
        <h2>Branch-aware by default</h2>
        <p>
          <code>aipr</code> checks that you are inside a git repository, resolves the current head branch, validates the
          base branch, and confirms there are commits ahead before it generates anything.
        </p>

        <h2>Harness-driven drafting</h2>
        <p>
          It selects an installed harness from Claude Code, Codex CLI, or Gemini CLI, sends the branch context, and asks
          that tool to produce the draft PR title and description.
        </p>

        <h2>GitHub-native finish</h2>
        <p>
          When you are not in <code>--dry-run</code> mode, it creates the draft PR with <code>gh</code>. When you are in
          preview mode, it prints the generated content directly in the terminal.
        </p>
      </DocumentLeftAligned>

      <DocumentLeftAligned
        id="usage"
        headline="Use it your way"
        subheadline={
          <>
            <p>Use the homepage as a fast-start reference whether you prefer one-off runs or a global install.</p>
          </>
        }
        className="pt-6"
      >
        <h2>Run without installing</h2>
        <Document className="space-y-3 rounded-[1.5rem] border border-brick-950/10 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
          <CommandLine>npx aipr --base-branch main</CommandLine>
          <CommandLine>pnpm dlx aipr --base-branch main</CommandLine>
        </Document>

        <h2>Install globally</h2>
        <Document className="space-y-3 rounded-[1.5rem] border border-brick-950/10 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
          <CommandLine>pnpm install -g aipr</CommandLine>
          <CommandLine>aipr --base-branch main</CommandLine>
        </Document>

        <h2>More ways to use it</h2>
        <ul>
          <li>
            <code>aipr create --base-branch main --head-branch feature/multi-harness</code> for explicit source and
            target branches.
          </li>
          <li>
            <code>aipr --base-branch main --harness codex</code> to force a specific harness.
          </li>
          <li>
            <code>aipr --base-branch main --dry-run</code> to preview generated content without opening the PR.
          </li>
          <li>
            <code>aipr harness list</code> and <code>aipr doctor</code> to check local setup.
          </li>
        </ul>

        <h2>Requirements</h2>
        <ul>
          <li>Node.js 18 or newer.</li>
          <li>A git repository with commits ahead of the base branch.</li>
          <li>GitHub CLI installed and authenticated.</li>
          <li>At least one supported harness installed and authenticated.</li>
        </ul>

        <div className="flex flex-wrap gap-3 pt-4">
          <SoftButtonLink href="https://github.com/thatbeautifuldream/aipr" target="_blank" rel="noreferrer" size="lg">
            Read the README
          </SoftButtonLink>
          <GetEarlyAccessButton size="lg" />
        </div>
      </DocumentLeftAligned>
    </>
  )
}

function CommandBlock({ label, command, output }: { label: string; command: string; output: string[] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-[0.24em] text-stone-400 uppercase">{label}</p>
      <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
        <p className="font-mono text-sm text-emerald-300 sm:text-[15px]">
          <span className="mr-2 text-stone-500">$</span>
          {command}
        </p>
        <div className="mt-4 space-y-2 border-t border-white/10 pt-4 font-mono text-xs text-stone-300 sm:text-sm">
          {output.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

function CommandChip({ command, detail }: { command: string; detail: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      <p className="font-mono text-sm text-stone-100">{command}</p>
      <p className="mt-2 text-sm text-stone-400">{detail}</p>
    </div>
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

function CommandLine({ children }: { children: string }) {
  return (
    <p className="rounded-xl bg-brick-950 px-4 py-3 font-mono text-sm text-white dark:bg-brick-200 dark:text-brick-950">
      {children}
    </p>
  )
}
