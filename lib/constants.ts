export const PLANT_TYPES = [
  { id: 'monstera', name: 'Monstera Deliciosa', wateringDays: 7, light: 'medium' as const },
  { id: 'snake', name: 'Snake Plant', wateringDays: 14, light: 'low' as const },
  { id: 'pothos', name: 'Golden Pothos', wateringDays: 5, light: 'medium' as const },
  { id: 'fiddle', name: 'Fiddle Leaf Fig', wateringDays: 7, light: 'high' as const },
  { id: 'rubber', name: 'Rubber Plant', wateringDays: 10, light: 'medium' as const },
  { id: 'peace', name: 'Peace Lily', wateringDays: 5, light: 'low' as const },
];

export const PERSONALITY_ARCHETYPES = [
  {
    id: 'chill',
    name: 'Chill Validator',
    description: 'Laid-back and goes with the flow, uses crypto slang casually',
    traits: ['relaxed', 'optimistic', 'crypto-savvy'],
  },
  {
    id: 'dramatic',
    name: 'Drama Queen',
    description: 'Expressive and attention-seeking, compares everything to market volatility',
    traits: ['expressive', 'attention-seeking', 'market-obsessed'],
  },
  {
    id: 'wise',
    name: 'Sage Staker',
    description: 'Wise and philosophical, gives life advice through DeFi metaphors',
    traits: ['philosophical', 'wise', 'defi-focused'],
  },
  {
    id: 'sassy',
    name: 'Sassy Trader',
    description: 'Witty and sarcastic, makes jokes about gas fees and transactions',
    traits: ['witty', 'sarcastic', 'trading-focused'],
  },
  {
    id: 'zen',
    name: 'Zen Hodler',
    description: 'Calm and meditative, promotes patience and long-term thinking',
    traits: ['calm', 'patient', 'hodl-focused'],
  },
];

export const SOLANA_THEMED_MESSAGES = {
  watering: [
    "Time to refill my liquidity pool! 💧 My roots are getting a bit dry over here.",
    "Hey fren, my water reserves are running low. Need a top-up to keep validating! 🌱",
    "Transaction pending: H2O transfer required! My soil's looking pretty dry tbh.",
  ],
  thriving: [
    "Feeling bullish today! 📈 That watering yesterday was *chef's kiss* perfect.",
    "My growth metrics are looking solid! Thanks for keeping my ecosystem healthy 🚀",
    "Currently staking in the sunlight and feeling absolutely mint! ✨",
  ],
  sunlight: [
    "Need more exposure to that sweet, sweet solar energy! ☀️ My photosynthesis is lagging.",
    "My light validation is failing - can you move me closer to the window? 🌞",
    "Running low on solar power over here! Time to relocate this validator 📍",
  ],
};
