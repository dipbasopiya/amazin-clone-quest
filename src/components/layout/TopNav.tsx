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
    <header className="sticky top-0 z-50 w-full glass border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo - Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange flex items-center justify-center shadow-soft transition-all duration-400 hover:scale-105 hover:shadow-glow">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">Fluxion</h1>
          </div>
        </div>

        {/* Navigation - Center */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 rounded-2xl bg-muted/60 border border-border/30">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium',
                  'transition-all duration-400 ease-out',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  isActive
                    ? 'bg-card text-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn(
                    'w-4 h-4 transition-all duration-400',
                    isActive && 'text-primary'
                  )} />
                  <span className="hidden sm:inline">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile Dropdown - Right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-full transition-all duration-400 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background">
              <Avatar className="w-9 h-9 border-2 border-primary/20 transition-all duration-400 hover:border-primary/40">
                <AvatarImage src={settings.profile.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-lavender/30 text-foreground text-sm font-medium">
                  {getInitials(settings.profile.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 bg-card border-border/50 shadow-hover rounded-xl animate-scale-in">
            <div className="px-3 py-3">
              <p className="text-sm font-medium text-foreground">
                {settings.profile.name || 'Guest User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {settings.profile.email || 'Set up your profile'}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem asChild className="cursor-pointer transition-colors duration-300 rounded-lg mx-1">
              <NavLink to="/settings" className="flex items-center gap-2 w-full">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer transition-colors duration-300 rounded-lg mx-1">
              <NavLink to="/settings" className="flex items-center gap-2 w-full">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive transition-colors duration-300 rounded-lg mx-1 mb-1">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
