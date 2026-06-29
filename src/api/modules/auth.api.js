import axiosClients from "../axiosClient";
import { API_ENDPOINTS } from "../endpoints";

export const login = (data) => {
    return axiosClients.post(API_ENDPOINTS.AUTH.LOGIN, data);
};

export const logout = () => {
    return axiosClients.post(API_ENDPOINTS.AUTH.LOGOUT);
};
