import { randomUUID } from 'node:crypto';
import { clearAllPostsForTests, getDb, getDbPath, resetDbForTests } from './db';
import type {
  CommunityPost,
  CommunityReply,
  CreatePostInput,
  CreateReplyInput,
  ListPostsOptions,
} from './types';

type PostRow = {
  id: string;
  author_id: string;
  author_name: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  reply_count: number;
};

type ReplyRow = {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

function mapPost(row: PostRow): CommunityPost {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author_name,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    replyCount: row.reply_count,
  };
}

function mapReply(row: ReplyRow): CommunityReply {
  return {
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
  };
}

export async function listPosts(opts: ListPostsOptions = {}): Promise<CommunityPost[]> {
  const { limit = 50, offset = 0 } = opts;
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, author_id, author_name, title, body, created_at, updated_at, reply_count
       FROM posts
       ORDER BY datetime(created_at) DESC
       LIMIT ? OFFSET ?`,
    )
    .all(limit, offset) as PostRow[];
  return rows.map(mapPost);
}

export async function getPost(id: string): Promise<CommunityPost | null> {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id, author_id, author_name, title, body, created_at, updated_at, reply_count
       FROM posts WHERE id = ?`,
    )
    .get(id) as PostRow | undefined;
  return row ? mapPost(row) : null;
}

export async function listReplies(postId: string): Promise<CommunityReply[]> {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, post_id, author_id, author_name, body, created_at
       FROM replies WHERE post_id = ?
       ORDER BY datetime(created_at) ASC`,
    )
    .all(postId) as ReplyRow[];
  return rows.map(mapReply);
}

export async function createPost(input: CreatePostInput): Promise<CommunityPost> {
  const now = new Date().toISOString();
  const post: CommunityPost = {
    id: randomUUID(),
    authorId: input.authorId,
    authorName: input.authorName,
    title: input.title,
    body: input.body,
    createdAt: now,
    updatedAt: now,
    replyCount: 0,
  };
  const db = getDb();
  db.prepare(
    `INSERT INTO posts (id, author_id, author_name, title, body, created_at, updated_at, reply_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
  ).run(
    post.id,
    post.authorId,
    post.authorName,
    post.title,
    post.body,
    post.createdAt,
    post.updatedAt,
  );
  return post;
}

export async function createReply(
  postId: string,
  input: CreateReplyInput,
): Promise<CommunityReply | null> {
  const post = await getPost(postId);
  if (!post) return null;

  const now = new Date().toISOString();
  const reply: CommunityReply = {
    id: randomUUID(),
    postId,
    authorId: input.authorId,
    authorName: input.authorName,
    body: input.body,
    createdAt: now,
  };

  const db = getDb();
  db.exec('BEGIN');
  try {
    db.prepare(
      `INSERT INTO replies (id, post_id, author_id, author_name, body, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(reply.id, reply.postId, reply.authorId, reply.authorName, reply.body, reply.createdAt);
    db.prepare(
      `UPDATE posts SET reply_count = reply_count + 1, updated_at = ? WHERE id = ?`,
    ).run(now, postId);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return reply;
}

export async function deletePost(postId: string, authorId: string): Promise<boolean> {
  const db = getDb();
  const row = db.prepare('SELECT author_id FROM posts WHERE id = ?').get(postId) as
    | { author_id: string }
    | undefined;
  if (!row || row.author_id !== authorId) return false;

  db.exec('BEGIN');
  try {
    db.prepare('DELETE FROM replies WHERE post_id = ?').run(postId);
    db.prepare('DELETE FROM posts WHERE id = ?').run(postId);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return true;
}

/** 테스트·개발용 */
export { clearAllPostsForTests as resetStoreForTests, resetDbForTests, getDbPath as getStorePathForTests };
