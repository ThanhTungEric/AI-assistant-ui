export interface Topic {
    id: number;
    title: string;
}

export interface Message {
    sender: 'user' | 'bot';
    text: string;
    createdAt?: string;
}