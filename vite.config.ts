/// <reference types="vitest" />
import { defineConfig } from "vite";

const twoMinutesInMilliSeconds = 120_000;
const twentySecondsInMilliSeconds = 20_000;

export default defineConfig({
  build: {
    minify: "esbuild",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
      treeshake: "smallest",
      output: {
        generatedCode: {
          constBindings: true,
        },
        validate: true,
      },
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
