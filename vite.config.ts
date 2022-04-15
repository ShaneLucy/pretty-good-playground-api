/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: true,
    lib: {
      name: "lib",
      entry: "src/index.ts",
      formats: ["es"],
    },
  },
  test: {
    coverage: {
      include: ["src/**/*"],
      exclude: ["node_modules/**/*", "src/tests/**/*"],
    },
  },
});
