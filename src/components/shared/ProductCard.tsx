import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantityInStock: number;
  unit: string;
  image: string | null;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onEdit?: (product: Product) => void;
  showEdit?: boolean;
  onDelete?: (product: Product) => void;
  showDelete?: boolean;
}

export const ProductCard = ({ product, index, onEdit, showEdit = false, onDelete, showDelete = false }: ProductCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
  >
    <div className="relative h-28 sm:h-36 overflow-hidden">
      <img
        src={product.image ? `https://agric-sales-backend.onrender.com/${product.image}` : '/placeholder.png'}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {showEdit && (
          <button
            onClick={() => onEdit?.(product)}
            className="bg-card/90 backdrop-blur-sm rounded-full p-1.5"
          >
            <Pencil className="w-3.5 h-3.5 text-primary" />
          </button>
        )}
        {showDelete && (
          <button
            onClick={() => onDelete?.(product)}
            className="bg-card/90 backdrop-blur-sm rounded-full p-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </button>
        )}
      </div>
    </div>
    <div className="p-2.5 sm:p-3">
      <h3 className="font-semibold text-foreground text-xs sm:text-sm">{product.name}</h3>
      <div className="mt-1 sm:mt-1.5 space-y-0.5 text-[10px] sm:text-xs text-muted-foreground">
        <p>Qty: <span className="font-semibold text-primary">{product.quantityInStock ?? 0}</span> {product.unit}</p>
        <p>Price: <span className="font-semibold text-foreground">GHS {(product.price ?? 0).toFixed(2)}</span></p>
        <p className="font-semibold text-primary">
          Total: GHS {((product.quantityInStock ?? 0) * (product.price ?? 0)).toFixed(0)}
        </p>
      </div>
    </div>
  </motion.div>
);