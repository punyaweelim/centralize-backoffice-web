// Private config module - config is NOT exposed to window object
let configCache: Record<string, any> | null = null;

async function loadConfig(): Promise<Record<string, any>> {
  if (configCache) return configCache;

  try {
    const response = await fetch("/runtime-config.json", {
      headers: { "Cache-Control": "no-cache" },
    });

    if (!response.ok) throw new Error("Failed to load config");

    configCache = Object.freeze(await response.json());
    return configCache || {};
  } catch (error) {
    console.error("Error loading runtime config:", error);
    // return {
    //   APP_USER_API_URL:
    //     `${import.meta.env.APP_USER_API_URL.toString()}` || "http://localhost:3000",
    //   ENVIRONMENT: "production",
    // };
    configCache = Object.freeze({
    APP_USER_API_URL:
      import.meta.env.APP_USER_API_URL,
    APP_SYSTEM_API_URL:
      import.meta.env.APP_SYSTEM_API_URL,
    ENVIRONMENT: "production",
  });

  return configCache;
  }
}

export async function getConfig<T = any>(
  key: string,
  defaultValue?: T,
): Promise<T> {
  const config = await loadConfig();
  return config[key] ?? defaultValue;
}

export async function getAllConfig(): Promise<Record<string, any>> {
  return loadConfig();
}

export async function initConfig(): Promise<void> {
  await loadConfig();
}
