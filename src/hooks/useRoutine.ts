import { useCallback, useMemo } from 'react';
import { RoutineBlock } from '@/types/routine';
import { TaskCategory } from '@/types/fluxion';
import { useLocalStorage } from './useLocalStorage';

export function useRoutine() {
  const [blocks, setBlocks] = useLocalStorage<RoutineBlock[]>('fluxion-routine-blocks', []);

  const addBlock = useCallback((
    title: string,
    category: TaskCategory | 'break',
    day: number,
    startHour: number,
    startMinute: number,
    duration: number
  ) => {
    const newBlock: RoutineBlock = {
      id: crypto.randomUUID(),
      title,
      category,
      day,
      startHour,
      startMinute,
      duration,
    };
    setBlocks((prev) => [...prev, newBlock]);
    return newBlock;
  }, [setBlocks]);

  const updateBlock = useCallback((id: string, updates: Partial<Omit<RoutineBlock, 'id'>>) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  }, [setBlocks]);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  }, [setBlocks]);

  const moveBlock = useCallback((id: string, day: number, startHour: number) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, day, startHour } : block
      )
    );
  }, [setBlocks]);

  const getBlocksForDay = useCallback((day: number) => {
    return blocks
      .filter((block) => block.day === day)
      .sort((a, b) => {
        const aTime = a.startHour * 60 + (a.startMinute || 0);
        const bTime = b.startHour * 60 + (b.startMinute || 0);
        return aTime - bTime;
      });
  }, [blocks]);

  const hasConflict = useCallback((
    day: number,
    startHour: number,
    duration: number,
    excludeId?: string
  ) => {
    const endHour = startHour + duration;
    return blocks.some((block) => {
      if (block.id === excludeId) return false;
      if (block.day !== day) return false;
      const blockEnd = block.startHour + block.duration;
      return (startHour < blockEnd && endHour > block.startHour);
    });
  }, [blocks]);

  const totalHoursByCategory = useMemo(() => {
    const totals: Record<TaskCategory | 'break', number> = {
      dsa: 0,
      coding: 0,
      project: 0,
      academic: 0,
      personal: 0,
      break: 0,
    };
    blocks.forEach((block) => {
      totals[block.category] += block.duration;
    });
    return totals;
  }, [blocks]);

  return {
    blocks,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    getBlocksForDay,
    hasConflict,
    totalHoursByCategory,
  };
}
