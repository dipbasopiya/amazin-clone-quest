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
  default: 'bg-gradient-to-br from-[hsl(35_30%_94%)] to-[hsl(32_28%_91%)] text-card-foreground',
  peach: 'bg-gradient-to-br from-peach to-[hsl(20_80%_85%)] text-peach-foreground',
  lavender: 'bg-gradient-to-br from-lavender to-[hsl(255_50%_83%)] text-lavender-foreground',
  blue: 'bg-gradient-to-br from-soft-blue to-[hsl(205_70%_83%)] text-soft-blue-foreground',
  yellow: 'bg-gradient-to-br from-soft-yellow to-[hsl(40_80%_80%)] text-soft-yellow-foreground',
  pink: 'bg-gradient-to-br from-soft-pink to-[hsl(335_60%_85%)] text-soft-pink-foreground',
  green: 'bg-gradient-to-br from-soft-green to-[hsl(150_45%_80%)] text-soft-green-foreground',
  cyan: 'bg-gradient-to-br from-soft-cyan to-[hsl(180_55%_80%)] text-soft-cyan-foreground',
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
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none rounded-3xl" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
