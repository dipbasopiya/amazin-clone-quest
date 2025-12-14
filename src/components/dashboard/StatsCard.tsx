import { BentoCard } from './BentoCard';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorVariant: 'peach' | 'blue' | 'yellow' | 'pink' | 'green';
  delay?: number;
}

export function StatsCard({ title, value, subtitle, icon: Icon, colorVariant, delay = 0 }: StatsCardProps) {
  return (
    <BentoCard colorVariant={colorVariant} delay={delay}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-70 mb-1">{title}</p>
          <p className="text-3xl font-thin-numeric tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-60 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-2 rounded-xl bg-foreground/5">
          <Icon className="w-5 h-5 opacity-70" />
        </div>
      </div>
    </BentoCard>
  );
}
