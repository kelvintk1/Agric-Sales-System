import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [restockDate, setRestockDate] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Product added successfully!', {
      description: `${name} has been added to inventory.`,
    });
    setName('');
    setPrice('');
    setQuantity('');
    setRestockDate('');
    setImagePreview(null);
  };

  const estimatedCost = (parseFloat(price) || 0) * (parseInt(quantity) || 0);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-primary">Add Product</h1>
          <p className="text-sm text-muted-foreground">Add a new product to your inventory</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSave}
          className="bg-card rounded-xl border p-6 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image upload */}
            <div>
              <label
                htmlFor="product-image"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-muted/30 overflow-hidden"
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
                  <Label className="text-sm font-medium">Quantity in stock</Label>
                  <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="mt-1" required />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Last restock date</Label>
                <Input type="date" value={restockDate} onChange={(e) => setRestockDate(e.target.value)} className="mt-1" />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
            <p>Estimated current stock cost: <span className="font-bold text-primary">GHS {estimatedCost.toLocaleString()}</span></p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-primary text-primary-foreground px-8">Save</Button>
            <Button type="button" variant="outline" onClick={() => { setName(''); setPrice(''); setQuantity(''); setRestockDate(''); setImagePreview(null); }}>Cancel</Button>
          </div>
        </motion.form>
      </motion.div>
    </DashboardLayout>
  );
};

export default AddProduct;
