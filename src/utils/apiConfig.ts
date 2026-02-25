declare global {
  interface Window {
    APP_CONFIG?: Record<string, string>;
  }
}

export const appConfig = window.APP_CONFIG ?? (import.meta as any).env ?? {}

if (!appConfig) {
  throw new Error("❌ APP_CONFIG not found. runtime-config.js not loaded");
}
