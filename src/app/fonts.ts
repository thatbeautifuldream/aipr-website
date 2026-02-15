import { Familjen_Grotesk, Inter } from 'next/font/google'

export const fontDisplay = Familjen_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})
