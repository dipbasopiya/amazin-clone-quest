import { BentoCard } from './BentoCard';
import { TaskCategory, CATEGORY_COLORS } from '@/types/fluxion';
import { Play, Pause, Square, AlertTriangle, Clock, Plus, CheckCircle2, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TimerStatus, ActiveTask } from '@/hooks/useActiveTaskTimer';
import { motion, AnimatePresence } from 'framer-motion';
import { RoutineTask } from '@/hooks/useRoutineCompletion';

interface ActiveTaskCardProps {
  activeTask: ActiveTask | null;
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  timerStatus: TimerStatus;
  onStart: (task: ActiveTask) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: (markCompleted?: boolean) => void;
  onAddTime: (minutes: number) => void;
  formatTime: (seconds: number) => string;
  formatOvertime: (seconds: number) => string;
  getTimeDisplay: () => { remaining: number; overtime: number; progress: number; totalElapsed: number };
  routineTasks: RoutineTask[];
}

const formatTaskTime = (hour: number, minute: number): string => {
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  const period = hour < 12 ? 'AM' : 'PM';
  return `${h}:${m} ${period}`;
};

export function ActiveTaskCard({
  activeTask,
  isRunning,
  isPaused,
  elapsedSeconds,
  timerStatus,
  onStart,
  onPause,
  onResume,
  onStop,
  onAddTime,
  formatTime,
  formatOvertime,
  getTimeDisplay,
  routineTasks,
}: ActiveTaskCardProps) {
  const { remaining, overtime, progress } = getTimeDisplay();
  
  // Find next incomplete task from routine
  const getNextTask = (): RoutineTask | null => {
    const incompleteTasks = routineTasks.filter(t => !t.completed && t.category !== 'break');
    if (incompleteTasks.length === 0) return null;
    
    // If there's an active task, find the next one after it
    if (activeTask) {
      const currentIndex = routineTasks.findIndex(t => t.id === activeTask.id);
      const nextTask = routineTasks.slice(currentIndex + 1).find(t => !t.completed && t.category !== 'break');
      return nextTask || incompleteTasks[0];
    }
    
    return incompleteTasks[0];
  };

  const nextTask = getNextTask();
  const allTasksCompleted = routineTasks.length > 0 && routineTasks.filter(t => t.category !== 'break').every(t => t.completed);
  const noTasksScheduled = routineTasks.filter(t => t.category !== 'break').length === 0;

  const getGlowClass = () => {
    switch (timerStatus) {
      case 'warning': return 'glow-warning timer-active';
      case 'overtime': return 'glow-danger';
      case 'running': return 'glow-primary timer-active';
      case 'paused': return 'timer-active';
      default: return '';
    }
  };

  const handleStartNextTask = () => {
    if (nextTask) {
      // Duration is in hours, convert to minutes. Fallback to 30 min if missing
      const durationMinutes = nextTask.duration > 0 ? Math.round(nextTask.duration * 60) : 30;
      
      onStart({
        id: nextTask.id,
        title: nextTask.title,
        category: nextTask.category === 'break' ? 'personal' : nextTask.category,
        durationMinutes,
        scheduledTime: formatTaskTime(nextTask.startHour, nextTask.startMinute),
      });
    }
  };

  const getCardVariant = () => {
    if (timerStatus === 'overtime') return 'pink';
    if (timerStatus === 'warning') return 'yellow';
    if (isPaused) return 'peach';
    return 'lavender';
  };

  // Idle state - no active task
  if (!activeTask && !isRunning && !isPaused) {
    // All tasks completed
    if (allTasksCompleted) {
      return (
        <BentoCard 
          className="col-span-1 md:col-span-2" 
          colorVariant="green" 
          delay={1} 
          elevated
        >
          <div className="flex flex-col items-center justify-center h-full py-8">
            <motion.div 
              className="p-4 rounded-2xl bg-foreground/10 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">All Tasks Completed!</h3>
            <p className="text-sm opacity-70 text-center max-w-xs">
              Great work today. Take a well-deserved break or add more tasks to your routine.
            </p>
          </div>
        </BentoCard>
      );
    }

    // No tasks scheduled
    if (noTasksScheduled) {
      return (
        <BentoCard 
          className="col-span-1 md:col-span-2" 
          colorVariant="lavender" 
          delay={1} 
          elevated
        >
          <div className="flex flex-col items-center justify-center h-full py-8">
            <motion.div 
              className="p-4 rounded-2xl bg-foreground/10 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CalendarPlus className="w-8 h-8 opacity-70" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">No Tasks Scheduled</h3>
            <p className="text-sm opacity-70 text-center max-w-xs">
              Plan your day by adding tasks to your routine. A structured routine helps you stay focused.
            </p>
          </div>
        </BentoCard>
      );
    }

    // Show next task to start
    return (
      <BentoCard 
        className="col-span-1 md:col-span-2" 
        colorVariant="lavender" 
        delay={1} 
        elevated
      >
        <div className="flex flex-col items-center justify-center h-full py-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-foreground/5">
              <Clock className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-sm font-semibold">Next Up</p>
          </div>
          
          {nextTask && (
            <>
              <h3 className="text-2xl font-semibold mb-2 text-center">{nextTask.title}</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium',
                  CATEGORY_COLORS[nextTask.category === 'break' ? 'personal' : nextTask.category].bg,
                  CATEGORY_COLORS[nextTask.category === 'break' ? 'personal' : nextTask.category].text
                )}>
                  {CATEGORY_COLORS[nextTask.category === 'break' ? 'personal' : nextTask.category].label}
                </span>
                <span className="text-sm opacity-60">
                  {formatTaskTime(nextTask.startHour, nextTask.startMinute)} · {nextTask.duration} min
                </span>
              </div>
              <Button
                onClick={handleStartNextTask}
                variant="default"
                size="lg"
                className="rounded-full px-8 transition-all duration-400 shadow-soft hover:shadow-glow hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 mr-2" /> Start Task
              </Button>
            </>
          )}
        </div>
      </BentoCard>
    );
  }

  // Active task state
  return (
    <BentoCard 
      className={cn(
        'col-span-1 md:col-span-2 transition-all duration-500',
        isRunning && getGlowClass()
      )} 
      colorVariant={getCardVariant()} 
      delay={1} 
      elevated
    >
      <div className="flex flex-col items-center justify-center h-full py-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div 
            className={cn(
              'p-2 rounded-xl transition-all duration-400',
              isRunning ? 'bg-foreground/10' : 'bg-foreground/5'
            )}
            animate={isRunning && !isPaused ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {timerStatus === 'overtime' ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : timerStatus === 'warning' ? (
              <Clock className="w-5 h-5 text-amber-600" />
            ) : isPaused ? (
              <Pause className="w-5 h-5 text-amber-600" />
            ) : (
              <Play className="w-5 h-5 text-primary" />
            )}
          </motion.div>
          <div className="text-center">
            <p className="text-sm font-semibold">
              {isPaused ? 'Paused' : 'Active Task'}
            </p>
            {activeTask && (
              <p className="text-xs opacity-70">{activeTask.title}</p>
            )}
          </div>
        </div>

        {/* Scheduled Time */}
        {activeTask?.scheduledTime && (
          <p className="text-xs opacity-50 mb-2">Scheduled: {activeTask.scheduledTime}</p>
        )}
        
        {/* Timer Display */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={timerStatus}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center mb-2"
          >
            {timerStatus === 'overtime' ? (
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-thin-numeric tracking-tight text-foreground/60">
                  {formatTime(activeTask?.durationMinutes ? activeTask.durationMinutes * 60 : 0)}
                </span>
                <span className="text-4xl font-thin-numeric tracking-tight text-red-600 animate-pulse">
                  {formatOvertime(overtime)}
                </span>
              </div>
            ) : (
              <span className={cn(
                'text-5xl font-thin-numeric tracking-tight transition-all duration-400',
                timerStatus === 'warning' && 'text-amber-600',
                timerStatus === 'paused' && 'text-amber-600 opacity-70',
                timerStatus === 'running' && 'text-primary'
              )}>
                {formatTime(remaining)}
              </span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Overtime Message */}
        {timerStatus === 'overtime' && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600/80 mb-3 text-center px-4"
          >
            You've exceeded planned time. Continue or wrap up?
          </motion.p>
        )}

        {/* Progress Bar */}
        {activeTask && (
          <div className="w-full max-w-xs mb-4">
            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  'h-full rounded-full transition-colors duration-300',
                  timerStatus === 'overtime' 
                    ? 'bg-red-500' 
                    : timerStatus === 'warning' 
                      ? 'bg-amber-500' 
                      : isPaused
                        ? 'bg-amber-400'
                        : 'bg-primary'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progress)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-center mt-1 opacity-60">
              {timerStatus === 'overtime' 
                ? 'Task overtime' 
                : isPaused 
                  ? 'Timer paused'
                  : `${Math.round(progress)}% complete`}
            </p>
          </div>
        )}

        {/* Category Badge */}
        {activeTask && timerStatus !== 'overtime' && (
          <div className={cn(
            'px-4 py-2 rounded-xl text-xs font-medium mb-5 shadow-soft',
            CATEGORY_COLORS[activeTask.category].bg,
            CATEGORY_COLORS[activeTask.category].text
          )}>
            {CATEGORY_COLORS[activeTask.category].label}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap justify-center">
          {timerStatus === 'overtime' ? (
            <>
              <Button
                onClick={() => onStop(true)}
                variant="default"
                size="sm"
                className="rounded-full px-5 transition-all duration-300 hover:scale-105 active:scale-95 bg-primary"
              >
                <Square className="w-3.5 h-3.5 mr-1.5" /> Complete Task
              </Button>
              <Button
                onClick={() => onAddTime(15)}
                variant="outline"
                size="sm"
                className="rounded-full px-4 transition-all duration-300 hover:scale-105 active:scale-95 bg-background/50"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> 15 min
              </Button>
            </>
          ) : (
            <>
              {isPaused ? (
                <Button
                  onClick={onResume}
                  variant="default"
                  size="lg"
                  className="rounded-full px-6 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 mr-2" /> Resume
                </Button>
              ) : (
                <Button
                  onClick={onPause}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-6 transition-all duration-300 hover:scale-105 active:scale-95 bg-background/50"
                >
                  <Pause className="w-4 h-4 mr-2" /> Pause
                </Button>
              )}
              <Button
                onClick={() => onStop(true)}
                variant="default"
                size="lg"
                className="rounded-full px-6 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Square className="w-4 h-4 mr-2" /> Complete
              </Button>
            </>
          )}
        </div>
      </div>
    </BentoCard>
  );
}