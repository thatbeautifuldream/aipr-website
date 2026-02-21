import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import clsx from 'clsx/lite'
import type { Metadata } from 'next'
import { TRPCProvider } from '../lib/trpc'
import { fontDisplay, fontSans } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIPR Automated Code Review',
  description: 'Get automated code reviews using AI. Expert feedback on every pull request without vendor lock-in.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={clsx(fontDisplay.variable, fontSans.variable)}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <TRPCProvider>{children}</TRPCProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
