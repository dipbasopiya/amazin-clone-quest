import { BentoCard } from './BentoCard';
import { CATEGORY_COLORS, TaskCategory } from '@/types/fluxion';
import { ROUTINE_CATEGORY_COLORS } from '@/types/routine';
import { Check, Calendar, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { RoutineTask } from '@/hooks/useRoutineCompletion';

interface TaskCardProps {
  routineTasks: RoutineTask[];
  completedCount: number;
  onToggle: (blockId: string) => void;
}

export function TaskCard({ routineTasks, completedCount, onToggle }: TaskCardProps) {
  const progress = routineTasks.length > 0 ? (completedCount / routineTasks.length) * 100 : 0;

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

  return (
    <BentoCard className="col-span-1 md:col-span-2 row-span-2" colorVariant="default" delay={0}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground">Today's Tasks</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {routineTasks.length} completed
            </p>
          </div>
        </div>
      </div>

      <Progress value={progress} className="h-2 mb-5 bg-muted/50" />

      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-2">
        {routineTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-muted/30 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-foreground font-medium mb-1">No tasks for today</p>
            <p className="text-sm text-muted-foreground">
              Head to Routine to plan your day
            </p>
          </div>
        ) : (
          routineTasks.map((task, index) => {
            const colors = getCategoryColors(task.category);
            return (
              <div
                key={task.id}
                className={cn(
                  'flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group',
                  'border border-border/30',
                  task.completed 
                    ? 'bg-muted/30 opacity-60' 
                    : 'bg-card hover:bg-muted/40 hover:border-border/50'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => onToggle(task.blockId)}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0',
                    task.completed
                      ? 'bg-primary border-primary text-primary-foreground scale-100'
                      : 'border-muted-foreground/40 hover:border-primary hover:scale-110'
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
