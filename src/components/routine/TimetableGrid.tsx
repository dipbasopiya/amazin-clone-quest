import { useMemo, useRef, useState } from 'react';
import { RoutineBlock, DAYS, HOURS } from '@/types/routine';
import { CATEGORY_COLORS } from '@/types/fluxion';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface TimetableGridProps {
  blocks: RoutineBlock[];
  onBlockClick: (block: RoutineBlock) => void;
  onCellClick: (day: number, hour: number) => void;
  onBlockMove: (id: string, day: number, startHour: number) => void;
}

const HOUR_HEIGHT = 60; // px per hour

export function TimetableGrid({ blocks, onBlockClick, onCellClick, onBlockMove }: TimetableGridProps) {
  const [draggedBlock, setDraggedBlock] = useState<RoutineBlock | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const blocksByDay = useMemo(() => {
    const map: Record<number, RoutineBlock[]> = {};
    for (let i = 0; i < 7; i++) map[i] = [];
    blocks.forEach((block) => {
      map[block.day].push(block);
    });
    return map;
  }, [blocks]);

  const handleDragStart = (e: React.DragEvent, block: RoutineBlock) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', block.id);
    
    // Create invisible drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: number, hour: number) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('text/plain');
    if (blockId) {
      onBlockMove(blockId, day, hour);
    }
    setDraggedBlock(null);
  };

  const formatHour = (hour: number) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h} ${ampm}`;
  };

  return (
    <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-8 border-b border-border">
        <div className="p-3 text-xs font-medium text-muted-foreground" />
        {DAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              'p-3 text-center text-sm font-medium',
              i === new Date().getDay() ? 'bg-primary/10 text-primary' : 'text-foreground'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="relative grid grid-cols-8">
        {/* Time column */}
        <div className="border-r border-border">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-[60px] px-2 py-1 text-xs text-muted-foreground text-right border-b border-border/50"
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {DAYS.map((_, dayIndex) => (
          <div key={dayIndex} className="relative border-r border-border/50 last:border-r-0">
            {/* Hour cells */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-[60px] border-b border-border/30 hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => onCellClick(dayIndex, hour)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, dayIndex, hour)}
              />
            ))}

            {/* Blocks */}
            {blocksByDay[dayIndex].map((block) => {
              const top = (block.startHour - HOURS[0]) * HOUR_HEIGHT;
              const height = block.duration * HOUR_HEIGHT - 4;
              const colors = CATEGORY_COLORS[block.category];

              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBlockClick(block);
                  }}
                  className={cn(
                    'absolute left-1 right-1 rounded-lg p-2 cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02] hover:shadow-md',
                    colors.bg,
                    colors.text,
                    draggedBlock?.id === block.id && 'opacity-50'
                  )}
                  style={{ top: `${top}px`, height: `${height}px` }}
                >
                  <div className="flex items-start gap-1">
                    <GripVertical className="w-3 h-3 opacity-50 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{block.title}</p>
                      {block.duration >= 1 && (
                        <p className="text-xs opacity-70">
                          {formatHour(block.startHour)} - {formatHour(block.startHour + block.duration)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
