import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Challenge } from './EmotionChallenges';

interface ActiveChallengeProps {
  challenge: Challenge;
  onClose: () => void;
}

export function ActiveChallenge({ challenge, onClose }: ActiveChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    setTimeLeft(60);
    setIsPaused(false);
  };

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Get active step index based on elapsed seconds
  const elapsed = 60 - timeLeft;
  const steps = challenge.steps || [];
  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);

  const getActiveStepDetails = () => {
    if (steps.length === 0) {
      return { index: 0, text: challenge.instruction, timeLeftForStep: timeLeft, nextText: '' };
    }

    if (challenge.loop) {
      const cycleTime = elapsed % totalDuration;
      let accumulated = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulated += steps[i].duration;
        if (cycleTime < accumulated) {
          const stepTimeLeft = accumulated - cycleTime;
          const nextIndex = (i + 1) % steps.length;
          return {
            index: i,
            text: steps[i].text,
            timeLeftForStep: stepTimeLeft,
            nextText: steps[nextIndex].text
          };
        }
      }
      return { index: 0, text: steps[0].text, timeLeftForStep: steps[0].duration, nextText: steps[1]?.text || '' };
    } else {
      let accumulated = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulated += steps[i].duration;
        if (elapsed < accumulated) {
          const stepTimeLeft = accumulated - elapsed;
          const nextText = i + 1 < steps.length ? steps[i + 1].text : 'Completion';
          return {
            index: i,
            text: steps[i].text,
            timeLeftForStep: stepTimeLeft,
            nextText
          };
        }
      }
      const lastIdx = steps.length - 1;
      return { index: lastIdx, text: steps[lastIdx].text, timeLeftForStep: 0, nextText: 'Completion' };
    }
  };

  const { index: activeStepIndex, text: activeStepText, timeLeftForStep, nextText } = getActiveStepDetails();
  const progressPercent = ((60 - timeLeft) / 60) * 100;

  const renderModalContent = () => {
    if (timeLeft === 0) {
      return (
        <div className="completion-screen fade-in">
          <div className="completion-content">
            <span className="completion-emoji" aria-hidden="true"></span>
            <h2>Exercise Completed!</h2>
            <p className="intro-text">Great job taking a moment for yourself. Hopefully, you feel a bit more grounded now.</p>
            <div className="completion-buttons">
              <button className="btn-complete" onClick={onClose}>
                Finish Exercise
              </button>
              <button className="btn-back" onClick={handleRestart} style={{ width: '100%', marginTop: '12px', marginBottom: 0 }}>
                Repeat Exercise
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="challenge-header-area">
          <h3>{challenge.title}</h3>
          <p className="challenge-goal"><strong>Goal:</strong> {challenge.description}</p>
        </div>

        {/* Timer Widget */}
        <div className="timer-widget">
          <div className="timer-number">{formatTime(timeLeft)}</div>
          
          <div className="timer-progress-bg">
            <div 
              className="timer-progress-fill" 
              style={{ 
                width: `${progressPercent}%`,
                transition: timeLeft === 60 ? 'none' : 'width 1s linear'
              }}
            ></div>
          </div>

          <div className="timer-controls-row">
            <button 
              className={`btn-control ${isPaused ? 'btn-paused' : ''}`} 
              onClick={handleTogglePause}
              title={isPaused ? 'Resume exercise' : 'Pause exercise'}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            
            <button 
              className="btn-control btn-restart" 
              onClick={handleRestart}
              title="Restart exercise timer"
            >
              Restart
            </button>
            
            <button 
              className="btn-control btn-skip" 
              onClick={onClose}
              title="Skip timer and close exercise"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Dynamic Stepper Display */}
        <div className="stepper-widget">
          <div className="stepper-header">
            <span className="stepper-badge">
              Step {activeStepIndex + 1} of {steps.length} {challenge.loop && '(Repeating)'}
            </span>
            {timeLeftForStep > 0 && (
              <span className="step-countdown">
                {timeLeftForStep}s
              </span>
            )}
          </div>
          <p className="stepper-active-text">{activeStepText}</p>
          {nextText && nextText !== 'Completion' && (
            <div className="stepper-next-preview">
              <span className="next-label">Next:</span> {nextText}
            </div>
          )}
        </div>
      </>
    );
  };

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="challenge-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose} title="Close exercise modal">
          &times;
        </button>
        {renderModalContent()}
      </div>
    </div>,
    document.body
  );
}
