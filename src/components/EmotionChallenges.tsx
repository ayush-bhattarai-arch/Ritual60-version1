import { useState } from 'react';
import { ActiveChallenge } from './ActiveChallenge';

type Emotion = 'Angry' | 'Sad' | 'Panic' | 'Depression';

export interface ExerciseStep {
  text: string;
  duration: number;
}

export interface Challenge {
  title: string;
  description: string;
  instruction: string;
  loop?: boolean;
  steps: ExerciseStep[];
}

const EMOTION_CHALLENGES: Record<Emotion, Challenge[]> = {
  Angry: [
    {
      title: "Box Breathing (4-4-4-4)",
      description: "Regulate your nervous system and slow down your heart rate.",
      instruction: "Inhale slowly for 4 seconds, hold your breath for 4 seconds, exhale completely for 4 seconds, and hold empty for 4 seconds. Repeat this cycle 4 times.",
      loop: true,
      steps: [
        { text: "Inhale slowly through your nose...", duration: 4 },
        { text: "Hold your breath...", duration: 4 },
        { text: "Exhale completely through your mouth...", duration: 4 },
        { text: "Hold your lungs empty...", duration: 4 }
      ]
    },
    {
      title: "Physical Release (Squeeze & Let Go)",
      description: "Release the physical tension that builds up with anger.",
      instruction: "Clench your fists or squeeze a pillow as tight as you can for 5 seconds, then release completely. Notice the sensation of relaxation. Repeat 3 times.",
      loop: true,
      steps: [
        { text: "Clench your fists or squeeze a pillow as tight as you can!", duration: 5 },
        { text: "Release completely. Notice the sensation of relaxation.", duration: 15 }
      ]
    },
    {
      title: "Rant Writing & Deleting",
      description: "Express your frustration without consequences.",
      instruction: "Write down everything that is making you angry. Don't filter yourself. Once finished, clear the text or tear the paper up to physically let it go.",
      loop: false,
      steps: [
        { text: "Write/type down everything making you angry. Don't filter yourself.", duration: 45 },
        { text: "Now clear/delete the text to physically let it go.", duration: 15 }
      ]
    },
    {
      title: "Vigorous Movement Burst",
      description: "Safely channel the adrenaline spike from anger.",
      instruction: "Perform 10 rapid jumping jacks, 10 wall push-ups, or shake your limbs vigorously for 30 seconds to burn off the excess energy.",
      loop: false,
      steps: [
        { text: "Perform rapid jumping jacks or shake your limbs vigorously to burn off the adrenaline!", duration: 35 },
        { text: "Stop, place your hand on your heart, and feel it slowing down...", duration: 25 }
      ]
    }
  ],
  Sad: [
    {
      title: "Gratitude Anchoring",
      description: "Gently shift focus to small, comforting elements of your reality.",
      instruction: "Look around and name 3 tiny things you are grateful for right now (e.g., the warmth of a drink, a soft blanket, or the ambient light).",
      loop: false,
      steps: [
        { text: "Name one tiny thing you are grateful for right now (e.g. warmth of a drink).", duration: 20 },
        { text: "Name a second tiny thing you are grateful for right now (e.g. soft blanket).", duration: 20 },
        { text: "Name a third tiny thing you are grateful for right now (e.g. ambient light).", duration: 20 }
      ]
    },
    {
      title: "Self-Compassion Hug",
      description: "Provide physical comfort to yourself during emotional pain.",
      instruction: "Wrap your arms around yourself in a gentle hug. Take a deep breath and tell yourself: 'It is okay to feel sad. I am doing my best right now.'",
      loop: false,
      steps: [
        { text: "Wrap your arms around yourself in a gentle, warm hug.", duration: 15 },
        { text: "Breathe slowly and tell yourself: 'It is okay to feel sad. I am doing my best.'", duration: 45 }
      ]
    },
    {
      title: "Sensory Grounding (Calming Sounds)",
      description: "Immerse your senses in a soothing auditory environment.",
      instruction: "Close your eyes and listen to a calming sound, like rain, ocean waves, or a gentle melody, for 2 minutes without any other distractions.",
      loop: false,
      steps: [
        { text: "Close your eyes, breathe, and focus entirely on the calming sound in your environment.", duration: 60 }
      ]
    },
    {
      title: "Gentle Body Stretching",
      description: "Release the sadness and stagnation stored in the muscles.",
      instruction: "Slowly roll your neck in circles, stretch your arms overhead, or sit in a child's pose. Hold each position and breathe deeply.",
      loop: false,
      steps: [
        { text: "Slowly roll your neck in circles to release shoulder tension...", duration: 15 },
        { text: "Stretch your arms overhead and reach for the sky...", duration: 15 },
        { text: "Sit in child's pose and breathe deeply into your back...", duration: 30 }
      ]
    }
  ],
  Panic: [
    {
      title: "5-4-3-2-1 Grounding Method",
      description: "Bring your mind back to the present moment and out of panic.",
      instruction: "Identify 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste around you.",
      loop: false,
      steps: [
        { text: "Name 5 things you can see around you...", duration: 12 },
        { text: "Name 4 things you can touch...", duration: 12 },
        { text: "Name 3 things you can hear...", duration: 12 },
        { text: "Name 2 things you can smell...", duration: 12 },
        { text: "Name 1 thing you can taste...", duration: 12 }
      ]
    },
    {
      title: "The Physiological Sigh",
      description: "The fastest biological way to reduce autonomic arousal.",
      instruction: "Take a deep breath through your nose, followed immediately by another short sniff, then sigh out slowly and completely through your mouth. Repeat 3 times.",
      loop: true,
      steps: [
        { text: "Take a deep double inhale (one deep breath + one quick sniff)...", duration: 4 },
        { text: "Sigh out slowly and completely through your mouth...", duration: 6 }
      ]
    },
    {
      title: "Cold Water Shock",
      description: "Trigger the dive reflex to automatically slow down your heart rate.",
      instruction: "Splash cold water on your face, or hold an ice cube in your hands. Focus entirely on the physical sensation of the intense cold.",
      loop: false,
      steps: [
        { text: "Splash cold water on your face or hold an ice cube in your hands...", duration: 15 },
        { text: "Breathe slowly and focus entirely on the physical cold fading...", duration: 45 }
      ]
    },
    {
      title: "Solid Grounding Check",
      description: "Reconnect with physical stability.",
      instruction: "Place both feet flat on the floor. Feel the weight of your body supported by the ground. Say out loud: 'I am safe, I am here, and I am grounded.'",
      loop: false,
      steps: [
        { text: "Place both feet flat on the floor. Feel the support of the earth...", duration: 15 },
        { text: "Breathe deeply and repeat: 'I am safe, I am here, and I am grounded.'", duration: 45 }
      ]
    }
  ],
  Depression: [
    {
      title: "One Tiny Action",
      description: "Break the paralysis of low energy with an extremely small step.",
      instruction: "Pick one task that takes under 2 minutes (e.g., taking a sip of water, washing one dish, or straightening a pillow) and do only that.",
      loop: false,
      steps: [
        { text: "Think of one tiny task under 2 minutes (e.g. sip of water) and do it right now.", duration: 60 }
      ]
    },
    {
      title: "Natural Light Exposure",
      description: "Use light to gently stimulate your mood and circadian rhythm.",
      instruction: "Step outside or sit close to a window. Look towards the light (not directly at the sun) and let the daylight touch your face for 2-3 minutes.",
      loop: false,
      steps: [
        { text: "Sit close to a window or step outside. Let the natural light touch your face.", duration: 60 }
      ]
    },
    {
      title: "Soft Connection",
      description: "Reach out gently without the pressure of a full conversation.",
      instruction: "Send a simple text message to a trusted friend or family member (e.g., 'Thinking of you!') or write down the name of someone you appreciate.",
      loop: false,
      steps: [
        { text: "Draft a text to a friend or write down a name of someone you appreciate.", duration: 30 },
        { text: "Breathe and sit with the warm feelings of appreciation for that person.", duration: 30 }
      ]
    },
    {
      title: "Gentle Arm Swaying",
      description: "Begin moving your body with very low effort.",
      instruction: "Stand up or sit comfortably. Let your arms hang loose and gently sway them side-to-side for 1 minute, letting your body regain a gentle flow.",
      loop: false,
      steps: [
        { text: "Let your arms hang loose and sway them side-to-side, letting your body regain a gentle flow.", duration: 60 }
      ]
    }
  ]
};

export function EmotionChallenges() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState<number | null>(null);

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setSelectedChallengeIndex(null);
  };

  const handleBackToEmotions = () => {
    setSelectedEmotion(null);
    setSelectedChallengeIndex(null);
  };

  const handleBackToChallenges = () => {
    setSelectedChallengeIndex(null);
  };

  if (!selectedEmotion) {
    return (
      <div className="fade-in">
        <h2>How are you feeling right now?</h2>
        <p className="intro-text">Select your current emotional state to find simple, soothing exercises designed to help you ground and calm down.</p>
        <div className="emotion-grid">
          <button className="btn-angry" onClick={() => handleEmotionSelect('Angry')}>Angry</button>
          <button className="btn-sad" onClick={() => handleEmotionSelect('Sad')}>Sad</button>
          <button className="btn-panic" onClick={() => handleEmotionSelect('Panic')}>Panic</button>
          <button className="btn-depr" onClick={() => handleEmotionSelect('Depression')}>Depression</button>
        </div>
      </div>
    );
  }

  const challenges = EMOTION_CHALLENGES[selectedEmotion];

  const handleRandomChallenge = () => {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    setSelectedChallengeIndex(randomIndex);
  };

  return (
    <div className="fade-in">
      <button className="btn-back" onClick={handleBackToEmotions}>&larr; Back to Emotions</button>
      <h2>{selectedEmotion} Challenges</h2>
      <p className="intro-text">Select one of the exercises below or let us choose one for you:</p>
      
      <button className="btn-random" onClick={handleRandomChallenge} style={{ marginBottom: '24px' }}>
        Pick Any Challenge for Me
      </button>

      <ul className="challenge-list">
        {challenges.map((challenge, index) => (
          <li key={index} className="challenge-item" onClick={() => setSelectedChallengeIndex(index)}>
            <h4>{challenge.title}</h4>
            <p>{challenge.description}</p>
          </li>
        ))}
      </ul>

      {selectedChallengeIndex !== null && (
        <ActiveChallenge 
          challenge={challenges[selectedChallengeIndex]} 
          onClose={handleBackToChallenges} 
        />
      )}
    </div>
  );
}
