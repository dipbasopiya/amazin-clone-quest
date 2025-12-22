import { useLocalStorage } from './useLocalStorage';
import { TaskCategory } from '@/types/fluxion';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export type ThemeOption = 'default' | 'dark';

export interface AppSettings {
  profile: UserProfile;
  dailyFocusGoal: number; // in minutes
  customCategories: { id: TaskCategory; label: string; enabled: boolean }[];
  theme: ThemeOption;
  notifications: boolean;
  soundEnabled: boolean;
  fitToScreen: boolean; // Desktop no-scroll layout mode
}

const DEFAULT_SETTINGS: AppSettings = {
  profile: {
    name: '',
    email: '',
  },
  dailyFocusGoal: 120, // 2 hours default
  customCategories: [
    { id: 'dsa', label: 'DSA', enabled: true },
    { id: 'coding', label: 'Coding', enabled: true },
    { id: 'project', label: 'Project', enabled: true },
    { id: 'academic', label: 'Academic', enabled: true },
    { id: 'personal', label: 'Personal', enabled: true },
  ],
  theme: 'default',
  notifications: true,
  soundEnabled: true,
  fitToScreen: false,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('fluxion-settings', DEFAULT_SETTINGS);

  const updateProfile = (profile: Partial<UserProfile>) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }));
  };

  const updateFocusGoal = (minutes: number) => {
    setSettings((prev) => ({ ...prev, dailyFocusGoal: minutes }));
  };

  const updateTheme = (theme: ThemeOption) => {
    setSettings((prev) => ({ ...prev, theme }));
    
    // Apply theme immediately
    const root = document.documentElement;
    // Remove all theme classes first
    root.classList.remove('dark', 'theme-default');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('theme-default');
    }
  };

  const toggleCategory = (categoryId: TaskCategory) => {
    setSettings((prev) => ({
      ...prev,
      customCategories: prev.customCategories.map((cat) =>
        cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
      ),
    }));
  };

  const updateCategoryLabel = (categoryId: TaskCategory, label: string) => {
    setSettings((prev) => ({
      ...prev,
      customCategories: prev.customCategories.map((cat) =>
        cat.id === categoryId ? { ...cat, label } : cat
      ),
    }));
  };

  const toggleNotifications = () => {
    setSettings((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  const toggleSound = () => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleFitToScreen = () => {
    setSettings((prev) => ({ ...prev, fitToScreen: !prev.fitToScreen }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
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
  };
}
