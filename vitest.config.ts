import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ["src/**/*"],
      exclude: ["src/tests/**/*", "src/{app,server}.ts", "src/database/**/*"]
    }
  }
})