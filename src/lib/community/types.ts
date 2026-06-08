export const COMMUNITY_CATEGORIES = [
  { id: 'explore', label: '탐구 나눔' },
  { id: 'question', label: '질문' },
  { id: 'reflect', label: '성찰' },
  { id: 'luck', label: '월령·운' },
  { id: 'relations', label: '형충·관계' },
  { id: 'counsel', label: '운명 공동체' },
  { id: 'other', label: '기타' },
] as const;

export type CommunityCategoryId = (typeof COMMUNITY_CATEGORIES)[number]['id'];

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  category: CommunityCategoryId;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
}

export interface CommunityReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface CommunityStore {
  version: 1;
  posts: CommunityPost[];
  replies: CommunityReply[];
}

export interface CreatePostInput {
  authorId: string;
  authorName: string;
  category: CommunityCategoryId;
  title: string;
  body: string;
}

export interface CreateReplyInput {
  authorId: string;
  authorName: string;
  body: string;
}

export interface ListPostsOptions {
  category?: CommunityCategoryId;
  limit?: number;
  offset?: number;
}
