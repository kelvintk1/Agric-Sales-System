export type UserRole = 'admin' | 'salesperson';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price_per_bag: number;
  quantity_in_stock: number;
  image_url: string;
  last_restock_date: string;
  created_by: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  created_at: string;
}

export interface Sale {
  id: string;
  customer_id: string;
  product_id: string;
  salesperson_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  payment_method: 'Cash' | 'MoMo' | 'Bank' | 'POS';
  transaction_date: string;
  // joined
  customer_name?: string;
  salesperson_name?: string;
  product_name?: string;
}

export interface SidebarItem {
  label: string;
  icon: string;
  path: string;
}
