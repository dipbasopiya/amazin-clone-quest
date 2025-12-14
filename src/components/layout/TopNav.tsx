import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart3, Settings, Zap, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSettings } from '@/hooks/useSettings';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/routine', icon: Calendar, label: 'Routine' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function TopNav() {
  const { settings } = useSettings();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo - Left */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-soft transition-transform duration-300 hover:scale-105">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">Fluxion</h1>
          </div>
        </div>

        {/* Navigation - Center */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 rounded-2xl bg-muted/50">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium',
                  'transition-all duration-300 ease-out',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn(
                    'w-4 h-4 transition-transform duration-300',
                    isActive && 'scale-110'
                  )} />
                  <span className="hidden sm:inline">{label}</span>
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-primary/10 animate-[scale-in_0.2s_ease-out]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile Dropdown - Right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-full transition-all duration-300 hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 hover:ring-offset-card focus:outline-none focus:ring-2 focus:ring-primary/30">
              <Avatar className="w-9 h-9 border-2 border-primary/20 transition-transform duration-300 hover:scale-105">
                <AvatarImage src={settings.profile.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(settings.profile.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 bg-card border-border shadow-hover animate-[scale-in_0.15s_ease-out]">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground">
                {settings.profile.name || 'Guest User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {settings.profile.email || 'Set up your profile'}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="cursor-pointer transition-colors duration-200">
              <NavLink to="/settings" className="flex items-center gap-2 w-full">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer transition-colors duration-200">
              <NavLink to="/settings" className="flex items-center gap-2 w-full">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive transition-colors duration-200">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
