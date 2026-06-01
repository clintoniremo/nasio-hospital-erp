import { Router } from 'express';
import { pool } from '../db';
import { verifyToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { logAction } from '../utils/audit';

const router = Router();

router.get('/', verifyToken, authorizeRoles('pharmacist', 'finance', 'receptionist'), async (req, res) => {
  const result = await pool.query('SELECT * FROM inventory_items ORDER BY name');
  res.json(result.rows);
});

router.post('/', verifyToken, authorizeRoles('pharmacist', 'finance'), async (req: AuthRequest, res) => {
  const { sku, name, description, quantity, unit_price } = req.body;
  if (!sku || !name) return res.status(400).json({ message: 'SKU and name required' });

  const result = await pool.query(
    `INSERT INTO inventory_items (sku, name, description, quantity, unit_price) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [sku, name, description || '', quantity || 0, unit_price || 0]
  );

  await logAction(req.user!.userId, 'Create inventory item', 'Inventory', `Item ${sku} created`);
  res.status(201).json(result.rows[0]);
});

router.patch('/:id/adjust', verifyToken, authorizeRoles('pharmacist', 'finance'), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { change, reason, related_patient } = req.body;
  if (!change) return res.status(400).json({ message: 'Change amount required' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const itemRes = await client.query('SELECT * FROM inventory_items WHERE id = $1 FOR UPDATE', [id]);
    if (!itemRes.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Item not found' });
    }

    const newQty = Number(itemRes.rows[0].quantity) + Number(change);
    await client.query('UPDATE inventory_items SET quantity = $1, updated_at = NOW() WHERE id = $2', [newQty, id]);
    await client.query('INSERT INTO inventory_logs (item_id, changed_by, change, reason, related_patient) VALUES ($1,$2,$3,$4,$5)', [id, req.user!.userId, change, reason || '', related_patient || null]);
    await client.query('COMMIT');
    await logAction(req.user!.userId, 'Adjust inventory', 'Inventory', `Item ${id} adjusted by ${change}`);
    res.json({ id, quantity: newQty });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

export default router;
