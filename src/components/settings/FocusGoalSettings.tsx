import { Target, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface FocusGoalSettingsProps {
  focusGoal: number;
  onUpdate: (minutes: number) => void;
}

const PRESET_GOALS = [30, 60, 90, 120, 180, 240];

export function FocusGoalSettings({ focusGoal, onUpdate }: FocusGoalSettingsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Target className="w-5 h-5 text-primary" />
          Daily Focus Goal
        </CardTitle>
        <CardDescription>Set your daily focus time target</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/10">
            <Clock className="w-6 h-6 text-primary" />
            <span className="text-3xl font-display text-primary">{formatTime(focusGoal)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">per day</p>
        </div>

        <div className="space-y-3">
          <Label className="text-foreground">Adjust Goal</Label>
          <Slider
            value={[focusGoal]}
            onValueChange={(value) => onUpdate(value[0])}
            min={15}
            max={480}
            step={15}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>15m</span>
            <span>8h</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Quick Presets</Label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_GOALS.map((preset) => (
              <button
                key={preset}
                onClick={() => onUpdate(preset)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  focusGoal === preset
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {formatTime(preset)}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
