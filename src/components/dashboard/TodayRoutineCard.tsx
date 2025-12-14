import { useMemo } from 'react';
import { BentoCard } from './BentoCard';
import { RoutineBlock, ROUTINE_CATEGORY_COLORS } from '@/types/routine';
import { Check, CalendarCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface TodayRoutineCardProps {
  blocks: RoutineBlock[];
  completedBlockIds: Set<string>;
  onToggleComplete: (blockId: string) => void;
  fitToScreen?: boolean;
}

export function TodayRoutineCard({ 
  blocks, 
  completedBlockIds, 
  onToggleComplete,
  fitToScreen = false 
}: TodayRoutineCardProps) {
  const currentHour = new Date().getHours();
  
  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((a, b) => {
      const aTime = a.startHour * 60 + (a.startMinute || 0);
      const bTime = b.startHour * 60 + (b.startMinute || 0);
      return aTime - bTime;
    });
  }, [blocks]);

  const completedCount = useMemo(() => {
    return sortedBlocks.filter((b) => completedBlockIds.has(b.id)).length;
  }, [sortedBlocks, completedBlockIds]);

  const progress = blocks.length > 0 ? (completedCount / blocks.length) * 100 : 0;

  const formatHour = (hour: number, minute = 0) => {
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    const period = hour >= 12 ? 'PM' : 'AM';
    return minute > 0 ? `${h}:${m} ${period}` : `${h} ${period}`;
  };

  const getBlockStatus = (block: RoutineBlock) => {
    const isCompleted = completedBlockIds.has(block.id);
    const endHour = block.startHour + block.duration;
    const isMissed = !isCompleted && endHour <= currentHour;
    const isActive = !isCompleted && block.startHour <= currentHour && endHour > currentHour;
    return { isCompleted, isMissed, isActive };
  };

  return (
    <BentoCard 
      className={cn("col-span-2 row-span-2", fitToScreen && "flex flex-col overflow-hidden")} 
      colorVariant="default" 
      delay={0}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <CalendarCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">Today's Routine</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {blocks.length} completed
            </p>
          </div>
        </div>
      </div>

      <Progress value={progress} className="h-2 mb-4" />

      <div className={cn(
        "space-y-2 overflow-y-auto pr-2", 
        fitToScreen ? "flex-1 min-h-0" : "max-h-[300px]"
      )}>
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Clock className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground font-medium">No routine planned for today</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Head to the Routine page to create your schedule
            </p>
          </div>
        ) : (
          sortedBlocks.map((block) => {
            const { isCompleted, isMissed, isActive } = getBlockStatus(block);
            const colors = ROUTINE_CATEGORY_COLORS[block.category];
            const endHour = block.startHour + block.duration;
            const endMinute = (block.startMinute || 0) + (block.duration % 1) * 60;

            return (
              <div
                key={block.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all group cursor-pointer',
                  isCompleted && 'opacity-60',
                  isMissed && 'opacity-40',
                  isActive && 'ring-2 ring-primary/30 bg-primary/5',
                  !isCompleted && !isMissed && 'hover:bg-muted/50'
                )}
                onClick={() => onToggleComplete(block.id)}
              >
                <button
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isMissed
                        ? 'border-destructive/50 bg-destructive/10'
                        : 'border-muted-foreground hover:border-primary'
                  )}
                >
                  {isCompleted && <Check className="w-4 h-4" />}
                  {isMissed && !isCompleted && (
                    <span className="text-[10px] text-destructive font-bold">!</span>
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium truncate',
                      isCompleted && 'line-through text-muted-foreground',
                      isMissed && !isCompleted && 'text-destructive/70'
                    )}
                  >
                    {block.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatHour(block.startHour, block.startMinute || 0)} - {formatHour(Math.floor(endHour), Math.round(endMinute) % 60)}
                  </p>
                </div>

                <span
                  className={cn(
                    'px-2 py-1 rounded-md text-xs font-medium',
                    colors.bg,
                    colors.text
                  )}
                >
                  {colors.label}
                </span>

                {isMissed && !isCompleted && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-destructive/10 text-destructive">
                    Missed
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </BentoCard>
  );
}
