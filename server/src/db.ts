import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as mockStore from './mockStore';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

let pool: any;

if (connectionString) {
  pool = new Pool({ connectionString });
} else {
  pool = { query: mockStore.query };
}

export { pool };
