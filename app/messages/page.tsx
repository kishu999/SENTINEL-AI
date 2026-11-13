"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Paperclip,
  Search,
  MessageSquare,
  CheckCheck,
  Check,
  Sparkles,
  Phone,
  Video,
  Info,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Conversation, Message, Profile } from "@/types/database";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function MessagesContent() {
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get("id");

  const currentUser = dataService.getCurrentUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConvId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = () => {
    const list = dataService.getConversations(currentUser.id);
    setConversations(list);
    if (!activeConvId && list.length > 0) {
      setActiveConvId(list[0].id);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentUser.id]);

  useEffect(() => {
    if (activeConvId) {
      setMessages(dataService.getMessages(activeConvId));
      scrollToBottom();
    }
  }, [activeConvId]);

  useEffect(() => {
    const handleNewMessage = (e: any) => {
      const msg = e.detail as Message;
      if (activeConvId && msg.conversation_id === activeConvId) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
      loadConversations();
    };

    window.addEventListener("skillconnect:message", handleNewMessage);
    return () => window.removeEventListener("skillconnect:message", handleNewMessage);
  }, [activeConvId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const activeConversation = conversations.find((c) => c.id === activeConvId);
  const otherParticipant = activeConversation?.participants?.find(
    (p) => p.id !== currentUser.id
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConvId) return;

    dataService.sendMessage(activeConvId, inputMessage.trim());
    setInputMessage("");
    setMessages(dataService.getMessages(activeConvId));
    loadConversations();
    scrollToBottom();
  };

  const filteredConversations = conversations.filter((c) => {
    const other = c.participants?.find((p) => p.id !== currentUser.id);
    return (
      other?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.task_title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-6xl">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card overflow-hidden h-[750px] flex">
        {/* Conversations Sidebar (4 cols) */}
        <div className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const other = conv.participants?.find((p) => p.id !== currentUser.id);
                const isActive = conv.id === activeConvId;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                      isActive
                        ? "bg-blue-50/80 dark:bg-slate-800"
                        : "hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <img
                      src={other?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"}
                      alt={other?.full_name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {other?.full_name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatRelativeTime(conv.last_message_at)}
                        </span>
                      </div>
                      {conv.task_title && (
                        <div className="text-[10px] font-semibold text-blue-600 truncate">
                          {conv.task_title}
                        </div>
                      )}
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {conv.last_message_snippet || "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Message Thread Panel (8 cols) */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
          {activeConversation && otherParticipant ? (
            <>
              {/* Active Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={otherParticipant.avatar_url}
                    alt={otherParticipant.full_name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {otherParticipant.full_name}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      {otherParticipant.university} • {otherParticipant.course}
                    </div>
                  </div>
                </div>

                {activeConversation.task_title && (
                  <Badge variant="purple" className="text-xs max-w-xs truncate">
                    {activeConversation.task_title}
                  </Badge>
                )}
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isMine = msg.sender_id === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? "bg-blue-600 text-white rounded-br-none shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {formatRelativeTime(msg.created_at)}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${otherParticipant.full_name}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <Button type="submit" size="icon" className="rounded-2xl h-11 w-11 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <MessageSquare className="h-10 w-10 text-slate-300" />
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="container p-12 text-center text-sm text-slate-500">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
