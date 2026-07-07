interface SettingsPanelProps {
  theme: string | null;
  onThemeChange: (theme: string | null) => void;
  onClearChats: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function SettingsPanel({ theme, onThemeChange, onClearChats, isDarkMode = false }: SettingsPanelProps) {
  const themesList = [
    { id: 'moonglow', name: 'Moon Glow', gradient: 'linear-gradient(135deg, #fffbeb, #fde68a)', previewColor: '#78350f' },
    { id: 'fire', name: 'Fire', gradient: 'linear-gradient(135deg, #ffedd5, #fecdd3)', previewColor: '#a63a3a' }, // Peach to Rose preview
    { id: 'stargaze', name: 'Star Gaze', gradient: 'linear-gradient(135deg, #f5f3ff, #ddd6fe)', previewColor: '#4c1d95' },
    { id: 'waterflow', name: 'Water Flow', gradient: 'linear-gradient(135deg, #ecfeff, #a5f3fc)', previewColor: '#155e75' }
  ];

  return (
    <div className="settings-view fade-in">
      <h2>Application Settings</h2>
      <p className="intro-text">Personalize your calm space experience.</p>
      
      <div className="settings-section">
        <h3>User Profile</h3>
        <div className="profile-card">
          <div className="profile-avatar">AC</div>
          <div className="profile-details">
            <h4>Alex Carter</h4>
            <p>Member since July 2026</p>
          </div>
        </div>
      </div>

      {/* Theme Selection Center */}
      <div className="settings-section">
        <h3>Theme Selection</h3>
        <p className="intro-text" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
          Choose a theme to alter the color palette of the application (affects all tabs and community pages).
        </p>
        
        {isDarkMode && (
          <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            ⚠️ Themes are disabled while Dark Display is active. Turn off Dark Display in the nav bar to use pastel themes.
          </p>
        )}

        <div 
          className="theme-grid" 
          style={{ 
            opacity: isDarkMode ? 0.4 : 1, 
            pointerEvents: isDarkMode ? 'none' : 'auto' 
          }}
        >
          {themesList.map(t => (
            <div 
              key={t.id} 
              className={`theme-card-option ${theme === t.id ? 'active' : ''}`}
              onClick={() => !isDarkMode && onThemeChange(t.id)}
              title={isDarkMode ? "Themes are disabled in Dark Mode" : `Switch to ${t.name} theme`}
            >
              <div 
                className="theme-card-preview" 
                style={{ background: t.gradient }}
              >
                <div className="theme-preview-dot" style={{ backgroundColor: t.previewColor }}></div>
              </div>
              <span className="theme-card-name">{t.name}</span>
            </div>
          ))}
        </div>
        
        <button 
          className="btn-back" 
          style={{ 
            display: 'block', 
            margin: '16px auto 0 auto', 
            width: 'auto', 
            padding: '10px 24px',
            opacity: isDarkMode ? 0.4 : 1,
            pointerEvents: isDarkMode ? 'none' : 'auto'
          }}
          onClick={() => !isDarkMode && onThemeChange(null)}
          title={isDarkMode ? "Themes are disabled in Dark Mode" : "Reset to default application theme"}
          disabled={isDarkMode}
        >
          Remove Theme
        </button>
      </div>

      <div className="settings-section">
        <h3>Preferences</h3>
        <div className="settings-options">
          <div className="settings-row">
            <div className="setting-info">
              <h4>Daily Reminders</h4>
              <p>Get subtle browser notifications to take a breath</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked={true} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-row">
            <div className="setting-info">
              <h4>Soothing Soundboard</h4>
              <p>Play soft rain in the background during exercises</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked={true} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>
        <div className="settings-options">
          <div className="settings-row">
            <div className="setting-info">
              <h4>Reset Conversation History</h4>
              <p>Permanently delete all chats with your companion</p>
            </div>
            <button className="btn-back" onClick={onClearChats} style={{ color: 'var(--angry-text)', borderColor: 'var(--angry-border)', marginBottom: 0 }}>
              Clear Chats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
