import { pool } from '../db';

export async function logAction(userId: string, action: string, module: string, details: string) {
  await pool.query(
    `INSERT INTO audit_logs (user_id, action, module, details) VALUES ($1, $2, $3, $4)`,
    [userId, action, module, details]
  );
}
