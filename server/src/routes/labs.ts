import { Router } from 'express';
import { pool } from '../db';
import { verifyToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { logAction } from '../utils/audit';

const router = Router();

router.post('/request', verifyToken, authorizeRoles('doctor'), async (req: AuthRequest, res) => {
  const { patient_id, test_name, request_notes } = req.body;
  if (!patient_id || !test_name) {
    return res.status(400).json({ message: 'Patient ID and test name are required' });
  }

  const result = await pool.query(
    `INSERT INTO lab_tests (patient_id, requested_by, test_name, request_notes)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [patient_id, req.user!.userId, test_name, request_notes || '']
  );

  await pool.query('UPDATE patients SET current_stage = $1, last_updated = NOW() WHERE id = $2', ['Lab', patient_id]);
  await logAction(req.user!.userId, 'Request lab test', 'Lab', `Requested ${test_name} for patient ${patient_id}`);

  res.status(201).json(result.rows[0]);
});

router.post('/results', verifyToken, authorizeRoles('lab_tech'), async (req: AuthRequest, res) => {
  const { test_id, results } = req.body;
  if (!test_id || !results) {
    return res.status(400).json({ message: 'Test ID and results are required' });
  }

  const updated = await pool.query(
    `UPDATE lab_tests SET results = $1, status = 'Completed', completed_at = NOW() WHERE id = $2 RETURNING *`,
    [results, test_id]
  );

  if (!updated.rows.length) {
    return res.status(404).json({ message: 'Lab test not found' });
  }

  const patientId = updated.rows[0].patient_id;
  await pool.query('UPDATE patients SET current_stage = $1, last_updated = NOW() WHERE id = $2', ['Consultation (Review)', patientId]);
  await logAction(req.user!.userId, 'Complete lab result', 'Lab', `Lab test ${test_id} completed`);

  res.json(updated.rows[0]);
});

router.get('/', verifyToken, authorizeRoles('lab_tech', 'doctor', 'finance'), async (req, res) => {
  const result = await pool.query('SELECT * FROM lab_tests ORDER BY completed_at DESC NULLS LAST');
  res.json(result.rows);
});

export default router;
