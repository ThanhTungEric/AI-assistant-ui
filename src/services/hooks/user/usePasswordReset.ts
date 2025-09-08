import { useState } from 'react';
import { forgotPassword, resetPassword } from '../../api/user';

export function usePasswordReset() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const forgot = async (email: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);
        try {
            await forgotPassword(email);
            setIsSuccess(true);
            return true;
        } catch (err) {
            const errorMessage = (err as Error).message || 'Failed to send request. Please try again.';
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const reset = async (email: string, temporaryPassword: string, newPassword: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);
        try {
            await resetPassword(email, temporaryPassword, newPassword);
            setIsSuccess(true);
            return true;
        } catch (err) {
            const errorMessage = (err as Error).message || 'Password reset failed. Please try again.';
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        isSuccess,
        forgot,
        reset,
    };
}
