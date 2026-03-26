import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-[220px] p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
};
