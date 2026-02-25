let configCache: Record<string, any> | null = null;

async function loadConfig(): Promise<Record<string, any>> {
  if (configCache) return configCache;

  try {
    const response = await fetch("/runtime-config.json", {
      headers: { "Cache-Control": "no-cache" },
    });

    if (!response.ok) throw new Error("Failed to load config");

    configCache = Object.freeze(await response.json());
  } catch (error) {
    console.warn("runtime-config.json not found, falling back to import.meta.env");
    configCache = Object.freeze({
      APP_USER_API_URL:   import.meta.env.APP_USER_API_URL   || "http://localhost:3000",
      APP_SYSTEM_API_URL: import.meta.env.APP_SYSTEM_API_URL || "http://localhost:3001",
      APP_ENVIRONMENT:    import.meta.env.APP_ENVIRONMENT    || "development",
    });
  }

  // ★ key fix: set ลง window ให้ apiInstance.ts อ่านได้ตอน instantiate
  (window as any).__APP_CONFIG__ = configCache;
  return configCache!;
}

export async function initConfig(): Promise<void> {
  await loadConfig();
}

export async function getConfig<T = any>(key: string, defaultValue?: T): Promise<T> {
  const config = await loadConfig();
  return config[key] ?? defaultValue;
}