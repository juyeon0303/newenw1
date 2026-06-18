/** Render 배포 헬스체크 — DB·만세력 로직 없이 즉시 200 */
export const dynamic = 'force-static';
export const runtime = 'nodejs';

export function GET() {
  return new Response('ok', {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  });
}
