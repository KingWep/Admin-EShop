import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const categoryIconApi = {
  /**
   * Get all category icons
   */
  getAll: () =>
    axiosClient.get(API_ENDPOINTS.CATEGORY_ICONS.GET_ALL),

  /**
   * Get category icon by ID
   * @param {number} id
   */
  getById: (id) =>
    axiosClient.get(`${API_ENDPOINTS.CATEGORY_ICONS.BY_ID}?id=${id}`),

  /**
   * Upload a new category icon
   * @param {string} name - Icon name
   * @param {File} file  - Image file
   */
  upload: (name, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(
      `${API_ENDPOINTS.CATEGORY_ICONS.UPLOAD}?name=${encodeURIComponent(name)}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  /**
   * Delete a category icon by ID
   * @param {number} id
   */
  delete: (id) =>
    axiosClient.delete(`${API_ENDPOINTS.CATEGORY_ICONS.DELETE}?id=${id}`),
};
