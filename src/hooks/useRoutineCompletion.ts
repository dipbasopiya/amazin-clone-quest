import { useCallback, useMemo } from 'react';
import { RoutineBlock } from '@/types/routine';
import { TaskCategory } from '@/types/fluxion';
import { useLocalStorage } from './useLocalStorage';

export interface RoutineTaskCompletion {
  blockId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
}

export interface RoutineTask {
  id: string;
  blockId: string;
  title: string;
  category: TaskCategory | 'break';
  startHour: number;
  startMinute: number;
  duration: number;
  completed: boolean;
  completedAt?: string;
  date: string;
}

export function useRoutineCompletion(blocks: RoutineBlock[]) {
  const [completions, setCompletions] = useLocalStorage<RoutineTaskCompletion[]>(
    'fluxion-routine-completions',
    []
  );

  // Get today's date string
  const getTodayDateString = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Get date string for any date
  const getDateString = useCallback((date: Date) => {
    return date.toISOString().split('T')[0];
  }, []);

  // Toggle completion for a routine block on a specific date
  const toggleRoutineTaskCompletion = useCallback((blockId: string, date?: string) => {
    const dateStr = date || getTodayDateString();
    
    setCompletions((prev) => {
      const existing = prev.find((c) => c.blockId === blockId && c.date === dateStr);
      
      if (existing) {
        // Toggle existing completion
        if (existing.completed) {
          // Uncomplete - remove the completion record
          return prev.filter((c) => !(c.blockId === blockId && c.date === dateStr));
        } else {
          // Mark complete
          return prev.map((c) =>
            c.blockId === blockId && c.date === dateStr
              ? { ...c, completed: true, completedAt: new Date().toISOString() }
              : c
          );
        }
      } else {
        // Create new completion
        return [
          ...prev,
          {
            blockId,
            date: dateStr,
            completed: true,
            completedAt: new Date().toISOString(),
          },
        ];
      }
    });
  }, [setCompletions, getTodayDateString]);

  // Get today's routine tasks with completion state
  const todayRoutineTasks = useMemo(() => {
    const todayDateStr = getTodayDateString();
    const todayDayOfWeek = new Date().getDay();

    // Filter blocks for today's day of week (excluding breaks)
    const todayBlocks = blocks.filter(
      (block) => block.day === todayDayOfWeek && block.category !== 'break'
    );

    // Map blocks to routine tasks with completion state
    return todayBlocks
      .map((block): RoutineTask => {
        const completion = completions.find(
          (c) => c.blockId === block.id && c.date === todayDateStr
        );

        return {
          id: `${block.id}-${todayDateStr}`,
          blockId: block.id,
          title: block.title,
          category: block.category,
          startHour: block.startHour,
          startMinute: block.startMinute || 0,
          duration: block.duration,
          completed: completion?.completed || false,
          completedAt: completion?.completedAt,
          date: todayDateStr,
        };
      })
      .sort((a, b) => {
        const aTime = a.startHour * 60 + a.startMinute;
        const bTime = b.startHour * 60 + b.startMinute;
        return aTime - bTime;
      });
  }, [blocks, completions, getTodayDateString]);

  // Get completed count for today
  const todayCompletedCount = useMemo(() => {
    return todayRoutineTasks.filter((t) => t.completed).length;
  }, [todayRoutineTasks]);

  // Get routine tasks for a specific date
  const getRoutineTasksForDate = useCallback((date: Date) => {
    const dateStr = getDateString(date);
    const dayOfWeek = date.getDay();

    const dayBlocks = blocks.filter(
      (block) => block.day === dayOfWeek && block.category !== 'break'
    );

    return dayBlocks.map((block): RoutineTask => {
      const completion = completions.find(
        (c) => c.blockId === block.id && c.date === dateStr
      );

      return {
        id: `${block.id}-${dateStr}`,
        blockId: block.id,
        title: block.title,
        category: block.category,
        startHour: block.startHour,
        startMinute: block.startMinute || 0,
        duration: block.duration,
        completed: completion?.completed || false,
        completedAt: completion?.completedAt,
        date: dateStr,
      };
    });
  }, [blocks, completions, getDateString]);

  // Get all completions for analytics
  const getCompletionsForDateRange = useCallback((startDate: Date, endDate: Date) => {
    const results: { date: string; tasksCompleted: number; totalTasks: number }[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = getDateString(current);
      const dayOfWeek = current.getDay();
      
      const dayBlocks = blocks.filter(
        (block) => block.day === dayOfWeek && block.category !== 'break'
      );
      
      const completedCount = dayBlocks.filter((block) =>
        completions.some((c) => c.blockId === block.id && c.date === dateStr && c.completed)
      ).length;

      results.push({
        date: dateStr,
        tasksCompleted: completedCount,
        totalTasks: dayBlocks.length,
      });

      current.setDate(current.getDate() + 1);
    }

    return results;
  }, [blocks, completions, getDateString]);

  // Check if all tasks are completed for a date (for streak calculation)
  const isAllTasksCompletedForDate = useCallback((date: Date) => {
    const tasks = getRoutineTasksForDate(date);
    if (tasks.length === 0) return false;
    return tasks.every((t) => t.completed);
  }, [getRoutineTasksForDate]);

  // Get current streak (consecutive days with all tasks completed)
  const currentStreak = useMemo(() => {
    const hasAnyTaskBlocks = blocks.some((b) => b.category !== 'break');
    if (!hasAnyTaskBlocks) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check from yesterday backwards (today might not be complete yet)
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);

    // Hard cap the number of days we look back to avoid infinite loops
    let checkedDays = 0;
    while (checkedDays < 370) {
      checkedDays++;

      const tasks = getRoutineTasksForDate(checkDate);
      if (tasks.length === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }

      if (tasks.every((t) => t.completed)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }

      break;
    }

    // Also check if today is complete, add to streak
    if (todayRoutineTasks.length > 0 && todayRoutineTasks.every((t) => t.completed)) {
      streak++;
    }

    return streak;
  }, [blocks, getRoutineTasksForDate, todayRoutineTasks]);

  // Count productive days (days with at least one task completed)
  const productiveDays = useMemo(() => {
    const uniqueDates = new Set<string>();
    completions.forEach((c) => {
      if (c.completed) {
        uniqueDates.add(c.date);
      }
    });
    return uniqueDates.size;
  }, [completions]);

  // Total tasks completed all time
  const totalTasksCompleted = useMemo(() => {
    return completions.filter((c) => c.completed).length;
  }, [completions]);

  return {
    completions,
    todayRoutineTasks,
    todayCompletedCount,
    toggleRoutineTaskCompletion,
    getRoutineTasksForDate,
    getCompletionsForDateRange,
    isAllTasksCompletedForDate,
    currentStreak,
    productiveDays,
    totalTasksCompleted,
  };
}
