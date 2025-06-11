import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/simulation/storage',
  schema: './src/simulation/storage/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: 'http://127.0.0.1:8080',
  },
});