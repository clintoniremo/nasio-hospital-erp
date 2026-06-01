import { Router } from 'express';
import { pool } from '../db';
import { verifyToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { logAction } from '../utils/audit';
import { notifySHAApproval } from '../utils/shaService';

const router = Router();

router.post('/', verifyToken, authorizeRoles('sha_officer'), async (req: AuthRequest, res) => {
  const { patient_id, details, status } = req.body;
  if (!patient_id || !status) {
    return res.status(400).json({ message: 'Patient ID and SHA status are required' });
  }

  const result = await pool.query(
    `INSERT INTO sha_requests (patient_id, status, details, approved_by, approved_at)
     VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
    [patient_id, status, details || '', req.user!.userId]
  );

  const nextStage = status === 'Approved' ? 'Consultation Room' : 'SHA Office';
  await pool.query('UPDATE patients SET current_stage = $1, last_updated = NOW() WHERE id = $2', [nextStage, patient_id]);
  await logAction(req.user!.userId, 'SHA status update', 'SHA Office', `Patient ${patient_id} SHA ${status}`);

  if (status === 'Approved') {
    const shaResult = await notifySHAApproval(patient_id, details || '');
    // record API result in logs
    await logAction(req.user!.userId, 'SHA external notify', 'SHA Office', `SHA notify result: ${JSON.stringify(shaResult)}`);
  }

  res.status(201).json(result.rows[0]);
});

router.get('/', verifyToken, authorizeRoles('sha_officer', 'doctor', 'finance'), async (req, res) => {
  const result = await pool.query('SELECT * FROM sha_requests ORDER BY approved_at DESC');
  res.json(result.rows);
});

export default router;
