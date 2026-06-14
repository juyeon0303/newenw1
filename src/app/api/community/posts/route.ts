import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { createPost, listPosts } from '@/lib/community/store';
import {
  isValidAuthorId,
  normalizeAuthorName,
  normalizeBody,
  normalizeTitle,
} from '@/lib/community/validation';

export const runtime = 'nodejs';

export async function GET() {
  const posts = await listPosts({ limit: 100 });
  return NextResponse.json({ posts });
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
  const title = normalizeTitle(data.title);
  const text = normalizeBody(data.body);
  if (!authorName || !title || !text) {
    return NextResponse.json({ error: '입력값을 확인해 주세요.' }, { status: 400 });
  }

  try {
    const post = await createPost({
      authorId: data.authorId,
      authorName,
      title,
      body: text,
    });
    revalidatePath('/community');
    revalidatePath(`/community/${post.id}`);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error('[community] createPost failed', err);
    return NextResponse.json(
      { error: '글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 },
    );
  }
}
