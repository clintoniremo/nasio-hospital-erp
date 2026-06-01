import { Router } from 'express';
import { pool } from '../db';
import { verifyToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { logAction } from '../utils/audit';
import { pool as mainPool } from '../db';

const router = Router();

router.post('/', verifyToken, authorizeRoles('pharmacist'), async (req: AuthRequest, res) => {
  const { patient_id, medication, quantity } = req.body;
  if (!patient_id || !medication || !quantity) {
    return res.status(400).json({ message: 'Patient ID, medication, and quantity are required' });
  }
  // Attempt to find inventory item by SKU or name and decrement stock
  const client = await mainPool.connect();
  try {
    await client.query('BEGIN');
    const itemRes = await client.query(
      'SELECT * FROM inventory_items WHERE sku = $1 OR name = $1 FOR UPDATE',
      [medication]
    );

    if (!itemRes.rows.length) {
      // still allow dispensing but warn that item not in inventory
      const result = await client.query(
        `INSERT INTO pharmacy_records (patient_id, medication, quantity, dispensed_by, status, dispensed_at)
         VALUES ($1, $2, $3, $4, 'Dispensed', NOW()) RETURNING *`,
        [patient_id, medication, quantity, req.user!.userId]
      );
      await client.query('COMMIT');
      await pool.query('UPDATE patients SET current_stage = $1, last_updated = NOW() WHERE id = $2', ['Completed', patient_id]);
      await logAction(req.user!.userId, 'Dispense medication (no inventory)', 'Pharmacy', `Medication ${medication} dispensed for patient ${patient_id} but not found in inventory`);
      return res.status(201).json(result.rows[0]);
    }

    const item = itemRes.rows[0];
    const newQty = Number(item.quantity) - Number(quantity);
    if (newQty < 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient stock for item' });
    }

    await client.query('UPDATE inventory_items SET quantity = $1, updated_at = NOW() WHERE id = $2', [newQty, item.id]);
    await client.query(
      'INSERT INTO inventory_logs (item_id, changed_by, change, reason, related_patient) VALUES ($1,$2,$3,$4,$5)',
      [item.id, req.user!.userId, -Math.abs(Number(quantity)), 'Dispensed via pharmacy', patient_id]
    );

    const result = await client.query(
      `INSERT INTO pharmacy_records (patient_id, medication, quantity, dispensed_by, status, dispensed_at)
       VALUES ($1, $2, $3, $4, 'Dispensed', NOW()) RETURNING *`,
      [patient_id, medication, quantity, req.user!.userId]
    );

    await client.query('COMMIT');
    await mainPool.query('UPDATE patients SET current_stage = $1, last_updated = NOW() WHERE id = $2', ['Completed', patient_id]);
    await logAction(req.user!.userId, 'Dispense medication', 'Pharmacy', `Medication ${medication} dispensed for patient ${patient_id}`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

router.get('/', verifyToken, authorizeRoles('pharmacist', 'finance', 'doctor'), async (req, res) => {
  const result = await pool.query('SELECT * FROM pharmacy_records ORDER BY dispensed_at DESC');
  res.json(result.rows);
});

export default router;
