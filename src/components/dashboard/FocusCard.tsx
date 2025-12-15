import { BentoCard } from './BentoCard';
import { TaskCategory, CATEGORY_COLORS } from '@/types/fluxion';
import { Play, Square, Zap } from 'lucide-react';
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
    <BentoCard className="col-span-1 md:col-span-2" colorVariant="lavender" delay={1}>
      <div className="flex flex-col items-center justify-center h-full py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className={cn(
            'p-2 rounded-xl transition-all duration-400',
            isRunning ? 'bg-primary/20 animate-pulse' : 'bg-lavender-foreground/10'
          )}>
            <Zap className={cn(
              'w-5 h-5 transition-colors duration-400',
              isRunning ? 'text-primary' : 'text-lavender-foreground'
            )} />
          </div>
          <p className="text-sm font-medium text-lavender-foreground/80">
            {isRunning ? 'Focus Session' : "Today's Focus"}
          </p>
        </div>
        
        <div className={cn(
          'text-5xl font-thin-numeric tracking-tight text-lavender-foreground mb-5 transition-all duration-400',
          isRunning && 'pulse-subtle text-primary'
        )}>
          {isRunning ? formatTime(currentSeconds) : formatHoursMinutes(todayFocusMinutes)}
        </div>

        {!isRunning && (
          <div className="flex gap-2 mb-5 flex-wrap justify-center">
            {(Object.keys(CATEGORY_COLORS) as TaskCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300',
                  CATEGORY_COLORS[cat].bg,
                  CATEGORY_COLORS[cat].text,
                  currentCategory === cat 
                    ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-lavender scale-105 shadow-soft' 
                    : 'hover:scale-105'
                )}
              >
                {CATEGORY_COLORS[cat].label}
              </button>
            ))}
          </div>
        )}

        {isRunning && (
          <div className={cn(
            'px-4 py-2 rounded-xl text-xs font-medium mb-5 shadow-soft',
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
          className={cn(
            'rounded-full px-8 transition-all duration-400',
            !isRunning && 'shadow-soft hover:shadow-glow'
          )}
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
