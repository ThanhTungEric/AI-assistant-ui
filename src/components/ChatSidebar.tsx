import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import VGULogo from '../assets/VGU-Logo.png';
import type { Topic } from '../services/types';
import { COLORS } from '@util/colors';

const SidebarContainer = styled(Box)({
  backgroundColor: COLORS.navy,
  padding: '16px',
  color: 'white',
  boxShadow: '4px 0px 8px rgba(0, 0, 0, 0.1)',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

interface ChatSidebarProps {
  topics: Topic[];
  selectedTopicId: number | null;
  onSelectTopic: (topic: Topic) => void;
  onNewTopic: () => void;
  activeTopicId?: number | null; // Add this line
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ topics, selectedTopicId, onSelectTopic, onNewTopic, activeTopicId}) => {
  return (
    <SidebarContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, height: '64px' }}>
        <Box
          component="img"
          src={VGULogo}
          alt="VGU Logo"
          sx={{ width: 200, height: 'auto', marginRight: 2 }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Chat History
        </Typography>
        <IconButton type="button" size="small" sx={{ color: COLORS.cyan }} onClick={onNewTopic}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <List>
          {topics.map((topic) => (
            <ListItem disablePadding key={topic.id}>
              <ListItemButton
                selected={selectedTopicId === topic.id}
                onClick={() => onSelectTopic(topic)}
                sx={{
                  bgcolor: selectedTopicId === topic.id ? COLORS.navyDark : 'transparent',
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    bgcolor: COLORS.navyDark,
                    '&:hover': { bgcolor: COLORS.navyDark },
                  },
                  '&:hover': { bgcolor: COLORS.navyHover },
                  transition: 'background-color 0.15s ease',
                  ...(activeTopicId === topic.id && { fontWeight: 'bold' }), // Highlight active topic
                }}
              >
                <Typography variant="body2" sx={{ color: COLORS.textOnNavy, fontWeight: 'bold' }}>
                  {topic.title}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </SidebarContainer>
  );
};

export default ChatSidebar;