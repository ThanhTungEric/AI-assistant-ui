import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';
import ChatMessageComponent from './ChatMessage';
import type { ChatMessage } from 'services/types';
import { useProfile } from '@hooks/index';
import { COLORS } from '@util/colors';

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

const TypingIndicatorContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
  marginLeft: '16px',
});

const Dot = styled(Box)({
  width: '8px',
  height: '8px',
  backgroundColor: COLORS.textSecondary,
  borderRadius: '50%',
  margin: '0 4px',
  animation: 'blink 1.4s infinite ease-in-out both',
  '@keyframes blink': {
    '0%, 80%, 100%': { transform: 'scale(0)' },
    '40%': { transform: 'scale(1)' },
  },
  '&:nth-of-type(1)': { animationDelay: '0s' },
  '&:nth-of-type(2)': { animationDelay: '0.2s' },
  '&:nth-of-type(3)': { animationDelay: '0.4s' },
});

const TypingIndicator = () => (
  <TypingIndicatorContainer>
    <Dot />
    <Dot />
    <Dot />
  </TypingIndicatorContainer>
);

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  messageContainerRef: React.RefObject<HTMLDivElement | null>;
  isLoadingMore?: boolean;
  justOpenedTopic: boolean;
  setJustOpenedTopic: (value: boolean) => void;
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  messageContainerRef,
  isLoadingMore,
  justOpenedTopic,
  isTyping,
  setJustOpenedTopic,
}) => {
  const { profile } = useProfile();
  const [input, setInput] = useState<string>('');
  const [initialMessage, setInitialMessage] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Khi vừa mở topic -> nhảy ngay xuống đáy (không animation)
  useLayoutEffect(() => {
    if (justOpenedTopic && messageContainerRef.current) {
      const container = messageContainerRef.current;
      container.scrollTop = container.scrollHeight;
      setJustOpenedTopic(false);
    }
  }, [justOpenedTopic, setJustOpenedTopic, messageContainerRef]);

  // Khi có message mới sau đó -> cuộn mượt
  useEffect(() => {
    if (!isLoadingMore && !justOpenedTopic && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Thêm tin nhắn chào khi chưa có gì
  useEffect(() => {
    if (!messages.length && profile) {
      const welcomeMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI',
        text: `Hello ${profile.user.fullName}, for details on [admission method/tuition/training program], please see [Corresponding link]. ${profile.user.fullName}, please let us know the major you are interested in, email, and phone number so that VGU can provide detailed advice.`,
        createdAt: new Date().toISOString(),
      };
      setInitialMessage(welcomeMessage);
    }
  }, [messages, profile]);

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
      <MessageArea ref={messageContainerRef}>
        {initialMessage && (
          <ChatMessageComponent key={initialMessage.id} message={initialMessage} />
        )}
        {messages.map((message) => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </MessageArea>

      <InputArea>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Compose message"
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
          aria-label="Send message"
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
