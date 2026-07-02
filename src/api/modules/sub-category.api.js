import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const subCategoryApi = {
  /**
   * Get all sub-categories (paginated)
   * @param {number} page
   * @param {number} size
   */
  getAll: (page = 0, size = 10) =>
    axiosClient.post(`${API_ENDPOINTS.SUB_CATEGORIES.GET_ALL}?page=${page}&size=${size}`),

  /**
   * Get sub-category by ID
   * @param {number} id
   */
  getById: (id) =>
    axiosClient.post(`${API_ENDPOINTS.SUB_CATEGORIES.BY_ID}?id=${id}`),

  /**
   * Get all sub-categories under a category (as a flat list, no pagination)
   * @param {number} categoryId
   */
  getByCategoryId: (categoryId) =>
    axiosClient.post(`${API_ENDPOINTS.SUB_CATEGORIES.BY_CATEGORY_ID}?categoryId=${categoryId}`),

  /**
   * Get sub-category with its products
   * @param {number} id
   */
  getWithProducts: (id) =>
    axiosClient.post(`${API_ENDPOINTS.SUB_CATEGORIES.WITH_PRODUCTS}?id=${id}`),

  /**
   * Create a new sub-category (with optional image)
   * @param {object} data
   * @param {string} data.name
   * @param {number} data.categoryId
   * @param {string} data.description
   * @param {File}   [data.image]
   */
  create: ({ name, categoryId, description, image }) => {
    const formData = new FormData();
    if (image) formData.append("image", image);
    return axiosClient.post(
      `${API_ENDPOINTS.SUB_CATEGORIES.CREATE}?name=${encodeURIComponent(name)}&categoryId=${categoryId}&description=${encodeURIComponent(description)}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  /**
   * Update a sub-category (with optional image)
   * @param {number} id
   * @param {object} data
   * @param {string} data.name
   * @param {number} data.categoryId
   * @param {string} data.description
   * @param {File}   [data.file]
   */
  update: (id, { name, categoryId, description, file }) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    return axiosClient.post(
      `${API_ENDPOINTS.SUB_CATEGORIES.UPDATE}?id=${id}&name=${encodeURIComponent(name)}&categoryId=${categoryId}&description=${encodeURIComponent(description)}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  /**
   * Delete a sub-category by ID
   * @param {number} id
   */
  delete: (id) =>
    axiosClient.post(`${API_ENDPOINTS.SUB_CATEGORIES.DELETE}?id=${id}`),
};
