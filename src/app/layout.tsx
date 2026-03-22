import { Main } from '@/components/elements/main'
import { GitHubIcon } from '@/components/icons/social/github-icon'
// import { XIcon } from '@/components/icons/social/x-icon'
import { Navbar } from '@/components/navbar'
import {
  FooterWithWaitlistFormCategoriesAndSocialIcons,
  SocialLink,
  WaitlistForm,
} from '@/components/sections/footer-with-waitlist-form-categories-and-social-icons'
import { TRPCReactProvider } from '@/trpc/client'
import clsx from 'clsx/lite'
import type { Metadata } from 'next'
import { fontDisplay, fontSans } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIPR | Create Draft PRs With AI',
  description:
    'Create AI-generated draft GitHub pull requests from your terminal with Claude Code, Codex CLI, or Gemini CLI.',
}

const currentYear = new Date().getFullYear()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={clsx(fontDisplay.variable, fontSans.variable)}>
      <body>
        <TRPCReactProvider>
          <Navbar />

          <Main>{children}</Main>

          <FooterWithWaitlistFormCategoriesAndSocialIcons
            id="footer"
            cta={
              <WaitlistForm
                headline="Join the wait list"
                subheadline={<p>Get product updates, launch notes, and early access to what ships next.</p>}
              />
            }
            links={null}
            fineprint={
              <>
                &copy; {currentYear} aipr by{' '}
                <a
                  href="https://milindmishra.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-brick-950 underline underline-offset-4 dark:text-white"
                >
                  Milind Mishra
                </a>
                . Draft PRs, less ceremony.
              </>
            }
            socialLinks={
              <>
                {/* <SocialLink href="https://x.com" name="X">
                  <XIcon />
                </SocialLink> */}
                <SocialLink href="https://github.com/thatbeautifuldream/aipr" name="GitHub">
                  <GitHubIcon />
                </SocialLink>
              </>
            }
          />
        </TRPCReactProvider>
      </body>
    </html>
  )
}
