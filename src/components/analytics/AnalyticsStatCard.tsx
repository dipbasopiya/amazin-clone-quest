import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: 'peach' | 'lavender' | 'blue' | 'yellow' | 'pink' | 'green' | 'cyan';
  delay?: number;
}

const colorClasses = {
  peach: 'bg-peach text-peach-foreground',
  lavender: 'bg-lavender text-lavender-foreground',
  blue: 'bg-soft-blue text-soft-blue-foreground',
  yellow: 'bg-soft-yellow text-soft-yellow-foreground',
  pink: 'bg-soft-pink text-soft-pink-foreground',
  green: 'bg-soft-green text-soft-green-foreground',
  cyan: 'bg-soft-cyan text-soft-cyan-foreground',
};

const iconBgClasses = {
  peach: 'bg-peach-foreground/15',
  lavender: 'bg-lavender-foreground/15',
  blue: 'bg-soft-blue-foreground/15',
  yellow: 'bg-soft-yellow-foreground/15',
  pink: 'bg-soft-pink-foreground/15',
  green: 'bg-soft-green-foreground/15',
  cyan: 'bg-soft-cyan-foreground/15',
};

export function AnalyticsStatCard({ title, value, subtitle, icon: Icon, color, delay = 0, emphasized = false }: AnalyticsStatCardProps & { emphasized?: boolean }) {
  return (
    <div 
      className={cn(
        'rounded-2xl shadow-soft p-5 border border-border/20 card-hover bento-fade-in relative overflow-hidden',
        colorClasses[color],
        emphasized && 'ring-2 ring-primary/20 ring-offset-2 ring-offset-surface-0 shadow-elevated'
      )}
      style={{ animationDelay: `${delay * 80}ms` }}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-70 mb-1.5">{title}</p>
          <p className="text-2xl font-thin-numeric tracking-tight">{value}</p>
          <p className="text-xs opacity-60 mt-1">{subtitle}</p>
        </div>
        <div className={cn('p-2.5 rounded-xl', iconBgClasses[color])}>
          <Icon className="w-4 h-4 opacity-80" />
        </div>
      </div>
    </div>
  );
}
