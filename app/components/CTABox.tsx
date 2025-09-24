'use client';

import { ReactNode } from 'react';

interface CTABoxProps {
  variant?: 'primary' | 'secondary';
  title: string;
  description: string;
  action: ReactNode;
  icon?: ReactNode;
}

export function CTABox({ 
  variant = 'primary', 
  title, 
  description, 
  action, 
  icon 
}: CTABoxProps) {
  return (
    <div className={`glass-card p-6 ${variant === 'primary' ? 'border-primary/30' : 'border-white/10'}`}>
      <div className="flex items-start space-x-4">
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            variant === 'primary' 
              ? 'bg-gradient-to-br from-primary to-accent' 
              : 'bg-surface border border-white/20'
          }`}>
            {icon}
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {title}
          </h3>
          <p className="text-text-secondary mb-4">
            {description}
          </p>
          {action}
        </div>
      </div>
    </div>
  );
}
