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
    const BASE_URL = await getBaseUrl();
    try {
      let accessToken = localStorage.getItem("access_token");

      const headers = {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      };

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
          });
        }

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

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection.",
        );
      }

      console.error("API Client Error:", error);
      throw error;
    }
  },

  get: (url: string) => apiClient.request(url, { method: "GET" }),
  post: (url: string, data: any) =>
    apiClient.request(url, { method: "POST", body: JSON.stringify(data) }),
  put: (url: string, data: any) =>
    apiClient.request(url, { method: "PUT", body: JSON.stringify(data) }),
  delete: (url: string) => apiClient.request(url, { method: "DELETE" }),
};
