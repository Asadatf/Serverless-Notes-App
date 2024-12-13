import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables global `describe`, `it`, etc.
    environment: "jsdom", // Simulates a browser-like environment for React components.
  },
});
