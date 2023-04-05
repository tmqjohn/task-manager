import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "http://167.172.109.166/",
  server: {
    port: "80",
    host: true,
  },
});
