import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskCategory } from '@/types/fluxion';
import { FULL_DAYS, RoutineBlock, ROUTINE_CATEGORY_COLORS } from '@/types/routine';
import { cn } from '@/lib/utils';

type RoutineCategory = TaskCategory | 'break';

interface BlockFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; category: RoutineCategory; day: number; startHour: number; startMinute: number; duration: number }) => void;
  onDelete?: () => void;
  initialData?: RoutineBlock;
  defaultDay?: number;
  defaultHour?: number;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);
const MINUTES = [0, 15, 30, 45];

export function BlockFormModal({
  open,
  onClose,
  onSave,
  onDelete,
  initialData,
  defaultDay = 1,
  defaultHour = 9,
}: BlockFormModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RoutineCategory>('coding');
  const [day, setDay] = useState(defaultDay);
  const [startHour, setStartHour] = useState(defaultHour);
  const [startMinute, setStartMinute] = useState(0);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setDay(initialData.day);
      setStartHour(initialData.startHour);
      setStartMinute(initialData.startMinute || 0);
      setDuration(initialData.duration);
    } else {
      setTitle('');
      setCategory('coding');
      setDay(defaultDay);
      setStartHour(defaultHour);
      setStartMinute(0);
      setDuration(1);
    }
  }, [initialData, defaultDay, defaultHour, open]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), category, day, startHour, startMinute, duration });
  };

  const formatHour = (hour: number) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:00 ${ampm}`;
  };

  const categories = Object.keys(ROUTINE_CATEGORY_COLORS) as RoutineCategory[];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Block' : 'Add Routine Block'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Study"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => {
                const colors = ROUTINE_CATEGORY_COLORS[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      colors.badge,
                      colors.text,
                      category === cat && 'ring-2 ring-foreground/30 ring-offset-2'
                    )}
                  >
                    {colors.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Day</Label>
              <Select value={String(day)} onValueChange={(v) => setDay(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FULL_DAYS.map((d, i) => (
                    <SelectItem key={i} value={String(i)}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0.5, 1, 1.5, 2, 2.5, 3, 4].map((d) => (
                    <SelectItem key={d} value={String(d)}>{d} {d === 1 ? 'hour' : 'hours'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Hour</Label>
              <Select value={String(startHour)} onValueChange={(v) => setStartHour(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>{formatHour(h)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Minute</Label>
              <Select value={String(startMinute)} onValueChange={(v) => setStartMinute(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MINUTES.map((m) => (
                    <SelectItem key={m} value={String(m)}>{m.toString().padStart(2, '0')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            {onDelete && (
              <Button variant="destructive" onClick={onDelete} className="mr-auto">
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              {initialData ? 'Update' : 'Add Block'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
