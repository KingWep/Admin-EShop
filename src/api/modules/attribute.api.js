import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

// ─── Product Attributes ────────────────────────────────────────────────────────

export const attributeApi = {
  /**
   * Get all product attributes
   */
  getAll: () =>
    axiosClient.get(API_ENDPOINTS.ATTRIBUTES.GET_ALL),

  /**
   * Get a product attribute by ID
   * @param {number} id
   */
  getById: (id) =>
    axiosClient.get(API_ENDPOINTS.ATTRIBUTES.BY_ID.replace("{id}", id)),

  /**
   * Get a product attribute by name
   * @param {string} name - e.g. "Color", "Size"
   */
  getByName: (name) =>
    axiosClient.get(API_ENDPOINTS.ATTRIBUTES.BY_NAME.replace("{name}", encodeURIComponent(name))),

  /**
   * Delete a product attribute by ID
   * @param {number} id
   */
  delete: (id) =>
    axiosClient.delete(API_ENDPOINTS.ATTRIBUTES.DELETE.replace("{id}", id)),
};

// ─── Attribute Values ──────────────────────────────────────────────────────────

export const attributeValueApi = {
  /**
   * Get attribute value by ID
   * @param {number} id
   */
  getById: (id) =>
    axiosClient.get(API_ENDPOINTS.ATTRIBUTE_VALUES.BY_ID.replace("{id}", id)),

  /**
   * Get all values for a specific attribute
   * @param {number} attributeId
   */
  getByAttributeId: (attributeId) =>
    axiosClient.get(
      API_ENDPOINTS.ATTRIBUTE_VALUES.BY_ATTRIBUTE_ID.replace("{attributeId}", attributeId)
    ),

  /**
   * Find an attribute value by attribute ID + value string
   * @param {number} attributeId
   * @param {string} value - e.g. "Red", "XL"
   */
  getByAttributeAndValue: (attributeId, value) =>
    axiosClient.get(
      `${API_ENDPOINTS.ATTRIBUTE_VALUES.GET_BY_ATTR_AND_VALUE}?attributeId=${attributeId}&value=${encodeURIComponent(value)}`
    ),

  /**
   * Update an attribute value
   * @param {number} id
   * @param {{ value: string }} data
   */
  update: (id, data) =>
    axiosClient.put(
      API_ENDPOINTS.ATTRIBUTE_VALUES.UPDATE.replace("{id}", id),
      data
    ),

  /**
   * Delete an attribute value by ID
   * @param {number} id
   */
  delete: (id) =>
    axiosClient.delete(
      API_ENDPOINTS.ATTRIBUTE_VALUES.DELETE.replace("{id}", id)
    ),
};
