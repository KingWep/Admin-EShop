// src/constants/status.js
// Status definitions for all entity types used across the admin panel.

export const ORDER_STATUSES = {
  pending: { label: 'Pending', variant: 'warning' },
  processing: { label: 'Processing', variant: 'info' },
  shipped: { label: 'Shipped', variant: 'info' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
  refunded: { label: 'Refunded', variant: 'default' },
};

export const PAYMENT_STATUSES = {
  paid: { label: 'Paid', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  failed: { label: 'Failed', variant: 'danger' },
  refunded: { label: 'Refunded', variant: 'default' },
};

export const PRODUCT_STATUSES = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'danger' },
  draft: { label: 'Draft', variant: 'default' },
  out_of_stock: { label: 'Out of Stock', variant: 'danger' },
  archived: { label: 'Archived', variant: 'default' },
};

export const CUSTOMER_STATUSES = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'default' },
  banned: { label: 'Banned', variant: 'danger' },
};

export const RETURN_STATUSES = {
  requested: { label: 'Requested', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
  completed: { label: 'Completed', variant: 'info' },
};
