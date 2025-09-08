import { useState } from 'react';
import { login, logout, register } from '../../api/user';
import type { LoginResponse, RegisterResponse, LogoutResponse } from 'services/types';

export function useAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loginUser = async (userLogin: string, password: string): Promise<LoginResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await login(userLogin, password);
            return data;
        } catch (err) {
            const errorMessage = 'Login failed. Please try again.';
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const registerUser = async (email: string, username: string, password: string): Promise<RegisterResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await register(email, username, password);
            return data;
        } catch (err) {
            const errorMessage = 'Registration failed. Please try again.';
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const logoutUser = async (): Promise<LogoutResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await logout();
            return data;
        } catch (err) {
            const errorMessage = 'Logout failed. Please try again.';
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        loginUser,
        registerUser,
        logoutUser,
    };
}
