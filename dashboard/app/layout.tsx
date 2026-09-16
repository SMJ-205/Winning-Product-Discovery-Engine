import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Biz-In-Sight | Winning Product Discovery Engine',
  description: 'Analitik e-commerce untuk menemukan produk potensial & menilai kelayakan sourcing berbasis data (Khusus Pasar E-commerce Indonesia).',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" style={{ background: '#f3ece3', minHeight: '100%' }}>
      <body className={font.className} style={{ margin: 0, background: '#f3ece3', color: '#1e293b', minHeight: '100vh' }}>
        <LanguageProvider>
          <div className="app-layout-root">
            <Sidebar />
            <main className="main-content-layout">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
