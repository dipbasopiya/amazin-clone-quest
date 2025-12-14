import { RoutineBlock, ROUTINE_CATEGORY_COLORS } from '@/types/routine';
import { GripVertical, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoutineCardProps {
  block: RoutineBlock;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}

export function RoutineCard({ block, onClick, onDragStart, onDragEnd, isDragging }: RoutineCardProps) {
  const colors = ROUTINE_CATEGORY_COLORS[block.category];
  
  const formatTime = (hour: number, minute: number = 0) => {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const endHour = block.startHour + Math.floor(block.duration);
  const endMinute = ((block.startMinute || 0) + (block.duration % 1) * 60) % 60;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md',
        colors.bg,
        isDragging && 'opacity-50 scale-95'
      )}
    >
      <div className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="w-5 h-5 opacity-40" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className={cn('font-semibold text-base', colors.text)}>{block.title}</h3>
        <div className={cn('flex items-center gap-1.5 mt-1', colors.text, 'opacity-70')}>
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {formatTime(block.startHour, block.startMinute)} - {formatTime(endHour, endMinute)}
          </span>
        </div>
      </div>

      <span className={cn(
        'px-4 py-1.5 rounded-full text-sm font-medium',
        colors.badge,
        colors.text
      )}>
        {colors.label}
      </span>
    </div>
  );
}
