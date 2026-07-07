import React, { useState, useEffect, useRef } from 'react';
import type { SessionContext } from './EmotionChallenges';

export interface Message {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  isTyping: boolean;
  sessionContext?: SessionContext;
}

interface CompanionChatProps {
  chats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onSendMessage: (chatId: string, text: string) => void;
  onClose: () => void;
}

export function CompanionChat({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onSendMessage,
  onClose
}: CompanionChatProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  const contextLabel = activeChat?.sessionContext
    ? `Currently helping with: ${activeChat.sessionContext.emotion}`
    : 'Currently here with you';

  // Scroll to bottom on new message or when active chat changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, activeChat?.isTyping, activeChatId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChatId) return;

    onSendMessage(activeChatId, inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="chat-layout companion-chat-v2 fade-in">
      <div className="chat-sidebar">
        <button className="btn-new-chat" onClick={onNewChat}>
          + New Chat
        </button>
        <div className="sidebar-chats-container">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              className={`sidebar-chat-item ${chat.id === activeChatId ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <span className="chat-item-title" title={chat.title}>
                {chat.title || 'New Conversation'}
              </span>
              <button 
                className="btn-delete-chat" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                title="Delete Chat"
              >
                &times;
              </button>
            </div>
          ))}
          {chats.length === 0 && <div className="sidebar-empty-state">No conversations yet</div>}
        </div>
      </div>

      <div className="chat-main-area">
        <div className="chat-header">
          <button className="btn-back" onClick={onClose} style={{ margin: 0 }}>
            &larr; Check In
          </button>
          <div className="companion-heading">
            <div className="companion-status">
              <span className="status-dot"></span>
              <span className="companion-title">Companion</span>
              <span className="online-label">Online</span>
            </div>
            <span className="context-chip">{contextLabel}</span>
          </div>
        </div>

        {activeChat ? (
          <>
            {activeChat.sessionContext && (
              <div className="chat-context-panel">
                <span>Emotion: {activeChat.sessionContext.emotion}</span>
                <span>Exercise: {activeChat.sessionContext.exercise}</span>
                <span>Outcome: {activeChat.sessionContext.outcome}</span>
              </div>
            )}

            <div className="messages-container">
              {activeChat.messages.map(msg => (
                <div key={msg.id} className={`message-bubble-wrapper ${msg.sender}`}>
                  <div className={`message-bubble ${msg.sender}`}>
                    <p className="message-text">{msg.text}</p>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {activeChat.isTyping && (
                <div className="message-bubble-wrapper companion">
                  <div className="message-bubble companion typing">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                type="text"
                className="chat-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Write a message to your companion..."
                disabled={activeChat.isTyping}
              />
              <button 
                type="submit" 
                className="btn-send" 
                disabled={!inputValue.trim() || activeChat.isTyping}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty-state">
            <p>Start a conversation when you are ready.</p>
            <button className="btn-random" onClick={onNewChat} style={{ width: 'auto', padding: '12px 24px' }}>
              + Start a New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
