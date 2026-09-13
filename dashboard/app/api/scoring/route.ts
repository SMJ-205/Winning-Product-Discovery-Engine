import { NextRequest, NextResponse } from 'next/server'
import { getScoringData } from '@/lib/data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keywordId = searchParams.get('keyword_id')

  const data = await getScoringData(keywordId)
  return NextResponse.json(data)
}
