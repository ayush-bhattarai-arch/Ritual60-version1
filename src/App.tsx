import { useState, useEffect } from 'react'
import './App.css'
import { EmotionChallenges } from './components/EmotionChallenges'
import { CompanionChat, getCompanionResponse } from './components/CompanionChat'
import type { ChatSession, Message } from './components/CompanionChat'
import { UserDashboard } from './components/UserDashboard'
import { SettingsPanel } from './components/SettingsPanel'
import { UserJournal } from './components/UserJournal'
import { CommunitySpace } from './components/CommunitySpace'

type Tab = 'emotions' | 'chats' | 'journal' | 'community' | 'dashboard' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('emotions');
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [theme, setTheme] = useState<string | null>(() => {
    return localStorage.getItem('calm_space_theme');
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('calm_space_dark_mode') === 'true';
  });
  const [previousTheme, setPreviousTheme] = useState<string | null>(() => {
    return localStorage.getItem('calm_space_previous_theme');
  });

  useEffect(() => {
    document.body.className = '';
    
    // Save dark mode state
    localStorage.setItem('calm_space_dark_mode', String(isDarkMode));

    if (isDarkMode) {
      document.body.classList.add('display-dark');
    } else if (theme) {
      document.body.classList.add(`theme-${theme}`);
    }

    if (theme) {
      localStorage.setItem('calm_space_theme', theme);
    } else {
      localStorage.removeItem('calm_space_theme');
    }
  }, [theme, isDarkMode]);

  const handleToggleDarkMode = () => {
    if (!isDarkMode) {
      // Entering Dark Display: clear pastel theme but remember it
      if (theme) {
        setPreviousTheme(theme);
        localStorage.setItem('calm_space_previous_theme', theme);
      }
      setTheme(null);
      setIsDarkMode(true);
    } else {
      // Entering Light Display: restore previous theme if any
      const savedPrev = localStorage.getItem('calm_space_previous_theme');
      if (savedPrev) {
        setTheme(savedPrev);
      } else {
        setTheme(null);
      }
      setIsDarkMode(false);
    }
  };

  const handleThemeChange = (newTheme: string | null) => {
    if (isDarkMode) return; // Prevent selection when dark display is active
    setTheme(newTheme);
    if (newTheme) {
      setPreviousTheme(newTheme);
      localStorage.setItem('calm_space_previous_theme', newTheme);
    } else {
      setPreviousTheme(null);
      localStorage.removeItem('calm_space_previous_theme');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const text = inputValue.trim();
      const newChatId = Math.random().toString(36).substring(2, 9);
      const newChat: ChatSession = {
        id: newChatId,
        title: text.length > 25 ? text.substring(0, 22) + '...' : text,
        messages: [
          {
            id: Math.random().toString(36).substring(2, 9),
            sender: 'user',
            text,
            timestamp: new Date()
          }
        ],
        isTyping: true
      };

      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChatId);
      setInputValue('');
      setActiveTab('chats');

      // Trigger companion response
      setTimeout(() => {
        setChats(prev => prev.map(chat => {
          if (chat.id === newChatId) {
            const replyText = getCompanionResponse(text);
            return {
              ...chat,
              isTyping: false,
              messages: [
                ...chat.messages,
                {
                  id: Math.random().toString(36).substring(2, 9),
                  sender: 'companion',
                  text: replyText,
                  timestamp: new Date()
                }
              ]
            };
          }
          return chat;
        }));
      }, 1200);
    }
  };

  const handleNewChat = () => {
    const newChatId = Math.random().toString(36).substring(2, 9);
    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Conversation',
      messages: [
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'companion',
          text: 'Hello! I am your companion. How can I support you today?',
          timestamp: new Date()
        }
      ],
      isTyping: false
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    setActiveTab('chats');
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => {
      const updated = prev.filter(c => c.id !== chatId);
      if (activeChatId === chatId) {
        setActiveChatId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  };

  const handleSendMessage = (chatId: string, text: string) => {
    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const title = chat.title === 'New Conversation' 
          ? (text.length > 25 ? text.substring(0, 22) + '...' : text)
          : chat.title;
        return {
          ...chat,
          title,
          messages: [...chat.messages, userMessage],
          isTyping: true
        };
      }
      return chat;
    }));

    setTimeout(() => {
      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          const replyText = getCompanionResponse(text);
          const companionMessage: Message = {
            id: Math.random().toString(36).substring(2, 9),
            sender: 'companion',
            text: replyText,
            timestamp: new Date()
          };
          return {
            ...chat,
            messages: [...chat.messages, companionMessage],
            isTyping: false
          };
        }
        return chat;
      }));
    }, 1200 + Math.random() * 400);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'emotions':
        return (
          <div className="dashboard-layout">
            <div className="dashboard-main">
              <EmotionChallenges />
            </div>

            <hr className="divider" />

            <div className="companion-container">
              <label className="companion-label" htmlFor="companion-chat">Talk To Your Companion</label>
              <div className="companion-input-wrapper">
                <input 
                  id="companion-chat"
                  className="companion-input" 
                  type="text" 
                  placeholder="Type your message and press Enter to chat..." 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>
            </div>
          </div>
        );
      case 'chats':
        return (
          <CompanionChat 
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            onSendMessage={handleSendMessage}
            onClose={() => setActiveTab('emotions')} 
          />
        );
      case 'journal':
        return <UserJournal />;
      case 'community':
        return <CommunitySpace />;
      case 'dashboard':
        return <UserDashboard />;
      case 'settings':
        return (
          <SettingsPanel 
            theme={theme}
            onThemeChange={handleThemeChange}
            onClearChats={() => {
              setChats([]);
              setActiveChatId(null);
            }} 
            isDarkMode={isDarkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-card">
      <nav className="top-navbar">
        <div className="nav-logo">✨ Calm Space</div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            className={`nav-link ${activeTab === 'emotions' ? 'active' : ''}`}
            onClick={() => setActiveTab('emotions')}
          >
            Emotions
          </button>
          <button 
            className={`nav-link ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button 
            className={`nav-link ${activeTab === 'journal' ? 'active' : ''}`}
            onClick={() => setActiveTab('journal')}
          >
            Journal
          </button>
          <button 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-link ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            Community
          </button>
          <button 
            className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
      </nav>

      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  )
}

export default App

