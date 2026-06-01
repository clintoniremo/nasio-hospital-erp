import { Router } from 'express';
import { verifyToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { pool } from '../db';
import { logAction } from '../utils/audit';

const router = Router();

router.post('/', verifyToken, authorizeRoles('receptionist'), async (req: AuthRequest, res) => {
  const { full_name, contact, vehicle_plate, patient_code, arrival_time } = req.body;
  if (!full_name || !patient_code || !arrival_time) {
    return res.status(400).json({ message: 'Patient name, code, and arrival time are required' });
  }

  const result = await pool.query(
    `INSERT INTO patients (patient_code, full_name, contact, vehicle_plate, arrival_time, current_stage)
     VALUES ($1, $2, $3, $4, $5, 'Gate') RETURNING *`,
    [patient_code, full_name, contact || '', vehicle_plate || '', arrival_time]
  );

  await logAction(req.user!.userId, 'Create patient intake', 'Gate', `Patient ${patient_code} created by reception`);

  res.status(201).json(result.rows[0]);
});

router.get('/', verifyToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM patients ORDER BY arrival_time DESC');
  res.json(result.rows);
});

router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
  if (!result.rows.length) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  res.json(result.rows[0]);
});

export default router;
