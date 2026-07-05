export function UserDashboard() {
  return (
    <div className="dashboard-view fade-in">
      <h2>Your Calm Dashboard</h2>
      <p className="intro-text">Here is a summary of your emotional well-being and exercise history.</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-emoji">🧘</span>
          <div className="stat-info">
            <h3>85%</h3>
            <p>Overall Calmness</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">🔥</span>
          <div className="stat-info">
            <h3>5 Days</h3>
            <p>Daily Streak</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-emoji" aria-hidden="true"></span>
          <div className="stat-info">
            <h3>12</h3>
            <p>Completed Exercises</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-emoji" aria-hidden="true"></span>
          <div className="stat-info">
            <h3>8</h3>
            <p>Companion Sessions</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content-split">
        {/* Left Side: Emotion breakdown */}
        <div className="dashboard-panel">
          <h3>Emotion Activity</h3>
          <p>Breakdown of check-ins this week:</p>
          <div className="progress-bars-container">
            <div className="progress-item">
              <div className="progress-label">
                <span>Sadness</span>
                <span>35%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill sad" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>Anger</span>
                <span>25%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill angry" style={{ width: '25%' }}>
                </div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>Panic</span>
                <span>20%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill panic" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>Depression</span>
                <span>20%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill depr" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Inspirational Quote & Recommendations */}
        <div className="dashboard-panel quote-panel">
          <h3>Daily Inspiration</h3>
          <blockquote className="inspiration-quote">
            "You don't have to control your thoughts. You just have to stop letting them control you."
            <cite>— Dan Millman</cite>
          </blockquote>
          <div className="recommendation-box">
            <h4>Recommended Exercise:</h4>
            <p><strong>Box Breathing (4-4-4-4)</strong> to help ground your energy today.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
