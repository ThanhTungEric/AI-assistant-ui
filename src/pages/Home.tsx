import React, { useState } from 'react';
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
import type { Topic } from '../services/types';
import { useAuth, useMessage, useTopic } from '@hooks/index.ts';
import { useNavigate } from 'react-router-dom';
import { getTopicById } from '../services/api/message';

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
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    const { topics, setTopics } = useTopic();

    const onNewTopicCreated = async (newTopic: Topic) => {
        setSelectedTopicId(newTopic.id);
        setTopics((prev) => [newTopic, ...prev]);
        if (newTopic.id) {
            const updatedTopic = await getTopicById(newTopic.id);
            setSelectedTopicId(updatedTopic.id);
        }
    };

    const { messages, sendMessage, setMessages, messageContainerRef, isTyping } = useMessage(
        selectedTopicId,
        onNewTopicCreated
    );

    const onNewTopic = () => {
        setSelectedTopicId(null);
        setMessages([]);
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
                            topics={topics}
                            selectedTopicId={selectedTopicId}
                            onSelectTopic={(topic) => setSelectedTopicId(topic.id)}
                            onNewTopic={onNewTopic}
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

                    <ChatWindow
                        messages={messages}
                        onSendMessage={sendMessage}
                        messageContainerRef={messageContainerRef}
                        isTyping={isTyping} // Truyền prop isTyping xuống
                    />
                </Box>
            </HomeContainer>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <ChatSidebarDrawer
                    topics={topics}
                    selectedTopicId={selectedTopicId}
                    onSelectTopic={(topic) => {
                        setSelectedTopicId(topic.id);
                        setDrawerOpen(false);
                    }}
                    onClose={() => setDrawerOpen(false)}
                />
            </Drawer>
        </>
    );
};

export default Home;
