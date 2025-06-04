const BASE_URL = 'http://localhost:3000/api'

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface LoginResponse {
    message: string;
    user: User;
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

async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        },
        credentials: 'include',
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }
    return res.json();
}

// login API
export async function login(login: string, password: string): Promise<LoginResponse> {
    return request('/users/auth/login', {
        method: 'POST',
        body: JSON.stringify({ login, password }),
    });
}

// logout API
export async function logout(): Promise<LogoutResponse> {
    return request('/users/auth/logout', {
        method: 'POST',
    });
}

// createMessage (chat) API
export async function createMessage(topicId: number, content: string, sender: 'user' | 'ai'): Promise<CreateMessageResponse> {
    return request('/users/message', {
        method: 'POST',
        body: JSON.stringify({ topicId, content, sender }),
    });
}

// register API
export async function register(email: string, username: string, password: string): Promise<RegisterResponse> {
    return request('/users/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, username, password }),
    });
}

