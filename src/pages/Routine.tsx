import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TodayTimetable } from '@/components/routine/TodayTimetable';
import { PendingTasksCard } from '@/components/routine/PendingTasksCard';
import { DaySummaryCard } from '@/components/routine/DaySummaryCard';
import { AIGuidanceCard } from '@/components/routine/AIGuidanceCard';
import { BlockFormModal } from '@/components/routine/BlockFormModal';
import { BentoCard } from '@/components/dashboard/BentoCard';
import { useRoutine } from '@/hooks/useRoutine';
import { useRoutineCompletion } from '@/hooks/useRoutineCompletion';
import { RoutineBlock } from '@/types/routine';
import { TaskCategory } from '@/types/fluxion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

type RoutineCategory = TaskCategory | 'break';

export default function Routine() {
  const { blocks, addBlock, updateBlock, deleteBlock, getBlocksForDay, hasConflict } = useRoutine();
  const { todayRoutineTasks, toggleRoutineTaskCompletion } = useRoutineCompletion(blocks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<RoutineBlock | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [defaultHour, setDefaultHour] = useState(9);

  const today = new Date();
  const todayDayOfWeek = today.getDay();
  const currentHour = today.getHours();
  
  const todayBlocks = useMemo(() => getBlocksForDay(todayDayOfWeek), [getBlocksForDay, todayDayOfWeek]);

  const handleBlockClick = (block: RoutineBlock) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    const nextAvailableHour = Math.max(currentHour + 1, 6);
    setDefaultHour(nextAvailableHour);
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const handleSave = (data: { title: string; category: RoutineCategory; day: number; startHour: number; startMinute: number; duration: number }) => {
    const excludeId = editingBlock?.id;
    
    if (data.day === todayDayOfWeek && data.startHour < currentHour) {
      toast.error("Can't schedule in the past");
      return;
    }
    
    if (hasConflict(data.day, data.startHour, data.duration, excludeId)) {
      toast.error("Time slot overlaps with existing block");
      return;
    }

    if (editingBlock) {
      updateBlock(editingBlock.id, data);
      toast.success("Block updated");
    } else {
      addBlock(data.title, data.category, data.day, data.startHour, data.startMinute, data.duration);
      toast.success("Block added");
    }
    setIsModalOpen(false);
    setEditingBlock(null);
  };

  const handleDelete = () => {
    if (editingBlock) {
      deleteBlock(editingBlock.id);
      toast.success("Block deleted");
      setIsModalOpen(false);
      setEditingBlock(null);
    }
  };

  const handleGenerateAIPlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("AI plan generated");
    }, 1500);
  };

  const handleApplyPlan = () => {
    toast.success("Plan applied");
  };

  const handleToggleRoutineTask = (blockId: string) => {
    toggleRoutineTaskCompletion(blockId);
  };

  const handleAISuggestionApply = (suggestionId: string) => {
    if (suggestionId === 'no-breaks') {
      const breakHour = Math.max(currentHour + 2, 12);
      if (!hasConflict(todayDayOfWeek, breakHour, 0.5)) {
        addBlock('Short Break', 'break', todayDayOfWeek, breakHour, 0, 0.5);
        toast.success("Break added");
      }
    } else {
      handleAddClick();
    }
  };

  return (
    <MainLayout>
      <div className="page-transition">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display text-foreground mb-1">Routine</h1>
            <p className="text-muted-foreground">
              {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Button onClick={handleAddClick} className="gap-2 rounded-full px-6 shadow-soft hover:shadow-glow transition-all duration-400">
            <Plus className="w-4 h-4" />
            Add Block
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Primary card - Today's Schedule with emphasis */}
          <BentoCard className="lg:col-span-2 lg:row-span-2 min-h-[500px] ring-2 ring-primary/15 ring-offset-2 ring-offset-surface-0" delay={0} elevated>
            <TodayTimetable
              blocks={todayBlocks}
              routineTasks={todayRoutineTasks}
              onBlockClick={handleBlockClick}
              onToggleTask={handleToggleRoutineTask}
              onGenerateAIPlan={handleGenerateAIPlan}
              onApplyPlan={handleApplyPlan}
              isGenerating={isGenerating}
            />
          </BentoCard>

          <BentoCard className="min-h-[200px]" colorVariant="cyan" delay={1}>
            <DaySummaryCard blocks={todayBlocks} routineTasks={todayRoutineTasks} />
          </BentoCard>

          <BentoCard className="min-h-[200px]" colorVariant="green" delay={2}>
            <AIGuidanceCard blocks={todayBlocks} routineTasks={todayRoutineTasks} onApply={handleAISuggestionApply} />
          </BentoCard>

          <BentoCard className="lg:col-span-2 min-h-[250px]" delay={3}>
            <PendingTasksCard routineTasks={todayRoutineTasks} onMarkComplete={handleToggleRoutineTask} />
          </BentoCard>

          <BentoCard className="min-h-[100px]" colorVariant="peach" delay={4}>
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <p className="text-sm font-medium text-peach-foreground mb-1">Quick tip</p>
              <p className="text-xs text-peach-foreground/70">
                Tasks sync between Home and Routine pages
              </p>
            </div>
          </BentoCard>
        </div>

        <BlockFormModal
          open={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingBlock(null); }}
          onSave={handleSave}
          onDelete={editingBlock ? handleDelete : undefined}
          initialData={editingBlock || undefined}
          defaultDay={todayDayOfWeek}
          defaultHour={defaultHour}
        />
      </div>
    </MainLayout>
  );
}
