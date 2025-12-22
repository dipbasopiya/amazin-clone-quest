import { Palette, Moon, Bell, Volume2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ThemeOption } from '@/hooks/useSettings';

interface ThemeSettingsProps {
  theme: ThemeOption;
  notifications: boolean;
  soundEnabled: boolean;
  onThemeChange: (theme: ThemeOption) => void;
  onNotificationsToggle: () => void;
  onSoundToggle: () => void;
}

export function ThemeSettings({
  theme,
  notifications,
  soundEnabled,
  onThemeChange,
  onNotificationsToggle,
  onSoundToggle,
}: ThemeSettingsProps) {
  const themes: { id: ThemeOption; label: string; icon: React.ReactNode }[] = [
    { id: 'default', label: 'Default', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
  ];

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Palette className="w-5 h-5 text-primary" />
          Appearance & Preferences
        </CardTitle>
        <CardDescription>Customize the look and behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-foreground">Theme</Label>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                  theme === t.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {t.icon}
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-soft-blue">
                <Bell className="w-4 h-4 text-soft-blue-foreground" />
              </div>
              <div>
                <Label className="text-foreground">Notifications</Label>
                <p className="text-xs text-muted-foreground">Get reminded about focus sessions</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={onNotificationsToggle} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-lavender">
                <Volume2 className="w-4 h-4 text-lavender-foreground" />
              </div>
              <div>
                <Label className="text-foreground">Sound Effects</Label>
                <p className="text-xs text-muted-foreground">Play sounds on timer completion</p>
              </div>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={onSoundToggle} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
