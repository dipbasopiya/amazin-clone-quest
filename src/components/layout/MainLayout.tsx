import { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { useSettings } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { settings } = useSettings();
  const fitToScreen = settings.fitToScreen;

  return (
    <div
      className={cn(
        "min-w-[100vw] bg-background",
        fitToScreen
          ? "h-screen overflow-hidden"
          : "min-h-screen"
      )}
    >
      <TopNav />
      <main
        className={cn(
          "w-full",
          fitToScreen
            ? "h-[calc(100vh-4rem)] overflow-hidden flex flex-col"
            : "min-h-[calc(100vh-4rem)]"
        )}
      >
        <div
          className={cn(
            "p-6 md:p-8 w-full max-w-none",
            fitToScreen && "h-full flex flex-col overflow-hidden"
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
