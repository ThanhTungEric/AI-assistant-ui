import React, { useState, useEffect } from 'react';
import {
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/system';
import ChatSidebar from '../components/ChatSidebar';
import ChatSidebarDrawer from '../components/ChatSidebarDrawer';
import ChatWindow from '../components/ChatWindow';
import { getMessagesByTopic, createMessage } from '../services/api/message';
import type { Topic, Message } from '../services/types';
import { useAuth } from '@hooks/index.ts';
import { useNavigate } from 'react-router-dom';

export interface ChatMessage {
    id: number;
    sender: 'User' | 'AI';
    text: string;
    createdAt?: string;
}

const lightOrangeBackground = '#FFF3E0';

const HomeContainer = styled(Box)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    backgroundColor: lightOrangeBackground,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    },
}));

const Home: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMessages() {
            if (!selectedTopic?.id) return;

            try {
                const fetchedMessages: Message[] = await getMessagesByTopic(selectedTopic.id);
                const formatted = fetchedMessages.map((m) => ({
                    id: m.id,
                    sender: m.sender === 'user' ? 'User' : 'AI' as 'User' | 'AI',
                    text: m.content,
                    createdAt: m.createdAt,
                }));

                setMessages(formatted);
            } catch (error) {
                console.error('Error fetching messages for topic:', error);
            }
        }

        fetchMessages();
    }, [selectedTopic]);

    const handleSendMessage = async (text: string): Promise<void> => {
        if (!text.trim()) return;

        const tempMessage: ChatMessage = {
            id: Date.now(),
            sender: 'User',
            text,
        };
        setMessages((prev) => [...prev, tempMessage]);

        try {
            const res = await createMessage(selectedTopic?.id, text, 'user');

            const userMessage: ChatMessage = {
                id: res.data.userMessage.id,
                sender: 'User',
                text: res.data.userMessage.content,
                createdAt: res.data.userMessage.createdAt,
            };

            const aiMessage: ChatMessage = {
                id: res.data.aiMessage.id,
                sender: 'AI',
                text: res.data.aiMessage.content,
                createdAt: res.data.aiMessage.createdAt,
            };

            if (!selectedTopic) {
                const newTopic: Topic = {
                    id: res.data.userMessage.topicId ?? 0,
                    title: res.data.userMessage.topicTitle ?? '',
                    createdAt: res.data.userMessage.createdAt ?? '',
                    messages: [],
                };
                setSelectedTopic(newTopic);
                setTopics((prev) => [newTopic, ...prev]);
            }

            setMessages((prev) =>
                [...prev.filter((m) => m.id !== tempMessage.id), userMessage, aiMessage]
            );
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleLogout = async () => {
        const response = await logoutUser();
        if (response) {
            navigate('/login');
        } else {
            console.error('Logout failed.');
        }
    };

    return (
        <>
            <CssBaseline />
            <HomeContainer>
                {!isMobile && (
                    <Box sx={{ width: '280px', flexShrink: 0 }}>
                        <ChatSidebar
                            onSelectTopic={(topic) => {
                                setSelectedTopic(topic);
                            }}
                        />
                    </Box>
                )}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            backgroundColor: 'white',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        {isMobile && (
                            <IconButton onClick={() => setDrawerOpen(true)}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                            Chat with AI assistant
                        </Box>
                        <IconButton onClick={handleLogout} sx={{ ml: 1 }}>
                            <LogoutIcon />
                        </IconButton>
                    </Box>

                    <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
                </Box>
            </HomeContainer>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <ChatSidebarDrawer
                    topics={topics}
                    selectedTopicId={selectedTopic?.id || null}
                    onSelectTopic={(topic) => {
                        setSelectedTopic(topic);
                        setDrawerOpen(false);
                    }}
                    onClose={() => setDrawerOpen(false)}
                />
            </Drawer>
        </>
    );
};

export default Home;
