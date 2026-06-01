import { Router } from 'express';
import { pool } from '../db';
import { verifyToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { logAction } from '../utils/audit';

const router = Router();

router.post('/', verifyToken, authorizeRoles('doctor'), async (req: AuthRequest, res) => {
  const { patient_id, stage, diagnosis, prescription, referred_lab, review_notes } = req.body;
  if (!patient_id || !stage) {
    return res.status(400).json({ message: 'Patient ID and consultation stage are required' });
  }

  const result = await pool.query(
    `INSERT INTO consultations (patient_id, doctor_id, stage, diagnosis, prescription, referred_lab, review_notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [patient_id, req.user!.userId, stage, diagnosis || '', prescription || '', referred_lab || '', review_notes || '']
  );

  const nextStage = stage === 'Initial' ? 'Lab' : 'Finance';
  await pool.query('UPDATE patients SET current_stage = $1, last_updated = NOW() WHERE id = $2', [nextStage, patient_id]);
  await logAction(req.user!.userId, 'Record consultation', 'Consultation', `Patient ${patient_id} consulted at ${stage}`);

  res.status(201).json(result.rows[0]);
});

router.get('/', verifyToken, authorizeRoles('doctor', 'lab_tech', 'finance'), async (req, res) => {
  const result = await pool.query('SELECT * FROM consultations ORDER BY started_at DESC');
  res.json(result.rows);
});

export default router;
