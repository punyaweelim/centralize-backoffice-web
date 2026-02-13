/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_USER_API_URL: string
  readonly APP_SYSTEM_API_URL: string
  readonly APP_USE_PROXY: string
  readonly APP_ENVIRONMENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}