import { useEffect, useRef, useState } from "react";
import { createMessage, getMessagesByTopic, getTopicById } from "../../api/message";
import type { Message, Topic } from "../../types/index";
import type { ChatMessage } from "../../types/index";

export const useMessage = (
    selectedTopicId: number | null,
    onNewTopicCreated: (newTopic: Topic) => void
) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [justOpenedTopic, setJustOpenedTopic] = useState(false);

    const loadMessages = async (currentPage: number) => {
        if (!selectedTopicId) {
            setMessages([]);
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
        setIsTyping(true);

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

            setIsTyping(false);

            let currentText = '';
            let currentIndex = 0;
            const typingInterval = setInterval(() => {
                if (currentIndex < aiMessage.text.length) {
                    currentText += aiMessage.text[currentIndex];
                    setMessages((prev) => {
                        const lastMsg = prev[prev.length - 1];

                        if (lastMsg && lastMsg.id === aiMessage.id) {
                            return [...prev.slice(0, -1), { ...lastMsg, text: currentText }];
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
                }
            }, 50);

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

            setMessages((prev) => [
                ...prev.filter((m) => m.id !== tempMessage.id),
                userMessage,
                { ...aiMessage, text: '' }
            ]);

        } catch (error) {
            console.error("Error sending message:", error);
            setIsTyping(false);
            setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
        }
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
        isTyping,
    };
};
