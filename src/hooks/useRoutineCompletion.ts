import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface CompletionRecord {
  blockId: string;
  completedAt: string;
  date: string;
}

interface CompletionHistory {
  completions: CompletionRecord[];
}

export function useRoutineCompletion() {
  const todayKey = new Date().toISOString().split('T')[0];
  
  // Store all completions in a single history object
  const [history, setHistory] = useLocalStorage<CompletionHistory>(
    'fluxion-routine-completions',
    { completions: [] }
  );

  // Get today's completions
  const todayCompletions = useMemo(() => {
    return history.completions.filter((c) => c.date === todayKey);
  }, [history.completions, todayKey]);

  const toggleBlockCompletion = useCallback((blockId: string) => {
    setHistory((prev) => {
      const existingCompletion = prev.completions.find(
        (c) => c.blockId === blockId && c.date === todayKey
      );
      
      if (existingCompletion) {
        // Remove completion
        return {
          completions: prev.completions.filter(
            (c) => !(c.blockId === blockId && c.date === todayKey)
          ),
        };
      } else {
        // Add completion
        return {
          completions: [
            ...prev.completions,
            { 
              blockId, 
              completedAt: new Date().toISOString(),
              date: todayKey,
            },
          ],
        };
      }
    });
  }, [setHistory, todayKey]);

  const isBlockCompleted = useCallback((blockId: string) => {
    return todayCompletions.some((c) => c.blockId === blockId);
  }, [todayCompletions]);

  const getCompletedBlockIds = useMemo(() => {
    return new Set(todayCompletions.map((c) => c.blockId));
  }, [todayCompletions]);

  const isBlockMissed = useCallback((blockId: string, endHour: number) => {
    const currentHour = new Date().getHours();
    const isCompleted = isBlockCompleted(blockId);
    return !isCompleted && endHour <= currentHour;
  }, [isBlockCompleted]);

  // Get completions count for a specific date
  const getCompletionsForDate = useCallback((date: string) => {
    return history.completions.filter((c) => c.date === date);
  }, [history.completions]);

  // Get all dates that have completions
  const getProductiveDatesFromRoutine = useMemo(() => {
    const dates = new Set<string>();
    history.completions.forEach((c) => dates.add(c.date));
    return dates;
  }, [history.completions]);

  // Get total completions count (all time)
  const totalCompletionsAllTime = useMemo(() => {
    return history.completions.length;
  }, [history.completions]);

  // Get all completions (for analytics)
  const allCompletions = useMemo(() => {
    return history.completions;
  }, [history.completions]);

  return {
    toggleBlockCompletion,
    isBlockCompleted,
    isBlockMissed,
    getCompletedBlockIds,
    completedCount: todayCompletions.length,
    todayCompletions,
    getCompletionsForDate,
    getProductiveDatesFromRoutine,
    totalCompletionsAllTime,
    allCompletions,
  };
}
