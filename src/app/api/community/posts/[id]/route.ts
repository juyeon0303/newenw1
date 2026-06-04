import { NextResponse } from 'next/server';
import { deletePost, getPost, listReplies } from '@/lib/community/store';
import { isValidAuthorId } from '@/lib/community/validation';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
  }
  const replies = await listReplies(id);
  return NextResponse.json({ post, replies });
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
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
  const ok = await deletePost(id, data.authorId);
  if (!ok) {
    return NextResponse.json({ error: '삭제할 수 없습니다.' }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
