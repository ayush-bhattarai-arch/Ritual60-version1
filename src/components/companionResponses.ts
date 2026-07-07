export const MOCK_COMPANION_RESPONSES = [
  "I hear you, and I'm right here with you. Take a slow, comforting breath. I'm listening.",
  'Thank you for sharing that with me. It is completely valid to feel this way. Let it out.',
  "That sounds like a lot to carry. You do not have to navigate it alone. I'm here with you.",
  "I'm listening closely. Be gentle with yourself while we take this one step at a time.",
  "I appreciate you opening up. Let's stay with what feels most important right now.",
  "I'm here with you, no matter what you are feeling. Take all the time you need.",
  'It is okay to feel overwhelmed or tired. Noticing it is already a meaningful step.'
];

const KEYWORD_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['angry', 'mad', 'furious', 'pissed', 'annoyed', 'hate', 'frustrated'],
    response: "It's completely okay to feel angry. It's a natural signal that something needs attention. What part of this feels most unfair right now?"
  },
  {
    keywords: ['sad', 'cry', 'depressed', 'lonely', 'hurt', 'pain', 'grief'],
    response: "I'm sorry this feels so heavy. You do not have to make it smaller before talking about it. What has been hurting the most?"
  },
  {
    keywords: ['anxious', 'panic', 'scared', 'worry', 'afraid', 'stressed', 'nervous'],
    response: 'I hear how activated everything feels. We can slow this down together. What thought keeps pulling your attention back?'
  },
  {
    keywords: ['tired', 'exhausted', 'give up', 'done', 'sleepy'],
    response: "You've been carrying a lot. We do not need to solve everything right now. What would feel like the smallest relief?"
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
