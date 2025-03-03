import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/safexpress-auth": {
        target: "https://api-auth.safexpress.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/safexpress-auth/, ""),
      },
      "/safexpress-tracking": {
        target: "https://apigateway.safexpress.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/safexpress-tracking/, ""),
      },
    },
  },
});
