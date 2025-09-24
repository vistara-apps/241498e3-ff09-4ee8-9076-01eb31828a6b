'use client';

import { Plant } from '@/lib/types';
import { getPlantStatusColor, formatTimeAgo, getDaysUntilNextWatering } from '@/lib/utils';
import { Droplets, Sun, MessageCircle, QrCode } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
}

export function PlantCard({ plant, onClick }: PlantCardProps) {
  const daysUntilWatering = getDaysUntilNextWatering(plant.careSchedule.nextWatering);
  
  return (
    <div className="plant-card" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            {plant.nickname}
          </h3>
          <p className="text-text-secondary text-sm mb-2">{plant.plantType}</p>
          <div className={`status-indicator ${getPlantStatusColor(plant.status)}`}>
            {plant.status === 'thriving' && '🌱 Thriving'}
            {plant.status === 'thirsty' && '💧 Thirsty'}
            {plant.status === 'needsSun' && '☀️ Needs Sun'}
            {plant.status === 'dormant' && '😴 Dormant'}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <QrCode className="w-5 h-5 text-text-secondary" />
          <div className="text-xs text-text-secondary">
            ID: {plant.plantId.slice(-6)}
          </div>
        </div>
      </div>

      {/* Care Schedule */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-xs text-text-secondary">Next watering</p>
            <p className="text-sm font-medium text-text-primary">
              {daysUntilWatering === 0 ? 'Today' : 
               daysUntilWatering === 1 ? 'Tomorrow' : 
               `${daysUntilWatering} days`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Sun className="w-4 h-4 text-yellow-400" />
          <div>
            <p className="text-xs text-text-secondary">Light need</p>
            <p className="text-sm font-medium text-text-primary capitalize">
              {plant.careSchedule.lightRequirement}
            </p>
          </div>
        </div>
      </div>

      {/* Last Message */}
      {plant.lastMessage && (
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="flex items-start space-x-2">
            <MessageCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-text-primary mb-1">{plant.lastMessage}</p>
              {plant.lastMessageTime && (
                <p className="text-xs text-text-secondary">
                  {formatTimeAgo(plant.lastMessageTime)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Personality Badge */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-xs text-text-secondary capitalize">
            {plant.personalityProfile.archetype} personality
          </span>
        </div>
        
        {plant.personalityProfile.solanaTheme && (
          <div className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
            Solana Native
          </div>
        )}
      </div>
    </div>
  );
}
