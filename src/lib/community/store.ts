import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type {
  CommunityPost,
  CommunityReply,
  CommunityStore,
  CreatePostInput,
  CreateReplyInput,
  ListPostsOptions,
} from './types';

const STORE_VERSION = 1 as const;

function dataDir(): string {
  return process.env.COMMUNITY_DATA_PATH ?? path.join(process.cwd(), 'data');
}

function storePath(): string {
  return path.join(dataDir(), 'community.json');
}

function seedPath(): string {
  return path.join(dataDir(), 'community.seed.json');
}

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(dataDir(), { recursive: true });
}

async function readStoreFile(): Promise<CommunityStore> {
  const file = storePath();
  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw) as CommunityStore;
    if (parsed?.version !== STORE_VERSION || !Array.isArray(parsed.posts)) {
      throw new Error('invalid store');
    }
    return {
      version: STORE_VERSION,
      posts: parsed.posts ?? [],
      replies: parsed.replies ?? [],
    };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code !== 'ENOENT') throw err;
    await ensureDataDir();
    try {
      const seedRaw = await fs.readFile(seedPath(), 'utf8');
      const seed = JSON.parse(seedRaw) as CommunityStore;
      await writeStoreFile(seed);
      return seed;
    } catch {
      const empty: CommunityStore = { version: STORE_VERSION, posts: [], replies: [] };
      await writeStoreFile(empty);
      return empty;
    }
  }
}

async function writeStoreFile(store: CommunityStore): Promise<void> {
  await ensureDataDir();
  const file = storePath();
  const payload = JSON.stringify(store, null, 2);
  // Windows: rename cannot replace an existing file (EPERM) — breaks saves in dev
  if (process.platform === 'win32') {
    await fs.writeFile(file, payload, 'utf8');
    return;
  }
  const tmp = `${file}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, payload, 'utf8');
  try {
    await fs.rename(tmp, file);
  } catch {
    await fs.unlink(file).catch(() => {});
    await fs.rename(tmp, file);
  }
}

async function mutate<T>(fn: (store: CommunityStore) => T): Promise<T> {
  const store = await readStoreFile();
  const result = fn(store);
  await writeStoreFile(store);
  return result;
}

export async function listPosts(opts: ListPostsOptions = {}): Promise<CommunityPost[]> {
  const { category, limit = 50, offset = 0 } = opts;
  const store = await readStoreFile();
  let posts = [...store.posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (category) posts = posts.filter((p) => p.category === category);
  return posts.slice(offset, offset + limit);
}

export async function getPost(id: string): Promise<CommunityPost | null> {
  const store = await readStoreFile();
  return store.posts.find((p) => p.id === id) ?? null;
}

export async function listReplies(postId: string): Promise<CommunityReply[]> {
  const store = await readStoreFile();
  return store.replies
    .filter((r) => r.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function createPost(input: CreatePostInput): Promise<CommunityPost> {
  const now = new Date().toISOString();
  const post: CommunityPost = {
    id: randomUUID(),
    authorId: input.authorId,
    authorName: input.authorName,
    category: input.category,
    title: input.title,
    body: input.body,
    createdAt: now,
    updatedAt: now,
    replyCount: 0,
  };
  await mutate((store) => {
    store.posts.push(post);
  });
  return post;
}

export async function createReply(
  postId: string,
  input: CreateReplyInput,
): Promise<CommunityReply | null> {
  const now = new Date().toISOString();
  let created: CommunityReply | null = null;
  await mutate((store) => {
    const post = store.posts.find((p) => p.id === postId);
    if (!post) return;
    const reply: CommunityReply = {
      id: randomUUID(),
      postId,
      authorId: input.authorId,
      authorName: input.authorName,
      body: input.body,
      createdAt: now,
    };
    store.replies.push(reply);
    post.replyCount += 1;
    post.updatedAt = now;
    created = reply;
  });
  return created;
}

export async function deletePost(postId: string, authorId: string): Promise<boolean> {
  let removed = false;
  await mutate((store) => {
    const idx = store.posts.findIndex((p) => p.id === postId && p.authorId === authorId);
    if (idx === -1) return;
    store.posts.splice(idx, 1);
    store.replies = store.replies.filter((r) => r.postId !== postId);
    removed = true;
  });
  return removed;
}

/** 테스트·개발용 */
export async function resetStoreForTests(store: CommunityStore): Promise<void> {
  await writeStoreFile(store);
}

export function getStorePathForTests(): string {
  return storePath();
}
