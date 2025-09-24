'use client';

import { useState, useRef, useEffect } from 'react';
import { Plant, SMSMessage } from '@/lib/types';
import { generatePlantMessage, formatTimeAgo } from '@/lib/utils';
import { Send, MessageCircle, Smartphone } from 'lucide-react';

interface AgentChatProps {
  plant: Plant;
  variant?: 'withTools' | 'compact';
}

export function AgentChat({ plant, variant = 'withTools' }: AgentChatProps) {
  const [messages, setMessages] = useState<SMSMessage[]>([
    {
      messageId: '1',
      plantId: plant.plantId,
      userId: plant.userId,
      content: generatePlantMessage(plant, 'thriving'),
      sentAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'mood_update'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Add user message (simulated)
    const userMessage: SMSMessage = {
      messageId: Date.now().toString(),
      plantId: plant.plantId,
      userId: plant.userId,
      content: newMessage,
      sentAt: new Date(),
      type: 'response'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate plant response
    setTimeout(() => {
      const plantResponse: SMSMessage = {
        messageId: (Date.now() + 1).toString(),
        plantId: plant.plantId,
        userId: plant.userId,
        content: generatePlantResponse(newMessage, plant),
        sentAt: new Date(),
        type: 'response'
      };
      
      setMessages(prev => [...prev, plantResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generatePlantResponse = (userMessage: string, plant: Plant): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('water') || lowerMessage.includes('drink')) {
      return generatePlantMessage(plant, 'watering');
    } else if (lowerMessage.includes('sun') || lowerMessage.includes('light')) {
      return generatePlantMessage(plant, 'sunlight');
    } else if (lowerMessage.includes('how') || lowerMessage.includes('feeling')) {
      return generatePlantMessage(plant, 'thriving');
    } else {
      const responses = [
        "Thanks for checking in! I'm just here photosynthesizing and living my best plant life 🌱",
        "Appreciate the message! Currently staking my claim in this sunny spot ☀️",
        "Hey there! Just validating some sunlight transactions over here 📈",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  if (variant === 'compact') {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Smartphone className="w-5 h-5 text-accent" />
          <div>
            <h4 className="font-medium text-text-primary">SMS Chat</h4>
            <p className="text-xs text-text-secondary">
              {messages.length} messages
            </p>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-sm text-text-primary">
            {messages[messages.length - 1]?.content}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            {formatTimeAgo(messages[messages.length - 1]?.sentAt)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            SMS Chat with {plant.nickname}
          </h3>
          <p className="text-text-secondary text-sm">
            {plant.personalityProfile.archetype} personality • Solana themed
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.messageId}
            className={`flex ${message.type === 'response' && message.content.includes('Thanks') ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'response' && message.content.includes('Thanks')
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-white/20 text-text-primary'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {formatTimeAgo(message.sentAt)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface border border-white/20 text-text-primary max-w-xs px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Reply to your plant..."
          className="flex-1 bg-surface border border-white/20 rounded-lg px-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isTyping}
          className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
