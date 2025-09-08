import { useState, useEffect } from 'react';
import { getProfile } from '../../api/user';
import type { ProfileResponse } from 'services/types';

export function useProfile() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfile(data);
            } catch (err) {
                const errorMessage = (err as Error).message || 'Could not retrieve profile information.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { profile, isLoading, error };
}
