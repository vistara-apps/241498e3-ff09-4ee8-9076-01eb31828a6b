'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { PlantCard } from './components/PlantCard';
import { CTABox } from './components/CTABox';
import { AgentChat } from './components/AgentChat';
import { PaymentFlow } from './components/PaymentFlow';
import { Plant, PaymentResponse } from '@/lib/types';
import { generatePlantMessage } from '@/lib/utils';
import { Leaf, QrCode, Smartphone, Plus, Sparkles } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar, Identity } from '@coinbase/onchainkit/identity';

export default function HomePage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

  // Initialize with demo plants
  useEffect(() => {
    const demoPlants: Plant[] = [
      {
        plantId: 'plant-1',
        userId: 'user-1',
        nickname: 'Luna the Monstera',
        plantType: 'Monstera Deliciosa',
        personalityProfile: {
          archetype: 'chill',
          solanaTheme: true,
          traits: ['relaxed', 'optimistic', 'crypto-savvy'],
          communicationStyle: 'crypto-native'
        },
        careSchedule: {
          nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
          wateringFrequency: 7,
          lightRequirement: 'medium'
        },
        qrCodeId: 'qr-1',
        status: 'thriving',
        lastMessage: "Feeling bullish today! 📈 That watering yesterday was *chef's kiss* perfect.",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        plantId: 'plant-2',
        userId: 'user-1',
        nickname: 'Sage the Snake Plant',
        plantType: 'Snake Plant',
        personalityProfile: {
          archetype: 'wise',
          solanaTheme: true,
          traits: ['philosophical', 'wise', 'defi-focused'],
          communicationStyle: 'formal'
        },
        careSchedule: {
          nextWatering: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
          wateringFrequency: 14,
          lightRequirement: 'low'
        },
        qrCodeId: 'qr-2',
        status: 'thirsty',
        lastMessage: "Remember, patience in plant care is like HODLing - it pays off 🧘‍♂️",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      }
    ];
    
    setPlants(demoPlants);
    setSelectedPlant(demoPlants[0]);
  }, []);

  const handleAddPlant = () => {
    setShowAddPlant(true);
  };

  const handlePaymentSuccess = (response: PaymentResponse) => {
    console.log('Payment successful:', response);
    setHasSubscription(true);
    // Here you could trigger a subscription activation
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment failed:', error);
    // Handle payment error (show notification, etc.)
  };

  return (
    <AppShell 
      title="PlantPal AI" 
      showAddButton={true} 
      onAddClick={handleAddPlant}
    >
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 animate-float">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Your Plant's Personal AI Assistant
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
          SMS service where houseplants text you personalized care reminders with Solana-themed personality
        </p>

        {/* Wallet Connection */}
        <div className="flex justify-center mb-8">
          <Wallet>
            <ConnectWallet>
              <div className="flex items-center space-x-3 bg-surface border border-white/20 rounded-lg px-6 py-3 hover:bg-white/5 transition-all duration-200">
                <Avatar className="w-8 h-8" />
                <div className="text-left">
                  <Name className="text-text-primary font-medium" />
                  <div className="text-text-secondary text-sm">Connect to get started</div>
                </div>
              </div>
            </ConnectWallet>
          </Wallet>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <CTABox
          variant="primary"
          title="QR Code Setup"
          description="Scan once to link your plant with its AI personality"
          icon={<QrCode className="w-6 h-6 text-white" />}
          action={
            <button className="btn-secondary">
              Generate QR Code
            </button>
          }
        />
        
        <CTABox
          title="SMS Reminders"
          description="Get personalized care messages from your plants"
          icon={<Smartphone className="w-6 h-6 text-accent" />}
          action={
            <button className="btn-secondary">
              Setup Phone Number
            </button>
          }
        />
        
        <CTABox
          title="AI Personalities"
          description="Each plant has unique Solana-themed personality traits"
          icon={<Sparkles className="w-6 h-6 text-accent" />}
          action={
            <button className="btn-secondary">
              Customize Personality
            </button>
          }
        />
      </div>

      {/* Plants Section */}
      {plants.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plants List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Your Plants</h2>
              <div className="text-text-secondary text-sm">
                {plants.length} plant{plants.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="space-y-4">
              {plants.map((plant) => (
                <PlantCard
                  key={plant.plantId}
                  plant={plant}
                  onClick={() => setSelectedPlant(plant)}
                />
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div>
            {selectedPlant && (
              <AgentChat plant={selectedPlant} variant="withTools" />
            )}
          </div>
        </div>
      ) : (
        <CTABox
          variant="primary"
          title="Add Your First Plant"
          description="Start by adding a plant to receive personalized SMS care reminders"
          icon={<Plus className="w-6 h-6 text-white" />}
          action={
            <button className="btn-primary" onClick={handleAddPlant}>
              Add Plant
            </button>
          }
        />
      )}

      {/* Subscription CTA */}
      <div className="mt-16 text-center">
        <div className="glass-card p-8 border-primary/30">
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            {hasSubscription ? "You're All Set!" : "Ready to Start?"}
          </h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            {hasSubscription 
              ? "Your subscription is active. Enjoy personalized SMS messages from your plants!"
              : "$5.99/month for up to 10 plants with unlimited SMS messages and AI personalities"
            }
          </p>
          
          {!hasSubscription && (
            <div className="max-w-md mx-auto">
              <PaymentFlow
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                buttonText="Subscribe with USDC ($5.99/month)"
              />
              <p className="text-text-secondary text-sm mt-3">
                7-day free trial • Cancel anytime • Pay with USDC on Base
              </p>
            </div>
          )}
          
          {hasSubscription && (
            <div className="text-green-400 text-lg font-medium">
              ✓ Subscription Active
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
