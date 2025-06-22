import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL,
  withCredentials: true,
});

// Agrego declaración global para Vite env
interface ImportMetaEnv {
  readonly VITE_BACK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 