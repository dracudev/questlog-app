/// <reference path="../../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly PUBLIC_API_URL: string;

  // Application Configuration
  readonly PUBLIC_APP_ENV: string;
  readonly PUBLIC_APP_VERSION: string;
  readonly PUBLIC_DEBUG_MODE: string;
  readonly PUBLIC_USE_MOCK_DATA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
