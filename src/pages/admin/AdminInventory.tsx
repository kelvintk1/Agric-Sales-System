import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductCard } from '@/components/shared/ProductCard';
import { mockProducts } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AdminInventory = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Repeat products for grid display like the design
  const displayProducts = [...products, ...products, ...products];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Inventory</h1>
          <p className="text-sm text-muted-foreground">View all products you have in stock</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayProducts.map((product, i) => (
            <ProductCard
              key={`${product.id}-${i}`}
              product={product}
              index={i}
              showEdit
              onEdit={setEditProduct}
            />
          ))}
        </div>
      </motion.div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-display">{editProduct?.name}</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <img src={editProduct.image_url} alt={editProduct.name} className="w-32 h-32 rounded-lg object-cover" />
                <div className="space-y-3 flex-1">
                  <div>
                    <Label className="text-xs">Unit price</Label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">GHS</span>
                      <span className="font-bold text-primary">{editProduct.price_per_bag.toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Quantity in stock</Label>
                    <p className="font-bold text-primary">{editProduct.quantity_in_stock} <span className="text-xs font-normal text-muted-foreground">bags</span></p>
                  </div>
                </div>
              </div>
              <div className="text-sm space-y-2 text-muted-foreground">
                <p>Last restock date: <span className="text-foreground">{editProduct.last_restock_date}</span></p>
                <p>Estimated current stock cost: <span className="font-bold text-primary">GHS {(editProduct.quantity_in_stock * editProduct.price_per_bag).toLocaleString()}.00</span></p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button size="sm" className="bg-primary text-primary-foreground">Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminInventory;
