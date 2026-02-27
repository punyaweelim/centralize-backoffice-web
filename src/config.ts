type ConfigRecord = Record<string, string>;

let configCache: ConfigRecord | null = null;

async function loadConfig(): Promise<ConfigRecord> {
  if (configCache) return configCache;

  if (import.meta.env.DEV) {
    configCache = {
      APP_USER_API_URL: import.meta.env.APP_USER_API_URL ?? "",
      APP_SYSTEM_API_URL: import.meta.env.APP_SYSTEM_API_URL ?? "",
      ENVIRONMENT: import.meta.env.APP_ENVIRONMENT ?? "local",
    };
    return configCache;
  }

  try {
    const response = await fetch("/runtime-config.json", {
      headers: { "Cache-Control": "no-cache" },
    });

    if (!response.ok)
      throw new Error(`Failed to load runtime config: ${response.status}`);

    configCache = await response.json();
    return configCache ?? {};
  } catch (error) {
    console.error("Error loading runtime config:", error);
    return {};
  }
}

export async function getConfig<T = string>(
  key: string,
  defaultValue?: T,
): Promise<T | undefined> {
  const config = await loadConfig();
  return (config[key] as T) ?? defaultValue;
}

export async function getAllConfig(): Promise<ConfigRecord> {
  return loadConfig();
}

export async function initConfig(): Promise<void> {
  await loadConfig();
}