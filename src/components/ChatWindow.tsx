import React, { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';
import ChatMessageComponent from './ChatMessage';
import type { ChatMessage } from '../pages/Home';
import { COLORS } from '@util/colors';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

const ChatWindowContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minHeight: 0,
});

const MessageArea = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  backgroundColor: '#FFFFFF',
});

const InputArea = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  borderTop: `1px solid ${COLORS.dividerNavy}`,
  backgroundColor: 'white',
  flexShrink: 0,
  position: 'sticky',
  bottom: 0,
  zIndex: 10,
});

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (): void => {
    const text = input.trim();
    if (text) {
      onSendMessage(text);
      setInput('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0;

  return (
    <ChatWindowContainer>
      <MessageArea>
        {messages.map((message) => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </MessageArea>

      <InputArea>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Nhập tin nhắn của bạn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Soạn tin nhắn"
          sx={{
            mr: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '30px',
              backgroundColor: COLORS.bgSoft,
              paddingRight: 0,
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              '& fieldset': { borderColor: COLORS.navy },
              '&:hover fieldset': { borderColor: COLORS.navyHover },
              '&.Mui-focused fieldset': {
                borderColor: COLORS.navyHover,
                borderWidth: '2px',
              },
            },
            '& .MuiInputBase-input': { py: 1.5 },
          }}
        />

        <IconButton
          onClick={handleSend}
          aria-label="Gửi tin nhắn"
          disabled={!canSend}
          sx={{
            ml: 1,
            p: 1.5,
            bgcolor: canSend ? COLORS.navy : 'rgba(0,0,0,0.12)',
            color: canSend ? 'white' : 'rgba(0,0,0,0.38)',
            borderRadius: '50%',
            transition: 'background-color 0.15s ease',
            '&:hover': {
              bgcolor: canSend ? COLORS.navyHover : 'rgba(0,0,0,0.12)',
            },
            '&:active': {
              bgcolor: canSend ? COLORS.navyDark : 'rgba(0,0,0,0.12)',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </InputArea>
    </ChatWindowContainer>
  );
};

export default ChatWindow;