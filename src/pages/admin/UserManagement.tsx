import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Trash2, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'salesperson';
}

const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Create user form state
  const [showCreate, setShowCreate] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'salesperson'>('salesperson');
  const [creating, setCreating] = useState(false);

  // Delete state
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err: any) {
        toast.error('Failed to load users', {
          description: err.response?.data?.message || 'Check your connection.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const resetCreateForm = () => {
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('salesperson');
  };

  const handleCreateUser = async () => {
    if (!newUsername || !newEmail || !newPassword) {
      toast.error('Please fill all fields');
      return;
    }
    setCreating(true);
    try {
      const res = await api.post('/admin/create-user', {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });
      // Add newly created user to local list
      setUsers(prev => [...prev, res.data.user]);
      toast.success('User created!', { description: `${newUsername} has been added.` });
      setShowCreate(false);
      resetCreateForm();
    } catch (err: any) {
      toast.error('Failed to create user', {
        description: err.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${deleteUser._id}`);
      setUsers(prev => prev.filter(u => u._id !== deleteUser._id));
      toast.success('User deleted!', { description: `${deleteUser.username} has been removed.` });
      setDeleteUser(null);
    } catch (err: any) {
      toast.error('Failed to delete user', {
        description: err.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary">User Management</h1>
            <p className="text-sm text-muted-foreground">Manage all users in one place. Control access, assign roles and monitor activity</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="bg-primary text-primary-foreground gap-2">
            <UserPlus className="w-4 h-4" /> Add User
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs h-9"
          />
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

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading users...</div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border shadow-sm overflow-x-auto"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5">
                    <TableHead className="text-xs font-semibold text-primary min-w-[120px]">Username</TableHead>
                    <TableHead className="text-xs font-semibold text-primary min-w-[160px]">Email</TableHead>
                    <TableHead className="text-xs font-semibold text-primary min-w-[100px]">Role</TableHead>
                    <TableHead className="text-xs font-semibold text-primary min-w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-8">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((user, i) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.03 }}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="text-xs font-medium">{user.username}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                            user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-accent-foreground'
                          }`}>
                            {user.role === 'salesperson' ? 'Salesperson' : 'Admin'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.role !== 'admin' && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => setDeleteUser(user)}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </Button>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </motion.div>
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {users.length} users</p>
          </>
        )}
      </motion.div>

      {/* Create User Dialog */}
      <Dialog open={showCreate} onOpenChange={(open) => { setShowCreate(open); if (!open) resetCreateForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-display">Add New User</DialogTitle>
            <DialogDescription>Create a salesperson account. Only one admin can exist.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Username</Label>
              <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="mt-1" placeholder="Enter username" />
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="mt-1" placeholder="Enter email" />
            </div>
            <div>
              <Label className="text-sm">Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" placeholder="Set password" />
            </div>
            <div>
              <Label className="text-sm">Role</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as 'admin' | 'salesperson')}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salesperson">Salesperson</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleCreateUser} disabled={creating} className="bg-primary text-primary-foreground">
                {creating ? 'Creating...' : 'Create User'}
              </Button>
              <Button variant="outline" onClick={() => { setShowCreate(false); resetCreateForm(); }}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteUser?.username}?</AlertDialogTitle>
            <AlertDialogDescription>This user will be permanently removed from the system.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default UserManagement;