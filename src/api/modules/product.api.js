import { API_ENDPOINTS } from "../endpoints";
import axiosClient from "../axiosClient";

export const productApi = {
  /**
   * Get all products (paginated)
   * @param {number} page - page index (0-based)
   * @param {number} size - items per page
   */
  getAll: (page = 0, size = 10) =>
    axiosClient.post(`${API_ENDPOINTS.PRODUCTS.GET_ALL}?page=${page}&size=${size}`),

  /**
   * Get product by ID
   * @param {number} id
   */
  getById: (id) =>
    axiosClient.post(`${API_ENDPOINTS.PRODUCTS.PRODUCT_ID}?id=${id}`),

  /**
   * Get product with all SKU variants
   * @param {number} id
   */
  getWithSkus: (id) =>
    axiosClient.post(`${API_ENDPOINTS.PRODUCTS.WITH_SKU}?id=${id}`),

  /**
   * Create a new product with images
   *
   * The API expects:
   *  - Query params: name, description, is_active, sub_category_id, skus (JSON string)
   *  - Body: multipart/form-data with image files under the key "files"
   *
   * @param {Object} productData
   * @param {string} productData.name              - Product name (required)
   * @param {number} productData.sub_category_id   - Sub-category ID (required)
   * @param {string} [productData.description]     - Description
   * @param {boolean} [productData.is_active]      - Active status (default true)
   * @param {Array}  [productData.skus]            - Array of SKU objects
   * @param {File[]} [productData.files]           - Image files to upload
   */
  create: ({ name, sub_category_id, description, is_active = true, skus = [], files = [] }) => {
    // Build query string for text fields
    const params = new URLSearchParams();
    params.append("name", name);
    params.append("sub_category_id", sub_category_id);
    if (description) params.append("description", description);
    params.append("is_active", is_active);
    if (skus.length > 0) params.append("skus", JSON.stringify(skus));

    // Build FormData for image files
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    return axiosClient.post(
      `${API_ENDPOINTS.PRODUCTS.CREATE}?${params.toString()}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  /**
   * Update an existing product
   * @param {number} id - Product ID (required)
   * @param {Object} productData - Same shape as create()
   */
  update: (id, { name, sub_category_id, description, is_active = true, skus = [], files = [] }) => {
    const params = new URLSearchParams();
    params.append("id", id);
    params.append("name", name);
    params.append("sub_category_id", sub_category_id);
    if (description) params.append("description", description);
    params.append("is_active", is_active);
    if (skus.length > 0) params.append("skus", JSON.stringify(skus));

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    return axiosClient.put(
      `${API_ENDPOINTS.PRODUCTS.UPDATE}?${params.toString()}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  /**
   * Delete a product by ID
   * @param {number} id
   */
  delete: (id) =>
    axiosClient.post(`${API_ENDPOINTS.PRODUCTS.DELETE}?id=${id}`),

  /**
   * Toggle product active status
   * @param {number} id
   * @param {boolean} isActive
   */
  updateStatus: (id, isActive) =>
    axiosClient.patch(`${API_ENDPOINTS.PRODUCTS.STATUS}?id=${id}&isActive=${isActive}`),

  /**
   * Search products by keyword
   * @param {string} keyword
   * @param {number} page
   * @param {number} size
   */
  search: (keyword, page = 0, size = 10) =>
    axiosClient.post(`${API_ENDPOINTS.PRODUCTS.SEARCH}?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`),
};