import { NextResponse } from 'next/server';
import { calculateManseryeok, type ManseryeokInput } from '@/lib/manseryeok';
import { buildCareerMonthlyChart } from '@/lib/lifestyle/career-monthly';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { input: ManseryeokInput; year?: number };
    if (!body.input?.year || !body.input.gender) {
      return NextResponse.json({ error: 'input required' }, { status: 400 });
    }
    const chart = calculateManseryeok(body.input);
    const data = buildCareerMonthlyChart(chart, body.year ?? new Date().getFullYear());
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'error' },
      { status: 500 },
    );
  }
}
