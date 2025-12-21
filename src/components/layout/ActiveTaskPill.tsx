import { useActiveTaskTimer } from '@/hooks/useActiveTaskTimer';
import { CATEGORY_COLORS } from '@/types/fluxion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, AlertTriangle, Pause } from 'lucide-react';

export function ActiveTaskPill() {
  const { activeTask, isRunning, isPaused, timerStatus, getTimeDisplay, formatTime, formatOvertime } = useActiveTaskTimer();
  
  const { remaining, overtime } = getTimeDisplay();

  // Show pill if there's an active task (running or paused)
  if ((!isRunning && !isPaused) || !activeTask) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          'flex items-center gap-2.5 px-3.5 py-2 rounded-xl cursor-pointer',
          'border transition-all duration-300 hover:scale-[1.02]',
          timerStatus === 'overtime' 
            ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50' 
            : timerStatus === 'warning'
              ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50'
              : timerStatus === 'paused'
                ? 'bg-amber-50/50 border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-800/30'
                : 'bg-soft-blue/50 border-soft-blue/30'
        )}
      >
        {/* Pulsing Indicator */}
        <motion.div
          animate={isPaused ? {} : { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {timerStatus === 'overtime' ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          ) : isPaused ? (
            <Pause className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Circle className={cn(
              'w-2.5 h-2.5 fill-current',
              timerStatus === 'warning' ? 'text-amber-500' : 'text-primary'
            )} />
          )}
        </motion.div>

        {/* Task Info */}
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs font-medium truncate max-w-[100px]',
            timerStatus === 'overtime' ? 'text-red-700 dark:text-red-300' : 
            isPaused ? 'text-amber-700/70 dark:text-amber-300/70' : 'text-foreground/80'
          )}>
            {activeTask.title}
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className={cn(
            'text-xs',
            CATEGORY_COLORS[activeTask.category].text
          )}>
            {isPaused ? 'Paused' : CATEGORY_COLORS[activeTask.category].label}
          </span>
        </div>

        {/* Timer */}
        <span className={cn(
          'text-sm font-mono font-semibold tabular-nums ml-1',
          timerStatus === 'overtime' 
            ? 'text-red-600 dark:text-red-400' 
            : timerStatus === 'warning'
              ? 'text-amber-600 dark:text-amber-400'
              : isPaused
                ? 'text-amber-600/70 dark:text-amber-400/70'
                : 'text-foreground'
        )}>
          {timerStatus === 'overtime' ? formatOvertime(overtime) : formatTime(remaining)}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}