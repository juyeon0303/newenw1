#!/usr/bin/env npx tsx
/**
 * 월간 커리어 차트 JSON — 백엔드·배치용
 *
 * npx tsx scripts/generate-career-chart.ts '{"year":1990,"month":5,"day":15,"hour":14,"minute":30,"gender":"male"}' 2026
 */
import { calculateManseryeok, type ManseryeokInput } from '../src/lib/manseryeok';
import { buildCareerMonthlyChart } from '../src/lib/lifestyle/career-monthly';

const inputJson = process.argv[2];
const targetYear = Number(process.argv[3]) || new Date().getFullYear();

if (!inputJson) {
  console.error(
    'Usage: npx tsx scripts/generate-career-chart.ts <json-input> [year]',
  );
  process.exit(1);
}

const input = JSON.parse(inputJson) as ManseryeokInput;
const chart = calculateManseryeok(input);
const data = buildCareerMonthlyChart(chart, targetYear);
console.log(JSON.stringify(data, null, 2));
