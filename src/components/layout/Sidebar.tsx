import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart3, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/routine', icon: Calendar, label: 'Routine' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Fluxion</h1>
          <p className="text-xs text-muted-foreground">Productivity Flow</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 rounded-xl bg-lavender">
        <p className="text-xs font-medium text-lavender-foreground mb-1">Pro Tip</p>
        <p className="text-xs text-lavender-foreground/70">
          Use the Pomodoro technique: 25 min focus, 5 min break.
        </p>
      </div>
    </aside>
  );
}
