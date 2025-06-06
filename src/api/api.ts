import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface LoginResponse {
    message: string;
    session: {
        user: {
        id: number;
        username: string;
        email: string;
        };
    };
}

export interface LogoutResponse {
    message: string;
}

export interface RegisterResponse {
    message: string;
    user: User;
}

export interface Message {
    id: number;
    topicId: number;
    content: string;
    sender: 'user' | 'ai';
}

export interface CreateMessageResponse {
    message: Message;
}

export interface ForgotPassword {
    message: string;
    user: User;
}

// Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auto-redirect on 401
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
        console.warn('Session expired. Redirecting to login.');
        window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Generic request function using Axios
async function request<T>(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> {
    const response = await api({
        url: path,
        method,
        data,
    });
    return response.data;
}

// Login
export async function login(login: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>('/users/auth/login', 'POST', { login, password });
}

// Logout
export async function logout(): Promise<LogoutResponse> {
    return request<LogoutResponse>('/users/auth/logout', 'POST');
}

// Create Message (Chat)
export async function createMessage(topicId: number, content: string, sender: 'user' | 'ai'): Promise<CreateMessageResponse> {
    return request<CreateMessageResponse>('/users/message', 'POST', { topicId, content, sender });
}

// Register
export async function register(email: string, username: string, password: string): Promise<RegisterResponse> {
    return request<RegisterResponse>('/users/auth', 'POST', { email, username, password });
}

// Forgot Password
export async function forgotPassword(email: string): Promise<ForgotPassword> {
    return request<ForgotPassword>('/users/auth/forgot-password', 'POST', { email });
}
