import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const paymentApi = {
  /**
   * Get all payments for a user
   * @param {number} userId
   */
  getByUser: (userId) =>
    axiosClient.post(`${API_ENDPOINTS.PAYMENTS.USER_ALL}?userId=${userId}`),

  /**
   * Get payment detail for a specific user and payment
   * @param {number} userId
   * @param {number} paymentId
   */
  getUserDetail: (userId, paymentId) =>
    axiosClient.post(`${API_ENDPOINTS.PAYMENTS.USER_DETAIL}?userId=${userId}&paymentId=${paymentId}`),

  /**
   * Get payment history for a user (with optional filters)
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
    return axiosClient.post(`${API_ENDPOINTS.PAYMENTS.USER_HISTORY}?${params.toString()}`);
  },

  /**
   * Get payment by transaction ID
   * @param {string} transactionId
   */
  getByTransaction: (transactionId) =>
    axiosClient.post(`${API_ENDPOINTS.PAYMENTS.BY_TRANSACTION}?transactionId=${encodeURIComponent(transactionId)}`),

  /**
   * Get payment by order ID
   * @param {number} orderId
   */
  getByOrder: (orderId) =>
    axiosClient.post(`${API_ENDPOINTS.PAYMENTS.BY_ORDER}?orderId=${orderId}`),
};
