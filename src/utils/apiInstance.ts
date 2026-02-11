import axios from "axios";
import { appConfig } from "./apiConfig";

export const sysApi = axios.create({
  baseURL: appConfig.APP_SYSTEM_API_URL,
});

export const authApi = axios.create({
  baseURL: appConfig.APP_USER_API_URL,
});
