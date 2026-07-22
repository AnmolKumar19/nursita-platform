import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Ensures JS and CSS bundles load correctly from root on route refresh
  server: { port: 5173 },
});