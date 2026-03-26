import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductCard } from '@/components/shared/ProductCard';
import { mockProducts } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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

const AdminInventory = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setEditPrice(product.price_per_bag.toString());
    setEditQuantity(product.quantity_in_stock.toString());
  };

  const handleSaveEdit = () => {
    if (!editProduct) return;
    setProducts(prev =>
      prev.map(p =>
        p.id === editProduct.id
          ? { ...p, price_per_bag: parseFloat(editPrice) || p.price_per_bag, quantity_in_stock: parseInt(editQuantity) || p.quantity_in_stock }
          : p
      )
    );
    toast.success('Product updated!', { description: `${editProduct.name} has been updated.` });
    setEditProduct(null);
  };

  const handleDelete = () => {
    if (!deleteProduct) return;
    setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
    toast.success('Product deleted!', { description: `${deleteProduct.name} has been removed.` });
    setDeleteProduct(null);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Inventory</h1>
          <p className="text-sm text-muted-foreground">View all products you have in stock</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              showEdit
              onEdit={handleEdit}
              showDelete
              onDelete={setDeleteProduct}
            />
          ))}
        </div>
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
                <img src={editProduct.image_url} alt={editProduct.name} className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg object-cover" />
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
                </div>
              </div>
              <div className="text-sm space-y-2 text-muted-foreground">
                <p>Last restock date: <span className="text-foreground">{editProduct.last_restock_date}</span></p>
                <p>Estimated stock cost: <span className="font-bold text-primary">GHS {((parseInt(editQuantity) || 0) * (parseFloat(editPrice) || 0)).toLocaleString()}</span></p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button size="sm" onClick={handleSaveEdit} className="bg-primary text-primary-foreground">Save</Button>
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
            <AlertDialogDescription>This action cannot be undone. This product will be permanently removed from inventory.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminInventory;
