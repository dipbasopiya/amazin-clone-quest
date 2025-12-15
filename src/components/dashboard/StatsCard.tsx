import { BentoCard } from './BentoCard';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorVariant: 'peach' | 'blue' | 'yellow' | 'pink' | 'green' | 'cyan' | 'lavender';
  delay?: number;
}

const iconBgClasses = {
  peach: 'bg-peach-foreground/15',
  blue: 'bg-soft-blue-foreground/15',
  yellow: 'bg-soft-yellow-foreground/15',
  pink: 'bg-soft-pink-foreground/15',
  green: 'bg-soft-green-foreground/15',
  cyan: 'bg-soft-cyan-foreground/15',
  lavender: 'bg-lavender-foreground/15',
};

export function StatsCard({ title, value, subtitle, icon: Icon, colorVariant, delay = 0 }: StatsCardProps) {
  return (
    <BentoCard colorVariant={colorVariant} delay={delay}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-70 mb-1.5">{title}</p>
          <p className="text-3xl font-thin-numeric tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-60 mt-1.5">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-xl', iconBgClasses[colorVariant])}>
          <Icon className="w-5 h-5 opacity-75" />
        </div>
      </div>
    </BentoCard>
  );
}
