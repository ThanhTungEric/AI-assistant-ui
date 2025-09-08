export interface ProfileResponse {
    message: string;
    user: {
        id: number;
        email: string;
        username: string;
    };
}