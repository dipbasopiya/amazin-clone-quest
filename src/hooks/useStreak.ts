import { useMemo } from 'react';
import { Task, FocusSession } from '@/types/fluxion';
import { CompletionRecord } from './useRoutineCompletion';

export function useStreak(
  tasks: Task[], 
  sessions: FocusSession[],
  routineCompletions: CompletionRecord[] = []
) {
  const streak = useMemo(() => {
    const productiveDays = new Set<string>();
    
    tasks.forEach((task) => {
      if (task.completed) {
        const date = new Date(task.createdAt).toISOString().split('T')[0];
        productiveDays.add(date);
      }
    });
    
    sessions.forEach((session) => {
      if (session.duration >= 300) { // At least 5 minutes
        productiveDays.add(session.date);
      }
    });

    // Include routine block completions
    routineCompletions.forEach((completion) => {
      productiveDays.add(completion.date);
    });

    const sortedDays = Array.from(productiveDays).sort().reverse();
    
    if (sortedDays.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (sortedDays[0] !== today && sortedDays[0] !== yesterday) {
      return 0;
    }

    let currentStreak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const currentDate = new Date(sortedDays[i - 1]);
      const prevDate = new Date(sortedDays[i]);
      const diffDays = (currentDate.getTime() - prevDate.getTime()) / 86400000;
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    return currentStreak;
  }, [tasks, sessions, routineCompletions]);

  return streak;
}
