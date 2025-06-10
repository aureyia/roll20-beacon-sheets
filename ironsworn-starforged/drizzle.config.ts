import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/simulation/storage',
  schema: './src/simulation/storage/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'local.db'
  },
});