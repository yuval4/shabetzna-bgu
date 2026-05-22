/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_CHAT_URL: string;
  readonly VITE_ENV: string;
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_ONE_SIGNAL_APP_ID: string;
  readonly VITE_USE_GOOGLE_AUTH: string;
  readonly VITE_ALGORITHM_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
