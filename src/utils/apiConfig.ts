declare global {
  interface Window {
    APP_CONFIG?: Record<string, string>;
  }
}

// ไม่อ่านทันทีตอน module load
export function getAppConfig(): Record<string, string> {
  // window.__APP_CONFIG__ จะถูก set โดย config.ts หลัง fetch สำเร็จ
  const cfg = (window as any).__APP_CONFIG__;
  if (!cfg) {
    throw new Error("App config not loaded yet. initConfig() must be called first.");
  }
  return cfg;
}