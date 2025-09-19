// components/ChatSidebarDrawer.tsx
import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, Avatar, Typography } from '@mui/material';
import type { Topic } from '../services/types';

interface ChatSidebarDrawerProps {
  topics: Topic[];
  selectedTopicId: number | null;
  onSelectTopic: (topic: Topic) => void;
  onClose: () => void;
  activeTopicId?: number | null; // Add this line
}

const primaryOrange = '#FF5722';
const darkOrange = '#BF360C';

const ChatSidebarDrawer: React.FC<ChatSidebarDrawerProps> = ({
  topics,
  selectedTopicId,
  onSelectTopic,
  onClose,
  activeTopicId,
}) => (
  <Box sx={{ width: 280 }}>
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Chat history
      </Typography>
    </Box>
    <List>
      {topics.map((topic) => (
        <ListItem disablePadding key={topic.id}>
          <ListItemButton
            selected={selectedTopicId === topic.id}
            onClick={() => {
              onSelectTopic(topic);
              onClose();
            }}
            sx={{
              bgcolor: selectedTopicId === topic.id ? darkOrange : 'transparent',
              '&.Mui-selected': { bgcolor: darkOrange },
              ...(activeTopicId === topic.id && { fontWeight: 'bold' }), // Highlight active topic
            }}
          >
            <ListItemIcon>
              <Avatar sx={{ bgcolor: primaryOrange, color: 'white' }}>
                {topic.id}
              </Avatar>
            </ListItemIcon>
            <Typography variant="body2">
              {topic.title && topic.title.trim().length > 0 ? topic.title : "New Chat"}
            </Typography>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default ChatSidebarDrawer;