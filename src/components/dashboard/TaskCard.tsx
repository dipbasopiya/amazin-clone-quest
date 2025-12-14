import { useState } from 'react';
import { BentoCard } from './BentoCard';
import { Task, TaskCategory, CATEGORY_COLORS } from '@/types/fluxion';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface TaskCardProps {
  tasks: Task[];
  onAdd: (title: string, category: TaskCategory, deadline?: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ tasks, onAdd, onToggle, onDelete }: TaskCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('coding');

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAdd(newTitle.trim(), newCategory);
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <BentoCard className="col-span-2 row-span-2" colorVariant="default" delay={0}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Today's Tasks</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full hover:bg-muted"
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </Button>
      </div>

      <Progress value={progress} className="h-2 mb-4" />

      {isAdding && (
        <div className="mb-4 p-4 rounded-xl bg-muted/50 space-y-3 animate-in slide-in-from-top-2">
          <Input
            placeholder="Task title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="bg-card border-border"
          />
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(CATEGORY_COLORS) as TaskCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setNewCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  CATEGORY_COLORS[cat].bg,
                  CATEGORY_COLORS[cat].text,
                  newCategory === cat && 'ring-2 ring-primary ring-offset-2'
                )}
              >
                {CATEGORY_COLORS[cat].label}
              </button>
            ))}
          </div>
          <Button onClick={handleAdd} size="sm" className="w-full">
            Add Task
          </Button>
        </div>
      )}

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {tasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No tasks yet. Add one to get started!
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl transition-all group',
                task.completed ? 'opacity-60' : 'hover:bg-muted/50'
              )}
            >
              <button
                onClick={() => onToggle(task.id)}
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                  task.completed
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-muted-foreground hover:border-primary'
                )}
              >
                {task.completed && <Check className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm font-medium truncate',
                    task.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {task.title}
                </p>
              </div>
              <span
                className={cn(
                  'px-2 py-1 rounded-md text-xs font-medium',
                  CATEGORY_COLORS[task.category].bg,
                  CATEGORY_COLORS[task.category].text
                )}
              >
                {CATEGORY_COLORS[task.category].label}
              </span>
              <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </BentoCard>
  );
}
