import { useState } from 'react';
import { BentoCard } from './BentoCard';
import { CATEGORY_COLORS, TaskCategory } from '@/types/fluxion';
import { ROUTINE_CATEGORY_COLORS } from '@/types/routine';
import { Check, Calendar, Sparkles, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { RoutineTask } from '@/hooks/useRoutineCompletion';

interface TaskCardProps {
  routineTasks: RoutineTask[];
  completedCount: number;
  onToggle: (blockId: string) => void;
}

export function TaskCard({ routineTasks, completedCount, onToggle }: TaskCardProps) {
  const [recentlyCompleted, setRecentlyCompleted] = useState<string | null>(null);
  const progress = routineTasks.length > 0 ? (completedCount / routineTasks.length) * 100 : 0;
  const isAllComplete = routineTasks.length > 0 && completedCount === routineTasks.length;

  const formatTime = (hour: number, minute: number) => {
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${h}:${m} ${ampm}`;
  };

  const formatTimeRange = (task: RoutineTask) => {
    const startTime = formatTime(task.startHour, task.startMinute);
    const endHour = task.startHour + Math.floor(task.duration);
    const endMinute = task.startMinute + (task.duration % 1) * 60;
    const endTime = formatTime(endHour, Math.round(endMinute));
    return `${startTime} - ${endTime}`;
  };

  const getCategoryColors = (category: TaskCategory | 'break') => {
    if (category === 'break') {
      return ROUTINE_CATEGORY_COLORS.break;
    }
    return CATEGORY_COLORS[category];
  };

  const handleToggle = (blockId: string) => {
    setRecentlyCompleted(blockId);
    onToggle(blockId);
    setTimeout(() => setRecentlyCompleted(null), 600);
  };

  return (
    <BentoCard 
      className="col-span-1 md:col-span-2 row-span-2 ring-2 ring-primary/20 ring-offset-2 ring-offset-surface-0" 
      colorVariant="cyan" 
      delay={0} 
      elevated
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/15 shadow-soft">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Today's Tasks</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {routineTasks.length} completed
            </p>
          </div>
        </div>
        {isAllComplete && (
          <span className="px-3 py-1.5 rounded-full bg-soft-green/50 text-soft-green-foreground text-xs font-medium animate-scale-in">
            All done!
          </span>
        )}
      </div>

      <Progress 
        value={progress} 
        className={cn(
          "h-2.5 mb-5 bg-muted/50 transition-all duration-500",
          isAllComplete && "shadow-glow"
        )} 
      />

      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-2">
        {routineTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-gradient-to-b from-muted/20 to-muted/40 rounded-2xl border border-dashed border-border/50">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <CircleDot className="w-7 h-7 text-primary/60" />
            </div>
            <p className="text-foreground font-medium mb-1">Your day is clear</p>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Plan one focused task to begin your productive day
            </p>
          </div>
        ) : (
          routineTasks.map((task, index) => {
            const colors = getCategoryColors(task.category);
            const isJustCompleted = recentlyCompleted === task.blockId;
            return (
              <div
                key={task.id}
                className={cn(
                  'flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group',
                  'border border-border/30',
                  task.completed 
                    ? 'bg-muted/30 opacity-60' 
                    : 'bg-card hover:bg-muted/40 hover:border-border/50',
                  isJustCompleted && 'animate-scale-in bg-soft-green/20'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => handleToggle(task.blockId)}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0',
                    task.completed
                      ? 'bg-primary border-primary text-primary-foreground scale-100'
                      : 'border-muted-foreground/40 hover:border-primary hover:scale-110',
                    isJustCompleted && 'animate-bounce'
                  )}
                >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium truncate transition-all duration-300',
                      task.completed && 'line-through text-muted-foreground'
                    )}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTimeRange(task)}
                  </p>
                </div>
                <span
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 transition-all duration-300',
                    colors.bg,
                    colors.text
                  )}
                >
                  {colors.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </BentoCard>
  );
}
