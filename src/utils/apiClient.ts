// src/utils/apiClient.ts

import { getConfig } from "../config";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const getBaseUrl = async (): Promise<string> => {
  try {
    return (
      (await getConfig("APP_USER_API_URL")) ||
      import.meta.env.APP_USER_API_URL ||
      "http://localhost:3000"
    );
  } catch {
    return import.meta.env.APP_USER_API_URL || "http://localhost:3000";
  }
};

// Flag เพื่อป้องกันการ refresh ซ้ำซ้อน
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// เพิ่ม request ที่รอ token ใหม่
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// เรียกทุก request ที่รออยู่เมื่อได้ token ใหม่
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

export const apiClient = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  async request(endpoint: string, options: RequestInit = {}) {
<<<<<<< HEAD
    try {
      let accessToken = localStorage.getItem('access_token');

      const headers = {
        'Content-Type': 'application/json',
=======
    const BASE_URL = await getBaseUrl();
    try {
      let accessToken = localStorage.getItem("access_token");

      const headers = {
        "Content-Type": "application/json",
>>>>>>> 6950cfc1fe59e028e15fc2fc498457450164e697
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      };

<<<<<<< HEAD
      let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

      // กรณี Access Token หมดอายุ (401)
      if (response.status === 401) {
        console.log('Received 401, attempting token refresh...');
        
        // ถ้ากำลัง refresh อยู่แล้ว ให้รอจนกว่าจะเสร็จ
        if (isRefreshing) {
          console.log('Token refresh in progress, queuing request...');
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh(async (newToken: string) => {
              try {
                // ส่ง request ใหม่ด้วย token ที่ refresh แล้ว
                const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
                  ...options,
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${newToken}`
                  }
                });
                
                if (!retryResponse.ok) {
                  const errorData = await retryResponse.json().catch(() => null);
                  reject(new Error(errorData?.message || `HTTP Error: ${retryResponse.status}`));
                } else {
                  resolve(await retryResponse.json());
                }
              } catch (error) {
                reject(error);
              }
            });
          });
        }

        // เริ่ม refresh token
        isRefreshing = true;
        
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          isRefreshing = false;
          this.clearTokens();
          // Redirect to login
          window.location.assign('/');
          throw new Error('No refresh token available. Please login again.');
        }

        try {
          // เรียก refresh token endpoint
          const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
=======
      let response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        console.log("Received 401, attempting token refresh...");

        if (isRefreshing) {
          console.log("Token refresh in progress, queuing request...");
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh(async (newToken: string) => {
              try {
                const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
                  ...options,
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${newToken}`,
                  },
                });

                if (!retryResponse.ok) {
                  const errorData = await retryResponse
                    .json()
                    .catch(() => null);
                  reject(
                    new Error(
                      errorData?.message ||
                        `HTTP Error: ${retryResponse.status}`,
                    ),
                  );
                } else {
                  resolve(await retryResponse.json());
                }
              } catch (error) {
                reject(error);
              }
            });
>>>>>>> 6950cfc1fe59e028e15fc2fc498457450164e697
          });
        }

<<<<<<< HEAD
          if (!refreshResponse.ok) {
            throw new Error('Refresh token expired');
          }

          const data = await refreshResponse.json();
          const newAccessToken = data.access_token || data.accessToken;
          const newRefreshToken = data.refresh_token || data.refreshToken;

          if (!newAccessToken || !newRefreshToken) {
            throw new Error('Invalid refresh token response');
          }

          // บันทึก token ใหม่
          this.setTokens(newAccessToken, newRefreshToken);
          console.log('Token refreshed successfully');
          
          // แจ้ง requests ที่รออยู่
          onTokenRefreshed(newAccessToken);
          isRefreshing = false;

          // ส่ง request เดิมใหม่ด้วย token ใหม่
          response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`
            }
          });

        } catch (refreshError: any) {
          console.error('Token refresh failed:', refreshError);
          isRefreshing = false;
          refreshSubscribers = [];
          this.clearTokens();
          
          // Redirect to login
          window.location.assign('/');
          throw new Error('Session expired. Please login again.');
        }
      }

      // ตรวจสอบสถานะ HTTP อื่นๆ
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
        // ให้ error message ที่เฉพาะเจาะจงตาม status code
        let errorMessage = errorData?.message || `HTTP Error: ${response.status}`;
        
        switch (response.status) {
          case 400:
            errorMessage = errorData?.message || 'Invalid request. Please check your data.';
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = errorData?.message || 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
        }
        
=======
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          isRefreshing = false;
          this.clearTokens();
          window.location.assign("/");
          throw new Error("No refresh token available. Please login again.");
        }

        try {
          const refreshResponse = await fetch(
            `${BASE_URL}/auth/refresh-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            },
          );

          if (!refreshResponse.ok) {
            throw new Error("Refresh token expired");
          }

          const data = await refreshResponse.json();
          const newAccessToken = data.access_token || data.accessToken;
          const newRefreshToken = data.refresh_token || data.refreshToken;

          if (!newAccessToken || !newRefreshToken) {
            throw new Error("Invalid refresh token response");
          }

          this.setTokens(newAccessToken, newRefreshToken);
          console.log("Token refreshed successfully");

          onTokenRefreshed(newAccessToken);
          isRefreshing = false;

          response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
        } catch (refreshError: any) {
          console.error("Token refresh failed:", refreshError);
          isRefreshing = false;
          refreshSubscribers = [];
          this.clearTokens();

          window.location.assign("/");
          throw new Error("Session expired. Please login again.");
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        let errorMessage =
          errorData?.message || `HTTP Error: ${response.status}`;

        switch (response.status) {
          case 400:
            errorMessage =
              errorData?.message || "Invalid request. Please check your data.";
            break;
          case 403:
            errorMessage = "You do not have permission to perform this action.";
            break;
          case 404:
            errorMessage = errorData?.message || "Resource not found.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          case 503:
            errorMessage =
              "Service temporarily unavailable. Please try again later.";
            break;
        }

>>>>>>> 6950cfc1fe59e028e15fc2fc498457450164e697
        throw new Error(errorMessage);
      }

      return await response.json();
<<<<<<< HEAD
      
    } catch (error: any) {
      // ตรวจสอบว่าเป็น network error หรือไม่
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      console.error('API Client Error:', error);
=======
    } catch (error: any) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection.",
        );
      }

      console.error("API Client Error:", error);
>>>>>>> 6950cfc1fe59e028e15fc2fc498457450164e697
      throw error;
    }
  },

<<<<<<< HEAD
  get: (url: string) => apiClient.request(url, { method: 'GET' }),
  post: (url: string, data: any) => apiClient.request(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url: string, data: any) => apiClient.request(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url: string) => apiClient.request(url, { method: 'DELETE' }),
=======
  get: (url: string) => apiClient.request(url, { method: "GET" }),
  post: (url: string, data: any) =>
    apiClient.request(url, { method: "POST", body: JSON.stringify(data) }),
  put: (url: string, data: any) =>
    apiClient.request(url, { method: "PUT", body: JSON.stringify(data) }),
  delete: (url: string) => apiClient.request(url, { method: "DELETE" }),
>>>>>>> 6950cfc1fe59e028e15fc2fc498457450164e697
};
