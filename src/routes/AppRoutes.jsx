// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import DashboardPage      from '../pages/DashboardPage';
import OrdersPage         from '../pages/OrdersPage';
import OrderDetailPage    from '../pages/OrderDetailPage';
import ReturnsPage        from '../pages/ReturnsPage';
import CancelationsPage   from '../pages/CancelationsPage';
import PaymentsPage       from '../pages/PaymentsPage';
import RefundsPage        from '../pages/RefundsPage';
import ReportsPage        from '../pages/ReportsPage';
import TransactionsPage   from '../pages/TransactionsPage';
import CustomersPage        from '../pages/CustomersPage';
import CustomerDetailPage   from '../pages/CustomerDetailPage';
import CustomerGroupsPage   from '../pages/CustomerGroupsPage';
import AddCustomerGroupPage from '../pages/AddCustomerGroupPage';
import ProductsPage       from '../pages/ProductsPage';
import AddProductPage     from '../pages/AddProductPage';
import EditProductPage    from '../pages/EditProductPage';
import CategoriesPage     from '../pages/CategoriesPage';
import AddCategoryPage    from '../pages/AddCategoryPage';
import BrandsPage         from '../pages/BrandsPage';
import AddBrandPage       from '../pages/AddBrandPage';
import SettingsPage       from '../pages/SettingsPage';
import UsersPage          from '../pages/UsersPage';
import NotFoundPage       from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── All admin screens share the AdminLayout (sidebar + topbar + Outlet) ── */}
      <Route path="/" element={<AdminLayout />}>

        {/* Overview */}
        <Route index                    element={<DashboardPage />} />

        {/* Orders group */}
        <Route path="orders"            element={<OrdersPage />} />
        <Route path="orders/:id"        element={<OrderDetailPage />} />
        <Route path="returns"           element={<ReturnsPage />} />
        <Route path="cancelations"      element={<CancelationsPage />} />

        {/* Payments group */}
        <Route path="payments"          element={<PaymentsPage />} />
        <Route path="refunds"           element={<RefundsPage />} />
        <Route path="transactions"      element={<TransactionsPage />} />{/* placeholder */}

        {/* Customers group */}
        <Route path="customers"         element={<CustomersPage />} />
        <Route path="customers/:id"     element={<CustomerDetailPage />} />
        <Route path="customer-groups"   element={<CustomerGroupsPage />} />
        <Route path="customer-groups/add"      element={<AddCustomerGroupPage />} />
        <Route path="customer-groups/edit/:id" element={<AddCustomerGroupPage />} />

        {/* Products group */}
        <Route path="products"          element={<ProductsPage />} />
        <Route path="products/add"      element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="categories"        element={<CategoriesPage />} />
        <Route path="categories/add"      element={<AddCategoryPage />} />
        <Route path="categories/edit/:id" element={<AddCategoryPage />} />
        <Route path="brands"            element={<BrandsPage />} />
        <Route path="brands/add"        element={<AddBrandPage />} />
        <Route path="brands/edit/:id"   element={<AddBrandPage />} />

        {/* Reports group */}
        <Route path="sales-report"      element={<ReportsPage />} />
        <Route path="payment-report"    element={<ReportsPage />} />
        <Route path="tax-report"        element={<ReportsPage />} />

        {/* Settings group */}
        <Route path="settings"          element={<SettingsPage />} />
        <Route path="users"             element={<UsersPage />} />

      </Route>

      {/* ── Catch-all 404 – only fires when NO admin route matches ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
