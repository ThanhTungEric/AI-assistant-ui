export interface LoginResponse {
    message: string;
    session: any;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: number;
        email: string;
        username: string;
    };
}


export interface LogoutResponse {
    message: string;
}
