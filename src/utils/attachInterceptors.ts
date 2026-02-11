import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { showErrorPopup } from "./alertPopup";
import { authStorage } from "./auth";
import { appConfig } from "./apiConfig";

/* =========================
   Axios type extension
========================= */
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

/* =========================
   Dedicated refresh API
   (NO interceptors)
========================= */
const refreshApi = axios.create({
  baseURL: appConfig.APP_USER_API_URL,
});

/* =========================
   🔐 Shared refresh promise
========================= */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = authStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const res = await refreshApi.post("/auth/refresh-token", {
        refresh_token: refreshToken,
      });

      const newToken = res.data.access_token;
      console.log("🔄 refresh newToken", newToken);

      authStorage.setAccessToken(newToken, true);
      return newToken;
    })().finally(() => {
        console.log("🔄 refresh token", authStorage.getRefreshToken());
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

/* =========================
   Popup spam guard
========================= */
let lastPopupAt = 0;
function safePopup(message: string) {
  const now = Date.now();
  if (now - lastPopupAt > 1500) {
    showErrorPopup(message);
    lastPopupAt = now;
  }
}

/* =========================
   Attach interceptors
========================= */
export function attachInterceptors(
  api: ReturnType<typeof axios.create>
) {
  /* ---------- REQUEST ---------- */
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const isAuthEndpoint =
        config.url?.includes("/auth/login") ||
        config.url?.includes("/auth/refresh-token");

        console.log("➡️ interceptor hit", config.url);
        console.log('is authenEndpoint', isAuthEndpoint);


      if (!isAuthEndpoint) {
        console.log('is authenEndpoint', isAuthEndpoint);
        
        const token = authStorage.getAccessToken();
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    }
  );

  /* ---------- RESPONSE ---------- */
  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        console.log('error yahh', error);
        
      const config = error.config as InternalAxiosRequestConfig;
      const status = error.response?.status;
      const isLogin = config.url?.includes("/auth/login");
      const isRefresh = config.url?.includes("/auth/refresh-token");

      console.log(status,isLogin,isRefresh);
      

      /* ---------- REFRESH FAILED ---------- */
      if (status === 401 && isRefresh) {
        authStorage.clearAll();
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      /* ---------- 401 → REFRESH ---------- */
      if (status === 401 && !config._retry && !isLogin) {
        config._retry = true;
        console.log('401 ready to go');
        
        try {
          const newToken = await refreshAccessToken();
        console.log('attach newtoken', newToken);


          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${newToken}`;

          return api(config);
        } catch {
            console.log('error');
            
          authStorage.clearAll();
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      }

      /* ---------- LOGIN ERROR ---------- */
    //   if (status === 401 && isLogin) {
    //     safePopup("Invalid email or password");
    //   }

      /* ---------- OTHER ERRORS ---------- */
      if (status && status !== 200 && status !== 201) {
        console.log('show status');
        
        safePopup(
          (error.response?.data as any)?.message ||
            "Something went wrong"
        );
      }

      return Promise.reject(error);
    }
  );
}
