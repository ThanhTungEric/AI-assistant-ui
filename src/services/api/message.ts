// api/message.ts
import request from './request';
import type {
  CreateMessageResponse,
  GetMessagesResponse,
  GetTopicsWithMessagesResponse,
  Message,
  Topic,
} from '../types';

export async function createMessage(
  topicId: number | undefined,
  content: string,
  sender: 'user' | 'ai'
): Promise<CreateMessageResponse> {
  const payload: any = { content, sender };
  if (topicId !== undefined) payload.topicId = topicId;
  return request<CreateMessageResponse>('/users/message', 'POST', payload);
}

export async function getMessages(): Promise<GetMessagesResponse> {
  return request<GetMessagesResponse>('/users/message', 'GET');
}

export async function getTopicsWithMessages(): Promise<GetTopicsWithMessagesResponse> {
  return request<GetTopicsWithMessagesResponse>('/users/message/topics', 'GET');
}

export async function getTopics(): Promise<Topic[]> {
  const res = await request<{ message: string; data: Topic[] }>('/topics/by-user', 'GET');
  return res.data;
}

export async function getMessagesByTopic(topicId: number): Promise<Message[]> {
  const res = await request<{ message: string; data: Message[] }>(
    `/users/message/topics/${topicId}/messages`,
    'GET'
  );
  return res.data;
}
