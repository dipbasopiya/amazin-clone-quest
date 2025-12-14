import { BentoCard } from './BentoCard';
import { TaskCategory, CATEGORY_COLORS } from '@/types/fluxion';
import { Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FocusCardProps {
  isRunning: boolean;
  currentSeconds: number;
  currentCategory: TaskCategory;
  todayFocusMinutes: number;
  onStart: (category: TaskCategory) => void;
  onStop: () => void;
  onCategoryChange: (category: TaskCategory) => void;
  formatTime: (seconds: number) => string;
}

export function FocusCard({
  isRunning,
  currentSeconds,
  currentCategory,
  todayFocusMinutes,
  onStart,
  onStop,
  onCategoryChange,
  formatTime,
}: FocusCardProps) {
  const formatHoursMinutes = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <BentoCard className="col-span-2" colorVariant="lavender" delay={1}>
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-sm font-medium text-lavender-foreground/70 mb-2">
          {isRunning ? 'Focus Session' : "Today's Focus"}
        </p>
        
        <div className={cn(
          'text-5xl font-thin-numeric tracking-tight text-lavender-foreground mb-4',
          isRunning && 'pulse-subtle'
        )}>
          {isRunning ? formatTime(currentSeconds) : formatHoursMinutes(todayFocusMinutes)}
        </div>

        {!isRunning && (
          <div className="flex gap-2 mb-4 flex-wrap justify-center">
            {(Object.keys(CATEGORY_COLORS) as TaskCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  CATEGORY_COLORS[cat].bg,
                  CATEGORY_COLORS[cat].text,
                  currentCategory === cat && 'ring-2 ring-foreground/20 ring-offset-2 ring-offset-lavender'
                )}
              >
                {CATEGORY_COLORS[cat].label}
              </button>
            ))}
          </div>
        )}

        {isRunning && (
          <div className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium mb-4',
            CATEGORY_COLORS[currentCategory].bg,
            CATEGORY_COLORS[currentCategory].text
          )}>
            {CATEGORY_COLORS[currentCategory].label}
          </div>
        )}

        <Button
          onClick={() => (isRunning ? onStop() : onStart(currentCategory))}
          variant={isRunning ? 'destructive' : 'default'}
          size="lg"
          className="rounded-full px-8"
        >
          {isRunning ? (
            <>
              <Square className="w-4 h-4 mr-2" /> Stop
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" /> Start Focus
            </>
          )}
        </Button>
      </div>
    </BentoCard>
  );
}
