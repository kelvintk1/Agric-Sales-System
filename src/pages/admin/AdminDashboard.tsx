import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { motion } from 'framer-motion';
import { mockSales, mockProducts, mockCustomers, mockUsers, weeklySalesData } from '@/data/mockData';
import { DollarSign, ArrowUpRight, Users, TrendingUp, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const AdminDashboard = () => {
  const [search, setSearch] = useState('');
  const totalSales = mockSales.reduce((sum, s) => sum + s.total_amount, 0);
  const salespersonCount = mockUsers.filter(u => u.role === 'salesperson').length;
  const topProduct = mockProducts[0]; // Yam

  const recentSales = mockSales.filter(s =>
    s.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.product_name?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 6);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Main Dashboard</h1>
          <p className="text-sm text-muted-foreground">View overall analytics of sales that have been made</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sales of the week"
            value={`GHS ${totalSales.toLocaleString()}.00`}
            icon={<DollarSign className="w-5 h-5" />}
            delay={0.1}
          />
          <StatCard
            title="Transaction count of the week"
            value={mockSales.length}
            icon={<ArrowUpRight className="w-5 h-5" />}
            delay={0.15}
          />
          <StatCard
            title="Salesperson Contribution"
            value={salespersonCount}
            subtitle={`Customer count: ${mockCustomers.length}`}
            icon={<Users className="w-5 h-5" />}
            delay={0.2}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="bg-card rounded-xl border p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Top Selling Product</p>
            <div className="flex items-center gap-3 mt-2">
              <img
                src={topProduct.image_url}
                alt={topProduct.name}
                className="w-12 h-12 rounded-lg object-cover"
                loading="lazy"
              />
              <div>
                <p className="font-bold text-foreground">{topProduct.name}</p>
                <p className="text-xs text-muted-foreground">Price: GHS {topProduct.price_per_bag}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chart + Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 bg-card rounded-xl border p-5 shadow-sm"
          >
            <h3 className="font-semibold text-foreground mb-4">Total Summary of the week</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklySalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(130, 60%, 25%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(130, 60%, 25%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(130, 20%, 88%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(140, 10%, 45%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(140, 10%, 45%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(130, 20%, 88%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(130, 60%, 25%)"
                  strokeWidth={2}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2 text-center">Day of the week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Transactions</h3>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3 h-8 text-sm"
            />
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                  <div>
                    <p className="font-medium text-foreground text-xs">{sale.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{sale.product_name}</p>
                  </div>
                  <span className="font-semibold text-foreground text-sm">{sale.total_amount}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
