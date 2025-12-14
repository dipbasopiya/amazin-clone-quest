import { useState, useMemo } from 'react';
import { RoutineBlock } from '@/types/routine';
import { Task } from '@/types/fluxion';
import { Button } from '@/components/ui/button';
import { Lightbulb, X, ChevronRight, AlertTriangle, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIGuidanceCardProps {
  blocks: RoutineBlock[];
  tasks: Task[];
  onDismiss?: (suggestionId: string) => void;
  onApply?: (suggestionId: string) => void;
}

interface Suggestion {
  id: string;
  type: 'warning' | 'tip' | 'encouragement';
  icon: typeof AlertTriangle;
  message: string;
  action?: string;
}

export function AIGuidanceCard({
  blocks,
  tasks,
  onDismiss,
  onApply,
}: AIGuidanceCardProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => {
    const result: Suggestion[] = [];
    const now = new Date();
    const currentHour = now.getHours();
    
    // Calculate metrics
    const totalScheduledHours = blocks.reduce((acc, b) => acc + b.duration, 0);
    const availableHours = 22 - Math.max(6, currentHour);
    const remainingFreeHours = Math.max(0, availableHours - totalScheduledHours);
    const pendingTasks = tasks.filter(t => !t.completed && t.deadline);
    const overdueTasks = pendingTasks.filter(t => new Date(t.deadline!) < now);
    const urgentTasks = pendingTasks.filter(t => {
      const deadline = new Date(t.deadline!);
      const hoursUntilDue = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilDue > 0 && hoursUntilDue <= 24;
    });

    // Priority 1: Overdue tasks (highest priority)
    if (overdueTasks.length > 0) {
      result.push({
        id: 'overdue-tasks',
        type: 'warning',
        icon: AlertTriangle,
        message: `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''} need immediate attention. You have ${remainingFreeHours}h free to work on them.`,
        action: 'View Tasks',
      });
    }

    // Priority 2: Urgent tasks due today
    if (urgentTasks.length > 0 && overdueTasks.length === 0) {
      result.push({
        id: 'urgent-tasks',
        type: 'warning',
        icon: AlertTriangle,
        message: `${urgentTasks.length} task${urgentTasks.length > 1 ? 's' : ''} due in the next 24h. Consider scheduling them in your ${remainingFreeHours}h of free time.`,
        action: 'Schedule Now',
      });
    }

    // Priority 3: Overscheduling
    if (totalScheduledHours > availableHours) {
      result.push({
        id: 'overscheduled',
        type: 'warning',
        icon: AlertTriangle,
        message: `Scheduled ${totalScheduledHours}h but only ${availableHours}h remain today. Consider moving ${totalScheduledHours - availableHours}h to tomorrow.`,
        action: 'Optimize',
      });
    }

    // Context-aware tips based on time of day and schedule
    const hasBreaks = blocks.some(b => b.category === 'break');
    const morningBlocks = blocks.filter(b => b.startHour >= 6 && b.startHour < 12);
    const afternoonBlocks = blocks.filter(b => b.startHour >= 12 && b.startHour < 17);

    // Morning suggestions (before noon)
    if (currentHour < 12) {
      if (morningBlocks.length === 0 && remainingFreeHours >= 2) {
        result.push({
          id: 'morning-slot',
          type: 'tip',
          icon: Target,
          message: 'Peak focus time! Your morning is free. Schedule your most challenging task now.',
          action: 'Add Task',
        });
      }
    }

    // Afternoon suggestions
    if (currentHour >= 12 && currentHour < 17) {
      if (afternoonBlocks.length === 0 && remainingFreeHours >= 2) {
        result.push({
          id: 'afternoon-slot',
          type: 'tip',
          icon: Lightbulb,
          message: `${remainingFreeHours}h free this afternoon. Good time for collaborative work or meetings.`,
          action: 'Schedule',
        });
      }
    }

    // Break reminder
    if (blocks.length >= 3 && !hasBreaks && totalScheduledHours > 4) {
      result.push({
        id: 'no-breaks',
        type: 'tip',
        icon: Lightbulb,
        message: `${totalScheduledHours}h scheduled without breaks. Add 15-min breaks every 2h for sustained focus.`,
        action: 'Add Break',
      });
    }

    // Empty schedule guidance
    if (blocks.length === 0) {
      result.push({
        id: 'empty-schedule',
        type: 'encouragement',
        icon: Zap,
        message: `${availableHours}h available today. Start with your highest-priority task to build momentum.`,
        action: 'Get Started',
      });
    }

    // Positive reinforcement
    if (blocks.length >= 3 && totalScheduledHours <= availableHours && overdueTasks.length === 0) {
      result.push({
        id: 'good-progress',
        type: 'encouragement',
        icon: Zap,
        message: `Great balance! ${totalScheduledHours}h planned with ${remainingFreeHours}h buffer for unexpected tasks.`,
      });
    }

    return result.filter(s => !dismissedIds.has(s.id)).slice(0, 2); // Limit to 2 suggestions
  }, [blocks, tasks, dismissedIds]);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
    onDismiss?.(id);
  };

  const getIconColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'warning': return 'text-destructive';
      case 'tip': return 'text-primary';
      case 'encouragement': return 'text-soft-green-foreground';
    }
  };

  const getBgColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'warning': return 'bg-destructive/10';
      case 'tip': return 'bg-primary/10';
      case 'encouragement': return 'bg-soft-green/30';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-lavender/50">
          <Lightbulb className="w-5 h-5 text-lavender-foreground" />
        </div>
        <h3 className="font-semibold text-foreground">AI Guidance</h3>
      </div>

      {/* Suggestions */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {suggestions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground text-center">
              No suggestions right now. You're on track! ✨
            </p>
          </div>
        ) : (
          suggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={suggestion.id}
                className={cn(
                  "p-3 rounded-xl transition-all duration-200",
                  "animate-fade-in",
                  getBgColor(suggestion.type)
                )}
              >
                <div className="flex items-start gap-2">
                  <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", getIconColor(suggestion.type))} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed">
                      {suggestion.message}
                    </p>
                    {suggestion.action && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApply?.(suggestion.id)}
                        className="h-6 px-2 mt-1.5 text-xs gap-1 hover:bg-background/50"
                      >
                        {suggestion.action}
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(suggestion.id)}
                    className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
