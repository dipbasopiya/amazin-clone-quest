import { useMemo } from 'react';
import { RoutineBlock } from '@/types/routine';
import { RoutineTask } from '@/hooks/useRoutineCompletion';
import { Clock, Calendar, Coffee, Target, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DaySummaryCardProps {
  blocks: RoutineBlock[];
  routineTasks?: RoutineTask[];
  wakeHour?: number;
  sleepHour?: number;
}

export function DaySummaryCard({
  blocks,
  routineTasks = [],
  wakeHour = 6,
  sleepHour = 22,
}: DaySummaryCardProps) {
  const stats = useMemo(() => {
    const totalAvailableHours = sleepHour - wakeHour;
    const scheduledHours = blocks.reduce((acc, block) => acc + block.duration, 0);
    const breakHours = blocks
      .filter(block => block.category === 'break')
      .reduce((acc, block) => acc + block.duration, 0);
    const workHours = scheduledHours - breakHours;
    const freeHours = Math.max(0, totalAvailableHours - scheduledHours);
    const completedTasks = routineTasks.filter(t => t.completed).length;
    const totalTasks = routineTasks.length;
    
    return {
      totalAvailableHours,
      scheduledHours,
      workHours,
      breakHours,
      freeHours,
      completedTasks,
      totalTasks,
      utilizationPercent: Math.round((scheduledHours / totalAvailableHours) * 100),
    };
  }, [blocks, routineTasks, wakeHour, sleepHour]);

  // Calculate ring parameters
  const ringSize = 80;
  const strokeWidth = 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (stats.utilizationPercent / 100) * circumference;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-soft-blue/50">
          <Calendar className="w-4 h-4 text-soft-blue-foreground" />
        </div>
        <h3 className="font-semibold text-foreground text-sm">Day Summary</h3>
      </div>

      {/* Compact layout with ring */}
      <div className="flex-1 flex items-center gap-4">
        {/* Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg width={ringSize} height={ringSize} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={cn(
                "transition-all duration-500",
                stats.utilizationPercent > 80 ? "text-orange" : 
                stats.utilizationPercent > 50 ? "text-aqua" : "text-soft-green-foreground"
              )}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">{stats.utilizationPercent}%</span>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Target className="w-3 h-3" />
              Scheduled
            </span>
            <span className="font-semibold text-foreground">{stats.scheduledHours}h</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Coffee className="w-3 h-3" />
              Breaks
            </span>
            <span className="font-semibold text-foreground">{stats.breakHours}h</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Free
            </span>
            <span className={cn(
              "font-semibold",
              stats.freeHours > 2 ? "text-soft-green-foreground" : 
              stats.freeHours > 0 ? "text-soft-yellow-foreground" : "text-destructive"
            )}>
              {stats.freeHours}h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
