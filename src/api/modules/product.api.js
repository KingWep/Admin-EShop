import { API_ENDPOINTS } from "../endpoints";
import axiosClient from "../axiosClient";

export const productApi = {
  /**
   * Get all products (paginated, with optional filtering)
   *
   * POST /api/v1/products/get/all
   * Body: { page, size, criteria_type, criteria_value }
   */
  getAll: ({ page = 1, size = 10, criteria_type = 5, criteria_value = "" } = {}) =>
    axiosClient.post(API_ENDPOINTS.PRODUCTS.GET_ALL, {
      page,
      size,
      criteria_type,
      criteria_value,
    }),

  /**
   * Create a new product with images
   *
   * POST /api/v1/products/create/
   * Query params: name, description, is_active, sub_category_id, skus (JSON string)
   * Body: multipart/form-data with image files under key "files"
   */
create: ({ name, sub_category_id, description, is_active = true, skus = [], files = [] }) => {
  const params = new URLSearchParams();
  params.append("name", name);
  params.append("sub_category_id", sub_category_id);
  if (description) params.append("description", description);
  params.append("is_active", is_active);
  if (skus.length > 0) params.append("skus", JSON.stringify(skus));

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return axiosClient.post(
    `${API_ENDPOINTS.PRODUCTS.CREATE}?${params.toString()}`,
    formData,
    { headers: { "Content-Type": undefined } }
  );
},
  /**
   * Update an existing product
   *
   * PUT /api/v1/products/update/
   * Query params: id, name, description, is_active, sub_category_id, skus (JSON string)
   * Body: multipart/form-data with image files under key "files"
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
      { headers: { "Content-Type": undefined } }
    );
  },

  /**
   * Delete a product by ID
   * POST /api/v1/products/delete
   */
  delete: (id) =>
    axiosClient.post(`${API_ENDPOINTS.PRODUCTS.DELETE}?id=${id}`),

  /**
   * Toggle product active status
   * PATCH /api/v1/products/update/status/
   */
  updateStatus: (id, isActive) =>
    axiosClient.patch(`${API_ENDPOINTS.PRODUCTS.UPDATE_STATUS}?id=${id}&isActive=${isActive}`),
};