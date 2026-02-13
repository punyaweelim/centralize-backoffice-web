import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    componentName?: string;
  }
}
