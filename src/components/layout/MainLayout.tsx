import { ReactNode } from 'react';
import { TopNav } from './TopNav';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full min-w-[100vw] bg-background">
      <TopNav />
      <main className="min-h-[calc(100vh-4rem)] w-full">
        <div className="p-6 md:p-8 w-full max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}
