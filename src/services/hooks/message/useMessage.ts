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
  const [messagesByTopic, setMessagesByTopic] = useState<Record<number, ChatMessage[]>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [justOpenedTopic, setJustOpenedTopic] = useState(false);
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Track typing sessions per topic
  const [typingSessions, setTypingSessions] = useState<Record<
    number,
    { aiMessage: ChatMessage; startTime: number; speed: number }
  >>({});

  const isTyping =
    selectedTopicId !== null
      ? !!typingSessions[selectedTopicId]
      : !!typingSessions[-1];

  // ✅ Track if user is near bottom
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);

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
        [selectedTopicId]:
          currentPage === 1
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

    const topicIdAtSend = selectedTopicId ?? -1;

    const tempMessage: ChatMessage = {
      id: Date.now(),
      sender: "User",
      text,
      topicId: topicIdAtSend,
    };

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

      if (!selectedTopicId && res.data.userMessage.topicId) {
        const topicFromApi = await getTopicById(res.data.userMessage.topicId);
        if (topicFromApi) {
          onNewTopicCreated(topicFromApi);
        }
      }

      const realTopicId: number | undefined = res.data.userMessage.topicId;
      if (!realTopicId) {
        console.error("No topicId returned from backend!");
        return;
      }

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
          [-1]: [],
        };
      });

      // ✅ Start typing session with time-based approach
      setTypingSessions((prev) => ({
        ...prev,
        [realTopicId]: {
          aiMessage,
          startTime: Date.now(),
          speed: 30 / 1000, // 30 chars per sec
        },
      }));
    } catch (error) {
      console.error("Error sending message:", error);
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
    setMessagesByTopic((prev) => ({ ...prev, [-1]: [] }));
  };

  const loadMoreMessages = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // ✅ Drive AI typing with requestAnimationFrame
  useEffect(() => {
    let raf: number;

    const tick = () => {
      Object.entries(typingSessions).forEach(([topicId, session]) => {
        const elapsed = Date.now() - session.startTime;
        const charsToShow = Math.min(
          session.aiMessage.text.length,
          Math.floor(elapsed * session.speed)
        );

        setMessagesByTopic((prev) => ({
          ...prev,
          [Number(topicId)]: (prev[Number(topicId)] ?? []).map((msg) =>
            msg.id === session.aiMessage.id
              ? { ...msg, text: session.aiMessage.text.slice(0, charsToShow) }
              : msg
          ),
        }));

        if (charsToShow >= session.aiMessage.text.length) {
          setTypingSessions((prev) => {
            const copy = { ...prev };
            delete copy[Number(topicId)];
            return copy;
          });
        }
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [typingSessions]);

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

  // ✅ Detect user scroll position
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 50;
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      setIsUserNearBottom(distanceFromBottom < threshold);

      if (container.scrollTop === 0 && hasMore) {
        loadMoreMessages();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore]);

  // ✅ Auto-scroll only when near bottom or just opened topic
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    if (isUserNearBottom || justOpenedTopic) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, justOpenedTopic, isUserNearBottom]);

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
