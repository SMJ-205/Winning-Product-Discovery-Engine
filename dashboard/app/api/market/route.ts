import { NextResponse } from 'next/server'
import { getMarketData } from '@/lib/data'

export const revalidate = 3600 // cache 1 jam (ISR)

export async function GET() {
  const data = await getMarketData()
  return NextResponse.json(data)
}
