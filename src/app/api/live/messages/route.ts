import { NextResponse } from 'next/server';
import { isValidAuthorId, normalizeAuthorName } from '@/lib/community/validation';
import { createLiveMessage, listLiveMessages, pruneLiveMessages } from '@/lib/live-chat/store';
import { normalizeChatBody } from '@/lib/live-chat/validation';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const afterId = searchParams.get('afterId') ?? undefined;
  const messages = await listLiveMessages({ afterId, limit: 100 });
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON 형식이 아닙니다.' }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  if (!isValidAuthorId(data.authorId)) {
    return NextResponse.json({ error: '작성자 정보가 올바르지 않습니다.' }, { status: 400 });
  }
  const authorName = normalizeAuthorName(data.authorName);
  const text = normalizeChatBody(data.body);
  if (!authorName || !text) {
    return NextResponse.json({ error: '입력값을 확인해 주세요.' }, { status: 400 });
  }

  try {
    const message = await createLiveMessage({
      authorId: data.authorId,
      authorName,
      body: text,
    });
    await pruneLiveMessages();
    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    console.error('[live] createLiveMessage failed', err);
    return NextResponse.json(
      { error: '채팅을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 },
    );
  }
}
