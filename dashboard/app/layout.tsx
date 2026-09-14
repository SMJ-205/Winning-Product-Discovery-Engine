import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Biz-In-Sight | Winning Product Discovery Engine',
  description: 'Analitik e-commerce untuk menemukan produk potensial & menilai kelayakan sourcing berbasis data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" style={{ background: '#0c1021', minHeight: '100%' }}>
      <body className={font.className} style={{ margin: 0, background: '#0c1021', color: '#f8fafc', minHeight: '100vh' }}>
        <LanguageProvider>
          <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#0c1021' }}>
            <Sidebar />
            <main style={{
              marginLeft: 240,
              flex: 1,
              minWidth: 0,
              padding: '2rem 2.5rem',
              boxSizing: 'border-box',
              background: '#0c1021',
              minHeight: '100vh',
            }}>
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
