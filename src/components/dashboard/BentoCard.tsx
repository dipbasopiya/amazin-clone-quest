import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  colorVariant?: 'default' | 'peach' | 'lavender' | 'blue' | 'yellow' | 'pink' | 'green' | 'cyan';
  delay?: number;
  hover?: boolean;
  elevated?: boolean;
}

const colorClasses = {
  default: 'bg-surface-1 text-card-foreground border border-border/50',
  peach: 'bg-peach text-peach-foreground',
  lavender: 'bg-lavender text-lavender-foreground',
  blue: 'bg-soft-blue text-soft-blue-foreground',
  yellow: 'bg-soft-yellow text-soft-yellow-foreground',
  pink: 'bg-soft-pink text-soft-pink-foreground',
  green: 'bg-soft-green text-soft-green-foreground',
  cyan: 'bg-soft-cyan text-soft-cyan-foreground',
};

export function BentoCard({ 
  children, 
  className, 
  colorVariant = 'default', 
  delay = 0,
  hover = true,
  elevated = false
}: BentoCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl p-6 bento-fade-in relative overflow-hidden',
        elevated ? 'shadow-elevated' : 'shadow-soft',
        hover && 'card-hover',
        colorClasses[colorVariant],
        className
      )}
      style={{ animationDelay: `${delay * 80}ms` }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
