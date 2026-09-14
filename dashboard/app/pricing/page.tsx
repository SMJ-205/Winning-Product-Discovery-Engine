export const dynamic = 'force-dynamic'

import { getComplaintsData } from '@/lib/data'
import PricingClientView from '@/components/PricingClientView'

export default async function PricingPage() {
  const data = await getComplaintsData()

  return (
    <PricingClientView
      complaints={data.complaints}
      prices={data.prices}
      reviews={data.reviews}
      categories={data.categories}
    />
  )
}
