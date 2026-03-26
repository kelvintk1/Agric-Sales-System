import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInventory from "./pages/admin/AdminInventory";
import SalesTracking from "./pages/admin/SalesTracking";
import UserManagement from "./pages/admin/UserManagement";
import AddProduct from "./pages/admin/AddProduct";
import SalesDashboard from "./pages/sales/SalesDashboard";
import SalesInventory from "./pages/sales/SalesInventory";
import SalesEntry from "./pages/sales/SalesEntry";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/sales" element={<SalesTracking />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            {/* Salesperson Routes */}
            <Route path="/sales/dashboard" element={<SalesDashboard />} />
            <Route path="/sales/inventory" element={<SalesInventory />} />
            <Route path="/sales/entry" element={<SalesEntry />} />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
