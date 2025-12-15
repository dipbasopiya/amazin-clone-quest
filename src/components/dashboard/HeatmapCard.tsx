import { useMemo } from 'react';
import { BentoCard } from './BentoCard';
import { Task, FocusSession } from '@/types/fluxion';
import { RoutineTaskCompletion } from '@/hooks/useRoutineCompletion';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

interface HeatmapCardProps {
  tasks: Task[];
  sessions: FocusSession[];
  routineCompletions?: RoutineTaskCompletion[];
  delay?: number;
}

export function HeatmapCard({ tasks, sessions, routineCompletions = [], delay = 0 }: HeatmapCardProps) {
  const heatmapData = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    
    const data: { date: string; intensity: number }[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(now.getFullYear(), now.getMonth(), day).toISOString().split('T')[0];
      
      // Count routine completions for this date
      const routineTasksCompleted = routineCompletions.filter(
        (c) => c.date === dateStr && c.completed
      ).length;
      
      // Fallback to legacy tasks if no routine completions
      const tasksCompleted = routineTasksCompleted > 0 
        ? routineTasksCompleted
        : tasks.filter(
            (t) => t.completed && new Date(t.createdAt).toISOString().split('T')[0] === dateStr
          ).length;
      
      const focusMinutes = sessions
        .filter((s) => s.date === dateStr)
        .reduce((acc, s) => acc + s.duration, 0) / 60;
      
      // Calculate intensity (0-4) based on productivity
      let intensity = 0;
      const productivityScore = tasksCompleted * 2 + focusMinutes / 30;
      if (productivityScore > 0) intensity = 1;
      if (productivityScore >= 3) intensity = 2;
      if (productivityScore >= 6) intensity = 3;
      if (productivityScore >= 10) intensity = 4;
      
      data.push({ date: dateStr, intensity });
    }
    
    return { data, firstDayOfMonth };
  }, [tasks, sessions, routineCompletions]);

  const intensityColors = [
    'bg-soft-green/20',
    'bg-soft-green/40',
    'bg-soft-green/60',
    'bg-soft-green/80',
    'bg-soft-green',
  ];

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  return (
    <BentoCard colorVariant="green" delay={delay}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-soft-green-foreground/10">
            <Activity className="w-4 h-4 text-soft-green-foreground" />
          </div>
          <h3 className="text-sm font-medium text-soft-green-foreground">{monthName}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-soft-green-foreground/60">
          <span>Less</span>
          {intensityColors.map((color, i) => (
            <div key={i} className={cn('w-2.5 h-2.5 rounded-sm', color)} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs text-soft-green-foreground/50 font-medium py-1">
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before the 1st */}
        {Array.from({ length: heatmapData.firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {heatmapData.data.map((day) => (
          <div
            key={day.date}
            className={cn(
              'aspect-square rounded-[4px] transition-all duration-300 hover:scale-125 cursor-default',
              intensityColors[day.intensity]
            )}
            title={`${day.date}: Level ${day.intensity}`}
          />
        ))}
      </div>
    </BentoCard>
  );
}
