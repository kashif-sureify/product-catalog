// vite.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // This is crucial for backend tests
    include: ['backend/src/__tests__/**/*.test.ts'], // Adjust based on your structure
    ui: true, // Enable the UI for test results
  },
});
