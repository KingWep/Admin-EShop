import axiosClient from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const login = async (data) => {
    return axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
};

export const logout = async () => {
  try {
    await axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.log("Backend logout failed, forcing local logout");
  } finally {
    localStorage.removeItem("token");
  }
};
