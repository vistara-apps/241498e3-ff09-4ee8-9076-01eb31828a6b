import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plant, PersonalityProfile } from './types';
import { SOLANA_THEMED_MESSAGES } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePlantMessage(plant: Plant, messageType: 'watering' | 'thriving' | 'sunlight'): string {
  const messages = SOLANA_THEMED_MESSAGES[messageType];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  // Customize message based on personality
  const personalizedMessage = personalizeMessage(randomMessage, plant.personalityProfile, plant.nickname);
  
  return personalizedMessage;
}

function personalizeMessage(message: string, personality: PersonalityProfile, plantName: string): string {
  let personalizedMessage = message;
  
  // Add personality-specific touches
  switch (personality.archetype) {
    case 'dramatic':
      personalizedMessage = `OMG ${personalizedMessage} This is literally a CRISIS! 😱`;
      break;
    case 'chill':
      personalizedMessage = `Yo, ${personalizedMessage} No rush though, whenever you get a chance 😎`;
      break;
    case 'sassy':
      personalizedMessage = `${personalizedMessage} But like, no pressure or anything... 💅`;
      break;
    case 'wise':
      personalizedMessage = `${personalizedMessage} Remember, patience in plant care is like HODLing - it pays off 🧘‍♂️`;
      break;
    case 'zen':
      personalizedMessage = `${personalizedMessage} All is well, just sharing my current state 🕯️`;
      break;
  }
  
  return personalizedMessage;
}

export function getPlantStatusColor(status: Plant['status']): string {
  switch (status) {
    case 'thriving':
      return 'status-thriving';
    case 'thirsty':
      return 'status-thirsty';
    case 'needsSun':
      return 'status-needs-sun';
    default:
      return 'status-thriving';
  }
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function generateQRCodeData(plantId: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://plantpal-ai.vercel.app';
  return `${baseUrl}/setup/${plantId}`;
}

export function getDaysUntilNextWatering(nextWatering: Date): number {
  const now = new Date();
  const diffInMs = nextWatering.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}
