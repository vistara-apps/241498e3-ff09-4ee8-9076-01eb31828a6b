export interface User {
  userId: string;
  phoneNumber?: string;
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  subscriptionEndDate?: Date;
}

export interface Plant {
  plantId: string;
  userId: string;
  nickname: string;
  plantType: string;
  personalityProfile: PersonalityProfile;
  careSchedule: CareSchedule;
  qrCodeId: string;
  status: 'thriving' | 'thirsty' | 'needsSun' | 'dormant';
  lastMessage?: string;
  lastMessageTime?: Date;
}

export interface PersonalityProfile {
  archetype: 'chill' | 'dramatic' | 'wise' | 'sassy' | 'zen';
  solanaTheme: boolean;
  traits: string[];
  communicationStyle: 'formal' | 'casual' | 'crypto-native';
}

export interface CareSchedule {
  lastWatered?: Date;
  nextWatering: Date;
  wateringFrequency: number; // days
  lightRequirement: 'low' | 'medium' | 'high';
  lastFertilized?: Date;
  nextFertilizing?: Date;
}

export interface QRCode {
  qrCodeId: string;
  plantId?: string;
  uniqueScanToken: string;
  isUsed: boolean;
  createdAt: Date;
}

export interface SMSMessage {
  messageId: string;
  plantId: string;
  userId: string;
  content: string;
  sentAt: Date;
  type: 'care_reminder' | 'mood_update' | 'greeting' | 'response';
}

export interface PaymentRequest {
  amount: string;
  currency: 'USDC';
  recipient: string;
  description?: string;
}

export interface PaymentResponse {
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  currency: 'USDC';
  duration: 'monthly' | 'yearly';
  features: string[];
}
