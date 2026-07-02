export const API_ENDPOINTS = {
  AUTH: {
    VERIFY: '/api/v1/public/verify',
    RESET_PASSWORD: '/api/v1/public/reset-password',
    RESEND_CODE: '/api/v1/public/resend',
    REGISTER: '/api/v1/public/register',
    REFRESH_TOKEN: '/api/v1/public/refresh',
    LOGOUT: '/api/v1/public/logout',
    FORGOT_PASSWORD: '/api/v1/public/forgot-password',
    LOGIN: '/api/v1/public/email/username/login',
    CHECK_USER: '/api/v1/public/check-user',
  },

  PRODUCTS: {
    UPDATE: '/api/v1/products/update',
    SUB_CATEGORY_ID: '/api/v1/products/subcategory/id',
    SEARCH: '/api/v1/products/search',
    PRODUCT_ID: '/api/v1/products/id',
    WITH_SKU: '/api/v1/products/id/with-skus',
    GET_ALL: '/api/v1/products/get/all',
    DELETE: '/api/v1/products/delete',
    CREATE: '/api/v1/products/create',
    CATEGORY_ID: '/api/v1/products/category/id',
    ACTIVE: '/api/v1/products/active',
    STATUS: '/api/v1/products/id/status',
  },

  CATEGORIES: {
    GET_ALL: '/api/v1/categories/get/all',
    UPDATE: '/api/v1/categories/id/update',
    UPDATE_ICON: '/api/v1/categories/id/icon',
    WITH_SUBCATEGORIES: '/api/v1/categories/with-subcategories',
    BY_NAME: '/api/v1/categories/name/',
    BY_ID: '/api/v1/categories/id/get/',
    CREATE: '/api/v1/categories/create/',
    DELETE: '/api/v1/categories/delete',
  },

  CATEGORY_ICONS: {
    UPLOAD: '/api/v1/category-icons/upload',
    BY_ID: '/api/v1/category-icons/id',
    GET_ALL: '/api/v1/category-icons/get/all',
    DELETE: '/api/v1/category-icons/delete',
  },

  SUB_CATEGORIES: {
    WITH_PRODUCTS: '/api/v1/subcategories/with-products',
    UPDATE: '/api/v1/subcategories/update',
    BY_ID: '/api/v1/subcategories/id',
    DELETE: '/api/v1/subcategories/delete/',
    CREATE: '/api/v1/subcategories/create/',
    BY_CATEGORY_ID: '/api/v1/subcategories/category/id/all',
    GET_ALL: '/api/v1/subcategories/All',
  },

  ATTRIBUTES: {
    GET_ALL: '/api/v1/attributes',
    BY_ID: '/api/v1/attributes/{id}',
    DELETE: '/api/v1/attributes/{id}',
    BY_NAME: '/api/v1/attributes/name/{name}',
  },

  ATTRIBUTE_VALUES: {
    BY_ID: '/api/v1/attribute-values/{id}',
    UPDATE: '/api/v1/attribute-values/{id}',
    DELETE: '/api/v1/attribute-values/{id}',
    GET_BY_ATTR_AND_VALUE: '/api/v1/attribute-values',
    BY_ATTRIBUTE_ID: '/api/v1/attribute-values/attribute/{attributeId}',
  },

  INVENTORY: {
    CREATE: '/api/v1/inventory',
    BY_SKU: '/api/v1/inventory/sku/',
    BY_PRODUCT: '/api/v1/inventory/product/',
    LOW_STOCK: '/api/v1/inventory/low-stock',
    BY_ID: '/api/v1/inventory/id/',
    ADJUST: '/api/v1/inventory/exact',
    DELETE: '/api/v1/inventory/delete',
    GET_ALL: '/api/v1/inventory/all/',
    RESTOCK: '/api/v1/inventory/restock', // PATCH
  },

  ORDERS: {
    GET_ALL: '/api/v1/orders', // GET
    BY_NUMBER: '/api/v1/orders/number/',
    BY_ID: '/api/v1/orders/id/',
    BAKONG_VERIFY: '/api/v1/orders/bakong/verify',
    BAKONG_INITIATE: '/api/v1/orders/bakong/initiate',
    BAKONG_CALLBACK: '/api/v1/orders/bakong/callback',
    USER_BY_ID: '/api/v1/orders/user/id/',
    USER_HISTORY: '/api/v1/orders/user/history',
    USER_FROM_CART: '/api/v1/orders/user/from-cart',
    USER_FROM_CART_BAKONG: '/api/v1/orders/user/from-cart/bakong',
    USER_DETAIL: '/api/v1/orders/user/detail',
    USER_CANCEL: '/api/v1/orders/user/cancel',
    UPDATE_STATUS: '/api/v1/orders/status/',
  },

  PAYMENTS: {
    USER_HISTORY: '/api/v1/payments/user/history',
    USER_DETAIL: '/api/v1/payments/user/detail',
    USER_ALL: '/api/v1/payments/user/all',
    BY_TRANSACTION: '/api/v1/payments/transaction/',
    BY_ORDER: '/api/v1/payments/order/',
  },
};