import axios, { AxiosInstance } from "axios";
import { getAppConfig } from "./apiConfig";

// ไม่สร้าง instance ทันที — สร้างตอนแรกที่ใช้งาน
let _sysApi: AxiosInstance | null = null;
let _authApi: AxiosInstance | null = null;

export function getSysApi(): AxiosInstance {
  if (!_sysApi) {
    const cfg = getAppConfig();
    _sysApi = axios.create({ baseURL: cfg.APP_SYSTEM_API_URL });
    // attach interceptors
    import("./attachInterceptors").then(({ attachInterceptors }) => {
      attachInterceptors(_sysApi!);
    });
  }
  return _sysApi;
}

export function getAuthApi(): AxiosInstance {
  if (!_authApi) {
    const cfg = getAppConfig();
    _authApi = axios.create({ baseURL: cfg.APP_USER_API_URL });
    import("./attachInterceptors").then(({ attachInterceptors }) => {
      attachInterceptors(_authApi!);
    });
  }
  return _authApi;
}

// backward compat — ใช้ getter แทน direct export
export const sysApi  = new Proxy({} as AxiosInstance, { get: (_, p) => getSysApi()[p as keyof AxiosInstance] });
export const authApi = new Proxy({} as AxiosInstance, { get: (_, p) => getAuthApi()[p as keyof AxiosInstance] });