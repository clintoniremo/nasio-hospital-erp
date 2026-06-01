import { Router } from 'express';
import { pool } from '../db';
import { verifyToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { logAction } from '../utils/audit';

const router = Router();

router.post('/', verifyToken, authorizeRoles('nurse'), async (req: AuthRequest, res) => {
  const { patient_id, temperature, height, weight, age, assessment } = req.body;
  if (!patient_id || !temperature || !height || !weight || !age) {
    return res.status(400).json({ message: 'Missing triage data' });
  }

  const result = await pool.query(
    `INSERT INTO triage_records (patient_id, temperature, height, weight, age, assessment)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [patient_id, temperature, height, weight, age, assessment || '']
  );

  await pool.query('UPDATE patients SET current_stage = $1, last_updated = NOW() WHERE id = $2', ['SHA Office', patient_id]);
  await logAction(req.user!.userId, 'Record triage', 'Triage', `Patient ${patient_id} triaged by nurse`);

  res.status(201).json(result.rows[0]);
});

router.get('/', verifyToken, authorizeRoles('nurse', 'sha_officer', 'doctor'), async (req, res) => {
  const result = await pool.query('SELECT * FROM triage_records ORDER BY recorded_at DESC');
  res.json(result.rows);
});

export default router;
