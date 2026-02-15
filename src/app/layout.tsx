import { Main } from '@/components/elements/main'
import { GitHubIcon } from '@/components/icons/social/github-icon'
// import { XIcon } from '@/components/icons/social/x-icon'
import { Navbar } from '@/components/navbar'
import {
  FooterWithWaitlistFormCategoriesAndSocialIcons,
  SocialLink,
  WaitlistForm,
} from '@/components/sections/footer-with-waitlist-form-categories-and-social-icons'
import clsx from 'clsx/lite'
import type { Metadata } from 'next'
import { fontDisplay, fontSans } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIPR Automated Code Review',
  description: 'Get automated code reviews using AI. Expert feedback on every pull request without vendor lock-in.',
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
        <>
          <Navbar />

          <Main>{children}</Main>

          <FooterWithWaitlistFormCategoriesAndSocialIcons
            id="footer"
            cta={<WaitlistForm headline="Join the wait list" subheadline={<p>Automate your code reviews.</p>} />}
            links={null}
            fineprint={
              <>
                &copy; {currentYear} <s>Too</s> Two excited engineers
              </>
            }
            socialLinks={
              <>
                {/* <SocialLink href="https://x.com" name="X">
                  <XIcon />
                </SocialLink> */}
                <SocialLink href="https://github.com/aipr-agent" name="GitHub">
                  <GitHubIcon />
                </SocialLink>
              </>
            }
          />
        </>
      </body>
    </html>
  )
}
