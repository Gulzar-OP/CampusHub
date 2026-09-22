
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

import {
  MessageCircle,
  Send,
  Search,
  MessagesSquare,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
  {
    autoConnect: false,
  },
);

export default function Chat() {
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [loadingConversations, setLoadingConversations] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] = useState(false);

  const [search, setSearch] = useState("");

  const messagesEndRef = useRef(null);

  const activeConversation =
    searchParams.get("conversation");

  // ==========================================
  // LOAD CONVERSATIONS
  // ==========================================

  const loadConversations = async () => {
    try {
      const res = await api.get(
        "/chat/conversations",
      );

      setConversations(
        res.data.conversations || [],
      );
    } catch (error) {
      console.error(
        "Failed to load conversations:",
        error,
      );
    } finally {
      setLoadingConversations(false);
    }
  };

  // ==========================================
  // SOCKET CONNECTION
  // ==========================================

  useEffect(() => {
    loadConversations();

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  // ==========================================
  // LOAD MESSAGES
  // ==========================================

  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);

        const res = await api.get(
          `/chat/conversations/${activeConversation}/messages`,
        );

        setMessages(
          res.data.messages || [],
        );
      } catch (error) {
        console.error(
          "Failed to load messages:",
          error,
        );
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();

    // Join selected conversation
    socket.emit(
      "conversation:join",
      activeConversation,
    );

    // New real-time message
    const handleNewMessage = (message) => {
      setMessages((prev) => {
        const alreadyExists = prev.some(
          (m) => m._id === message._id,
        );

        if (alreadyExists) {
          return prev;
        }

        return [...prev, message];
      });

      loadConversations();
    };

    socket.on(
      "message:new",
      handleNewMessage,
    );

    return () => {
      socket.off(
        "message:new",
        handleNewMessage,
      );
    };
  }, [activeConversation]);

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async (e) => {
    e.preventDefault();

    const cleanText = text.trim();

    if (
      !cleanText ||
      !activeConversation ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);

      const res = await api.post(
        `/chat/conversations/${activeConversation}/messages`,
        {
          text: cleanText,
        },
      );

      const newMessage = res.data.message;

      setMessages((prev) => {
        const alreadyExists = prev.some(
          (message) =>
            message._id === newMessage._id,
        );

        if (alreadyExists) {
          return prev;
        }

        return [...prev, newMessage];
      });

      setText("");

      loadConversations();
    } catch (error) {
      console.error(
        "Failed to send message:",
        error,
      );
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // CURRENT CONVERSATION
  // ==========================================

  const currentConversation = useMemo(
    () =>
      conversations.find(
        (conversation) =>
          conversation._id ===
          activeConversation,
      ),
    [
      conversations,
      activeConversation,
    ],
  );

  const currentOtherUser =
    currentConversation?.members?.find(
      (member) =>
        member._id !== user?._id,
    ) ||
    currentConversation?.members?.[0];

  // ==========================================
  // SEARCH CONVERSATIONS
  // ==========================================

  const filteredConversations =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return conversations;
      }

      return conversations.filter(
        (conversation) => {
          const otherUser =
            conversation.members?.find(
              (member) =>
                member._id !==
                user?._id,
            ) ||
            conversation.members?.[0];

          return otherUser?.name
            ?.toLowerCase()
            .includes(query);
        },
      );
    }, [
      conversations,
      search,
      user?._id,
    ]);

  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="mb-7">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Messages
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Connect safely with students on campus.
        </p>
      </div>

      {/* ================= CHAT CONTAINER ================= */}

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="grid h-[calc(100vh-190px)] min-h-[600px] grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr]">

          {/* ================= CONVERSATION LIST ================= */}

          <aside
            className={`border-r border-gray-100 bg-white ${
              activeConversation
                ? "hidden md:flex"
                : "flex"
            } flex-col`}
          >
            {/* Sidebar Header */}
            <div className="border-b border-gray-100 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Conversations
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    {conversations.length} chats
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MessageCircle size={20} />
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value,
                    )
                  }
                  placeholder="Search conversations..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto p-2">
              {loadingConversations ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex animate-pulse items-center gap-3 rounded-xl p-3"
                      >
                        <div className="h-11 w-11 rounded-full bg-gray-200" />

                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/2 rounded bg-gray-200" />

                          <div className="h-3 w-3/4 rounded bg-gray-100" />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : filteredConversations.length ? (
                filteredConversations.map(
                  (conversation) => {
                    const otherUser =
                      conversation.members?.find(
                        (member) =>
                          member._id !==
                          user?._id,
                      ) ||
                      conversation
                        .members?.[0];

                    const active =
                      activeConversation ===
                      conversation._id;

                    return (
                      <button
                        key={
                          conversation._id
                        }
                        onClick={() =>
                          setSearchParams({
                            conversation:
                              conversation._id,
                          })
                        }
                        className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                          active
                            ? "bg-indigo-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold uppercase ${
                            active
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {otherUser?.name?.[0] ||
                            "U"}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`truncate text-sm font-semibold ${
                                active
                                  ? "text-indigo-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {otherUser?.name ||
                                "Student"}
                            </p>
                          </div>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {conversation.lastMessage ||
                              "Start a conversation"}
                          </p>
                        </div>
                      </button>
                    );
                  },
                )
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <MessagesSquare
                    size={36}
                    className="mb-4 text-gray-300"
                  />

                  <p className="text-sm font-medium text-gray-700">
                    No conversations
                  </p>

                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    Open an item and message
                    its owner to start a
                    conversation.
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* ================= CHAT WINDOW ================= */}

          <section
            className={`${
              activeConversation
                ? "flex"
                : "hidden md:flex"
            } min-w-0 flex-col bg-gray-50`}
          >
            {activeConversation ? (
              <>
                {/* ================= CHAT HEADER ================= */}

                <div className="flex h-[73px] items-center gap-3 border-b border-gray-100 bg-white px-4 sm:px-6">

                  {/* Mobile back */}
                  <button
                    onClick={() =>
                      setSearchParams({})
                    }
                    className="mr-1 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 md:hidden"
                  >
                    ←
                  </button>

                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold uppercase text-white">
                    {currentOtherUser?.name?.[0] ||
                      "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {currentOtherUser?.name ||
                        "Conversation"}
                    </p>

                    <p className="text-xs text-gray-400">
                      CampusHub student
                    </p>
                  </div>
                </div>

                {/* ================= MESSAGES ================= */}

                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  {loadingMessages ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-sm text-gray-400">
                        Loading messages...
                      </div>
                    </div>
                  ) : messages.length ? (
                    <div className="space-y-3">
                      {messages.map(
                        (message) => {
                          const mine =
                            message.sender
                              ?._id ===
                            user?._id;

                          return (
                            <div
                              key={
                                message._id
                              }
                              className={`flex ${
                                mine
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm sm:max-w-[70%] ${
                                  mine
                                    ? "rounded-br-md bg-indigo-600 text-white"
                                    : "rounded-bl-md border border-gray-100 bg-white text-gray-700"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words leading-6">
                                  {
                                    message.text
                                  }
                                </p>

                                <p
                                  className={`mt-1 text-right text-[10px] ${
                                    mine
                                      ? "text-indigo-200"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {new Date(
                                    message.createdAt,
                                  ).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute:
                                        "2-digit",
                                    },
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        },
                      )}

                      <div
                        ref={
                          messagesEndRef
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <MessageCircle
                          size={28}
                        />
                      </div>

                      <h3 className="font-semibold text-gray-800">
                        Start the conversation
                      </h3>

                      <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
                        Send a message to{" "}
                        {currentOtherUser?.name ||
                          "this student"}
                        .
                      </p>
                    </div>
                  )}
                </div>

                {/* ================= MESSAGE INPUT ================= */}

                <form
                  onSubmit={sendMessage}
                  className="border-t border-gray-100 bg-white p-4 sm:p-5"
                >
                  <div className="flex items-end gap-3">
                    <textarea
                      rows={1}
                      value={text}
                      onChange={(e) =>
                        setText(
                          e.target.value,
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key ===
                            "Enter" &&
                          !e.shiftKey
                        ) {
                          e.preventDefault();

                          sendMessage(e);
                        }
                      }}
                      placeholder="Type a message..."
                      className="max-h-32 min-h-[46px] flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />

                    <button
                      type="submit"
                      disabled={
                        !text.trim() ||
                        sending
                      }
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send
                        size={19}
                      />
                    </button>
                  </div>

                  <p className="mt-2 hidden text-xs text-gray-400 sm:block">
                    Press Enter to send ·
                    Shift + Enter for new line
                  </p>
                </form>
              </>
            ) : (
              /* ================= NO ACTIVE CHAT ================= */

              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
                  <MessagesSquare
                    size={36}
                  />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Your messages
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Select a conversation
                  from the left to start
                  chatting with another
                  student.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

