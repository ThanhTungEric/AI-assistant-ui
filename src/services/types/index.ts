// types/index.ts

export interface User {
  id: number;
  email: string;
  fullName: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ForgotPassword {
  message: string;
  user: User;
}

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  createdAt?: string;
  topicId?: number;
  topicTitle?: string;
}

export interface CreateMessageResponse {
  message: string;
  data: {
    userMessage: Message;
    aiMessage: Message;
  };
  user: string;
}

export interface Topic {
  id: number;
  title: string;
  createdAt: string;
  messages: Message[];
}

export interface GetMessagesResponse {
  message: string;
  data: Message[];
  user: string;
}

export interface GetTopicsWithMessagesResponse {
  message: string;
  data: Topic[];
}

export interface ProfileResponse {
  message: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
}

export interface ChatMessage {
  id: number;
  sender: 'User' | 'AI';
  text: string;
  createdAt?: string;
  topicId?: number;
}

export * from './user';
export * from './auth';