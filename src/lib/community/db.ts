import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

let db: DatabaseSync | null = null;

function dataDir(): string {
  return process.env.COMMUNITY_DATA_PATH ?? path.join(process.cwd(), 'data');
}

export function getDbPath(): string {
  return process.env.COMMUNITY_DB_PATH ?? path.join(dataDir(), 'community.db');
}

function initSchema(database: DatabaseSync): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      reply_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS replies (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_replies_post ON replies(post_id);

    CREATE TABLE IF NOT EXISTS live_messages (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_live_messages_created ON live_messages(created_at);
  `);
}

function migrateFromLegacyJson(database: DatabaseSync): void {
  const count = database.prepare('SELECT COUNT(*) AS n FROM posts').get() as { n: number };
  if (count.n > 0) return;

  const jsonPath = path.join(dataDir(), 'community.json');
  if (!fs.existsSync(jsonPath)) return;

  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(raw) as {
      posts?: Array<{
        id: string;
        authorId: string;
        authorName: string;
        title: string;
        body: string;
        createdAt: string;
        updatedAt: string;
        replyCount?: number;
      }>;
      replies?: Array<{
        id: string;
        postId: string;
        authorId: string;
        authorName: string;
        body: string;
        createdAt: string;
      }>;
    };

    const insertPost = database.prepare(`
      INSERT INTO posts (id, author_id, author_name, title, body, created_at, updated_at, reply_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertReply = database.prepare(`
      INSERT INTO replies (id, post_id, author_id, author_name, body, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    database.exec('BEGIN');
    for (const p of parsed.posts ?? []) {
      insertPost.run(
        p.id,
        p.authorId,
        p.authorName,
        p.title,
        p.body,
        p.createdAt,
        p.updatedAt,
        p.replyCount ?? 0,
      );
    }
    for (const r of parsed.replies ?? []) {
      insertReply.run(r.id, r.postId, r.authorId, r.authorName, r.body, r.createdAt);
    }
    database.exec('COMMIT');
  } catch (err) {
    database.exec('ROLLBACK');
    console.warn('[community] legacy JSON migration skipped', err);
  }
}

export function getDb(): DatabaseSync {
  if (!db) {
    const dbPath = getDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new DatabaseSync(dbPath);
    initSchema(db);
    migrateFromLegacyJson(db);
  }
  return db;
}

/** 테스트·개발용 */
export function resetDbForTests(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function clearAllPostsForTests(): void {
  const database = getDb();
  database.exec('DELETE FROM replies; DELETE FROM posts; DELETE FROM live_messages;');
}
