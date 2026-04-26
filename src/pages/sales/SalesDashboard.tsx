import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { motion } from 'framer-motion';
import { DollarSign, ArrowUpRight, Users, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

// Shape returned by GET /api/sales/mine (populated)
interface Sale {
  _id: string;
  customerName: string;
  product: { name: string; price: number } | null;
  bags: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Group sales by day-of-week for the area chart
const buildWeeklyData = (sales: Sale[]) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const totals: Record<string, number> = {};
  days.forEach(d => (totals[d] = 0));
  sales.forEach(s => {
    const day = days[new Date(s.createdAt).getDay()];
    totals[day] += s.totalAmount;
  });
  return days.map(day => ({ day, amount: totals[day] }));
};

const SalesDashboard = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        // Salesperson sees only their own sales
        const res = await api.get('/sales/mine');
        setSales(res.data);
      } catch (err: any) {
        toast.error('Failed to load sales', {
          description: err.response?.data?.message || 'Check your connection.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const uniqueCustomers = new Set(sales.map(s => s.customerName)).size;
  const topProduct = sales.reduce<Record<string, number>>((acc, s) => {
    const name = s.product?.name ?? 'Unknown';
    acc[name] = (acc[name] || 0) + s.totalAmount;
    return acc;
  }, {});
  const topProductName = Object.keys(topProduct).sort((a, b) => topProduct[b] - topProduct[a])[0] ?? '—';
  const topProductRevenue = topProduct[topProductName] ?? 0;

  const weeklySalesData = buildWeeklyData(sales);

  const recentSales = sales
    .filter(s =>
      s.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      s.product?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 5);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-primary">Sales Dashboard</h1>
          <p className="text-sm text-muted-foreground">View analytics of sales that have been made</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="Total Revenue"
                value={`GHS ${totalRevenue.toLocaleString()}`}
                subtitle="All time"
                icon={<DollarSign className="w-5 h-5" />}
                delay={0.1}
              />
              <StatCard
                title="Transactions"
                value={sales.length}
                icon={<ArrowUpRight className="w-5 h-5" />}
                delay={0.15}
              />
              <StatCard
                title="Unique Customers"
                value={uniqueCustomers}
                icon={<Users className="w-5 h-5" />}
                delay={0.2}
              />

              {/* Top product card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card rounded-xl border p-4 shadow-sm"
              >
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">Top Product</p>
                <div className="mt-2">
                  <p className="font-bold text-foreground text-sm">{topProductName}</p>
                  <p className="text-xs text-muted-foreground">GHS {topProductRevenue.toLocaleString()} revenue</p>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Area chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-3 bg-card rounded-xl border p-4 sm:p-5 shadow-sm"
              >
                <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">Sales Summary (This Week)</h3>
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
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 100%)',
                        border: '1px solid hsl(130, 20%, 88%)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`GHS ${value.toLocaleString()}`, 'Amount']}
                    />
                    <Area type="monotone" dataKey="amount" stroke="hsl(130, 60%, 25%)" strokeWidth={2} fill="url(#colorSales2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Recent transactions */}
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
                <Input
                  placeholder="Search by customer or product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-3 h-8 text-sm"
                />
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {recentSales.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No transactions found.</p>
                  ) : (
                    recentSales.map((sale) => (
                      <div key={sale._id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                        <div>
                          <p className="font-medium text-foreground text-xs">{sale.customerName}</p>
                          <p className="text-xs text-muted-foreground">{sale.product?.name ?? '—'}</p>
                        </div>
                        <span className="font-semibold text-foreground text-sm">
                          GHS {sale.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default SalesDashboard;