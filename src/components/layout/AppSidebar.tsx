import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, TrendingUp, Users, PlusCircle, LogOut, ShoppingCart, Leaf } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const adminLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Inventory', icon: Package, path: '/admin/inventory' },
  { label: 'Sales Tracking', icon: TrendingUp, path: '/admin/sales' },
  { label: 'User Management', icon: Users, path: '/admin/users' },
  { label: 'Add Product', icon: PlusCircle, path: '/admin/add-product' },
];

const salespersonLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/sales/dashboard' },
  { label: 'Inventory', icon: Package, path: '/sales/inventory' },
  { label: 'Sales Entry', icon: ShoppingCart, path: '/sales/entry' },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

export const AppSidebar = ({ onNavigate }: AppSidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  const links = user?.role === 'admin' ? adminLinks : salespersonLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <>
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="gradient-sidebar w-[220px] min-h-screen flex flex-col text-sidebar-foreground fixed left-0 top-0 z-40"
        style={onNavigate ? { position: 'relative', zIndex: 'auto' } : undefined}
      >
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-6 h-6 text-sidebar-primary" />
            <span className="text-sm font-medium opacity-80">Welcome,</span>
          </div>
          <h2 className="text-lg font-bold font-display">
            {user?.role === 'admin' ? 'Admin' : 'Salesperson'}
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {links.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <motion.button
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleNav(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 mt-auto">
          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors text-sidebar-foreground/80 hover:text-destructive-foreground"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </motion.aside>

      <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl font-display">
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You will need to sign in again to access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-center gap-4 sm:justify-center">
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              Yes
            </AlertDialogAction>
            <AlertDialogCancel className="px-8">No</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
