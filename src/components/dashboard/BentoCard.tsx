import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  colorVariant?: 'default' | 'peach' | 'lavender' | 'blue' | 'yellow' | 'pink' | 'green';
  delay?: number;
}

const colorClasses = {
  default: 'bg-card',
  peach: 'bg-peach',
  lavender: 'bg-lavender',
  blue: 'bg-soft-blue',
  yellow: 'bg-soft-yellow',
  pink: 'bg-soft-pink',
  green: 'bg-soft-green',
};

export function BentoCard({ children, className, colorVariant = 'default', delay = 0 }: BentoCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 shadow-soft card-hover bento-fade-in',
        colorClasses[colorVariant],
        className
      )}
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      {children}
    </div>
  );
}
