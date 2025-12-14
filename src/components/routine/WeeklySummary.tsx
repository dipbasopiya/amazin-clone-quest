import { CATEGORY_COLORS, TaskCategory } from '@/types/fluxion';
import { cn } from '@/lib/utils';

interface WeeklySummaryProps {
  totalHours: Record<TaskCategory, number>;
}

export function WeeklySummary({ totalHours }: WeeklySummaryProps) {
  const total = Object.values(totalHours).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-card rounded-2xl shadow-soft p-6">
      <h3 className="text-sm font-medium text-foreground mb-4">Weekly Schedule Summary</h3>
      
      <div className="space-y-3">
        {(Object.keys(CATEGORY_COLORS) as TaskCategory[]).map((cat) => {
          const hours = totalHours[cat];
          const percentage = total > 0 ? (hours / total) * 100 : 0;
          const colors = CATEGORY_COLORS[cat];

          return (
            <div key={cat} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={cn('font-medium', colors.text)}>{colors.label}</span>
                <span className="text-muted-foreground">{hours}h</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', colors.bg)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Total Scheduled</span>
          <span className="text-lg font-thin-numeric text-foreground">{total}h / week</span>
        </div>
      </div>
    </div>
  );
}
