import request from './request';
import type {
  CreateMessageResponse,
  GetMessagesResponse,
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
  return request<CreateMessageResponse>('/messages', 'POST', payload);
}

export async function getMessages(): Promise<GetMessagesResponse> {
  return request<GetMessagesResponse>('/messages', 'GET');
}

export async function getTopics(): Promise<Topic[]> {
  return request<Topic[]>('/topics', 'GET');
}

export async function getMessagesByTopic(
  topicId: number,
  page: number = 1,
  limit: number = 20,
): Promise<Message[]> {
  const res = await request<{ message: string; data: Message[] }>(
    `/messages/topic/${topicId}?page=${page}&limit=${limit}`,
    'GET'
  );
  return res.data;
}


export async function getTopicById(topicId: number): Promise<Topic> {
  return request<Topic>(`/topics/${topicId}`, 'GET');
}
