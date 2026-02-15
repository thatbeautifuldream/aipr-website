import { Main } from '@/components/elements/main'
import { GitHubIcon } from '@/components/icons/social/github-icon'
import { XIcon } from '@/components/icons/social/x-icon'
import { Navbar } from '@/components/navbar'
import {
  FooterWithWaitlistFormCategoriesAndSocialIcons,
  SocialLink,
  WaitlistForm,
} from '@/components/sections/footer-with-waitlist-form-categories-and-social-icons'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'aipr.dev - Agent-Agnostic Code Reviews',
}

const currentYear = new Date().getFullYear()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <>
          <Navbar />

          <Main>{children}</Main>

          <FooterWithWaitlistFormCategoriesAndSocialIcons
            id="footer"
            cta={<WaitlistForm headline="Join the wait list" subheadline={<p>Automate your code reviews.</p>} />}
            links={null}
            fineprint={`© ${currentYear} @aipr`}
            socialLinks={
              <>
                <SocialLink href="https://x.com" name="X">
                  <XIcon />
                </SocialLink>
                <SocialLink href="https://github.com" name="GitHub">
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
