import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error("database url not found");
}

// NeonDB
// neonConfig.fetchConnectionCache = true;
// const sql = neon(process.env.DATABASE_URL);
// export const db = drizzle(sql);

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
