import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import './globals.css'

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'SaleSpyder | Winning Product Discovery Engine',
  description: 'Analitik e-commerce untuk menemukan produk potensial & menilai kelayakan sourcing berbasis data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={font.className} style={{ margin: 0, background: '#f1f3f7', minHeight: '100vh', color: '#1e293b' }}>
        <Sidebar />
        <main style={{ marginLeft: 236, padding: '2rem 2.5rem', minHeight: '100vh', boxSizing: 'border-box' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
