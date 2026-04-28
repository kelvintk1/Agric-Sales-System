import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantityInStock: number;
  unit: string;
}

const SalesEntry = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [productName, setProductName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bags, setBags] = useState('');

  const selectedProduct = products.find(p => p.name === productName);
  const unitPrice = selectedProduct?.price ?? 0;
  const totalAmount = unitPrice * (parseInt(bags) || 0);
  const timestamp = new Date().toLocaleString();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err: any) {
        toast.error('Could not load products', {
          description: err.response?.data?.message || 'Check your connection.',
        });
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const resetForm = () => {
    setCustomerName('');
    setContact('');
    setProductName('');
    setPaymentMethod('');
    setBags('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !paymentMethod) {
      toast.error('Please fill all required fields');
      return;
    }

    if (selectedProduct && parseInt(bags) > selectedProduct.quantityInStock) {
      toast.error('Insufficient stock', {
        description: `Only ${selectedProduct.quantityInStock} ${selectedProduct.unit}(s) available.`,
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/sales', {
        productName,
        bags: parseInt(bags),
        customerName,
        contact,
        paymentMethod,
      });

      toast.success('Sale logged successfully!', {
        description: `${customerName} purchased ${bags} ${selectedProduct?.unit}(s) of ${productName}.`,
      });

      setProducts(prev =>
        prev.map(p =>
          p.name === productName
            ? { ...p, quantityInStock: p.quantityInStock - parseInt(bags) }
            : p
        )
      );

      resetForm();
    } catch (err: any) {
      toast.error('Failed to log sale', {
        description: err.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-primary">Sales Entry</h1>
          <p className="text-sm text-muted-foreground">Log your sales into database for convenient tracking</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSave}
          className="bg-card rounded-xl border p-4 sm:p-6 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Customer Name</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Product</Label>
              <Select value={productName} onValueChange={setProductName} disabled={loadingProducts}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={loadingProducts ? 'Loading...' : 'Select product'} />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p._id} value={p.name}>
                      {p.name} ({p.quantityInStock} {p.unit}s left)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Contact</Label>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone number"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Unit Price</Label>
              <Input
                value={unitPrice ? `GHS ${unitPrice.toFixed(2)}` : ''}
                readOnly
                className="mt-1 bg-muted/50"
                placeholder="Auto-generated"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="MoMo">MoMo</SelectItem>
                  <SelectItem value="Bank Transfer">Bank</SelectItem>
                  <SelectItem value="POS">POS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Bags</Label>
              <Input
                type="number"
                min="1"
                value={bags}
                onChange={(e) => setBags(e.target.value)}
                placeholder="Number of bags"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Timestamp</Label>
              <Input value={timestamp} readOnly className="mt-1 bg-muted/50" />
            </div>

            <div>
              <Label className="text-sm font-medium">Total Amount</Label>
              <Input
                value={totalAmount ? `GHS ${totalAmount.toFixed(2)}` : ''}
                readOnly
                className="mt-1 bg-muted/50"
                placeholder="Auto-generated"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground px-8 sm:px-10"
            >
              {submitting ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </motion.form>
      </motion.div>
    </DashboardLayout>
  );
};

export default SalesEntry;