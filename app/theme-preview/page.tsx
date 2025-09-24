'use client';

import { AppShell } from '../components/AppShell';
import { PlantCard } from '../components/PlantCard';
import { CTABox } from '../components/CTABox';
import { StatusIndicator } from '../components/StatusIndicator';
import { useTheme } from '../components/ThemeProvider';
import { Plant } from '@/lib/types';
import { Leaf, QrCode, Smartphone, Sparkles } from 'lucide-react';

export default function ThemePreviewPage() {
  const { theme, setTheme } = useTheme();

  const demoPlant: Plant = {
    plantId: 'demo-plant',
    userId: 'demo-user',
    nickname: 'Demo Plant',
    plantType: 'Monstera Deliciosa',
    personalityProfile: {
      archetype: 'chill',
      solanaTheme: true,
      traits: ['relaxed', 'optimistic'],
      communicationStyle: 'crypto-native'
    },
    careSchedule: {
      nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      wateringFrequency: 7,
      lightRequirement: 'medium'
    },
    qrCodeId: 'demo-qr',
    status: 'thriving',
    lastMessage: "Feeling bullish today! 📈",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30)
  };

  const themes = [
    { id: 'default', name: 'Plant Theme', description: 'Nature-inspired green theme' },
    { id: 'solana', name: 'Solana', description: 'Purple gradient theme' },
    { id: 'base', name: 'Base', description: 'Blue blockchain theme' },
    { id: 'celo', name: 'Celo', description: 'Black and yellow theme' },
    { id: 'coinbase', name: 'Coinbase', description: 'Navy corporate theme' },
  ];

  return (
    <AppShell title="Theme Preview">
      <div className="space-y-8">
        {/* Theme Selector */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Theme Selector</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id as any)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  theme === themeOption.id
                    ? 'border-primary bg-primary/10'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <h3 className="font-semibold text-text-primary">{themeOption.name}</h3>
                <p className="text-text-secondary text-sm mt-1">{themeOption.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 bg-bg rounded-lg border border-white/20"></div>
              <p className="text-text-secondary text-sm">Background</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-surface rounded-lg border border-white/20"></div>
              <p className="text-text-secondary text-sm">Surface</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-primary rounded-lg"></div>
              <p className="text-text-secondary text-sm">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-accent rounded-lg"></div>
              <p className="text-text-secondary text-sm">Accent</p>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Component Examples</h2>
          
          {/* Buttons */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Status Indicators</h3>
            <div className="flex flex-wrap gap-4">
              <StatusIndicator status="thriving" />
              <StatusIndicator status="thirsty" />
              <StatusIndicator status="needsSun" />
              <StatusIndicator status="dormant" />
            </div>
          </div>

          {/* Plant Card */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Plant Card</h3>
            <div className="max-w-md">
              <PlantCard plant={demoPlant} />
            </div>
          </div>

          {/* CTA Boxes */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">CTA Boxes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CTABox
                variant="primary"
                title="Primary CTA"
                description="This is a primary call-to-action box"
                icon={<Leaf className="w-6 h-6 text-white" />}
                action={<button className="btn-primary">Action</button>}
              />
              <CTABox
                variant="secondary"
                title="Secondary CTA"
                description="This is a secondary call-to-action box"
                icon={<QrCode className="w-6 h-6 text-accent" />}
                action={<button className="btn-secondary">Action</button>}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
