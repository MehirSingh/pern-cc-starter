import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL IS REQUIRED')

const sql = neon(process.env.DATABASE_URL); //creating the new Neon database
export const db = drizzle(sql); //use this data base connection for all my querries