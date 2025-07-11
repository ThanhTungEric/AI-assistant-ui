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
// api.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response?.status === 401 && typeof window !== 'undefined') {
//         console.warn('Session expired.');
//         alert('Your session has expired. Please log in again.');
//         window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

// Generic request function using Axios
async function request<T>(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> {
    try {
        const response = await api({
        url: path,
        method,
        data,
        });
    return response.data;
    } catch (error: any) {
        console.error('Axios Error Message:', error.message);
        if (error.response) {
        console.error('Server responded with:', error.response.status, error.response.data);
        } else if (error.request) {
        console.error('Request was made but no response received');
        } else {
        console.error('Error setting up request:', error.message);
        }
        throw error;
    }
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

// Reset Password
export async function resetPassword(email: string, temporaryPassword: string, newPassword: string) {
    return request('/users/auth/reset-password', 'POST', { email, temporaryPassword, newPassword });
}

// Fetch Topics
export async function fetchTopics(): Promise<{ id: number; title: string }[]> {
    return request<{ id: number; title: string }[]>('/topics', 'GET');
}

