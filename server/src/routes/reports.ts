import { Router } from 'express';
import { pool } from '../db';
import { verifyToken, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/overview', verifyToken, authorizeRoles('finance', 'doctor', 'sha_officer', 'receptionist'), async (req, res) => {
  const patients = await pool.query('SELECT current_stage, COUNT(*) AS count FROM patients GROUP BY current_stage');
  const financeSummary = await pool.query(
    `SELECT
       COUNT(*) AS billed_count,
       SUM(service_total) AS total_revenue,
       SUM(sha_deduction) AS total_sha,
       SUM(patient_payment) AS total_paid
     FROM finances`
  );
  const labSummary = await pool.query('SELECT status, COUNT(*) AS count FROM lab_tests GROUP BY status');
  const inventorySummary = await pool.query('SELECT COUNT(*) AS item_count, SUM(quantity) AS total_stock FROM inventory_items');
  const inventoryLow = await pool.query('SELECT COUNT(*) AS low_count FROM inventory_items WHERE quantity < 10');
  const consultationTimes = await pool.query(
    `SELECT
       COUNT(*) AS consult_count,
       AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) AS avg_duration_seconds
     FROM consultations WHERE completed_at IS NOT NULL`
  );

  res.json({
    patientFlow: patients.rows,
    financeSummary: financeSummary.rows[0],
    labSummary: labSummary.rows
    ,inventorySummary: inventorySummary.rows[0]
    ,inventoryLow: inventoryLow.rows[0]
    ,consultationMetrics: consultationTimes.rows[0]
  });
});

router.get('/audit', verifyToken, authorizeRoles('finance', 'doctor', 'sha_officer'), async (req, res) => {
  const result = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200');
  res.json(result.rows);
});

export default router;
