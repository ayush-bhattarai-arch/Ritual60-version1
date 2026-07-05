import React, { useState, useEffect, useRef } from 'react';

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

export const MOCK_COMPANION_RESPONSES = [
  "I hear you, and I'm right here with you. Take a slow, comforting breath. I'm listening.",
  "Thank you for sharing that with me. It is completely valid to feel this way. Let it out.",
  "That sounds like a lot to carry. Please know you don't have to navigate it alone. I'm here for you.",
  "I'm listening closely. Remember to be gentle with yourself. You're doing the best you can.",
  "I appreciate you opening up. Let's take it one step at a time. What else is on your mind?",
  "I'm here for you, no matter what you're feeling. Take all the time you need to write it out.",
  "It is okay to feel overwhelmed or tired. Just being here and acknowledging it is a brave step."
];

const KEYWORD_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['angry', 'mad', 'furious', 'pissed', 'annoyed', 'hate', 'frustrated'],
    response: "It's completely okay to feel angry. It's a natural signal that something needs attention. Let's take a deep breath together. I'm here to listen to your frustrations."
  },
  {
    keywords: ['sad', 'cry', 'depressed', 'lonely', 'hurt', 'pain', 'grief'],
    response: "I'm so sorry you're feeling sad right now. It can feel really heavy, but I'm here with you. Allow yourself to feel, and know that you are not alone."
  },
  {
    keywords: ['anxious', 'panic', 'scared', 'worry', 'afraid', 'stressed', 'nervous'],
    response: "I hear how anxious you feel. Let's press pause for a moment. Feel the ground beneath your feet. You are safe here with me. Let's breathe slowly."
  },
  {
    keywords: ['tired', 'exhausted', 'give up', 'done', 'sleepy'],
    response: "You've been holding onto a lot. It is okay to be tired and just rest. You don't have to figure everything out right this second. Rest with me for a bit."
  }
];

export const getCompanionResponse = (userText: string): string => {
  const textLower = userText.toLowerCase();
  for (const item of KEYWORD_RESPONSES) {
    if (item.keywords.some(keyword => textLower.includes(keyword))) {
      return item.response;
    }
  }
  const randomIndex = Math.floor(Math.random() * MOCK_COMPANION_RESPONSES.length);
  return MOCK_COMPANION_RESPONSES[randomIndex];
};

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
    <div className="chat-layout fade-in">
      {/* Sidebar for Chat Management */}
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
          {chats.length === 0 && (
            <div className="sidebar-empty-state">No conversations yet</div>
          )}
        </div>
      </div>

      {/* Main Chat Thread Area */}
      <div className="chat-main-area">
        <div className="chat-header">
          <button className="btn-back" onClick={onClose} style={{ margin: 0 }}>
            &larr; Home
          </button>
          <div className="companion-status">
            <span className="status-dot"></span>
            <span className="companion-title">Companion</span>
          </div>
        </div>

        {activeChat ? (
          <>
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
            <p>Select a conversation from the sidebar or start a new one to chat with your companion.</p>
            <button className="btn-random" onClick={onNewChat} style={{ width: 'auto', padding: '12px 24px' }}>
              + Start a New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
