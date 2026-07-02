import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const inventoryApi = {
  /**
   * Get all inventory records (paginated, Admin only)
   * @param {number} page
   * @param {number} size
   */
  getAll: (page = 0, size = 10) =>
    axiosClient.post(`${API_ENDPOINTS.INVENTORY.GET_ALL}?page=${page}&size=${size}`),

  /**
   * Get inventory record by ID
   * @param {number} id
   */
  getById: (id) =>
    axiosClient.post(`${API_ENDPOINTS.INVENTORY.BY_ID}?id=${id}`),

  /**
   * Get inventory by product SKU ID
   * @param {number} skuId
   */
  getBySkuId: (skuId) =>
    axiosClient.post(`${API_ENDPOINTS.INVENTORY.BY_SKU}?skuId=${skuId}`),

  /**
   * Get all SKU inventories for a product (paginated)
   * @param {number} productId
   * @param {number} page
   * @param {number} size
   */
  getByProductId: (productId, page = 0, size = 10) =>
    axiosClient.post(
      `${API_ENDPOINTS.INVENTORY.BY_PRODUCT}?productId=${productId}&page=${page}&size=${size}`
    ),

  /**
   * Get low stock items (items where quantity <= threshold)
   * @param {number} threshold - default 10
   * @param {number} page
   * @param {number} size
   */
  getLowStock: (threshold = 10, page = 0, size = 10) =>
    axiosClient.post(
      `${API_ENDPOINTS.INVENTORY.LOW_STOCK}?threshold=${threshold}&page=${page}&size=${size}`
    ),

  /**
   * Create inventory record for a product SKU
   * @param {{ skuId: number, quantity: number, warehouseLocation?: string }} data
   */
  create: (data) =>
    axiosClient.post(API_ENDPOINTS.INVENTORY.CREATE, data),

  /**
   * Set exact quantity / warehouse location (adjust)
   * @param {number} id - Inventory ID
   * @param {{ quantity: number, warehouseLocation?: string }} data
   */
  adjust: (id, data) =>
    axiosClient.post(`${API_ENDPOINTS.INVENTORY.ADJUST}?id=${id}`, data),

  /**
   * Add quantity to existing inventory (restock)
   * @param {number} id - Inventory ID
   * @param {{ quantity: number }} data
   */
  restock: (id, data) =>
    axiosClient.patch(`${API_ENDPOINTS.INVENTORY.RESTOCK}?id=${id}`, data),

  /**
   * Delete an inventory record by ID
   * @param {number} id
   */
  delete: (id) =>
    axiosClient.post(`${API_ENDPOINTS.INVENTORY.DELETE}?id=${id}`),
};
