import React from 'react';
import { Box, Paper, Avatar, Stack, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkLinkify from 'remark-linkify';
import { COLORS } from '@util/colors';

import type { ChatMessage } from 'services/types';

interface ChatMessageProps {
  message: ChatMessage;
}

interface ChatBubbleProps {
  isUser: boolean;
}

const ChatBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isUser'
})<ChatBubbleProps>(({ isUser }) => ({
  padding: '16px',
  maxWidth: '70%',
  marginBottom: '16px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
  marginLeft: isUser ? 'auto' : 'unset',
  marginRight: isUser ? 'unset' : 'auto',
  backgroundColor: isUser ? COLORS.navyDark : COLORS.bgSoft,
  color: isUser ? COLORS.textOnNavy : COLORS.textPrimary,
  transition: 'box-shadow 0.15s ease',
}));

const ChatMessageComponent: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const isUser = message.sender === 'User';

  // 🔹 Copy handler
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <Box sx={{ display: 'flex', mb: 2, flexDirection: isUser ? 'row-reverse' : 'row' }}>
      <Avatar
        sx={{
          bgcolor: isUser ? COLORS.navy : COLORS.navyHover,
          color: 'white',
          mr: isUser ? 0 : 2,
          ml: isUser ? 2 : 0,
          fontWeight: 700,
        }}
      >
        {isUser ? 'N' : 'AI'}
      </Avatar>

      <ChatBubble isUser={isUser}>
        <Box
          sx={{
            typography: 'body1',
            '& a': {
              color: COLORS.cyan,
              wordBreak: 'break-all',
              textDecoration: 'underline',
            },
            '& p': { margin: 0 },
            '& code': {
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              background: isUser ? '#08223F' : '#F3F6FA',
              borderRadius: '4px',
              padding: '0 4px',
            },
            '& pre code': {
              display: 'block',
              padding: '12px',
              borderRadius: '8px',
              overflowX: 'auto',
            },
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks, remarkLinkify]}
            components={{
              a: ({ href, children, ...props }) => {
                const childArray = React.Children.toArray(children);
                const firstChild = childArray[0];

                let display;
                if (typeof firstChild === 'string') {
                  const isUrl = firstChild.startsWith('http');
                  display = isUrl ? 'Xem chi tiết' : firstChild;
                } else {
                  display = firstChild;
                }

                return (
                  <Tooltip title={href || ''} arrow>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: COLORS.cyan,
                        textDecoration: 'underline',
                        wordBreak: 'break-all',
                      }}
                      {...props}
                    >
                      {display}
                    </a>
                  </Tooltip>
                );
              },
            }}
          >
            {message.text}
          </ReactMarkdown>
        </Box>

        {message.sender === 'AI' && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
          >
            <IconButton size="small" onClick={handleCopy}>
              <ContentCopyIcon fontSize="small" sx={{ color: COLORS.textSecondary }} />
            </IconButton>
          </Stack>
        )}
      </ChatBubble>
    </Box>
  );
});

export default ChatMessageComponent;
