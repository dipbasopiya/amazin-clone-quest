import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TodayTimetable } from '@/components/routine/TodayTimetable';
import { PendingTasksCard } from '@/components/routine/PendingTasksCard';
import { DaySummaryCard } from '@/components/routine/DaySummaryCard';
import { AIGuidanceCard } from '@/components/routine/AIGuidanceCard';
import { BlockFormModal } from '@/components/routine/BlockFormModal';
import { BentoCard } from '@/components/dashboard/BentoCard';
import { useRoutine } from '@/hooks/useRoutine';
import { useTasks } from '@/hooks/useTasks';
import { RoutineBlock } from '@/types/routine';
import { Task, TaskCategory } from '@/types/fluxion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

type RoutineCategory = TaskCategory | 'break';

export default function Routine() {
  const { blocks, addBlock, updateBlock, deleteBlock, getBlocksForDay, hasConflict } = useRoutine();
  const { tasks, toggleTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<RoutineBlock | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [defaultHour, setDefaultHour] = useState(9);

  // Get today's day of week (0 = Sunday, 1 = Monday, etc.)
  const today = new Date();
  const todayDayOfWeek = today.getDay();
  const currentHour = today.getHours();
  
  // Get blocks for today
  const todayBlocks = useMemo(() => getBlocksForDay(todayDayOfWeek), [getBlocksForDay, todayDayOfWeek]);

  const handleBlockClick = (block: RoutineBlock) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    // Find the next available hour slot
    const nextAvailableHour = Math.max(currentHour + 1, 6);
    setDefaultHour(nextAvailableHour);
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const handleSave = (data: { title: string; category: RoutineCategory; day: number; startHour: number; startMinute: number; duration: number }) => {
    const excludeId = editingBlock?.id;
    
    // Check if trying to schedule in the past
    if (data.day === todayDayOfWeek && data.startHour < currentHour) {
      toast.error("Can't schedule in the past", {
        description: "Please select a future time slot.",
      });
      return;
    }
    
    if (hasConflict(data.day, data.startHour, data.duration, excludeId)) {
      toast.error("Time Conflict", {
        description: "This time slot overlaps with an existing block.",
      });
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
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("AI plan generated", {
        description: "Review and apply the suggested schedule.",
      });
    }, 1500);
  };

  const handleApplyPlan = () => {
    toast.success("Plan applied", {
      description: "Your schedule has been updated.",
    });
  };

  const handleMarkTaskComplete = (taskId: string) => {
    toggleTask(taskId);
    toast.success("Task marked complete");
  };

  const handleAddTaskToTimetable = (task: Task) => {
    // Find next available slot
    const nextHour = Math.max(currentHour + 1, 9);
    if (!hasConflict(todayDayOfWeek, nextHour, 1)) {
      addBlock(task.title, task.category, todayDayOfWeek, nextHour, 0, 1);
      toast.success("Task added to timetable", {
        description: `Scheduled for ${nextHour > 12 ? nextHour - 12 : nextHour} ${nextHour >= 12 ? 'PM' : 'AM'}`,
      });
    } else {
      toast.error("No available slots", {
        description: "Try a different time or clear some blocks.",
      });
    }
  };

  const handleDeferTask = (task: Task) => {
    toast.info("Task deferred", {
      description: "You can reschedule it for another day.",
    });
  };

  const handleAISuggestionApply = (suggestionId: string) => {
    switch (suggestionId) {
      case 'no-breaks':
        // Add a break at the next available slot
        const breakHour = Math.max(currentHour + 2, 12);
        if (!hasConflict(todayDayOfWeek, breakHour, 0.5)) {
          addBlock('Short Break', 'break', todayDayOfWeek, breakHour, 0, 0.5);
          toast.success("Break added to your schedule");
        }
        break;
      case 'morning-slot':
        setDefaultHour(9);
        setEditingBlock(null);
        setIsModalOpen(true);
        break;
      case 'empty-schedule':
        handleAddClick();
        break;
      default:
        break;
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-foreground mb-1">Routine</h1>
          <p className="text-muted-foreground">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2 rounded-full px-6">
          <Plus className="w-4 h-4" />
          Add Block
        </Button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Primary Card: Today's Timetable - Takes 2 columns */}
        <BentoCard className="lg:col-span-2 lg:row-span-2 min-h-[500px]" delay={0}>
          <TodayTimetable
            blocks={todayBlocks}
            tasks={tasks}
            onBlockClick={handleBlockClick}
            onGenerateAIPlan={handleGenerateAIPlan}
            onApplyPlan={handleApplyPlan}
            isGenerating={isGenerating}
          />
        </BentoCard>

        {/* Day Summary Card */}
        <BentoCard className="min-h-[200px]" colorVariant="blue" delay={1}>
          <DaySummaryCard blocks={todayBlocks} />
        </BentoCard>

        {/* AI Guidance Card */}
        <BentoCard className="min-h-[200px]" colorVariant="lavender" delay={2}>
          <AIGuidanceCard
            blocks={todayBlocks}
            tasks={tasks}
            onApply={handleAISuggestionApply}
          />
        </BentoCard>

        {/* Pending Tasks Card - Full width on mobile, 2 columns on desktop */}
        <BentoCard className="lg:col-span-2 min-h-[250px]" delay={3}>
          <PendingTasksCard
            tasks={tasks}
            onMarkComplete={handleMarkTaskComplete}
            onAddToTimetable={handleAddTaskToTimetable}
            onDefer={handleDeferTask}
          />
        </BentoCard>

        {/* Additional info or quick actions could go here */}
        <BentoCard className="min-h-[100px]" colorVariant="peach" delay={4}>
          <div className="h-full flex flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground mb-2">Quick tip</p>
            <p className="text-xs text-muted-foreground">
              Drag tasks from Pending to your timetable to schedule them quickly.
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
    </MainLayout>
  );
}
