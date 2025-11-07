// src/config/axiosInstance.js
import axios from "axios";
import { showNotification } from "../redux/slices/notificationSlice";
import { store } from "../redux/store";

const USERNAME = "RPCM";
const PASSWORD = "rpcm@123";
const credentials = btoa(`${USERNAME}:${PASSWORD}`);

// Retrieve stored base URLs from sessionStorage
const storedBaseURL = sessionStorage.getItem("baseURL") || "";
const storedCrudURL = sessionStorage.getItem("crud_URL") || "";
const storedCommonURL = sessionStorage.getItem("common_url") || "";
const storedReportURL = sessionStorage.getItem("report_URL") || "";

// Create axios instances with stored base URLs
const createAxiosInstance = (baseURL) => {
    const instance = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            // For login requests, use Basic auth
            if (config.url?.includes("Restpos_Login")) {
                config.headers.Authorization = `Basic ${credentials}`;
            } else {
                // For other requests, use token-based auth
                const token = store.getState().auth.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            const message = error.response?.data?.message || "An error occurred";
            store.dispatch(
                showNotification({
                    message,
                    severity: "error",
                })
            );
            return Promise.reject(error);
        }
    );

    return instance;
};

// Create instances
const axiosInstance = createAxiosInstance(storedBaseURL);
const axiosCrudInstance = createAxiosInstance(storedCrudURL);
const axiosCommonInstance = createAxiosInstance(storedCommonURL);
const axiosReportInstance = createAxiosInstance(storedReportURL);

// Fetch base URLs from API
async function fetchBaseURL(subDomainId) {
    try {
        const payload = {
            FUNCTION: "FileReader",
            APP_ID: "RestPOSCloudManager",
            VERSION: "V1.0",
            SUB_DOMAIN_ID: subDomainId,
            FileName: `RestPOSCloudManager/settings/${subDomainId}/appconfig.json`,
        };

        const response = await axios.post("https://web2.mycomsys.com:8803/api/appconfig/v1/GetAppSettings", payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials}`,
            },
            timeout: 10000,
        });

        if (response && response.data) {
            // Store URLs in sessionStorage
            sessionStorage.setItem("baseURL", response.data.AppBaseURL);
            sessionStorage.setItem("crud_URL", response.data.crud_URL);
            sessionStorage.setItem("common_url", response.data.common_url);
            sessionStorage.setItem("ClientID", response.data.ClientId);
            sessionStorage.setItem("report_URL", response.data.report_URL);
            sessionStorage.setItem("imageURL", response.data.imageURL);
            sessionStorage.setItem("template_url", response.data.template_url);
            sessionStorage.setItem("logo_url", response.data.logo_url);

            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        sessionStorage.setItem("Login", false);
        console.error("Error fetching base URL:", error);

        store.dispatch(
            showNotification({
                message: "Failed to fetch application configuration",
                severity: "error",
            })
        );

        return null;
    }
}

// Login API function
export const loginAPI = async (credentials) => {
    const payload = {
        DIV_DES: "",
        DIV_ID: "1",
        FUNCTION: "Restpos_Login",
        SEND_KEY: "123456",
        DATA: {
            email: credentials.email,
            password: credentials.password,
            client_id: credentials.client_id,
        },
    };

    const response = await axiosInstance.post("/Restpos_Login", payload);
    return response.data;
};

// Set base URLs for axios instances
export async function setBaseURL(ClientID) {
    try {
        const configData = await fetchBaseURL(ClientID);

        if (configData) {
            // Update axios instances with new base URLs
            axiosInstance.defaults.baseURL = configData.AppBaseURL;
            axiosCrudInstance.defaults.baseURL = configData.crud_URL;
            axiosCommonInstance.defaults.baseURL = configData.common_url;
            axiosReportInstance.defaults.baseURL = configData.report_URL;

            // Store additional configuration
            sessionStorage.setItem("SettingApiStatus", "true");
            sessionStorage.setItem(
                "ClientInfo",
                JSON.stringify({
                    clientId: configData.ClientId,
                    invoiceFooter1: configData.Invoice_Footer1,
                    invoiceFooter2: configData.Invoice_Footer2,
                    invoiceFooter3: configData.Invoice_Footer3,
                    isHsnCodeRequired: configData.isHsnCodeRequired,
                    hsnCodeLength: configData.hsnCodeLength,
                })
            );

            return configData;
        } else {
            throw new Error("Invalid response from configuration API");
        }
    } catch (error) {
        sessionStorage.setItem("SettingApiStatus", "false");

        store.dispatch(
            showNotification({
                message: "Failed to set base URLs",
                severity: "error",
            })
        );

        throw error;
    }
}

// Export all instances
export { axiosCommonInstance, axiosCrudInstance, axiosInstance, axiosReportInstance };

export default axiosInstance;
