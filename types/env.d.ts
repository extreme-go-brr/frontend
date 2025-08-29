/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE?: string
  // Tambahkan env lain yang kamu pakai di sini
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
