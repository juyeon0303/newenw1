import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { createReply, getPost } from '@/lib/community/store';
import {
  isValidAuthorId,
  normalizeAuthorName,
  normalizeBody,
} from '@/lib/community/validation';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
  }

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
  const text = normalizeBody(data.body, 2000);
  if (!authorName || !text) {
    return NextResponse.json({ error: '입력값을 확인해 주세요.' }, { status: 400 });
  }

  try {
    const reply = await createReply(id, {
      authorId: data.authorId,
      authorName,
      body: text,
    });
    if (!reply) {
      return NextResponse.json({ error: '댓글을 달 수 없습니다.' }, { status: 500 });
    }
    revalidatePath('/community');
    revalidatePath(`/community/${id}`);
    return NextResponse.json({ reply }, { status: 201 });
  } catch (err) {
    console.error('[community] createReply failed', err);
    return NextResponse.json(
      { error: '댓글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 },
    );
  }
}
