import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductCard } from '@/components/shared/ProductCard';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantityInStock: number;
  unit: string;
  image: string | null;
}

const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const SalesInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-primary">Inventory</h1>
          <p className="text-sm text-muted-foreground">View all products you have in stock</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No products available.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default SalesInventory;