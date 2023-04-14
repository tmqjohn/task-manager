import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  base: "https://167.172.109.166.nip.io/",
  server: {
    port: "8080",
    host: true,
  },
});
