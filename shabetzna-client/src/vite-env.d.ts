/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_CHAT_URL: string;
  readonly VITE_ENV: string;
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_ONE_SIGNAL_APP_ID: string;
  readonly VITE_USE_GOOGLE_AUTH: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
