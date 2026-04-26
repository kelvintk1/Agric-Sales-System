import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Users, ShoppingCart, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface Sale {
  _id: string;
  customerName: string;
  product: { name: string; price: number } | null;
  bags: number;
  totalAmount: number;
  paymentMethod: string;
  soldBy: { username: string } | null;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  quantityInStock: number;
  unit: string;
}

interface User {
  _id: string;
  role: 'admin' | 'salesperson';
}

const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const SalesTracking = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [salesRes, productsRes, usersRes] = await Promise.all([
          api.get('/sales'),
          api.get('/products'),
          api.get('/admin/users'),
        ]);
        setSales(salesRes.data);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
      } catch (err: any) {
        toast.error('Failed to load data', {
          description: err.response?.data?.message || 'Check your connection.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const salespersonCount = users.filter(u => u.role === 'salesperson').length;
  const uniqueCustomers = new Set(sales.map(s => s.customerName)).size;

  // Low stock threshold: fewer than 100 units
  const lowStock = products.filter(p => p.quantityInStock < 100);

  const filteredSales = sales.filter(s => {
    const matchesSearch =
      s.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      s.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.soldBy?.username?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.paymentMethod === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-primary">Sales Tracking and Summary</h1>
          <p className="text-sm text-muted-foreground">View your logged sales for convenient tracking</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading data...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Total Customer Count"
                value={uniqueCustomers}
                subtitle="Unique customers"
                icon={<Users className="w-5 h-5" />}
                delay={0.1}
              />
              <StatCard
                title="Total Salesperson Count"
                value={salespersonCount}
                subtitle={`Salespersons on duty: ${salespersonCount}`}
                icon={<ShoppingCart className="w-5 h-5" />}
                delay={0.15}
              />

              {/* Low stock card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl border p-5 shadow-sm"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning" /> Almost out of stock
                </p>
                <div className="mt-2 space-y-1">
                  {lowStock.length === 0 ? (
                    <p className="text-sm text-muted-foreground">All products stocked well</p>
                  ) : (
                    lowStock.map(p => (
                      <div key={p._id} className="flex justify-between text-sm">
                        <span className="text-foreground">{p.name}</span>
                        <span className="text-muted-foreground">{p.quantityInStock} {p.unit}s</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
            >
              <Input
                placeholder="Search customer, product or salesperson..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs h-9"
              />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="MoMo">MoMo</SelectItem>
                  <SelectItem value="Bank Transfer">Bank</SelectItem>
                  <SelectItem value="POS">POS</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl border shadow-sm overflow-x-auto"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5">
                    <TableHead className="text-xs font-semibold text-primary min-w-[110px]">Customer</TableHead>
                    <TableHead className="text-xs font-semibold text-primary min-w-[110px]">Salesperson</TableHead>
                    <TableHead className="text-xs font-semibold text-primary min-w-[80px]">Product</TableHead>
                    <TableHead className="text-xs font-semibold text-primary min-w-[90px]">Amount</TableHead>
                    <TableHead className="text-xs font-semibold text-primary min-w-[50px]">Bags</TableHead>
                    <TableHead className="text-xs font-semibold text-primary min-w-[90px]">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-primary min-w-[80px]">Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground text-sm py-8">
                        No sales found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map((sale, i) => (
                      <motion.tr
                        key={sale._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.03 }}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="text-xs font-medium">{sale.customerName}</TableCell>
                        <TableCell className="text-xs">{sale.soldBy?.username ?? '—'}</TableCell>
                        <TableCell className="text-xs">{sale.product?.name ?? '—'}</TableCell>
                        <TableCell className="text-xs font-semibold">GHS {sale.totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-xs">{sale.bags}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(sale.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            sale.paymentMethod === 'MoMo' ? 'bg-accent/20 text-accent-foreground' :
                            sale.paymentMethod === 'Cash' ? 'bg-success/20 text-success' :
                            sale.paymentMethod === 'Bank' ? 'bg-primary/10 text-primary' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {sale.paymentMethod}
                          </span>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </motion.div>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default SalesTracking;