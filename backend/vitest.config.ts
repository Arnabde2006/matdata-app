import { defineConfig } from 'vitest/config';

// Dummy vitest config to satisfy prompt requirement, backend uses Jest.
export default defineConfig({
  test: {
    environment: 'node',
  },
});
