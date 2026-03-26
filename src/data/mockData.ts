import { User, Product, Customer, Sale } from '@/types';
import yamImg from '@/assets/yam-product.jpg';
import maizeImg from '@/assets/maize-product.jpg';
import riceImg from '@/assets/rice-product.jpg';
import sorghumImg from '@/assets/sorghum-product.jpg';

export const mockUsers: User[] = [
  { id: '1', name: 'Akoto John', email: 'johnakoto@gmail.com', phone: '0201340987', role: 'admin', created_at: '2025-01-01' },
  { id: '2', name: 'Akoto Doe', email: 'akotdoe@hotmail.com', phone: '0201340936', role: 'salesperson', created_at: '2025-01-05' },
  { id: '3', name: 'Clinton Kwame', email: 'kwameclinton@outlook.com', phone: '0531340387', role: 'salesperson', created_at: '2025-01-10' },
  { id: '4', name: 'Eman Aussy', email: 'aussy5678@outlook.com', phone: '0201340387', role: 'salesperson', created_at: '2025-02-01' },
  { id: '5', name: 'Ellison Somda', email: 'elliso54@gmail.com', phone: '0509540987', role: 'salesperson', created_at: '2025-02-15' },
  { id: '6', name: 'Gares Koyo', email: 'koyo2503go@ymail.com', phone: '0201342369', role: 'salesperson', created_at: '2025-03-01' },
  { id: '7', name: 'Larry Ama', email: 'larryama@trustandco.com', phone: '0541340987', role: 'salesperson', created_at: '2025-03-10' },
  { id: '8', name: 'Lantey Emma', email: 'lantnak3@outlook.com', phone: '0201899564', role: 'salesperson', created_at: '2025-03-15' },
  { id: '9', name: 'Owusu Akofua', email: 'akof2o89@yahoo.com', phone: '0206540987', role: 'salesperson', created_at: '2025-04-01' },
  { id: '10', name: 'Okeyere Ato', email: 'okeyeato@gmail.com', phone: '0501340387', role: 'salesperson', created_at: '2025-04-15' },
];

export const mockProducts: Product[] = [
  { id: '1', name: 'Yam', price_per_bag: 30, quantity_in_stock: 360, image_url: yamImg, last_restock_date: '2026-01-18', created_by: '1', created_at: '2025-01-01' },
  { id: '2', name: 'Maize', price_per_bag: 25, quantity_in_stock: 200, image_url: maizeImg, last_restock_date: '2026-01-15', created_by: '1', created_at: '2025-01-01' },
  { id: '3', name: 'Rice', price_per_bag: 45, quantity_in_stock: 150, image_url: riceImg, last_restock_date: '2026-01-20', created_by: '1', created_at: '2025-01-01' },
  { id: '4', name: 'Sorghum', price_per_bag: 20, quantity_in_stock: 80, image_url: sorghumImg, last_restock_date: '2026-01-10', created_by: '1', created_at: '2025-01-01' },
];

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Akoto Jane', contact: '0201234567', created_at: '2025-01-01' },
  { id: '2', name: 'Akoto Doe', contact: '0209876543', created_at: '2025-01-05' },
  { id: '3', name: 'Djokoto Leah', contact: '0551234567', created_at: '2025-02-01' },
  { id: '4', name: 'Eman Aussy', contact: '0301234567', created_at: '2025-02-15' },
  { id: '5', name: 'Ellison Seneca', contact: '0241234567', created_at: '2025-03-01' },
  { id: '6', name: 'Warekeh Pofo', contact: '0271234567', created_at: '2025-03-15' },
  { id: '7', name: 'Serena Bill', contact: '0201111111', created_at: '2025-04-01' },
  { id: '8', name: 'Clinton Kwame', contact: '0502222222', created_at: '2025-04-15' },
  { id: '9', name: 'Gares Koyo', contact: '0203333333', created_at: '2025-05-01' },
  { id: '10', name: 'Paapa Elie', contact: '0554444444', created_at: '2025-05-15' },
];

export const mockSales: Sale[] = [
  { id: '1', customer_id: '1', product_id: '1', salesperson_id: '2', quantity: 4, unit_price: 30, total_amount: 400, payment_method: 'MoMo', transaction_date: '2026-01-26', customer_name: 'Akoto Jane', salesperson_name: 'Akoto Doe', product_name: 'Yam' },
  { id: '2', customer_id: '2', product_id: '3', salesperson_id: '3', quantity: 8, unit_price: 45, total_amount: 600, payment_method: 'Cash', transaction_date: '2026-01-26', customer_name: 'Akoto Doe', salesperson_name: 'Clinton Kwame', product_name: 'Rice' },
  { id: '3', customer_id: '3', product_id: '1', salesperson_id: '6', quantity: 7, unit_price: 30, total_amount: 650, payment_method: 'Bank', transaction_date: '2026-01-26', customer_name: 'Djokoto Leah', salesperson_name: 'Gares Koyo', product_name: 'Yam' },
  { id: '4', customer_id: '4', product_id: '2', salesperson_id: '3', quantity: 9, unit_price: 25, total_amount: 100, payment_method: 'Cash', transaction_date: '2026-01-26', customer_name: 'Eman Aussy', salesperson_name: 'Clinton Kwame', product_name: 'Maize' },
  { id: '5', customer_id: '5', product_id: '1', salesperson_id: '6', quantity: 4, unit_price: 30, total_amount: 400, payment_method: 'MoMo', transaction_date: '2026-01-26', customer_name: 'Ellison Seneca', salesperson_name: 'Gares Koyo', product_name: 'Yam' },
  { id: '6', customer_id: '6', product_id: '3', salesperson_id: '6', quantity: 2, unit_price: 45, total_amount: 300, payment_method: 'POS', transaction_date: '2026-01-26', customer_name: 'Warekeh Pofo', salesperson_name: 'Gares Koyo', product_name: 'Rice' },
  { id: '7', customer_id: '7', product_id: '2', salesperson_id: '3', quantity: 9, unit_price: 25, total_amount: 700, payment_method: 'Cash', transaction_date: '2026-01-26', customer_name: 'Serena Bill', salesperson_name: 'Clinton Kwame', product_name: 'Maize' },
  { id: '8', customer_id: '8', product_id: '1', salesperson_id: '7', quantity: 9, unit_price: 30, total_amount: 700, payment_method: 'MoMo', transaction_date: '2026-01-26', customer_name: 'Clinton Kwame', salesperson_name: 'Larry Ama', product_name: 'Yam' },
  { id: '9', customer_id: '8', product_id: '2', salesperson_id: '8', quantity: 5, unit_price: 25, total_amount: 2000, payment_method: 'MoMo', transaction_date: '2026-01-26', customer_name: 'Clinton Kwame', salesperson_name: 'Lantey Emma', product_name: 'Maize' },
  { id: '10', customer_id: '10', product_id: '1', salesperson_id: '2', quantity: 3, unit_price: 30, total_amount: 400, payment_method: 'Cash', transaction_date: '2026-01-26', customer_name: 'Paapa Elie', salesperson_name: 'Akoto Doe', product_name: 'Yam' },
];

export const weeklySalesData = [
  { day: 'Monday', amount: 1200 },
  { day: 'Tuesday', amount: 800 },
  { day: 'Wednesday', amount: 1500 },
  { day: 'Thursday', amount: 900 },
  { day: 'Friday', amount: 2000 },
  { day: 'Saturday', amount: 1800 },
  { day: 'Sunday', amount: 600 },
];
