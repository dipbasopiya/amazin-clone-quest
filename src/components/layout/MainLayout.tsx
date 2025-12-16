import { ReactNode } from 'react';
import { TopNav } from './TopNav';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      <TopNav />
      <main className="min-h-[calc(100vh-4rem)] w-full">
        <div className="px-6 md:px-10 lg:px-16 py-6 md:py-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
