import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface CompletionRecord {
  blockId: string;
  completedAt: string;
}

interface DailyCompletions {
  date: string;
  completions: CompletionRecord[];
}

export function useRoutineCompletion() {
  const todayKey = new Date().toISOString().split('T')[0];
  
  const [dailyCompletions, setDailyCompletions] = useLocalStorage<DailyCompletions>(
    `fluxion-routine-completions-${todayKey}`,
    { date: todayKey, completions: [] }
  );

  const toggleBlockCompletion = useCallback((blockId: string) => {
    setDailyCompletions((prev) => {
      const isCompleted = prev.completions.some((c) => c.blockId === blockId);
      
      if (isCompleted) {
        return {
          ...prev,
          completions: prev.completions.filter((c) => c.blockId !== blockId),
        };
      } else {
        return {
          ...prev,
          completions: [
            ...prev.completions,
            { blockId, completedAt: new Date().toISOString() },
          ],
        };
      }
    });
  }, [setDailyCompletions]);

  const isBlockCompleted = useCallback((blockId: string) => {
    return dailyCompletions.completions.some((c) => c.blockId === blockId);
  }, [dailyCompletions.completions]);

  const getCompletedBlockIds = useMemo(() => {
    return new Set(dailyCompletions.completions.map((c) => c.blockId));
  }, [dailyCompletions.completions]);

  const isBlockMissed = useCallback((blockId: string, endHour: number) => {
    const currentHour = new Date().getHours();
    const isCompleted = isBlockCompleted(blockId);
    return !isCompleted && endHour <= currentHour;
  }, [isBlockCompleted]);

  return {
    toggleBlockCompletion,
    isBlockCompleted,
    isBlockMissed,
    getCompletedBlockIds,
    completedCount: dailyCompletions.completions.length,
  };
}
