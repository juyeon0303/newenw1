import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetDbForTests } from '@/lib/community/db';
import { createLiveMessage, listLiveMessages } from '../store';

let tmpDir: string;
let prevDataPath: string | undefined;
let prevDbPath: string | undefined;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'live-chat-test-'));
  prevDataPath = process.env.COMMUNITY_DATA_PATH;
  prevDbPath = process.env.COMMUNITY_DB_PATH;
  process.env.COMMUNITY_DATA_PATH = tmpDir;
  process.env.COMMUNITY_DB_PATH = path.join(tmpDir, 'test.db');
  resetDbForTests();
});

afterEach(async () => {
  resetDbForTests();
  process.env.COMMUNITY_DATA_PATH = prevDataPath;
  process.env.COMMUNITY_DB_PATH = prevDbPath;
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('live chat store', () => {
  it('creates and lists messages in order', async () => {
    const a = await createLiveMessage({
      authorId: '11111111-1111-4111-8111-111111111111',
      authorName: '채터1',
      body: '안녕하세요',
    });
    await createLiveMessage({
      authorId: '22222222-2222-4222-8222-222222222222',
      authorName: '채터2',
      body: '반갑습니다',
    });

    const all = await listLiveMessages();
    expect(all).toHaveLength(2);
    expect(all.map((m) => m.body)).toEqual(['안녕하세요', '반갑습니다']);

    const newer = await listLiveMessages({ afterId: a.id });
    expect(newer).toHaveLength(1);
    expect(newer[0]?.body).toBe('반갑습니다');
  });
});
