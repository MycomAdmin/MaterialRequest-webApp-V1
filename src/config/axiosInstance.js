// src/services/api.js
import axios from "axios";
import { showNotification } from "../redux/slices/notificationSlice";
import { store } from "../redux/store";
import StoreLoginDetails from "../utils/StoreloginDetails";

const USERNAME = "RPCM";
const PASSWORD = "rpcm@123";

// Encode credentials in Base64
const credentials = btoa(`${USERNAME}:${PASSWORD}`);

// Retrieve stored base URLs from sessionStorage with fallbacks
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
      Authorization: `Basic ${credentials}`,
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Keep existing token-based auth for backward compatibility
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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

    const response = await axios.post(
      "https://web2.mycomsys.com:8803/api/appconfig/v1/GetAppSettings",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        timeout: 10000,
      }
    );

    if (response && response.data) {
      // Store URLs in sessionStorage
      sessionStorage.setItem("baseURL", response.data.AppBaseURL);
      sessionStorage.setItem("crud_URL", response.data.crud_URL);
      sessionStorage.setItem("common_url", response.data.common_url);
      sessionStorage.setItem("ClientID", response.data.ClientId);
      sessionStorage.setItem("report_URL", response.data.report_URL);
      
      return response;
    } else {
      return null;
    }
  } catch (error) {
    sessionStorage.setItem("Login", false);
    console.error("Error fetching base URL:", error);
    
    // Dispatch notification for fetch error
    store.dispatch(
      showNotification({
        message: "Failed to fetch application configuration",
        severity: "error",
      })
    );
    
    return null;
  }
}

// Set base URLs for axios instances
export async function setBaseURL(ClientID) {
  try {
    const fileName = await fetchBaseURL(ClientID);

    if (fileName && fileName.data) {
      // Update axios instances with new base URLs
      axiosInstance.defaults.baseURL = fileName.data.AppBaseURL;
      axiosCrudInstance.defaults.baseURL = fileName.data.crud_URL;
      axiosCommonInstance.defaults.baseURL = fileName.data.common_url;
      axiosReportInstance.defaults.baseURL = fileName.data.report_URL;

      // Store login details
      StoreLoginDetails(fileName.data);
      sessionStorage.setItem("SettingApiStatus", true);

      return fileName;
    } else {
      throw new Error("Invalid response from configuration API");
    }
  } catch (error) {
    sessionStorage.setItem("SettingApiStatus", false);
    
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

// Default export for backward compatibility
export default axiosInstance;