export const dynamic = 'force-dynamic'

import { getComplaintsData } from '@/lib/data'
import PricingClientView from '@/components/PricingClientView'

export default async function PricingPage() {
  const { complaints, prices } = await getComplaintsData()

  return <PricingClientView complaints={complaints} prices={prices} />
}
