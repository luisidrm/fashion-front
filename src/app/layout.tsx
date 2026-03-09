import { Providers } from '../providers'
import { Playfair_Display, Cormorant_Garamond, DM_Sans } from 'next/font/google'
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable}`}>
      <body className="retro-grain min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}