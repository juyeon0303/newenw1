import { randomUUID } from 'node:crypto';
import { getDb } from '@/lib/community/db';
import type {
  CreateLiveMessageInput,
  ListLiveMessagesOptions,
  LiveMessage,
} from './types';

type LiveRow = {
  id: string;
  author_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

function mapRow(row: LiveRow): LiveMessage {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
  };
}

export async function listLiveMessages(
  opts: ListLiveMessagesOptions = {},
): Promise<LiveMessage[]> {
  const { afterId, limit = 80 } = opts;
  const db = getDb();

  if (afterId) {
    const rows = db
      .prepare(
        `SELECT id, author_id, author_name, body, created_at
         FROM live_messages
         WHERE rowid > COALESCE(
           (SELECT rowid FROM live_messages WHERE id = ?),
           0
         )
         ORDER BY rowid ASC
         LIMIT ?`,
      )
      .all(afterId, limit) as LiveRow[];
    return rows.map(mapRow);
  }

  const rows = db
    .prepare(
      `SELECT id, author_id, author_name, body, created_at
       FROM live_messages
       WHERE rowid IN (
         SELECT rowid FROM live_messages ORDER BY rowid DESC LIMIT ?
       )
       ORDER BY rowid ASC`,
    )
    .all(limit) as LiveRow[];

  return rows.map(mapRow);
}

export async function createLiveMessage(input: CreateLiveMessageInput): Promise<LiveMessage> {
  const message: LiveMessage = {
    id: randomUUID(),
    authorId: input.authorId,
    authorName: input.authorName,
    body: input.body,
    createdAt: new Date().toISOString(),
  };

  getDb()
    .prepare(
      `INSERT INTO live_messages (id, author_id, author_name, body, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(
      message.id,
      message.authorId,
      message.authorName,
      message.body,
      message.createdAt,
    );

  return message;
}

/** 오래된 채팅은 용량 관리를 위해 정리 (최근 5000건 유지) */
export async function pruneLiveMessages(): Promise<void> {
  const db = getDb();
  db.exec(`
    DELETE FROM live_messages
    WHERE rowid NOT IN (
      SELECT rowid FROM live_messages ORDER BY rowid DESC LIMIT 5000
    )
  `);
}
