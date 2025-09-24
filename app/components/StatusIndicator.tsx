'use client';

import { Plant } from '@/lib/types';
import { getPlantStatusColor } from '@/lib/utils';

interface StatusIndicatorProps {
  status: Plant['status'];
  variant?: 'default' | 'compact';
}

export function StatusIndicator({ status, variant = 'default' }: StatusIndicatorProps) {
  const getStatusText = () => {
    switch (status) {
      case 'thriving':
        return variant === 'compact' ? '🌱' : '🌱 Thriving';
      case 'thirsty':
        return variant === 'compact' ? '💧' : '💧 Thirsty';
      case 'needsSun':
        return variant === 'compact' ? '☀️' : '☀️ Needs Sun';
      case 'dormant':
        return variant === 'compact' ? '😴' : '😴 Dormant';
      default:
        return variant === 'compact' ? '🌱' : '🌱 Healthy';
    }
  };

  return (
    <div className={`status-indicator ${getPlantStatusColor(status)}`}>
      {getStatusText()}
    </div>
  );
}
