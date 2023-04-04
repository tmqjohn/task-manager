import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://136.158.79.152/",
  server: {
    host: true,
    port: 8080,
  },
});
