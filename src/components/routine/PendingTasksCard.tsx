import { useMemo } from 'react';
import { CATEGORY_COLORS } from '@/types/fluxion';
import { ROUTINE_CATEGORY_COLORS } from '@/types/routine';
import { RoutineTask } from '@/hooks/useRoutineCompletion';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Clock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PendingTasksCardProps {
  routineTasks: RoutineTask[];
  onMarkComplete: (blockId: string) => void;
  onStartTask?: (blockId: string) => void;
  activeTaskId?: string;
}

export function PendingTasksCard({
  routineTasks,
  onMarkComplete,
  onStartTask,
  activeTaskId,
}: PendingTasksCardProps) {
  const currentHour = new Date().getHours();
  
  const pendingTasks = useMemo(() => {
    return routineTasks
      .filter(task => !task.completed)
      .sort((a, b) => {
        const aTime = a.startHour * 60 + a.startMinute;
        const bTime = b.startHour * 60 + b.startMinute;
        return aTime - bTime;
      });
  }, [routineTasks]);

  const isPastScheduledTime = (task: RoutineTask) => {
    return task.startHour < currentHour;
  };

  const formatTime = (hour: number, minute: number) => {
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${h}:${m} ${ampm}`;
  };

  const getCategoryColors = (category: RoutineTask['category']) => {
    if (category === 'break') {
      return ROUTINE_CATEGORY_COLORS.break;
    }
    return CATEGORY_COLORS[category];
  };

  if (pendingTasks.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-background/50 shadow-soft">
            <Check className="w-4 h-4 text-foreground" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">All Caught Up!</h3>
        </div>
        <div className="flex-1 flex items-center justify-center bg-background/30 rounded-xl border border-background/50">
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center mx-auto mb-3 shadow-soft">
              <Check className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              All tasks completed
            </p>
            <p className="text-xs text-muted-foreground">
              Great work today! Take a well-deserved break.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const missedCount = pendingTasks.filter(t => isPastScheduledTime(t)).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header with urgency indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-xl shadow-soft",
            missedCount > 0 ? "bg-destructive/20 animate-pulse" : "bg-background/50"
          )}>
            <AlertCircle className={cn(
              "w-4 h-4",
              missedCount > 0 ? "text-destructive" : "text-foreground"
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Pending Tasks</h3>
            <p className="text-[10px] text-muted-foreground">
              {missedCount > 0 ? `${missedCount} missed` : `${pendingTasks.length} remaining`}
            </p>
          </div>
        </div>
        {missedCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-medium">
            Urgent
          </span>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {pendingTasks.map((task) => {
          const colors = getCategoryColors(task.category);
          const isMissed = isPastScheduledTime(task);
          const isActive = activeTaskId === task.blockId;
          
          return (
            <div
              key={task.id}
              className={cn(
                "p-3 rounded-xl border transition-all duration-200",
                "hover:shadow-md",
                isActive 
                  ? "bg-primary/10 border-primary/30 ring-2 ring-primary/20"
                  : isMissed 
                    ? "bg-destructive/5 border-destructive/20" 
                    : "bg-muted/30 border-border/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground truncate">
                      {task.title}
                    </p>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      colors.bg,
                      colors.text
                    )}>
                      {colors.label}
                    </span>
                    <span className={cn(
                      "flex items-center gap-1 text-xs",
                      isMissed ? "text-destructive" : "text-muted-foreground"
                    )}>
                      <Clock className="w-3 h-3" />
                      {formatTime(task.startHour, task.startMinute)}
                      {isMissed && " (missed)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 mt-2">
                {!isActive && onStartTask && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onStartTask(task.blockId)}
                    className="h-7 px-3 text-xs gap-1"
                  >
                    <Play className="w-3 h-3" />
                    Start
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkComplete(task.blockId)}
                  className="h-7 px-2 text-xs gap-1 hover:bg-background/50"
                >
                  <Check className="w-3 h-3" />
                  {isActive ? 'Complete' : 'Mark Complete'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
