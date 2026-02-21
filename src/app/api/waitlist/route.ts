import { addToWaitlist, getWaitlistCount } from '@/db/queries'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const count = await getWaitlistCount()
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const entry = await addToWaitlist({ email })
    return NextResponse.json({ entry })
  } catch {
    return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 })
  }
}
