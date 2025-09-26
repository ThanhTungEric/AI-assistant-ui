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
  // Store messages per topic (also key -1 for new chats before backend assigns ID)
  const [messagesByTopic, setMessagesByTopic] = useState<
    Record<number, ChatMessage[]>
  >({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [justOpenedTopic, setJustOpenedTopic] = useState(false);
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Track typing per topic
  const [isTypingByTopic, setIsTypingByTopic] = useState<
    Record<number, boolean>
  >({});
  const isTyping = selectedTopicId
    ? !!isTypingByTopic[selectedTopicId]
    : !!isTypingByTopic[-1];

  // Computed messages for the currently selected topic (or temp bucket -1)
  const messages =
    selectedTopicId !== null
      ? messagesByTopic[selectedTopicId] ?? []
      : messagesByTopic[-1] ?? [];

  const loadMessages = async (currentPage: number) => {
    if (!selectedTopicId) {
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

      setMessagesByTopic((prev) => ({
        ...prev,
        [selectedTopicId]: currentPage === 1
          ? normalized
          : [...normalized, ...(prev[selectedTopicId] ?? [])],
      }));

      setActiveTopicId(selectedTopicId);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // if topicId is not yet assigned, we still allow sending
    const topicIdAtSend = selectedTopicId ?? -1;

    const tempMessage: ChatMessage = {
      id: Date.now(),
      sender: "User",
      text,
      topicId: topicIdAtSend,
    };

    // put temp message into "current topic" (or temp -1 bucket)
    setMessagesByTopic((prev) => ({
      ...prev,
      [topicIdAtSend]: [...(prev[topicIdAtSend] ?? []), tempMessage],
    }));

    try {
      const res = await createMessage(
        selectedTopicId ?? undefined,
        text,
        "user"
      );

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

      // If this was a brand new topic, update the sidebar + selectedTopicId
      if (!selectedTopicId && res.data.userMessage.topicId) {
        const topicFromApi = await getTopicById(res.data.userMessage.topicId);
        if (topicFromApi) {
          onNewTopicCreated(topicFromApi);
        }
      }

      // ✅ make sure we got a real topic id
      const realTopicId: number | undefined = res.data.userMessage.topicId;
      if (!realTopicId) {
        console.error("No topicId returned from backend!");
        return;
      }

      setIsTypingByTopic((prev) => ({
        ...prev,
        [realTopicId]: true,
      }));

      setMessagesByTopic((prev) => {
        const tempMsgs = prev[-1] ?? [];
        const cleanedTemp = tempMsgs.filter((m) => m.id !== tempMessage.id);

        return {
          ...prev,
          [realTopicId]: [
            ...cleanedTemp,
            ...(prev[realTopicId] ?? []).filter(
              (m) => m.id !== tempMessage.id
            ),
            userMessage,
            { ...aiMessage, text: "" },
          ],
          [-1]: [], // clear temp bucket
        };
      });

      // simulate AI typing
      let currentText = "";
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < aiMessage.text.length) {
          currentText += aiMessage.text[index++];
          setMessagesByTopic((prev) => ({
            ...prev,
            [realTopicId]: (prev[realTopicId] ?? []).map((msg: ChatMessage) =>
              msg.id === aiMessage.id ? { ...msg, text: currentText } : msg
            ),
          }));
        } else {
          clearInterval(typingInterval);
          setIsTypingByTopic((prev) => ({
            ...prev,
            [realTopicId]: false,
          }));
        }
      }, 0.1);
    } catch (error) {
      console.error("Error sending message:", error);
      // remove temp on error
      setMessagesByTopic((prev) => ({
        ...prev,
        [topicIdAtSend]: (prev[topicIdAtSend] ?? []).filter(
          (m) => m.id !== tempMessage.id
        ),
      }));
    }
  };

  const createNewChat = async () => {
    setPage(1);
    setHasMore(true);
    setJustOpenedTopic(true);

    // reset typing for old topic if any
    if (selectedTopicId) {
      setIsTypingByTopic((prev) => ({
        ...prev,
        [selectedTopicId]: false,
      }));
    }
    // also ensure temp bucket -1 is cleared
    setMessagesByTopic((prev) => ({ ...prev, [-1]: [] }));
  };

  const loadMoreMessages = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
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
    setMessages: (value: React.SetStateAction<ChatMessage[]>) => {
      const topicId = selectedTopicId ?? -1;

      setMessagesByTopic((prev) => {
        const prevArr = prev[topicId] ?? [];
        const newArr =
          typeof value === "function"
            ? (value as (p: ChatMessage[]) => ChatMessage[])(prevArr)
            : value;
        return {
          ...prev,
          [topicId]: newArr,
        };
      });
    },
    justOpenedTopic,
    isTyping,
    createNewChat,
    activeTopicId,
    setJustOpenedTopic,
  };
};
