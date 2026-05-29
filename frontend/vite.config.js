/**
 * Vite config - dev server proxies API requests to the backend.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/getToken": "http://localhost:3000",
      "/token": "http://localhost:3000",
      "/stream": "http://localhost:3000",
      "/moderate": "http://localhost:3000",
      "/audit": "http://localhost:3000",
      "/health": "http://localhost:3000",
    },
  },
});
