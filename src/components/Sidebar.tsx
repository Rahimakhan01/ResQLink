
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Shield, 
  Bell, 
  LifeBuoy, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  Package,
  BrainCircuit,
  UserPlus,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, path, active }) => {
  return (
    <Link 
      to={path} 
      className={cn(
        "flex items-center space-x-3 px-4 py-3 rounded-md transition-colors",
        active 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-secondary"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { profile, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Different menu items based on user role
  const userMenuItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      label: 'Dashboard', 
      path: '/dashboard' 
    },
    { 
      icon: <AlertTriangle className="h-5 w-5" />, 
      label: 'Report Emergency', 
      path: '/report' 
    },
    { 
      icon: <Shield className="h-5 w-5" />, 
      label: 'Safety Tips', 
      path: '/safety' 
    },
    { 
      icon: <Bell className="h-5 w-5" />, 
      label: 'Notifications', 
      path: '/notifications' 
    }
  ];

  const adminMenuItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      label: 'Overview', 
      path: '/admin' 
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      label: 'Manage Users', 
      path: '/admin/users' 
    },
    { 
      icon: <ClipboardList className="h-5 w-5" />, 
      label: 'Emergency Reports', 
      path: '/admin/reports' 
    },
    { 
      icon: <Package className="h-5 w-5" />, 
      label: 'Resources', 
      path: '/admin/resources' 
    },
    { 
      icon: <UserPlus className="h-5 w-5" />, 
      label: 'Manage Admins', 
      path: '/admin/admins' 
    },
    { 
      icon: <BrainCircuit className="h-5 w-5" />, 
      label: 'AI Insights', 
      path: '/admin/insights' 
    }
  ];

  const menuItems = profile?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">RL</span>
              </div>
              <span className="text-xl font-bold text-primary">ResQLInk</span>
            </Link>
          </div>
          
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-1 px-3">
              {menuItems.map((item) => (
                <SidebarItem 
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  active={isActive(item.path)}
                />
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Button 
              variant="ghost" 
              className="w-full flex items-center space-x-3 justify-start text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
