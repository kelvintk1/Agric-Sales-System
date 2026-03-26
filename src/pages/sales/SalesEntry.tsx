import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProducts } from '@/data/mockData';
import { useState } from 'react';
import { toast } from 'sonner';

const SalesEntry = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [productId, setProductId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bags, setBags] = useState('');

  const selectedProduct = mockProducts.find(p => p.id === productId);
  const unitPrice = selectedProduct?.price_per_bag || 0;
  const totalAmount = unitPrice * (parseInt(bags) || 0);
  const timestamp = new Date().toLocaleString();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Sale logged successfully!', {
      description: `${name} purchased ${bags} bags of ${selectedProduct?.name}.`,
    });
    setName('');
    setContact('');
    setProductId('');
    setPaymentMethod('');
    setBags('');
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-primary">Sales Entry</h1>
          <p className="text-sm text-muted-foreground">Log your sales into database for convenient tracking</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSave}
          className="bg-card rounded-xl border p-6 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" className="mt-1" required />
            </div>
            <div>
              <Label className="text-sm font-medium">Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Contact</Label>
              <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone number" className="mt-1" required />
            </div>
            <div>
              <Label className="text-sm font-medium">Unit price</Label>
              <Input value={unitPrice ? `GHS ${unitPrice.toFixed(2)}` : ''} readOnly className="mt-1 bg-muted/50" placeholder="Auto-generated" />
            </div>
            <div>
              <Label className="text-sm font-medium">Payment method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="MoMo">MoMo</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                  <SelectItem value="POS">POS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Bags</Label>
              <Input type="number" value={bags} onChange={(e) => setBags(e.target.value)} placeholder="Number of bags" className="mt-1" required />
            </div>
            <div>
              <Label className="text-sm font-medium">Timestamp</Label>
              <Input value={timestamp} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <Label className="text-sm font-medium">Total Amount</Label>
              <Input value={totalAmount ? `GHS ${totalAmount.toFixed(2)}` : ''} readOnly className="mt-1 bg-muted/50" placeholder="Auto-generated" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-primary text-primary-foreground px-10">Save</Button>
            <Button type="button" variant="outline" onClick={() => { setName(''); setContact(''); setProductId(''); setPaymentMethod(''); setBags(''); }}>Cancel</Button>
          </div>
        </motion.form>
      </motion.div>
    </DashboardLayout>
  );
};

export default SalesEntry;
