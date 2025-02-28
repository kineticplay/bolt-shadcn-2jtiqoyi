import { useState } from 'react';
import { Menu, Settings, LayoutDashboard, LogOut, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  className?: string;
  onNavigate: (path: string) => void;
  activePath: string;
}

export function Sidebar({ className, onNavigate, activePath }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-50">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 bottom-0 z-50 flex flex-col bg-white border-r transition-transform duration-300",
          "md:translate-x-0 md:w-[250px]",
          "w-[80%] -translate-x-full",
          isMobileMenuOpen && "translate-x-0",
          className
        )}
      >
        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden absolute right-2 top-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Menu Items */}
        <div className="flex-1 py-8 px-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={activePath === item.path ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleNavigate(item.path)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="text-sm text-muted-foreground mb-4">v1.0.0</div>
          <Button
            variant="destructive"
            className="w-full"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}