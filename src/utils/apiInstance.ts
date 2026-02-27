import axios from "axios";
import { getConfig } from "../config";

export const sysApi = axios.create();

sysApi.interceptors.request.use(async (config) => {
  if (!config.baseURL) {
    config.baseURL = await getConfig("APP_SYSTEM_API_URL");
  }
  return config;
});

export const authApi = axios.create();

authApi.interceptors.request.use(async (config) => {
  if (!config.baseURL) {
    config.baseURL = await getConfig("APP_USER_API_URL");
  }
  return config;
});