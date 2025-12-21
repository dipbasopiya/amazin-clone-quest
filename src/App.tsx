import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActiveTaskProvider } from "@/hooks/useActiveTaskTimer";
import Dashboard from "./pages/Dashboard";
import Routine from "./pages/Routine";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Apply saved theme on initial load
const applySavedTheme = () => {
  try {
    const savedSettings = localStorage.getItem('fluxion-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      const theme = settings.theme || 'default';
      const root = document.documentElement;
      root.classList.remove('dark', 'bold-dark', 'theme-default');
      
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) root.classList.add('dark');
      } else if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'bold-dark') {
        root.classList.add('bold-dark');
      } else if (theme === 'default') {
        root.classList.add('theme-default');
      }
    } else {
      // Apply default theme if no settings exist
      document.documentElement.classList.add('theme-default');
    }
  } catch {
    document.documentElement.classList.add('theme-default');
  }
};

// Apply theme immediately before React renders
applySavedTheme();

const App = () => {
  useEffect(() => {
    applySavedTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ActiveTaskProvider>
          <div className="overflow-x-hidden w-full max-w-full">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/routine" element={<Routine />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </ActiveTaskProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
