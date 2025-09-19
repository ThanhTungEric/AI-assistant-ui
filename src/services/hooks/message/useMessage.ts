import { useEffect, useRef, useState } from "react";
import {
  createMessage,
  getMessagesByTopic,
  getTopicById,
} from "../../api/message";
import type { Message, Topic, ChatMessage } from "../../types";

export interface UseMessageReturn {
  messages: ChatMessage[];
  hasMore: boolean;
  sendMessage: (text: string) => Promise<void>;
  loadMoreMessages: () => void;
  messageContainerRef: React.RefObject<HTMLDivElement | null>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  justOpenedTopic: boolean;
  isTyping: boolean;
  createNewChat: () => Promise<void>;
  activeTopicId: number | null;
  setJustOpenedTopic: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMessage = (
  selectedTopicId: number | null,
  onNewTopicCreated: (newTopic: Topic) => void
): UseMessageReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [justOpenedTopic, setJustOpenedTopic] = useState(false);
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // NEW: track isTyping per topic
  const [isTypingByTopic, setIsTypingByTopic] = useState<Record<number, boolean>>({});

  const isTyping = selectedTopicId ? !!isTypingByTopic[selectedTopicId] : false;

  const loadMessages = async (currentPage: number) => {
    if (!selectedTopicId) {
      setMessages([]);
      setActiveTopicId(null);
      return;
    }

    try {
      const fetchedMessages: Message[] = await getMessagesByTopic(
        selectedTopicId,
        currentPage
      );

      const formatted: ChatMessage[] = fetchedMessages.map((m) => ({
        id: m.id,
        sender: m.sender === "user" ? "User" : "AI",
        text: m.content,
        createdAt: m.createdAt,
        topicId: selectedTopicId!,
      }));

      const normalized = [...formatted].reverse();
      if (formatted.length < 20) setHasMore(false);

      setMessages((prev) =>
        currentPage === 1 ? normalized : [...normalized, ...prev]
      );
      setActiveTopicId(selectedTopicId);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const topicId = selectedTopicId ?? undefined;

    const tempMessage: ChatMessage = {
      id: Date.now(),
      sender: "User",
      text,
      topicId,
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await createMessage(topicId, text, "user");

      const userMessage: ChatMessage = {
        id: res.data.userMessage.id,
        sender: "User",
        text: res.data.userMessage.content,
        createdAt: res.data.userMessage.createdAt,
        topicId: res.data.userMessage.topicId,
      };

      const aiMessage: ChatMessage = {
        id: res.data.aiMessage.id,
        sender: "AI",
        text: res.data.aiMessage.content,
        createdAt: res.data.aiMessage.createdAt,
        topicId: res.data.aiMessage.topicId,
      };

      // mark typing true
      setIsTypingByTopic((prev) => ({
        ...prev,
        [aiMessage.topicId!]: true,
      }));

      // Show user's confirmed message + placeholder AI message
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempMessage.id),
        userMessage,
        { ...aiMessage, text: "" },
      ]);

      // Simulate AI typing
      let currentText = "";
      let index = 0;

      const typingInterval = setInterval(() => {
        if (index < aiMessage.text.length) {
          currentText += aiMessage.text[index];
          index++;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessage.id
                ? { ...msg, text: currentText }
                : msg
            )
          );
        } else {
          clearInterval(typingInterval);
          setIsTypingByTopic((prev) => ({
            ...prev,
            [aiMessage.topicId!]: false,
          }));
        }
      }, 30);

      // Handle new topic
      if (!selectedTopicId && res.data.userMessage.topicId) {
        const topicFromApi = await getTopicById(res.data.userMessage.topicId);
        if (topicFromApi) {
          onNewTopicCreated(topicFromApi);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    }
  };

  const createNewChat = async () => {
    setPage(1);
    setHasMore(true);
    setMessages([]);
    setJustOpenedTopic(true);

    if (selectedTopicId) {
      setIsTypingByTopic((prev) => ({
        ...prev,
        [selectedTopicId]: false,
      }));
    }
  };

  const loadMoreMessages = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setMessages([]);
    if (selectedTopicId) {
      setJustOpenedTopic(true);
      loadMessages(1).then(() => setJustOpenedTopic(false));
    }
  }, [selectedTopicId]);

  useEffect(() => {
    if (page > 1) loadMessages(page);
  }, [page]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore) {
        loadMoreMessages();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore]);

  return {
    messages,
    hasMore,
    sendMessage,
    loadMoreMessages,
    messageContainerRef,
    setMessages,
    justOpenedTopic,
    isTyping,
    createNewChat,
    activeTopicId,
    setJustOpenedTopic,
  };
};
