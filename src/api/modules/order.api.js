import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const orderApi = {
  /**
   * Get all orders (Admin, paginated) — uses GET
   * @param {number} page
   * @param {number} size
   */
  getAll: (page = 0, size = 10) =>
    axiosClient.get(`${API_ENDPOINTS.ORDERS.GET_ALL}?page=${page}&size=${size}`),

  /**
   * Get order by ID
   * @param {number} id
   */
  getById: (id) =>
    axiosClient.post(`${API_ENDPOINTS.ORDERS.BY_ID}?id=${id}`),

  /**
   * Get order by order number
   * @param {string} orderNumber
   */
  getByNumber: (orderNumber) =>
    axiosClient.post(`${API_ENDPOINTS.ORDERS.BY_NUMBER}?orderNumber=${encodeURIComponent(orderNumber)}`),

  /**
   * Get all orders for a user (paginated)
   * @param {number} userId
   * @param {number} page
   * @param {number} size
   */
  getByUser: (userId, page = 0, size = 10) =>
    axiosClient.post(`${API_ENDPOINTS.ORDERS.USER_BY_ID}?userId=${userId}&page=${page}&size=${size}`),

  /**
   * Get order detail for a specific user
   * @param {number} userId
   * @param {number} orderId
   */
  getUserDetail: (userId, orderId) =>
    axiosClient.post(`${API_ENDPOINTS.ORDERS.USER_DETAIL}?userId=${userId}&orderId=${orderId}`),

  /**
   * Get order history for a user (with optional filters)
   * @param {number} userId
   * @param {object} [filters]
   * @param {string} [filters.status]
   * @param {string} [filters.startDate] - ISO datetime string
   * @param {string} [filters.endDate]   - ISO datetime string
   * @param {number} [filters.page]
   * @param {number} [filters.size]
   */
  getUserHistory: (userId, { status, startDate, endDate, page = 0, size = 10 } = {}) => {
    const params = new URLSearchParams({ userId, page, size });
    if (status) params.append("status", status);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return axiosClient.post(`${API_ENDPOINTS.ORDERS.USER_HISTORY}?${params.toString()}`);
  },

  /**
   * Update order status (Admin)
   * @param {number} id
   * @param {string} status - e.g. "SHIPPED", "DELIVERED", "CANCELLED"
   */
  updateStatus: (id, status) =>
    axiosClient.post(`${API_ENDPOINTS.ORDERS.UPDATE_STATUS}?id=${id}&status=${encodeURIComponent(status)}`),

  /**
   * Cancel an order
   * @param {number} id
   * @param {number} userId
   */
  cancel: (id, userId) =>
    axiosClient.post(`${API_ENDPOINTS.ORDERS.USER_CANCEL}?id=${id}&userId=${userId}`),

  /**
   * Create order from cart (Cash on Delivery)
   * @param {number} userId
   * @param {object} orderRequest - { addressId, note, ... }
   */
  createFromCart: (userId, orderRequest) =>
    axiosClient.post(`${API_ENDPOINTS.ORDERS.USER_FROM_CART}?userId=${userId}`, orderRequest),

  /**
   * Create order from cart with Bakong payment
   * @param {number} userId
   * @param {object} orderRequest
   */
  createFromCartBakong: (userId, orderRequest) =>
    axiosClient.post(`${API_ENDPOINTS.ORDERS.USER_FROM_CART_BAKONG}?userId=${userId}`, orderRequest),

  /**
   * Initiate Bakong payment for an existing order
   * @param {number} orderId
   */
  initiateBakong: (orderId) =>
    axiosClient.post(`${API_ENDPOINTS.ORDERS.BAKONG_INITIATE}?orderId=${orderId}`),

  /**
   * Verify a Bakong payment transaction
   * @param {number} orderId
   * @param {string} transactionId
   */
  verifyBakong: (orderId, transactionId) =>
    axiosClient.post(`${API_ENDPOINTS.ORDERS.BAKONG_VERIFY}?orderId=${orderId}&transactionId=${encodeURIComponent(transactionId)}`),
};
