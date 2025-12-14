import { Tags, Edit2, Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TaskCategory, CATEGORY_COLORS } from '@/types/fluxion';

interface CategorySettingsProps {
  categories: { id: TaskCategory; label: string; enabled: boolean }[];
  onToggle: (id: TaskCategory) => void;
  onUpdateLabel: (id: TaskCategory, label: string) => void;
}

export function CategorySettings({ categories, onToggle, onUpdateLabel }: CategorySettingsProps) {
  const [editingId, setEditingId] = useState<TaskCategory | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (id: TaskCategory, currentLabel: string) => {
    setEditingId(id);
    setEditValue(currentLabel);
  };

  const saveEdit = (id: TaskCategory) => {
    if (editValue.trim()) {
      onUpdateLabel(id, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Tags className="w-5 h-5 text-primary" />
          Task Categories
        </CardTitle>
        <CardDescription>Customize and enable/disable categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map((category) => {
          const colors = CATEGORY_COLORS[category.id];
          return (
            <div
              key={category.id}
              className={`flex items-center justify-between p-3 rounded-xl ${colors.bg} transition-all`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${colors.bg} ring-2 ring-offset-2 ring-offset-card`} 
                     style={{ backgroundColor: `hsl(var(--${category.id === 'dsa' ? 'soft-blue' : category.id === 'coding' ? 'lavender' : category.id === 'project' ? 'peach' : category.id === 'academic' ? 'soft-yellow' : 'soft-pink'}))` }} />
                
                {editingId === category.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 bg-card"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(category.id)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => saveEdit(category.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <span className={`font-medium ${colors.text}`}>{category.label}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-50 hover:opacity-100"
                      onClick={() => startEdit(category.id, category.label)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              <Switch
                checked={category.enabled}
                onCheckedChange={() => onToggle(category.id)}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
