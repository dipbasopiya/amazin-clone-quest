import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WeekSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  weekDates: Date[];
}

export function WeekSelector({ selectedDate, onDateChange, weekDates }: WeekSelectorProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goToPrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  const monthYear = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={goToPrevWeek} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-lg font-medium text-foreground min-w-[160px] text-center">
          {monthYear}
        </span>
        <Button variant="ghost" size="icon" onClick={goToNextWeek} className="rounded-full">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Week Days */}
      <div className="flex items-center gap-3">
        {weekDates.map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          const dayIndex = (index + 1) % 7; // Adjust for Mon-Sun

          return (
            <button
              key={index}
              onClick={() => onDateChange(date)}
              className={cn(
                'flex flex-col items-center py-3 px-4 rounded-2xl transition-all min-w-[70px]',
                isSelected
                  ? 'bg-[#d4f542] text-[#2a3a0a] shadow-md'
                  : 'bg-card hover:bg-muted text-foreground'
              )}
            >
              <span className="text-xs font-medium opacity-70">{days[index]}</span>
              <span className="text-xl font-semibold mt-1">{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
