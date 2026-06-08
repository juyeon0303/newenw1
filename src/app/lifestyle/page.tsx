import { redirect } from 'next/navigation';

export default async function LifestyleRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  params.set('tab', 'lifestyle');
  if (sp.focus) params.set('focus', String(sp.focus));
  redirect(`/explore?${params.toString()}`);
}
