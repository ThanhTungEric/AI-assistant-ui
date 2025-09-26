import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
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
  loadMoreMessages: () => void; // ✅ added
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  messageContainerRef,
  isLoadingMore,
  justOpenedTopic,
  isTyping,
  setJustOpenedTopic,
  loadMoreMessages, // ✅ from parent
}) => {
  const { profile } = useProfile();
  const [input, setInput] = useState<string>('');
  const [initialMessage, setInitialMessage] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSending = useRef(false);

  // 👀 track if user manually scrolled up
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Scroll to bottom when opening topic
  useLayoutEffect(() => {
    if (justOpenedTopic && messageContainerRef.current) {
      const container = messageContainerRef.current;
      container.scrollTop = container.scrollHeight;
      setJustOpenedTopic(false);
      setIsUserScrolling(false); // reset scroll lock
    }
  }, [justOpenedTopic, setJustOpenedTopic, messageContainerRef]);

  // Smooth scroll on new messages (only if user is not scrolling)
  useEffect(() => {
    if (!isLoadingMore && !justOpenedTopic && messagesEndRef.current && !isUserScrolling) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoadingMore, justOpenedTopic, messagesEndRef, isUserScrolling]);

  // Preserve scroll position when loading older messages
  useLayoutEffect(() => {
    if (isLoadingMore && messageContainerRef.current) {
      const container = messageContainerRef.current;
      const prevHeight = container.scrollHeight;
      requestAnimationFrame(() => {
        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - prevHeight;
      });
    }
  }, [messages, isLoadingMore]);

  // Infinite scroll handler (top detection + scroll lock detection)
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 50;

      // ✅ detect if user scrolled up (lock autoscroll)
      setIsUserScrolling(!nearBottom);

      if (container.scrollTop === 0 && !isLoadingMore) {
        loadMoreMessages(); // ✅ directly call the hook
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, messageContainerRef, loadMoreMessages]);

  // Welcome message
  useEffect(() => {
    if (!messages.length && profile && !initialMessage) {
      const welcomeMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI',
        text: `Hello **${profile.user.fullName}**, welcome to VGU chatbot. Please tell us your **Major** and provide your **Email** and **Phone number** so we can assist you with **Admission / Tuition / Training Program**. See [link](https://vgu.edu.vn/vi/admission) for more details.`,
        createdAt: new Date().toISOString(),
      };
      setInitialMessage(welcomeMessage);
    }
  }, [messages, profile, initialMessage]);

  const handleSend = (): void => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    if (isSending.current) return;
    isSending.current = true;

    onSendMessage(text);
    setTimeout(() => {
      isSending.current = false;
    }, 300);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
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
          type="button"
          onClick={handleSend}
          aria-label="Send message"
          disabled={!canSend}
          sx={{
            ml: 1,
            p: 1.5,
            bgcolor: canSend ? COLORS.navy : 'rgba(0,0,0,0.12)',
            color: canSend ? 'white' : 'rgba(0,0,0,0.38)',
            borderRadius: '50%',
            '&:hover': {
              bgcolor: canSend ? COLORS.navyHover : 'rgba(0,0,0,0.12)',
            },
            '&:active': {
              bgcolor: canSend ? COLORS.navyDark : 'rgba(0,0,0,0.12)',
            },
          }}
        >
          {isTyping ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </InputArea>
    </ChatWindowContainer>
  );
};

export default ChatWindow;
