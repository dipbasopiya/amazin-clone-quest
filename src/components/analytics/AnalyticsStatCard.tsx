import { LucideIcon } from 'lucide-react';

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: 'peach' | 'lavender' | 'blue' | 'yellow' | 'pink' | 'green';
}

const colorClasses = {
  peach: 'bg-peach text-peach-foreground',
  lavender: 'bg-lavender text-lavender-foreground',
  blue: 'bg-soft-blue text-soft-blue-foreground',
  yellow: 'bg-soft-yellow text-soft-yellow-foreground',
  pink: 'bg-soft-pink text-soft-pink-foreground',
  green: 'bg-soft-green text-soft-green-foreground',
};

export function AnalyticsStatCard({ title, value, subtitle, icon: Icon, color }: AnalyticsStatCardProps) {
  return (
    <div className={`rounded-2xl shadow-soft p-5 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-70 mb-1">{title}</p>
          <p className="text-2xl font-thin-numeric tracking-tight">{value}</p>
          <p className="text-xs opacity-60 mt-0.5">{subtitle}</p>
        </div>
        <div className="p-2 rounded-xl bg-foreground/5">
          <Icon className="w-4 h-4 opacity-70" />
        </div>
      </div>
    </div>
  );
}
