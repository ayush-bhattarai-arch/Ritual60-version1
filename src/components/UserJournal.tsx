import { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export interface JournalEntry {
  id: string;
  title: string;
  content: string; // HTML string from Quill
  date: string; // yyyy-mm-dd
}

interface IncomingJournalPrompt {
  id: string;
  title: string;
  prompt: string;
}

interface UserJournalProps {
  incomingPrompt?: IncomingJournalPrompt | null;
}

export function UserJournal({ incomingPrompt }: UserJournalProps) {
  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('calm_space_journals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'welcome-entry',
        title: 'Welcome to Your Private Journal',
        content: '<h2>A Safe Space for Your Thoughts</h2><p>This is your private digital journal. Everything you write here remains stored securely on your browser\'s local storage, keeping it private to you.</p><p>Feel free to express yourself freely. You can format your entries using the toolbar options above, search your history, or pick dates on the sidebar to find past reflections.</p>',
        date: new Date().toISOString().split('T')[0]
      }
    ];
  });

  const [activeEntryId, setActiveEntryId] = useState<string | null>(() => {
    return journals.length > 0 ? journals[0].id : null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const lastPromptIdRef = useRef<string | null>(null);

  const activeEntry = journals.find(j => j.id === activeEntryId);

  useEffect(() => {
    if (!incomingPrompt || lastPromptIdRef.current === incomingPrompt.id) return;

    lastPromptIdRef.current = incomingPrompt.id;
    const newEntry: JournalEntry = {
      id: incomingPrompt.id,
      title: incomingPrompt.title,
      content: `<h2>${escapeHtml(incomingPrompt.prompt)}</h2><p><br></p>`,
      date: new Date().toISOString().split('T')[0]
    };

    setJournals(prev => [newEntry, ...prev]);
    setActiveEntryId(newEntry.id);
  }, [incomingPrompt]);

  // Sync journals with localStorage
  useEffect(() => {
    localStorage.setItem('calm_space_journals', JSON.stringify(journals));
  }, [journals]);

  // Initialize Quill Editor
  useEffect(() => {
    if (editorContainerRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorContainerRef.current, {
        theme: 'snow',
        placeholder: 'Begin writing your thoughts here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['clean']
          ]
        }
      });

      // Sync editor change to React state (for auto-saving)
      quillInstance.current.on('text-change', () => {
        const currentHtml = quillInstance.current?.root.innerHTML || '';
        setJournals(prevJournals =>
          prevJournals.map(entry => {
            if (entry.id === activeEntryId) {
              return { ...entry, content: currentHtml };
            }
            return entry;
          })
        );
      });
    }
  }, [activeEntryId]);

  // Load new active entry content into editor when selection changes
  useEffect(() => {
    if (quillInstance.current && activeEntry) {
      const editorHtml = quillInstance.current.root.innerHTML;
      if (activeEntry.content !== editorHtml) {
        quillInstance.current.root.innerHTML = activeEntry.content || '';
      }
    }
  }, [activeEntryId]);

  const handleNewEntry = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    const newEntry: JournalEntry = {
      id: newId,
      title: 'Untitled Entry',
      content: '<p></p>',
      date: new Date().toISOString().split('T')[0]
    };
    setJournals(prev => [newEntry, ...prev]);
    setActiveEntryId(newId);
  };

  const handleDeleteEntry = (id: string) => {
    setJournals(prev => {
      const updated = prev.filter(j => j.id !== id);
      if (activeEntryId === id) {
        setActiveEntryId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  };

  const handleTitleChange = (newTitle: string) => {
    setJournals(prev =>
      prev.map(entry => {
        if (entry.id === activeEntryId) {
          return { ...entry, title: newTitle || 'Untitled Entry' };
        }
        return entry;
      })
    );
  };

  const handleDateChange = (newDate: string) => {
    setJournals(prev =>
      prev.map(entry => {
        if (entry.id === activeEntryId) {
          return { ...entry, date: newDate };
        }
        return entry;
      })
    );
  };

  // Filters logic
  const filteredEntries = journals.filter(entry => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = dateFilter ? entry.date === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="chat-layout fade-in">
      {/* Sidebar for Journal Management */}
      <div className="chat-sidebar" style={{ width: '220px' }}>
        <button className="btn-new-chat" onClick={handleNewEntry}>
          + New Entry
        </button>

        <div className="journal-filters">
          <input
            type="text"
            className="chat-input"
            style={{ padding: '8px 12px', fontSize: '0.85rem', marginBottom: '8px' }}
            placeholder="Search entries..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <input
              type="date"
              className="chat-input"
              style={{ padding: '6px 8px', fontSize: '0.85rem', flex: 1 }}
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button 
                className="btn-back" 
                style={{ padding: '6px 10px', fontSize: '0.8rem', margin: 0 }}
                onClick={() => setDateFilter('')}
                title="Clear date filter"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        <div className="sidebar-chats-container" style={{ marginTop: '12px' }}>
          {filteredEntries.map(entry => (
            <div
              key={entry.id}
              className={`sidebar-chat-item ${entry.id === activeEntryId ? 'active' : ''}`}
              onClick={() => setActiveEntryId(entry.id)}
            >
              <div className="chat-item-title" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{entry.title}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{entry.date}</span>
              </div>
              <button
                className="btn-delete-chat"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteEntry(entry.id);
                }}
                title="Delete Entry"
              >
                &times;
              </button>
            </div>
          ))}
          {filteredEntries.length === 0 && (
            <div className="sidebar-empty-state" style={{ fontSize: '0.8rem' }}>No entries found</div>
          )}
        </div>
      </div>

      {/* Main Quill Editor Area */}
      <div className="chat-main-area">
        {activeEntry ? (
          <div className="journal-editor-container">
            <div className="journal-editor-header">
              <input
                type="text"
                className="journal-title-input"
                value={activeEntry.title === 'Untitled Entry' ? '' : activeEntry.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Untitled Entry"
              />
              <input
                type="date"
                className="journal-date-input"
                value={activeEntry.date}
                onChange={e => handleDateChange(e.target.value)}
              />
            </div>
            
            <div className="quill-editor-wrapper">
              <div ref={editorContainerRef} className="quill-editor-inner"></div>
            </div>
          </div>
        ) : (
          <div className="chat-empty-state">
            <p>Select a journal entry from the sidebar or start a new one to begin writing.</p>
            <button className="btn-random" onClick={handleNewEntry} style={{ width: 'auto', padding: '12px 24px' }}>
              + Create a Journal Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
