export const dynamic = 'force-dynamic'

import { getComplaintsData } from '@/lib/data'
import PricingClientView from '@/components/PricingClientView'

export default async function PricingPage() {
  const data = await getComplaintsData()
  const latestSnapshotDate = data.prices?.[0]?.snapshot_date || '2026-09-15'

  return (
    <PricingClientView
      complaints={data.complaints}
      prices={data.prices}
      reviews={data.reviews}
      categories={data.categories}
      snapshotDate={latestSnapshotDate}
    />
  )
}
