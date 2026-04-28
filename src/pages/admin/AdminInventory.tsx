import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductCard } from '@/components/shared/ProductCard';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImagePlus } from 'lucide-react';
import api from '@/lib/api';
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

interface Product {
  _id: string;
  name: string;
  price: number;
  quantityInStock: number;
  unit: string;
  image: string | null;
  createdBy: string;
}

const getImageUrl = (image: string | null) =>
  image ? `https://agric-sales-backend.onrender.com/${image}` : '/placeholder.png';

const AdminInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err: any) {
        toast.error('Failed to load products', {
          description: err.response?.data?.message || 'Check your connection.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setEditPrice(product.price.toString());
    setEditQuantity(product.quantityInStock.toString());
    setEditImage(null);
    setEditImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleSaveEdit = async () => {
    if (!editProduct) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('price', editPrice);
      formData.append('quantityInStock', editQuantity);
      if (editImage) formData.append('image', editImage);

      const res = await api.put(`/products/${editProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProducts(prev =>
        prev.map(p => (p._id === editProduct._id ? res.data.product : p))
      );
      toast.success('Product updated!', { description: `${editProduct.name} has been updated.` });
      setEditProduct(null);
    } catch (err: any) {
      toast.error('Update failed', {
        description: err.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      await api.delete(`/products/${deleteProduct._id}`);
      setProducts(prev => prev.filter(p => p._id !== deleteProduct._id));
      toast.success('Product deleted!', { description: `${deleteProduct.name} has been removed.` });
      setDeleteProduct(null);
    } catch (err: any) {
      toast.error('Delete failed', {
        description: err.response?.data?.message || 'Something went wrong.',
      });
    }
  };

  const dialogImageSrc = editImagePreview ?? getImageUrl(editProduct?.image ?? null);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Inventory</h1>
          <p className="text-sm text-muted-foreground">View all products you have in stock</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                index={i}
                showEdit
                onEdit={handleEdit}
                showDelete
                onDelete={setDeleteProduct}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-display">{editProduct?.name}</DialogTitle>
            <DialogDescription>Update product details below.</DialogDescription>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative group w-28 h-28 sm:w-32 sm:h-32 shrink-0">
                  <img
                    src={dialogImageSrc}
                    alt={editProduct.name}
                    className="w-full h-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ImagePlus className="w-5 h-5 text-white" />
                    <span className="text-white text-[10px]">Change</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <Label className="text-xs">Unit price (GHS)</Label>
                    <Input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="mt-1 h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Quantity in stock</Label>
                    <Input
                      type="number"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      className="mt-1 h-9"
                    />
                  </div>
                  {editImage && (
                    <p className="text-[10px] text-muted-foreground truncate">
                      New: {editImage.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-sm space-y-2 text-muted-foreground">
                <p>Unit: <span className="text-foreground">{editProduct.unit}</span></p>
                <p>
                  Estimated stock cost:{' '}
                  <span className="font-bold text-primary">
                    GHS {((parseInt(editQuantity) || 0) * (parseFloat(editPrice) || 0)).toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button size="sm" onClick={handleSaveEdit} disabled={saving} className="bg-primary text-primary-foreground">
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteProduct?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This product will be permanently removed from inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminInventory;