import { Router } from 'express';
import { pool } from '../db';
import { verifyToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { logAction } from '../utils/audit';

const router = Router();

router.post('/', verifyToken, authorizeRoles('finance'), async (req: AuthRequest, res) => {
  const { patient_id, service_total, sha_deduction, patient_payment } = req.body;
  if (!patient_id || service_total === undefined || patient_payment === undefined) {
    return res.status(400).json({ message: 'Patient, service total, and payment amounts are required' });
  }

  const balance = Number(service_total) - Number(sha_deduction) - Number(patient_payment);
  const receiptNumber = `RCPT-${Date.now()}`;

  const result = await pool.query(
    `INSERT INTO finances (patient_id, service_total, sha_deduction, patient_payment, balance, receipt_number)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [patient_id, service_total, sha_deduction || 0, patient_payment, balance, receiptNumber]
  );

  await pool.query('UPDATE patients SET current_stage = $1, last_updated = NOW() WHERE id = $2', ['Pharmacy', patient_id]);
  await logAction(req.user!.userId, 'Generate bill', 'Finance', `Finance completed for patient ${patient_id}`);

  res.status(201).json(result.rows[0]);
});

router.get('/', verifyToken, authorizeRoles('finance', 'doctor', 'pharmacist'), async (req, res) => {
  const result = await pool.query('SELECT * FROM finances ORDER BY created_at DESC');
  res.json(result.rows);
});

export default router;
