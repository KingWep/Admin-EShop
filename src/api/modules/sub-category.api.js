import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

// Endpoint តែមួយសម្រាប់ GET operations ទាំងអស់
const GET_ALL_URL = API_ENDPOINTS.SUB_CATEGORIES.GET_ALL; // = "/subcategories/get/all"

export const subCategoryApi = {
  /**
   * Get all sub-categories (paginated)
   */
  getAll: (page = 1, size = 10) =>
    axiosClient.post(GET_ALL_URL, {
      criteria_type: 0,
      criteria_value: "",
      page,
      size,
    }),

  /**
   * Search sub-categories by name (fuzzy)
   */
  searchByName: (name, page = 1, size = 10) =>
    axiosClient.post(GET_ALL_URL, {
      criteria_type: 1,
      criteria_value: name,
      page,
      size,
    }),

  /**
   * Get sub-category by ID (no pagination, returns single object)
   */
  getById: (id) =>
    axiosClient.post(GET_ALL_URL, {
      criteria_type: 4,
      criteria_value: String(id),
    }),

  /**
   * Get sub-categories filtered by category ID (paginated)
   */
  getByCategoryId: (categoryId, page = 1, size = 10) =>
    axiosClient.post(GET_ALL_URL, {
      criteria_type: 2,
      criteria_value: String(categoryId),
      page,
      size,
    }),

  /**
   * Get sub-category with its products (no pagination, single object)
   */
  getWithProducts: (id) =>
    axiosClient.post(GET_ALL_URL, {
      criteria_type: 5,
      criteria_value: String(id),
    }),

  create: ({ name, categoryId, description, image }) => {
    const formData = new FormData();
    if (image) formData.append("image", image);
    return axiosClient.post(
      `${API_ENDPOINTS.SUB_CATEGORIES.CREATE}?name=${encodeURIComponent(name)}&categoryId=${categoryId}&description=${encodeURIComponent(description)}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  update: (id, { name, categoryId, description, file }) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    return axiosClient.post(
      `${API_ENDPOINTS.SUB_CATEGORIES.UPDATE}?id=${id}&name=${encodeURIComponent(name)}&categoryId=${categoryId}&description=${encodeURIComponent(description)}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  delete: (id) =>
    axiosClient.post(`${API_ENDPOINTS.SUB_CATEGORIES.DELETE}?id=${id}`),
};