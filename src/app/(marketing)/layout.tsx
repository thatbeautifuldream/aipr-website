import { Main } from '@/components/elements/main'
import { GitHubIcon } from '@/components/icons/social/github-icon'
import { Navbar } from '@/components/navbar'
import {
  FooterWithWaitlistFormCategoriesAndSocialIcons,
  SocialLink,
  WaitlistForm,
} from '@/components/sections/footer-with-waitlist-form-categories-and-social-icons'

const currentYear = new Date().getFullYear()

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
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
          <SocialLink href="https://github.com/aipr-agent" name="GitHub">
            <GitHubIcon />
          </SocialLink>
        }
      />
    </>
  )
}
