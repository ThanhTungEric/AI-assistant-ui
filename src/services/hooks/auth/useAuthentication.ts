import { useState } from 'react';
import { login, logout, register } from '../../api/user';
import type { LoginResponse, RegisterResponse, LogoutResponse } from 'services/types';

export function useAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loginUser = async (
        email: string,
        password: string
    ): Promise<LoginResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {

            const data = await login(email, password);

            if (data?.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }
            return data;
        } catch (err) {
            setError('Login failed. Please try again.');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const registerUser = async (
        email: string,
        fullName: string,
        password: string
    ): Promise<RegisterResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {

            return await register(email, fullName, password);
        } catch (err) {
            setError('Registration failed. Please try again.');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const logoutUser = async (): Promise<LogoutResponse | null> => {
        localStorage.removeItem('accessToken');
        setIsLoading(true);
        setError(null);
        try {
            return await logout();
        } catch (err) {
            setError('Logout failed. Please try again.');
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
