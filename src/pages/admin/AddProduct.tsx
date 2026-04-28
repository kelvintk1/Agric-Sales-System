import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

const UNITS = ['kg', 'g', 'litre', 'ml', 'bag', 'crate', 'piece', 'dozen'];

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setQuantity('');
    setUnit('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !quantity || !unit) {
      toast.error('Please fill all required fields including unit');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quantityInStock', quantity);
    formData.append('unit', unit);
    if (imageFile) formData.append('image', imageFile);

    try {
      setLoading(true);

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product added successfully!', {
        description: `${name} has been added to inventory.`,
      });
      resetForm();

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const estimatedCost = (parseFloat(price) || 0) * (parseInt(quantity) || 0);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-primary">Add Product</h1>
          <p className="text-sm text-muted-foreground">Add a new product to your inventory</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSave}
          className="bg-card rounded-xl border p-4 sm:p-6 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image upload */}
            <div>
              <label
                htmlFor="product-image"
                className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-muted/30 overflow-hidden"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm font-medium">Upload image</span>
                  </div>
                )}
              </label>
              <input id="product-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" className="mt-1" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">Unit price (GHS)</Label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="mt-1" required />
                </div>
                <div>
                  <Label className="text-sm font-medium">Quantity</Label>
                  <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="mt-1" required />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Unit</Label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled>Select unit</option>
                  {UNITS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
            <p>Estimated stock cost: <span className="font-bold text-primary">GHS {estimatedCost.toLocaleString()}</span></p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground px-8">
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </motion.form>
      </motion.div>
    </DashboardLayout>
  );
};

export default AddProduct;