export const dynamic = 'force-dynamic'

import Header from '@/components/Header'
import MarginSimulator from '@/components/MarginSimulator'
import { getScoringData } from '@/lib/data'

async function getDefaultPrice() {
  try {
    const data = await getScoringData()
    return (data as any)?.[0]?.dim_category_keyword?.target_price_min ?? 68000
  } catch {
    return 68000
  }
}

export default async function SourcingPage() {
  const defaultPrice = await getDefaultPrice()

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <Header />

      {/* Main Sourcing Content */}
      <div style={{ maxWidth: 960 }}>
        <MarginSimulator defaultSellingPrice={defaultPrice} />
      </div>
    </div>
  )
}
