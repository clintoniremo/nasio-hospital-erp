import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

export const pool = connectionString
  ? new Pool({ connectionString })
  : null;
