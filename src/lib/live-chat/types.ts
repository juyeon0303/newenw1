export interface LiveMessage {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface CreateLiveMessageInput {
  authorId: string;
  authorName: string;
  body: string;
}

export interface ListLiveMessagesOptions {
  afterId?: string;
  limit?: number;
}
