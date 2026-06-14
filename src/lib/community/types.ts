export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
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

export interface CreatePostInput {
  authorId: string;
  authorName: string;
  title: string;
  body: string;
}

export interface CreateReplyInput {
  authorId: string;
  authorName: string;
  body: string;
}

export interface ListPostsOptions {
  limit?: number;
  offset?: number;
}
