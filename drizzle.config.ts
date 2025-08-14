import { defineConfig } from 'drizzle-kit';
import * as process from 'node:process';

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema/*',
  out: './drizzle',

  dbCredentials: {
    host: process.env.DEV_DB_HOST as string,
    user: process.env.DEV_DB_USER as string,
    password: process.env.DEV_DB_PASSWORD as string,
    database: process.env.DEV_DB_NAME as string,
    port: parseInt(process.env.DEV_DB_PORT as string),
    ssl: {
      rejectUnauthorized: false,
    },
  },
});