/// <reference types="vitest" />
import { defineConfig } from "vite";

const twoMinutesInMilliSeconds = 120_000;

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
      reporter: ["text", "lcov"],
    },
    hookTimeout: twoMinutesInMilliSeconds,
  },
});
