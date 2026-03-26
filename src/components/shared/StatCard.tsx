import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  delay?: number;
  className?: string;
}

export const StatCard = ({ title, value, subtitle, icon, delay = 0, className = '' }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`bg-card rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}
  >
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
    <div className="flex items-end justify-between mt-2">
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {icon && <div className="text-primary opacity-60">{icon}</div>}
    </div>
  </motion.div>
);
