// ─── Navigation Items ──────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { path: '/',                 label: 'Dashboard',         icon: 'dashboard',  group: 'overview' },
  { path: '/orders',           label: 'Orders',            icon: 'orders',     group: 'orders', badge: 128 },
  { path: '/returns',          label: 'Returns',           icon: 'returns',    group: 'orders', badge: 12 },
  { path: '/cancelations',     label: 'Cancelations',      icon: 'cancelations', group: 'orders', badge: 8 },
  { path: '/payments',         label: 'Payment Details',   icon: 'payments',   group: 'payments' },
  { path: '/refunds',          label: 'Refunds',           icon: 'refunds',    group: 'payments' },
  { path: '/transactions',     label: 'Transactions',      icon: 'transactions', group: 'payments' },
  { path: '/customers',        label: 'Customers',         icon: 'customers',  group: 'customers' },
  { path: '/customer-groups',  label: 'Customer Groups',   icon: 'customerGroups', group: 'customers' },
  { path: '/products',         label: 'Products',          icon: 'products',   group: 'products' },
  { path: '/categories',       label: 'Categories',        icon: 'categories', group: 'products' },
  { path: '/brands',           label: 'Brands',            icon: 'brands',     group: 'products' },
  { path: '/sales-report',     label: 'Sales Report',      icon: 'reports',    group: 'reports' },
  { path: '/payment-report',   label: 'Payment Report',    icon: 'reports',    group: 'reports' },
  { path: '/tax-report',       label: 'Tax Report',        icon: 'reports',    group: 'reports' },
  { path: '/settings',         label: 'Settings',          icon: 'settings',   group: 'settings' },
  { path: '/users',            label: 'Users & Roles',     icon: 'users',      group: 'settings' },
];

export const NAV_GROUPS = [
  { key: 'overview',  label: 'OVERVIEW' },
  { key: 'orders',    label: 'ORDERS' },
  { key: 'payments',  label: 'PAYMENTS' },
  { key: 'customers', label: 'CUSTOMERS' },
  { key: 'products',  label: 'PRODUCTS' },
  { key: 'reports',   label: 'REPORTS' },
  { key: 'settings',  label: 'SETTINGS' },
];

// ─── Status Definitions ────────────────────────────────────────────────────
export const ORDER_STATUSES = {
  pending:    { label: 'Pending',    variant: 'warning' },
  processing: { label: 'Processing', variant: 'info' },
  shipped:    { label: 'Shipped',    variant: 'info' },
  completed:  { label: 'Completed',  variant: 'success' },
  cancelled:  { label: 'Cancelled',  variant: 'danger' },
  refunded:   { label: 'Refunded',   variant: 'default' },
};

export const PAYMENT_STATUSES = {
  paid:    { label: 'Paid',    variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  failed:  { label: 'Failed',  variant: 'danger' },
  refunded:{ label: 'Refunded',variant: 'default' },
};

export const PRODUCT_STATUSES = {
  active:       { label: 'Active',        variant: 'success' },
  draft:        { label: 'Draft',         variant: 'default' },
  out_of_stock: { label: 'Out of Stock',  variant: 'danger' },
  archived:     { label: 'Archived',      variant: 'default' },
};

export const CUSTOMER_STATUSES = {
  active:   { label: 'Active',   variant: 'success' },
  inactive: { label: 'Inactive', variant: 'default' },
  banned:   { label: 'Banned',   variant: 'danger' },
};

export const RETURN_STATUSES = {
  requested: { label: 'Requested', variant: 'warning' },
  approved:  { label: 'Approved',  variant: 'success' },
  rejected:  { label: 'Rejected',  variant: 'danger' },
  completed: { label: 'Completed', variant: 'info' },
};

// ─── Permissions ────────────────────────────────────────────────────────────
export const PERMISSIONS = [
  'view', 'create', 'edit', 'delete', 'export',
];

export const PERMISSION_MODULES = [
  'Dashboard', 'Products', 'Categories', 'Brands',
  'Orders', 'Customers', 'Payments', 'Returns',
  'Reports', 'Settings', 'Users',
];

// ─── Categories ─────────────────────────────────────────────────────────────
export const CATEGORIES = [
  'Electronics', 'Clothing', 'Accessories', 'Home & Garden',
  'Sports', 'Books', 'Beauty', 'Toys',
];

// ─── Currencies ─────────────────────────────────────────────────────────────
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
