import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockUsers } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const UserManagement = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage all users in one place. Control access, assign roles and monitor activity across the platform</p>
        </div>

        <div className="flex gap-3 items-center">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs h-9" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="salesperson">Salesperson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border shadow-sm overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                <TableHead className="text-xs font-semibold text-primary">Full name</TableHead>
                <TableHead className="text-xs font-semibold text-primary">E-mail</TableHead>
                <TableHead className="text-xs font-semibold text-primary">Contact</TableHead>
                <TableHead className="text-xs font-semibold text-primary">Role</TableHead>
                <TableHead className="text-xs font-semibold text-primary">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.03 }}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-xs font-medium">{user.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-xs">{user.phone}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                      user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-accent-foreground'
                    }`}>
                      {user.role === 'salesperson' ? 'Salesperson' : 'Admin'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Pencil className="w-3.5 h-3.5 text-primary" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        <p className="text-xs text-muted-foreground">Rows per page: 10 — 1 of {Math.ceil(filtered.length / 10)} pages</p>
      </motion.div>
    </DashboardLayout>
  );
};

export default UserManagement;
