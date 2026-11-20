import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/KNOWTIX_DASHBOARD_123/",
  plugins: [react()],
  server: {
    port: 5173,
  },
});
