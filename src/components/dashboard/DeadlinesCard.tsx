import { BentoCard } from './BentoCard';
import { Task, CATEGORY_COLORS } from '@/types/fluxion';
import { Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeadlinesCardProps {
  deadlines: Task[];
  delay?: number;
}

export function DeadlinesCard({ deadlines, delay = 0 }: DeadlinesCardProps) {
  const getUrgencyColor = (deadline: string) => {
    const daysUntil = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    if (daysUntil <= 1) return 'text-destructive';
    if (daysUntil <= 3) return 'text-orange-500';
    return 'text-muted-foreground';
  };

  const formatDeadline = (deadline: string) => {
    const daysUntil = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil < 7) return `${daysUntil} days`;
    return new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <BentoCard colorVariant="yellow" delay={delay}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-soft-yellow-foreground/70" />
        <h3 className="text-sm font-medium text-soft-yellow-foreground">Upcoming Deadlines</h3>
      </div>

      {deadlines.length === 0 ? (
        <p className="text-sm text-soft-yellow-foreground/60 text-center py-4">
          No upcoming deadlines
        </p>
      ) : (
        <div className="space-y-3">
          {deadlines.map((task) => (
            <div key={task.id} className="flex items-center gap-3">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  CATEGORY_COLORS[task.category].bg
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-soft-yellow-foreground">
                  {task.title}
                </p>
              </div>
              <span className={cn('text-xs font-medium flex items-center gap-1', getUrgencyColor(task.deadline!))}>
                {Math.ceil((new Date(task.deadline!).getTime() - Date.now()) / 86400000) <= 1 && (
                  <AlertCircle className="w-3 h-3" />
                )}
                {formatDeadline(task.deadline!)}
              </span>
            </div>
          ))}
        </div>
      )}
    </BentoCard>
  );
}
