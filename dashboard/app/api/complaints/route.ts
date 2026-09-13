import { NextResponse } from 'next/server'
import { getComplaintsData } from '@/lib/data'

export const revalidate = 3600

export async function GET() {
  const data = await getComplaintsData()
  return NextResponse.json(data)
}
