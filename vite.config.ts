/// <reference types="vitest" />
import { defineConfig } from "vite";

const twoMinutesInMilliSeconds = 120_000;
const twentySecondsInMilliSeconds = 20_000;

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
      exclude: ["node_modules/**/*", "tests/**/*"],
      reporter: ["text", "lcov"],
    },
    testTimeout: twentySecondsInMilliSeconds,
    hookTimeout: twoMinutesInMilliSeconds,
  },
});
