import { useState, useEffect } from 'react'
import './App.css'
import { EmotionChallenges } from './components/EmotionChallenges'
import type { SessionContext } from './components/EmotionChallenges'
import { CompanionChat } from './components/CompanionChat'
import type { ChatSession, Message } from './components/CompanionChat'
import { getCompanionResponse } from './components/companionResponses'
import { SettingsPanel } from './components/SettingsPanel'
import { UserJournal } from './components/UserJournal'

type Tab = 'checkin' | 'chats' | 'journal' | 'settings';

export interface JournalPrompt {
  id: string;
  title: string;
  prompt: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('checkin');
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(() => localStorage.getItem('calm_space_theme'));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('calm_space_dark_mode') === 'true');
  const [, setPreviousTheme] = useState<string | null>(() => localStorage.getItem('calm_space_previous_theme'));
  const [journalPrompt, setJournalPrompt] = useState<JournalPrompt | null>(null);

  useEffect(() => {
    document.body.className = '';
    localStorage.setItem('calm_space_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.body.classList.add('display-dark');
    } else if (theme) {
      document.body.classList.add(`theme-${theme}`);
    }
    if (theme) localStorage.setItem('calm_space_theme', theme);
    else localStorage.removeItem('calm_space_theme');
  }, [theme, isDarkMode]);

  const handleToggleDarkMode = () => {
    if (!isDarkMode) {
      if (theme) { setPreviousTheme(theme); localStorage.setItem('calm_space_previous_theme', theme); }
      setTheme(null);
      setIsDarkMode(true);
    } else {
      const savedPrev = localStorage.getItem('calm_space_previous_theme');
      if (savedPrev) setTheme(savedPrev); else setTheme(null);
      setIsDarkMode(false);
    }
  };

  const handleThemeChange = (newTheme: string | null) => {
    if (isDarkMode) return;
    setTheme(newTheme);
    if (newTheme) { setPreviousTheme(newTheme); localStorage.setItem('calm_space_previous_theme', newTheme); }
    else { setPreviousTheme(null); localStorage.removeItem('calm_space_previous_theme'); }
  };

  const openChatWithContext = (context: SessionContext) => {
    const newChatId = Math.random().toString(36).substring(2, 9);
    const openingText = createOpeningMessage(context);

    const newChat: ChatSession = {
      id: newChatId,
      title: `Feeling ${context.emotion}`,
      messages: [{ id: Math.random().toString(36).substring(2, 9), sender: 'companion', text: openingText, timestamp: new Date() }],
      isTyping: false,
      sessionContext: context
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    setActiveTab('chats');
  };

  const openJournalWithContext = (context: SessionContext) => {
    setJournalPrompt({
      id: Math.random().toString(36).substring(2, 9),
      title: `${context.emotion} Reflection`,
      prompt: createJournalPrompt(context)
    });
    setActiveTab('journal');
  };

  const handleNewChat = () => {
    const newChatId = Math.random().toString(36).substring(2, 9);
    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Conversation',
      messages: [{ id: Math.random().toString(36).substring(2, 9), sender: 'companion', text: 'I am here with you. What feels most present right now?', timestamp: new Date() }],
      isTyping: false
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    setActiveTab('chats');
  };

  const handleSelectChat = (chatId: string) => setActiveChatId(chatId);

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => {
      const updated = prev.filter(c => c.id !== chatId);
      if (activeChatId === chatId) setActiveChatId(updated.length > 0 ? updated[0].id : null);
      return updated;
    });
  };

  const handleSendMessage = (chatId: string, text: string) => {
    const userMessage: Message = { id: Math.random().toString(36).substring(2, 9), sender: 'user', text, timestamp: new Date() };
    setChats(prev => prev.map(chat => {
      if (chat.id !== chatId) return chat;
      const title = chat.title === 'New Conversation' ? (text.length > 25 ? text.substring(0, 22) + '...' : text) : chat.title;
      return { ...chat, title, messages: [...chat.messages, userMessage], isTyping: true };
    }));
    setTimeout(() => {
      setChats(prev => prev.map(chat => {
        if (chat.id !== chatId) return chat;
        const companionMessage: Message = { id: Math.random().toString(36).substring(2, 9), sender: 'companion', text: getCompanionResponse(text), timestamp: new Date() };
        return { ...chat, messages: [...chat.messages, companionMessage], isTyping: false };
      }));
    }, 1200 + Math.random() * 400);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'checkin':
        return <EmotionChallenges onOpenChat={openChatWithContext} onOpenJournal={openJournalWithContext} />;
      case 'chats':
        return (
          <CompanionChat
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            onSendMessage={handleSendMessage}
            onClose={() => setActiveTab('checkin')}
          />
        );
      case 'journal':
        return <UserJournal incomingPrompt={journalPrompt} />;
      case 'settings':
        return (
          <SettingsPanel
            theme={theme}
            onThemeChange={handleThemeChange}
            onClearChats={() => { setChats([]); setActiveChatId(null); }}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`app-card ${activeTab === 'checkin' ? 'support-mode' : ''}`}>
      <nav className="top-navbar">
        <div className="nav-logo">Calm Space</div>
        <div className="nav-links">
          <div className="nav-group">
            <span className="nav-group-label">Support</span>
            <div className="nav-group-items">
              <button className={`nav-link ${activeTab === 'checkin' ? 'active' : ''}`} onClick={() => setActiveTab('checkin')}>Check In</button>
              <button className={`nav-link ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')}>Conversations</button>
            </div>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Reflect</span>
            <div className="nav-group-items">
              <button className={`nav-link ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>Journal</button>
            </div>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Profile</span>
            <div className="nav-group-items">
              <button className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
}

function createOpeningMessage(context: SessionContext) {
  if (context.exercise === 'None') {
    return `You chose to talk instead of doing an exercise. What is making today feel ${context.emotion.toLowerCase()}?`;
  }

  if (context.outcome === 'Still Struggling') {
    return `I noticed the ${context.exercise} exercise did not help much. Do you want to tell me what's making today feel ${context.emotion.toLowerCase()}?`;
  }

  if (context.outcome === 'Better') {
    return `I am glad there is a little more room after ${context.exercise}. Do you want to talk about what was behind the ${context.emotion.toLowerCase()} feeling?`;
  }

  return `You tried ${context.exercise} while feeling ${context.emotion.toLowerCase()}. What feels most present now?`;
}

function createJournalPrompt(context: SessionContext) {
  const emotion = context.emotion.toLowerCase();

  if (context.exercise === 'None') {
    return `You mentioned feeling ${emotion} earlier. What's been taking up the most space in your mind today?`;
  }

  if (context.outcome === 'Better') {
    return `You mentioned feeling ${emotion} earlier, and ${context.exercise} helped a little. What shifted, even slightly?`;
  }

  if (context.outcome === 'Still Struggling') {
    return `You mentioned feeling ${emotion} earlier. The ${context.exercise} exercise did not bring much relief yet. What's still asking for attention?`;
  }

  return `You mentioned feeling ${emotion} earlier. What's been taking up the most space in your mind today?`;
}

export default App
