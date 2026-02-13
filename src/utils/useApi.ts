import { sysApi, authApi } from "./apiInstance";
import type { AxiosResponse, AxiosRequestConfig } from "axios";

type ApiType = "sys" | "auth";

interface CustomAxiosConfig extends AxiosRequestConfig {
  componentName?: string;
}

function getApi(type: ApiType) {
  switch (type) {
    case "auth":
      return authApi;
    case "sys":
    default:
      return sysApi;
  }
}

export function useApi(
  apiType: ApiType = "sys",
  componentName = "UnknownComponent"
) {
  const api = getApi(apiType);

  return {
    get: <T = any>(
      url: string,
      config?: CustomAxiosConfig
    ): Promise<AxiosResponse<T>> =>
      api.get<T>(url, { ...config, componentName }),

    post: <T = any, D = any>(
      url: string,
      data?: D,
      config?: CustomAxiosConfig
    ): Promise<AxiosResponse<T>> =>
      api.post<T>(url, data, { ...config, componentName }),

    put: <T = any, D = any>(
      url: string,
      data?: D,
      config?: CustomAxiosConfig
    ): Promise<AxiosResponse<T>> =>
      api.put<T>(url, data, { ...config, componentName }),

    delete: <T = any>(
      url: string,
      config?: CustomAxiosConfig
    ): Promise<AxiosResponse<T>> =>
      api.delete<T>(url, { ...config, componentName }),
  };
}
