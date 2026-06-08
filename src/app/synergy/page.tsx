import { redirect } from 'next/navigation';

export default async function SynergyRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  params.set('tab', 'synergy');
  if (sp.a) params.set('a', String(sp.a));
  if (sp.b) params.set('b', String(sp.b));
  redirect(`/explore?${params.toString()}`);
}
