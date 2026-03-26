import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { motion } from 'framer-motion';
import { mockSales, mockProducts, mockCustomers, weeklySalesData } from '@/data/mockData';
import { DollarSign, ArrowUpRight, Users, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const SalesDashboard = () => {
  const [search, setSearch] = useState('');
  const totalSales = mockSales.slice(0, 5).reduce((sum, s) => sum + s.total_amount, 0);
  const topProduct = mockProducts[0];

  const recentSales = mockSales.filter(s =>
    s.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.product_name?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-primary">Sales Dashboard</h1>
          <p className="text-sm text-muted-foreground">View analytics of sales that have been made</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title="Total Sales" value={`GHS ${totalSales.toLocaleString()}`} subtitle="Weekly Sales" icon={<DollarSign className="w-5 h-5" />} delay={0.1} />
          <StatCard title="Transactions" value={5} icon={<ArrowUpRight className="w-5 h-5" />} delay={0.15} />
          <StatCard title="Customers" value={mockCustomers.length} icon={<Users className="w-5 h-5" />} delay={0.2} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-xl border p-4 shadow-sm"
          >
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">Top Product</p>
            <div className="flex items-center gap-2 sm:gap-3 mt-2">
              <img src={topProduct.image_url} alt={topProduct.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover" loading="lazy" />
              <div>
                <p className="font-bold text-foreground text-sm">{topProduct.name}</p>
                <p className="text-xs text-muted-foreground">GHS {topProduct.price_per_bag}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 bg-card rounded-xl border p-4 sm:p-5 shadow-sm"
          >
            <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">Sales Summary</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklySalesData}>
                <defs>
                  <linearGradient id="colorSales2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(130, 60%, 25%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(130, 60%, 25%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(130, 20%, 88%)" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(140, 10%, 45%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(140, 10%, 45%)" width={40} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(130, 20%, 88%)', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="amount" stroke="hsl(130, 60%, 25%)" strokeWidth={2} fill="url(#colorSales2)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-2 bg-card rounded-xl border p-4 sm:p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Recent Transactions</h3>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-3 h-8 text-sm" />
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                  <div>
                    <p className="font-medium text-foreground text-xs">{sale.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{sale.product_name}</p>
                  </div>
                  <span className="font-semibold text-foreground text-sm">GHS {sale.total_amount}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SalesDashboard;
