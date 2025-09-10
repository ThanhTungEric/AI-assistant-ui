export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: number;
        email: string;
        fullName: string;
    };
}

export interface LogoutResponse {
    message: string;
}
