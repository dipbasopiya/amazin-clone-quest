import { MainLayout } from '@/components/layout/MainLayout';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { CategorySettings } from '@/components/settings/CategorySettings';
import { FocusGoalSettings } from '@/components/settings/FocusGoalSettings';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { LayoutSettings } from '@/components/settings/LayoutSettings';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const {
    settings,
    updateProfile,
    updateFocusGoal,
    updateTheme,
    toggleCategory,
    updateCategoryLabel,
    toggleNotifications,
    toggleSound,
    toggleFitToScreen,
    resetSettings,
  } = useSettings();

  const handleReset = () => {
    resetSettings();
    toast.success('Settings reset to defaults');
  };

  const handleProfileSave = (profile: Parameters<typeof updateProfile>[0]) => {
    updateProfile(profile);
    toast.success('Profile updated');
  };

  return (
    <MainLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ProfileSettings profile={settings.profile} onUpdate={handleProfileSave} />
          <FocusGoalSettings focusGoal={settings.dailyFocusGoal} onUpdate={updateFocusGoal} />
        </div>
        <div className="space-y-6">
          <ThemeSettings
            theme={settings.theme}
            notifications={settings.notifications}
            soundEnabled={settings.soundEnabled}
            onThemeChange={updateTheme}
            onNotificationsToggle={toggleNotifications}
            onSoundToggle={toggleSound}
          />
          <LayoutSettings
            fitToScreen={settings.fitToScreen}
            onFitToScreenToggle={toggleFitToScreen}
          />
          <CategorySettings
            categories={settings.customCategories}
            onToggle={toggleCategory}
            onUpdateLabel={updateCategoryLabel}
          />
        </div>
      </div>
    </MainLayout>
  );
}
