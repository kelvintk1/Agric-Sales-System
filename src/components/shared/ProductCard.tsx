import { motion } from 'framer-motion';
import { Product } from '@/types';
import { Pencil } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
  onEdit?: (product: Product) => void;
  showEdit?: boolean;
}

export const ProductCard = ({ product, index, onEdit, showEdit = false }: ProductCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
  >
    <div className="relative h-36 overflow-hidden">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      {showEdit && (
        <button
          onClick={() => onEdit?.(product)}
          className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="w-3.5 h-3.5 text-primary" />
        </button>
      )}
    </div>
    <div className="p-3">
      <h3 className="font-semibold text-foreground text-sm">{product.name}</h3>
      <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
        <p>Quantity: <span className="font-semibold text-primary">{product.quantity_in_stock}</span> bags</p>
        <p>Unit price: <span className="font-semibold text-foreground">GHS {product.price_per_bag.toFixed(2)}</span></p>
        <p className="font-semibold text-primary">
          Total: GHS {(product.quantity_in_stock * product.price_per_bag).toFixed(0)}
        </p>
      </div>
    </div>
  </motion.div>
);
