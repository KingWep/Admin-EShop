// AppRoutes.jsx
// Central routing configuration for the admin panel

import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';

// Page components
import AddBrandPage from '../pages/AddBrandPage';
import AddProductPage from '../pages/AddProductPage';
import BrandsPage from '../pages/BrandsPage';
import CancelationsPage from '../pages/CancelationsPage';
import CategoriesPage from '../pages/CategoriesPage';
import CustomerDetailPage from '../pages/CustomerDetailPage';
import CustomersPage from '../pages/CustomersPage';
import DashboardPage from '../pages/DashboardPage';
import EditProductPage from '../pages/EditProductPage';
import NotFoundPage from '../pages/NotFoundPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import OrdersPage from '../pages/OrdersPage';
import PaymentsPage from '../pages/PaymentsPage';
import ProductsPage from '../pages/ProductsPage';
import RefundsPage from '../pages/RefundsPage';
import ReportsPage from '../pages/ReportsPage';
import ReturnsPage from '../pages/ReturnsPage';
import SettingsPage from '../pages/SettingsPage';
import UsersPage from '../pages/UsersPage';

const AppRoutes = () => (
  <Routes>
    {/* All admin routes share the AdminLayout */}
    <Route path="/" element={<AdminLayout />}>
      {/* Primary navigation items */}
      <Route index element={<DashboardPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="returns" element={<ReturnsPage />} />
      <Route path="cancelations" element={<CancelationsPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="refunds" element={<RefundsPage />} />
      {/* Placeholder routes – using ReportsPage as temporary component */}
      <Route path="transactions" element={<ReportsPage />} />
      <Route path="customers" element={<CustomersPage />} />
      <Route path="customer-groups" element={<ReportsPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="brands" element={<BrandsPage />} />
      <Route path="sales-report" element={<ReportsPage />} />
      <Route path="payment-report" element={<ReportsPage />} />
      <Route path="tax-report" element={<ReportsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="users" element={<UsersPage />} />

      {/* Sub‑routes that are not part of the main navigation */}
      <Route path="products/add" element={<AddProductPage />} />
      <Route path="products/edit/:id" element={<EditProductPage />} />
      <Route path="brands/add" element={<AddBrandPage />} />
      <Route path="orders/:id" element={<OrderDetailPage />} />
      <Route path="customers/:id" element={<CustomerDetailPage />} />
    </Route>

    {/* Fallback for any undefined route */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
