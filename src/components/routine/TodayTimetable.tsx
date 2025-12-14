import { useMemo, useEffect, useRef } from 'react';
import { RoutineBlock, ROUTINE_CATEGORY_COLORS } from '@/types/routine';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Pencil, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, TaskCategory, CATEGORY_COLORS } from '@/types/fluxion';

interface TodayTimetableProps {
  blocks: RoutineBlock[];
  tasks: Task[];
  onBlockClick: (block: RoutineBlock) => void;
  onGenerateAIPlan: () => void;
  onApplyPlan: () => void;
  isGenerating?: boolean;
}

interface TimeSlot {
  hour: number;
  block?: RoutineBlock;
  task?: Task;
  isPast: boolean;
  isCurrentHour: boolean;
}

interface GroupedSlot {
  startHour: number;
  endHour: number;
  block?: RoutineBlock;
  isPast: boolean;
  isFreeGroup: boolean;
  freeSlotCount: number;
}

export function TodayTimetable({
  blocks,
  tasks,
  onBlockClick,
  onGenerateAIPlan,
  onApplyPlan,
  isGenerating = false,
}: TodayTimetableProps) {
  const currentHour = new Date().getHours();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (currentTimeRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentTimeElement = currentTimeRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = currentTimeElement.getBoundingClientRect();
      
      // Scroll to position current time indicator near the top
      const scrollOffset = elementRect.top - containerRect.top - 60;
      container.scrollTo({ top: container.scrollTop + scrollOffset, behavior: 'smooth' });
    }
  }, []);

  // Group consecutive free slots together
  const groupedSlots = useMemo(() => {
    const slots: GroupedSlot[] = [];
    let currentFreeGroup: { startHour: number; isPast: boolean } | null = null;

    for (let hour = 6; hour <= 22; hour++) {
      const block = blocks.find(b => {
        const blockEnd = b.startHour + b.duration;
        return hour >= b.startHour && hour < blockEnd;
      });
      
      const isPast = hour < currentHour;
      const isBlockStart = block?.startHour === hour;

      if (block) {
        // Close any open free group
        if (currentFreeGroup) {
          slots.push({
            startHour: currentFreeGroup.startHour,
            endHour: hour,
            isPast: currentFreeGroup.isPast,
            isFreeGroup: true,
            freeSlotCount: hour - currentFreeGroup.startHour,
          });
          currentFreeGroup = null;
        }
        
        // Only add block at start hour
        if (isBlockStart) {
          slots.push({
            startHour: block.startHour,
            endHour: block.startHour + block.duration,
            block,
            isPast,
            isFreeGroup: false,
            freeSlotCount: 0,
          });
        }
      } else {
        // Free slot
        if (!currentFreeGroup) {
          currentFreeGroup = { startHour: hour, isPast };
        }
      }
    }

    // Close final free group
    if (currentFreeGroup) {
      slots.push({
        startHour: currentFreeGroup.startHour,
        endHour: 23,
        isPast: currentFreeGroup.isPast,
        isFreeGroup: true,
        freeSlotCount: 23 - currentFreeGroup.startHour,
      });
    }

    return slots;
  }, [blocks, currentHour]);

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const getBlockHeight = (duration: number) => {
    return `${duration * 48}px`; // Slightly reduced from 56px
  };

  const getFreeGroupHeight = (count: number) => {
    // Collapse long free groups: show minimal height for groups > 2 hours
    if (count > 2) return '40px';
    return `${count * 32}px`; // Compact height for free slots
  };

  // Calculate current time position within the hour (0-100%)
  const currentMinutePercent = (new Date().getMinutes() / 60) * 100;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Today's Schedule</h3>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateAIPlan}
            disabled={isGenerating}
            className="gap-1.5 rounded-full text-xs"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </Button>
          <Button
            size="sm"
            onClick={onApplyPlan}
            className="gap-1.5 rounded-full text-xs"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Plan
          </Button>
        </div>
      </div>

      {/* Timetable */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="relative">
          {groupedSlots.map((slot, index) => {
            const isCurrentTimeSlot = currentHour >= slot.startHour && currentHour < slot.endHour;
            
            return (
              <div
                key={`${slot.startHour}-${index}`}
                ref={isCurrentTimeSlot ? currentTimeRef : undefined}
                className={cn(
                  "flex gap-3 border-b border-border/30 group relative",
                  slot.isPast && "opacity-50"
                )}
                style={{ 
                  minHeight: slot.isFreeGroup 
                    ? getFreeGroupHeight(slot.freeSlotCount) 
                    : slot.block 
                      ? getBlockHeight(slot.block.duration)
                      : '48px'
                }}
              >
                {/* Current time indicator line */}
                {isCurrentTimeSlot && (
                  <div 
                    className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                    style={{ top: `${currentMinutePercent}%` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                    <div className="flex-1 h-0.5 bg-orange/60" />
                  </div>
                )}

                {/* Time label */}
                <div className="w-16 flex-shrink-0 py-2 text-xs text-muted-foreground font-medium">
                  {formatHour(slot.startHour)}
                  {slot.isFreeGroup && slot.freeSlotCount > 1 && (
                    <span className="block text-[10px] opacity-60">
                      to {formatHour(slot.endHour)}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 py-1">
                  {slot.block ? (
                    <div
                      onClick={() => onBlockClick(slot.block!)}
                      style={{ height: '100%' }}
                      className={cn(
                        "rounded-xl px-3 py-2 cursor-pointer transition-all duration-200",
                        "hover:scale-[1.02] hover:shadow-md",
                        "flex flex-col justify-between",
                        ROUTINE_CATEGORY_COLORS[slot.block.category].bg
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={cn(
                            "font-medium text-sm",
                            ROUTINE_CATEGORY_COLORS[slot.block.category].text
                          )}>
                            {slot.block.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatHour(slot.block.startHour)} - {formatHour(slot.block.startHour + slot.block.duration)}
                          </p>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          ROUTINE_CATEGORY_COLORS[slot.block.category].badge,
                          ROUTINE_CATEGORY_COLORS[slot.block.category].text
                        )}>
                          {ROUTINE_CATEGORY_COLORS[slot.block.category].label}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="self-end opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className={cn(
                      "h-full rounded-xl border border-dashed border-border/40",
                      "flex items-center justify-center text-xs text-muted-foreground/50",
                      !slot.isPast && "hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer"
                    )}>
                      {!slot.isPast && (
                        <span className="flex items-center gap-1">
                          {slot.freeSlotCount > 1 
                            ? `${slot.freeSlotCount}h free` 
                            : 'Free slot'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current time indicator badge */}
      {currentHour >= 6 && currentHour <= 22 && (
        <div className="mt-2 flex items-center gap-2 text-xs bg-orange/10 text-orange px-3 py-1.5 rounded-full w-fit">
          <div className="w-2 h-2 rounded-full bg-orange animate-pulse" />
          <span className="font-medium">Now: {formatHour(currentHour)}</span>
        </div>
      )}
    </div>
  );
}
