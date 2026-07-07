import { useEffect, useMemo, useState } from 'react';

type FlowStep = 'emotion' | 'exercise' | 'session' | 'reflection' | 'supportChoice';
type Emotion = 'Sad' | 'Anxious' | 'Overwhelmed' | 'Frustrated';
type ReflectionOutcome = 'Better' | 'About The Same' | 'Still Struggling' | 'Talk Instead';

export interface ExerciseStep {
  text: string;
  duration: number;
}

export interface Challenge {
  title: string;
  description: string;
  instruction?: string;
  durationLabel: string;
  loop?: boolean;
  steps: ExerciseStep[];
}

export interface SessionContext {
  emotion: Emotion;
  exercise: string;
  outcome: ReflectionOutcome;
}

interface EmotionOption {
  emotion: Emotion;
  icon: string;
  description: string;
  reassurance: string;
}

interface EmotionChallengesProps {
  onOpenChat: (context: SessionContext) => void;
  onOpenJournal: (context: SessionContext) => void;
}

const EMOTIONS: EmotionOption[] = [
  {
    emotion: 'Sad',
    icon: 'S',
    description: 'Feeling emotionally heavy today',
    reassurance: "It's okay to feel sad."
  },
  {
    emotion: 'Anxious',
    icon: 'A',
    description: "Your mind won't slow down",
    reassurance: "It's okay to feel anxious."
  },
  {
    emotion: 'Overwhelmed',
    icon: 'O',
    description: 'Too much is happening at once',
    reassurance: "It's okay to feel overwhelmed."
  },
  {
    emotion: 'Frustrated',
    icon: 'F',
    description: 'Something feels blocked or unfair',
    reassurance: "It's okay to feel frustrated."
  }
];

const EMOTION_CHALLENGES: Record<Emotion, Challenge[]> = {
  Sad: [
    {
      title: 'Gentle Breathing',
      description: 'Slow the body down without forcing a mood change.',
      durationLabel: '60 sec',
      loop: true,
      steps: [
        { text: 'Inhale softly.', duration: 4 },
        { text: 'Let the breath rest.', duration: 3 },
        { text: 'Exhale slowly.', duration: 6 },
        { text: 'Let your shoulders drop.', duration: 2 }
      ]
    },
    {
      title: 'Small Comfort',
      description: 'Notice one thing nearby that feels steady or kind.',
      durationLabel: '60 sec',
      steps: [
        { text: 'Look for one small comforting thing around you.', duration: 20 },
        { text: 'Name why it feels safe, warm, or familiar.', duration: 20 },
        { text: 'Take that comfort in with one slow breath.', duration: 20 }
      ]
    },
    {
      title: 'Self-Compassion',
      description: 'Offer yourself a softer sentence for this moment.',
      durationLabel: '60 sec',
      steps: [
        { text: 'Place a hand somewhere that feels grounding.', duration: 15 },
        { text: 'Say: it makes sense that this feels heavy.', duration: 20 },
        { text: 'Say: I can move through this one breath at a time.', duration: 25 }
      ]
    },
    {
      title: 'Talk Instead',
      description: 'Skip the exercise and start with your companion.',
      durationLabel: 'Now',
      steps: []
    }
  ],
  Anxious: [
    {
      title: 'Box Breathing',
      description: 'Use a steady rhythm to give your body a calmer signal.',
      durationLabel: '60 sec',
      loop: true,
      steps: [
        { text: 'Inhale for four.', duration: 4 },
        { text: 'Hold for four.', duration: 4 },
        { text: 'Exhale for four.', duration: 4 },
        { text: 'Hold empty for four.', duration: 4 }
      ]
    },
    {
      title: 'Grounding',
      description: 'Bring attention back to the room around you.',
      durationLabel: '60 sec',
      steps: [
        { text: 'Name five things you can see.', duration: 12 },
        { text: 'Name four things you can feel.', duration: 12 },
        { text: 'Name three things you can hear.', duration: 12 },
        { text: 'Name two things you can smell.', duration: 12 },
        { text: 'Name one thing you can taste.', duration: 12 }
      ]
    },
    {
      title: 'Body Scan',
      description: 'Release small pockets of tension.',
      durationLabel: '60 sec',
      steps: [
        { text: 'Notice your jaw and soften it.', duration: 15 },
        { text: 'Notice your shoulders and let them lower.', duration: 15 },
        { text: 'Notice your hands and unclench them.', duration: 15 },
        { text: 'Notice your feet touching the ground.', duration: 15 }
      ]
    },
    {
      title: 'Talk Instead',
      description: 'Skip the exercise and start with your companion.',
      durationLabel: 'Now',
      steps: []
    }
  ],
  Overwhelmed: [
    {
      title: 'Box Breathing',
      description: 'Make the next minute smaller and steadier.',
      durationLabel: '60 sec',
      loop: true,
      steps: [
        { text: 'Breathe in slowly.', duration: 4 },
        { text: 'Hold gently.', duration: 4 },
        { text: 'Breathe out slowly.', duration: 4 },
        { text: 'Pause before the next breath.', duration: 4 }
      ]
    },
    {
      title: 'One Thing',
      description: 'Choose only the next tiny thing.',
      durationLabel: '60 sec',
      steps: [
        { text: 'Let everything wait for a moment.', duration: 15 },
        { text: 'Name one thing that needs attention first.', duration: 20 },
        { text: 'Make that thing smaller than it was.', duration: 25 }
      ]
    },
    {
      title: 'Body Scan',
      description: 'Settle your attention into your body.',
      durationLabel: '60 sec',
      steps: [
        { text: 'Feel your feet on the floor.', duration: 15 },
        { text: 'Feel the chair or surface supporting you.', duration: 15 },
        { text: 'Relax your forehead and eyes.', duration: 15 },
        { text: 'Let the room be here with you.', duration: 15 }
      ]
    },
    {
      title: 'Talk Instead',
      description: 'Skip the exercise and start with your companion.',
      durationLabel: 'Now',
      steps: []
    }
  ],
  Frustrated: [
    {
      title: 'Tension Release',
      description: 'Let the body discharge some of the pressure.',
      durationLabel: '60 sec',
      loop: true,
      steps: [
        { text: 'Squeeze your hands or press your feet into the floor.', duration: 5 },
        { text: 'Release all at once.', duration: 8 },
        { text: 'Notice what changed.', duration: 7 }
      ]
    },
    {
      title: 'Cooling Breath',
      description: 'Create a pause before reacting.',
      durationLabel: '60 sec',
      loop: true,
      steps: [
        { text: 'Inhale through your nose.', duration: 4 },
        { text: 'Exhale longer than the inhale.', duration: 7 },
        { text: 'Let your face soften.', duration: 4 }
      ]
    },
    {
      title: 'Reframe',
      description: 'Separate the feeling from the next action.',
      durationLabel: '60 sec',
      steps: [
        { text: 'Name what feels unfair or blocked.', duration: 20 },
        { text: 'Name what you can control in the next minute.', duration: 20 },
        { text: 'Let the rest wait outside this moment.', duration: 20 }
      ]
    },
    {
      title: 'Talk Instead',
      description: 'Skip the exercise and start with your companion.',
      durationLabel: 'Now',
      steps: []
    }
  ]
};

const TOTAL_SECONDS = 60;

function getActiveStepDetails(selectedExercise: Challenge | null, timeLeft: number) {
  if (!selectedExercise || selectedExercise.steps.length === 0) {
    return {
      currentIndex: 0,
      currentText: '',
      nextText: '',
      stepTimeLeft: timeLeft,
      stepCount: 0
    };
  }

  const elapsed = TOTAL_SECONDS - timeLeft;
  const totalStepDuration = selectedExercise.steps.reduce((sum, step) => sum + step.duration, 0);
  const cursor = selectedExercise.loop ? elapsed % totalStepDuration : elapsed;
  let accumulated = 0;

  for (let index = 0; index < selectedExercise.steps.length; index += 1) {
    const step = selectedExercise.steps[index];
    accumulated += step.duration;
    if (cursor < accumulated) {
      const nextIndex = selectedExercise.loop
        ? (index + 1) % selectedExercise.steps.length
        : index + 1;

      return {
        currentIndex: index,
        currentText: step.text,
        nextText: selectedExercise.steps[nextIndex]?.text ?? 'We will check in with how you feel.',
        stepTimeLeft: Math.max(accumulated - cursor, 0),
        stepCount: selectedExercise.steps.length
      };
    }
  }

  const lastIndex = selectedExercise.steps.length - 1;
  return {
    currentIndex: lastIndex,
    currentText: selectedExercise.steps[lastIndex].text,
    nextText: 'We will check in with how you feel.',
    stepTimeLeft: 0,
    stepCount: selectedExercise.steps.length
  };
}

export function EmotionChallenges({ onOpenChat, onOpenJournal }: EmotionChallengesProps) {
  const [flowStep, setFlowStep] = useState<FlowStep>('emotion');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Challenge | null>(null);
  const [reflectionOutcome, setReflectionOutcome] = useState<Exclude<ReflectionOutcome, 'Talk Instead'> | null>(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);

  const selectedEmotionOption = EMOTIONS.find(item => item.emotion === selectedEmotion);
  const exercises = useMemo(() => {
    if (!selectedEmotion) return [];

    const availableExercises = EMOTION_CHALLENGES[selectedEmotion];
    if (flowStep !== 'exercise' || !selectedExercise) return availableExercises;

    return [
      ...availableExercises.filter(exercise => exercise.title !== selectedExercise.title),
      ...availableExercises.filter(exercise => exercise.title === selectedExercise.title)
    ];
  }, [flowStep, selectedEmotion, selectedExercise]);

  useEffect(() => {
    if (flowStep !== 'session') return;
    if (isPaused) return;
    if (timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [flowStep, isPaused, timeLeft]);

  const activeStepDetails = getActiveStepDetails(selectedExercise, timeLeft);

  const selectEmotion = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setSelectedExercise(null);
    setReflectionOutcome(null);
    setIsPaused(false);
    setTimeLeft(TOTAL_SECONDS);
    setFlowStep('exercise');
  };

  const selectExercise = (exercise: Challenge) => {
    if (!selectedEmotion) return;
    if (exercise.title === 'Talk Instead') {
      onOpenChat({ emotion: selectedEmotion, exercise: 'None', outcome: 'Talk Instead' });
      return;
    }

    setSelectedExercise(exercise);
    setIsPaused(false);
    setTimeLeft(TOTAL_SECONDS);
    setFlowStep('session');
  };

  const handleReflection = (outcome: Exclude<ReflectionOutcome, 'Talk Instead'>) => {
    if (!selectedEmotion || !selectedExercise) return;

    setReflectionOutcome(outcome);
    setFlowStep('supportChoice');
  };

  const getCompletedContext = (): SessionContext | null => {
    if (!selectedEmotion || !selectedExercise || !reflectionOutcome) return null;

    return {
      emotion: selectedEmotion,
      exercise: selectedExercise.title,
      outcome: reflectionOutcome
    };
  };

  const handleTalkItOut = () => {
    const context = getCompletedContext();
    if (!context) return;

    onOpenChat(context);
  };

  const handleWriteItOut = () => {
    const context = getCompletedContext();
    if (!context) return;

    onOpenJournal(context);
  };

  const handleOneMoreExercise = () => {
    setReflectionOutcome(null);
    setIsPaused(false);
    setTimeLeft(TOTAL_SECONDS);
    setFlowStep('exercise');
  };

  const handlePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleRestartExercise = () => {
    setIsPaused(false);
    setTimeLeft(TOTAL_SECONDS);
  };

  const handleSkipExercise = () => {
    setIsPaused(false);
    setTimeLeft(0);
  };

  const restartFlow = () => {
    setSelectedEmotion(null);
    setSelectedExercise(null);
    setReflectionOutcome(null);
    setIsPaused(false);
    setTimeLeft(TOTAL_SECONDS);
    setFlowStep('emotion');
  };

  if (flowStep === 'emotion') {
    return (
      <section className="guided-flow guided-flow-narrow fade-in">
        <h1>How are you feeling today?</h1>
        <div className="emotion-stack" aria-label="Choose how you feel">
          {EMOTIONS.map(item => (
            <button
              key={item.emotion}
              className="emotion-card-v2"
              onClick={() => selectEmotion(item.emotion)}
            >
              <span className="emotion-card-icon" aria-hidden="true">{item.icon}</span>
              <span className="emotion-card-copy">
                <strong>{item.emotion}</strong>
                <span>{item.description}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (flowStep === 'exercise' && selectedEmotionOption) {
    return (
      <section className="guided-flow guided-flow-wide fade-in">
        <div className="flow-copy">
          <button className="text-back-button" onClick={restartFlow}>Back</button>
          <h1>{selectedEmotionOption.reassurance}</h1>
          <p>Let's take one minute together.</p>
          <p>Choose what feels helpful.</p>
        </div>

        <div className="exercise-grid-v2">
          {exercises.map(exercise => (
            <button
              key={exercise.title}
              className="exercise-card-v2"
              onClick={() => selectExercise(exercise)}
            >
              <span className="exercise-duration">{exercise.durationLabel}</span>
              <strong>{exercise.title}</strong>
              <span>Start →</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (flowStep === 'session' && selectedExercise && timeLeft > 0) {
    const progress = ((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100;
    const stepLabel = activeStepDetails.stepCount > 0
      ? `Step ${activeStepDetails.currentIndex + 1} of ${activeStepDetails.stepCount}`
      : 'Current Step';

    return (
      <section className="exercise-session-screen fade-in">
        <button className="text-back-button session-back" onClick={() => setFlowStep('exercise')}>
          Back
        </button>
        <div className="session-stage">
          <div className="session-header-copy">
            <h1>Let's help you feel better</h1>
            <h2>{selectedExercise.title}</h2>
            <p><strong>Goal:</strong> {selectedExercise.description}</p>
          </div>

          <div className="breathing-orb" aria-hidden="true">
            <div className="breathing-diamond" />
          </div>

          <div className="session-timer-area">
            <div className="session-timer" aria-live="polite">{timeLeft}</div>
            <div className="session-controls" aria-label="Exercise controls">
              <button onClick={handlePause}>{isPaused ? 'Resume' : 'Pause'}</button>
              <button onClick={handleRestartExercise}>Restart</button>
              <button onClick={handleSkipExercise}>Skip</button>
            </div>
          </div>

          <div className="session-guidance-card">
            <div className="session-step-meta">
              <span>{stepLabel}</span>
              <span>{activeStepDetails.stepTimeLeft}s remaining</span>
            </div>
            <p className="session-guidance-label">Current Step</p>
            <p className="session-instruction">{activeStepDetails.currentText}</p>
            <p className="session-next-step"><strong>Next:</strong> {activeStepDetails.nextText}</p>
          </div>

          <div className="session-progress-wrap">
            <p>Exercise Progress</p>
            <div className="session-progress" aria-label="Exercise progress">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (flowStep === 'reflection' || (flowStep === 'session' && selectedExercise && timeLeft <= 0)) {
    return (
      <section className="guided-flow guided-flow-narrow reflection-screen fade-in">
        <h1>How are you feeling now?</h1>
        <div className="reflection-actions">
          <button onClick={() => handleReflection('Better')}>Better</button>
          <button onClick={() => handleReflection('About The Same')}>About The Same</button>
          <button onClick={() => handleReflection('Still Struggling')}>Still Struggling</button>
        </div>
      </section>
    );
  }

  return (
    <section className="guided-flow guided-flow-narrow reflection-screen fade-in">
      <h1>What would help most right now?</h1>
      <div className="reflection-actions">
        <button onClick={handleTalkItOut}>Talk It Out</button>
        <button onClick={handleWriteItOut}>Write It Out</button>
        <button onClick={handleOneMoreExercise}>One More Exercise</button>
      </div>
    </section>
  );
}
