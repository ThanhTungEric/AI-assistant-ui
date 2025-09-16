import { useEffect, useRef, useState } from "react";
import { createMessage, getMessagesByTopic, getTopicById } from "../../api/message";
import type { Message, Topic } from "../../types/index";
import type { ChatMessage } from "../../types/index";

// Define the return type for useMessage
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
    setJustOpenedTopic: React.Dispatch<React.SetStateAction<boolean>>; // Added this line
}

export const useMessage = (
    selectedTopicId: number | null,
    onNewTopicCreated: (newTopic: Topic) => void
): UseMessageReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [isTypingAnimation, setIsTypingAnimation] = useState(false);
    const [justOpenedTopic, setJustOpenedTopic] = useState(false);
    const [activeTopicId, setActiveTopicId] = useState<number | null>(null);

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
            const formatted = fetchedMessages.map((m) => ({
                id: m.id,
                sender: m.sender === "user" ? "User" : ("AI" as "User" | "AI"),
                text: m.content,
                createdAt: m.createdAt,
                topicId: selectedTopicId,
            }));

            const normalized = [...formatted].reverse();

            if (formatted.length < 20) {
                setHasMore(false);
            }

            setMessages((prevMessages) => {
                if (currentPage === 1) {
                    return normalized;
                } else {
                    const container = messageContainerRef.current;
                    const oldScrollHeight = container?.scrollHeight || 0;

                    const newMessages = [...normalized, ...prevMessages];

                    setTimeout(() => {
                        if (container) {
                            const newScrollHeight = container.scrollHeight;
                            container.scrollTop = newScrollHeight - oldScrollHeight;
                        }
                    }, 0);

                    return newMessages;
                }
            });
            setActiveTopicId(selectedTopicId);
        } catch (error) {
            console.error("Error fetching messages for topic:", error);
        }
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const tempMessage: ChatMessage = {
            id: Date.now(),
            sender: "User",
            text,
            topicId: selectedTopicId || undefined,
        };

        setMessages((prev) => [...prev, tempMessage]);

        try {
            const res = await createMessage(selectedTopicId ?? undefined, text, "user");

            const userMessage: ChatMessage = {
                id: res.data.userMessage.id,
                sender: "User",
                text: res.data.userMessage.content,
                createdAt: res.data.userMessage.createdAt,
                topicId: selectedTopicId || undefined,
            };

            const aiMessage: ChatMessage = {
                id: res.data.aiMessage.id,
                sender: "AI",
                text: res.data.aiMessage.content,
                createdAt: res.data.aiMessage.createdAt,
                topicId: selectedTopicId || undefined,
            };

            setIsTypingAnimation(true);
            let currentText = '';
            let currentIndex = 0;
            const typingInterval = setInterval(() => {
                if (currentIndex < aiMessage.text.length) {
                    currentText += aiMessage.text[currentIndex];
                    setMessages((prev) => {
                        const lastMsgIndex = prev.findIndex(m => m.id === aiMessage.id);
                        if (lastMsgIndex !== -1) {
                            return [
                                ...prev.slice(0, lastMsgIndex),
                                { ...prev[lastMsgIndex], text: currentText },
                                ...prev.slice(lastMsgIndex + 1),
                            ];
                        }
                        return [
                            ...prev.filter((m) => m.id !== tempMessage.id),
                            userMessage,
                            { ...aiMessage, text: currentText },
                        ];
                    });
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    setIsTypingAnimation(false);
                }
            }, 0.1);

            setMessages((prev) => [
                ...prev.filter((m) => m.id !== tempMessage.id),
                userMessage,
                { ...aiMessage, text: '' },
            ]);

            if (!selectedTopicId && res.data.userMessage.topicId) {
                const topicFromApi = await getTopicById(res.data.userMessage.topicId);
                if (topicFromApi) {
                    const topicFromResponse: Topic = {
                        id: topicFromApi.id,
                        title: topicFromApi.title,
                        createdAt: topicFromApi.createdAt,
                        messages: [],
                    };
                    onNewTopicCreated(topicFromResponse);
                }
            }

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
        }
    };

    const createNewChat = async () => {
        console.log("Starting new chat creation, isTyping:", isTypingAnimation);
        if (isTypingAnimation) {
            await new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (!isTypingAnimation) {
                        clearInterval(checkInterval);
                        resolve(true);
                    }
                }, 50);
            });
        }

        if (selectedTopicId && messages.length > 0) {
            console.log("Saving current chat messages:", messages);
        } else {
            console.log("No messages or topic to save, selectedTopicId:", selectedTopicId);
        }

        setPage(1);
        setHasMore(true);
        setMessages([]);
        setJustOpenedTopic(true);
        setIsTypingAnimation(false);
    };

    const loadMoreMessages = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
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
        if (page > 1) {
            loadMessages(page);
        }
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
        return () => container.removeEventListener("scroll", handleScroll);
    }, [hasMore]);

    return {
        messages,
        hasMore,
        sendMessage,
        loadMoreMessages,
        messageContainerRef,
        setMessages,
        justOpenedTopic,
        isTyping: isTypingAnimation,
        createNewChat,
        activeTopicId,
        setJustOpenedTopic, // Ensure this is returned
    };
};