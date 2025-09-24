'use client';

import { ReactNode } from 'react';
import { Leaf, Settings2, Plus } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export function AppShell({ children, title = 'PlantPal AI', showAddButton = false, onAddClick }: AppShellProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="glass-card border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">{title}</h1>
                <p className="text-sm text-text-secondary">Your plant's AI assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {showAddButton && (
                <button
                  onClick={onAddClick}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Plant</span>
                </button>
              )}
              
              <div className="relative">
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="bg-surface border border-white/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="default">Plant Theme</option>
                  <option value="solana">Solana</option>
                  <option value="base">Base</option>
                  <option value="celo">Celo</option>
                  <option value="coinbase">Coinbase</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-text-secondary text-sm">
            <p>PlantPal AI - Making plant care fun with personality</p>
            <p className="mt-1">Powered by Base & OnchainKit</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
