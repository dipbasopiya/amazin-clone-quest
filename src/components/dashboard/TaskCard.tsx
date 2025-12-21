import { useState } from 'react';
import { BentoCard } from './BentoCard';
import { CATEGORY_COLORS, TaskCategory } from '@/types/fluxion';
import { ROUTINE_CATEGORY_COLORS } from '@/types/routine';
import { Check, Sparkles, CircleDot, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { RoutineTask } from '@/hooks/useRoutineCompletion';

interface TaskCardProps {
  routineTasks: RoutineTask[];
  completedCount: number;
  onToggle: (blockId: string) => void;
  onStartTask?: (taskId: string) => void;
  activeTaskId?: string;
}

export function TaskCard({ routineTasks, completedCount, onToggle, onStartTask, activeTaskId }: TaskCardProps) {
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
      className="col-span-1 md:col-span-2 row-span-2" 
      colorVariant="cyan" 
      delay={0} 
      elevated
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-foreground/10 shadow-soft">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Today's Tasks</h3>
            <p className="text-sm opacity-70">
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
          "h-2.5 mb-5 bg-foreground/10 transition-all duration-500",
          isAllComplete && "shadow-glow"
        )} 
      />

      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-2">
        {routineTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-foreground/5 rounded-2xl border border-dashed border-foreground/10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <CircleDot className="w-7 h-7 text-primary/60" />
            </div>
            <p className="font-medium mb-1">Your day is clear</p>
            <p className="text-sm opacity-60 max-w-[200px]">
              Plan one focused task to begin your productive day
            </p>
          </div>
        ) : (
          routineTasks.map((task, index) => {
            const colors = getCategoryColors(task.category);
            const isJustCompleted = recentlyCompleted === task.blockId;
            const isActive = activeTaskId === task.id;
            return (
              <div
                key={task.id}
                className={cn(
                  'flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group',
                  task.completed 
                    ? 'bg-foreground/5 opacity-60' 
                    : 'bg-background/40 hover:bg-background/60',
                  isJustCompleted && 'animate-scale-in bg-soft-green/20',
                  isActive && 'ring-2 ring-primary/30 bg-primary/5'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => handleToggle(task.blockId)}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0',
                    task.completed
                      ? 'bg-primary border-primary text-primary-foreground scale-100'
                      : 'border-foreground/30 hover:border-primary hover:scale-110',
                    isJustCompleted && 'animate-bounce'
                  )}
                >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium truncate transition-all duration-300',
                      task.completed && 'line-through opacity-60'
                    )}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs opacity-60 mt-0.5">
                    {formatTimeRange(task)}
                  </p>
                </div>
                {!task.completed && onStartTask && !isActive && (
                  <button
                    onClick={() => onStartTask(task.id)}
                    className="p-2 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/20 hover:scale-110"
                    title="Start timer"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                )}
                {isActive && (
                  <span className="px-2 py-1 rounded-lg bg-primary/15 text-primary text-xs font-medium animate-pulse">
                    Active
                  </span>
                )}
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
