import axios from "axios";
import { ENV } from "../config/env";
import { setupInterceptors } from "./interceptors";

const axiosClients = axios.create({
    baseURL : ENV.APP_API_URL,
    timeout : ENV.TIMEOUT,
    headers :{
        'Content-Type': 'application/json',
        Accept : 'application/json',
    },
});

// Register intercept
setupInterceptors(axiosClients);

export default axiosClients;