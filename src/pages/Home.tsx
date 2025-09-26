import React, { useState} from 'react';
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

import { useAuth, useMessage, useTopic } from '@hooks/index.ts';
import { useNavigate } from 'react-router-dom';
import { getTopicById } from '../services/api/message';

import type { Topic } from '../services/types';
import type { UseMessageReturn } from '@hooks/message/useMessage';

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

  // 📌 Called when a new topic is created
  const onNewTopicCreated = (newTopic: Topic) => {
    setSelectedTopicId(newTopic.id);

    setTopics((prev) => {
      const filtered = prev.filter((t) => t.id && t.id !== newTopic.id);
      return [newTopic, ...filtered];
    });

    if (newTopic.id) {
      getTopicById(newTopic.id)
        .then((updatedTopic) => {
          setTopics((prev) => {
            const filtered = prev.filter((t) => t.id && t.id !== updatedTopic.id);
            return [updatedTopic, ...filtered];
          });
          setSelectedTopicId(updatedTopic.id);
        })
        .catch((error) => console.error("Failed to fetch topic:", error));
    }
  };

  const {
    messages,
    sendMessage,
    messageContainerRef,
    isTyping,
    createNewChat,
    justOpenedTopic,
    activeTopicId,
    setJustOpenedTopic,
  }: UseMessageReturn = useMessage(
    selectedTopicId,
    onNewTopicCreated
    // We do NOT need to pass setIsTypingByTopic anymore!
  );

  // User clicks "New Chat"
  const onNewTopic = async () => {
    const tempTopic: Topic = {
      id: undefined as unknown as number,
      title: "",
      createdAt: new Date().toISOString(),
      messages: [],
    };

    setTopics((prev) => [tempTopic, ...prev]);
    setSelectedTopicId(null);
    await createNewChat();
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
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box sx={{ width: '280px', flexShrink: 0 }}>
            <ChatSidebar
              topics={topics}
              selectedTopicId={selectedTopicId}
              onSelectTopic={(topic) => setSelectedTopicId(topic.id)}
              onNewTopic={onNewTopic}
              activeTopicId={activeTopicId}
            />
          </Box>
        )}

        {/* Main Chat Area */}
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

          {/* ChatWindow: isTyping comes from hook per-topic */}
          <ChatWindow
            messages={messages}
            onSendMessage={sendMessage}
            messageContainerRef={messageContainerRef}
            isTyping={isTyping}
            justOpenedTopic={justOpenedTopic}
            setJustOpenedTopic={setJustOpenedTopic}
          />
        </Box>
      </HomeContainer>

      {/* Mobile Drawer Sidebar */}
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
          activeTopicId={activeTopicId}
        />
      </Drawer>
    </>
  );
};

export default Home;
