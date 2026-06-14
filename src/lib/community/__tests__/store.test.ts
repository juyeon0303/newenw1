import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createPost,
  createReply,
  deletePost,
  listPosts,
  listReplies,
  resetStoreForTests,
} from '../store';
import type { CommunityStore } from '../types';

let tmpDir: string;
let prevDataPath: string | undefined;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'community-test-'));
  prevDataPath = process.env.COMMUNITY_DATA_PATH;
  process.env.COMMUNITY_DATA_PATH = tmpDir;
  const seedSrc = path.join(process.cwd(), 'data', 'community.seed.json');
  await fs.copyFile(seedSrc, path.join(tmpDir, 'community.seed.json'));
});

afterEach(async () => {
  process.env.COMMUNITY_DATA_PATH = prevDataPath;
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('community store', () => {
  it('loads empty seed on first read', async () => {
    const posts = await listPosts();
    expect(posts).toHaveLength(0);
  });

  it('creates post and reply', async () => {
    const empty: CommunityStore = { version: 1, posts: [], replies: [] };
    await resetStoreForTests(empty);

    const post = await createPost({
      authorId: '11111111-1111-4111-8111-111111111111',
      authorName: '테스터',
      category: 'explore',
      title: '테스트 글',
      body: '본문 내용입니다.',
    });
    expect(post.id).toBeTruthy();

    const reply = await createReply(post.id, {
      authorId: '22222222-2222-4222-8222-222222222222',
      authorName: '댓글',
      body: '댓글 본문입니다.',
    });
    expect(reply?.postId).toBe(post.id);

    const replies = await listReplies(post.id);
    expect(replies).toHaveLength(1);

    const listed = await listPosts();
    expect(listed[0]?.replyCount).toBe(1);
  });

  it('deletes only own post', async () => {
    const empty: CommunityStore = { version: 1, posts: [], replies: [] };
    await resetStoreForTests(empty);
    const post = await createPost({
      authorId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      authorName: '작성자',
      category: 'other',
      title: '삭제 테스트',
      body: '삭제할 글입니다.',
    });
    const ok = await deletePost(post.id, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
    expect(ok).toBe(true);
    const posts = await listPosts();
    expect(posts).toHaveLength(0);

    const fail = await deletePost(post.id, 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
    expect(fail).toBe(false);
  });
});
