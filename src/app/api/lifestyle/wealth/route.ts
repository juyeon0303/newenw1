import { NextResponse } from 'next/server';
import { calculateManseryeok, type ManseryeokInput } from '@/lib/manseryeok';
import { buildWealthCalendar } from '@/lib/lifestyle/wealth-calendar';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      input: ManseryeokInput;
      dayCount?: number;
      startDate?: string;
    };
    if (!body.input?.year || !body.input.gender) {
      return NextResponse.json({ error: 'input required' }, { status: 400 });
    }
    const chart = calculateManseryeok(body.input);
    const start = body.startDate ? new Date(body.startDate) : new Date();
    const data = buildWealthCalendar(chart, start, body.dayCount ?? 42);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'error' },
      { status: 500 },
    );
  }
}
