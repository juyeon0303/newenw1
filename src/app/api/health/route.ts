import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ ok: true, service: '8-bit' }, { status: 200 });
}

export function HEAD() {
  return new NextResponse(null, { status: 200 });
}
