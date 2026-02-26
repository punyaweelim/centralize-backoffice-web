declare global {
  interface Window {
    APP_CONFIG?: Record<string, string>;
  }
}

const FALLBACK_CONFIG: Record<string, string> = {
  APP_USER_API_URL:   "https://test.user-api.nwl-dev.com",
  APP_SYSTEM_API_URL: "https://test.system-control-api.nwl-dev.com",
  APP_ENVIRONMENT:    "development",
};

// ไม่อ่านทันทีตอน module load
export function getAppConfig(): Record<string, string> {
  // window.__APP_CONFIG__ จะถูก set โดย config.ts หลัง fetch สำเร็จ
  const cfg = (window as any).__APP_CONFIG__;
  if (!cfg) {
    console.warn("App config not loaded yet, using fallback config.");
    return FALLBACK_CONFIG;
  }
  return cfg;
}