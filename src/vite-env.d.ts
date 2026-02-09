/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_USER_API_URL?: string;
  readonly ENVIRONMENT?: string;
  readonly ENABLE_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
