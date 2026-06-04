import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      {!isMobile && <AppSidebar />}

      {/* Mobile header */}
      {isMobile && (
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-background border-b">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="h-9 w-9">
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-display font-bold text-primary text-lg">AgriSales</span>
        </header>
      )}

      {/* Mobile sidebar sheet */}
      {isMobile && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-[260px] h-full overflow-y-auto">
            <AppSidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      <main className={`${isMobile ? 'p-4' : 'ml-[220px] p-6'} min-h-screen`}>
        {children}
      </main>
    </div>
  );
};
