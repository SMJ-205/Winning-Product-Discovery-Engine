import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Winning Product Discovery Engine',
  description: 'Analitik e-commerce untuk menemukan produk potensial & menilai kelayakan sourcing berbasis data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className} style={{ margin: 0, background: '#0f1117', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ marginLeft: 224, padding: '2rem', minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
