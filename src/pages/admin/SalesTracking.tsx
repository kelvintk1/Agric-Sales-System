import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { mockSales, mockCustomers, mockUsers, mockProducts } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Users, ShoppingCart, AlertTriangle } from 'lucide-react';

const SalesTracking = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const salespersonCount = mockUsers.filter(u => u.role === 'salesperson').length;
  const lowStock = mockProducts.filter(p => p.quantity_in_stock < 100);

  const filteredSales = mockSales.filter(s => {
    const matchesSearch = s.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.salesperson_name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.payment_method === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Sales Tracking and Summary</h1>
          <p className="text-sm text-muted-foreground">View your logged sales for convenient tracking</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total customer count" value={mockCustomers.length * 10} subtitle="17% from last week" icon={<Users className="w-5 h-5" />} delay={0.1} />
          <StatCard title="Total salesperson count" value={salespersonCount} subtitle={`Salespersons on duty: ${salespersonCount}`} icon={<ShoppingCart className="w-5 h-5" />} delay={0.15} />
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
              {lowStock.map(p => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{p.name}</span>
                  <span className="text-muted-foreground">{p.quantity_in_stock} bags</span>
                </div>
              ))}
              {lowStock.length === 0 && <p className="text-sm text-muted-foreground">All products stocked well</p>}
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3 items-center"
        >
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs h-9" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="MoMo">MoMo</SelectItem>
              <SelectItem value="Bank">Bank</SelectItem>
              <SelectItem value="POS">POS</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border shadow-sm overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                <TableHead className="text-xs font-semibold text-primary">Customer Name</TableHead>
                <TableHead className="text-xs font-semibold text-primary">Salesperson</TableHead>
                <TableHead className="text-xs font-semibold text-primary">Product</TableHead>
                <TableHead className="text-xs font-semibold text-primary">Amount (GHS)</TableHead>
                <TableHead className="text-xs font-semibold text-primary">Qty</TableHead>
                <TableHead className="text-xs font-semibold text-primary">Date</TableHead>
                <TableHead className="text-xs font-semibold text-primary">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale, i) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.03 }}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-xs font-medium">{sale.customer_name}</TableCell>
                  <TableCell className="text-xs">{sale.salesperson_name}</TableCell>
                  <TableCell className="text-xs">{sale.product_name}</TableCell>
                  <TableCell className="text-xs font-semibold">{sale.total_amount}</TableCell>
                  <TableCell className="text-xs">{sale.quantity}</TableCell>
                  <TableCell className="text-xs">{sale.transaction_date}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      sale.payment_method === 'MoMo' ? 'bg-accent/20 text-accent-foreground' :
                      sale.payment_method === 'Cash' ? 'bg-success/20 text-success' :
                      sale.payment_method === 'Bank' ? 'bg-primary/10 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {sale.payment_method}
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SalesTracking;
