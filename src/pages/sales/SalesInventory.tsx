import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductCard } from '@/components/shared/ProductCard';
import { mockProducts } from '@/data/mockData';
import { motion } from 'framer-motion';

const SalesInventory = () => {
  const displayProducts = [...mockProducts, ...mockProducts, ...mockProducts];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Inventory</h1>
          <p className="text-sm text-muted-foreground">View all products you have in stock</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayProducts.map((product, i) => (
            <ProductCard key={`${product.id}-${i}`} product={product} index={i} />
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SalesInventory;
