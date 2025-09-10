import { useState, useEffect } from 'react';
import { getTopics } from '../../api/message';
import type { Topic } from '../../types/index';

export const useTopic = () => {
    const [topics, setTopics] = useState<Topic[]>([]);

    const fetchTopics = async () => {
        try {
            const res = await getTopics();
            setTopics(res);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    return { topics, fetchTopics, setTopics };
};
