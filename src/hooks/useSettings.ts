import { useLocalStorage } from './useLocalStorage';
import { TaskCategory } from '@/types/fluxion';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface AppSettings {
  profile: UserProfile;
  dailyFocusGoal: number; // in minutes
  customCategories: { id: TaskCategory; label: string; enabled: boolean }[];
  theme: 'light' | 'dark' | 'system';
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
  theme: 'light',
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

  const updateTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings((prev) => ({ ...prev, theme }));
    
    // Apply theme immediately
    const root = document.documentElement;
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
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
