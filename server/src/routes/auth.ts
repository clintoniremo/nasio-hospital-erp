import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = Router();
const jwtSecret = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET';

const fallbackUsers = [
  { id: 'superadmin', full_name: 'Super Admin', email: 'superadmin@hospital.local', password_hash: 'PLAINTEXT:superadmin123', role: 'super_admin' },
  { id: 'reception', full_name: 'Reception Admin', email: 'reception@hospital.local', password_hash: 'PLAINTEXT:reception123', role: 'receptionist' },
  { id: 'nurse', full_name: 'Triage Nurse', email: 'nurse@hospital.local', password_hash: 'PLAINTEXT:nurse123', role: 'nurse' },
  { id: 'sha', full_name: 'SHA Coordinator', email: 'sha@hospital.local', password_hash: 'PLAINTEXT:sha123', role: 'sha_officer' },
  { id: 'doctor', full_name: 'Consulting Doctor', email: 'doctor@hospital.local', password_hash: 'PLAINTEXT:doctor123', role: 'doctor' },
  { id: 'lab', full_name: 'Lab Technician', email: 'lab@hospital.local', password_hash: 'PLAINTEXT:lab123', role: 'lab_tech' },
  { id: 'finance', full_name: 'Finance Officer', email: 'finance@hospital.local', password_hash: 'PLAINTEXT:finance123', role: 'finance' },
  { id: 'pharmacy', full_name: 'Pharmacy Agent', email: 'pharmacy@hospital.local', password_hash: 'PLAINTEXT:pharmacy123', role: 'pharmacist' }
];

async function findUserByEmail(email: string) {
  if (pool) {
    try {
      const result = await pool.query('SELECT id, full_name, email, password_hash, role FROM users WHERE email = $1', [email]);
      if (result && result.rows && result.rows.length) return result.rows[0];
    } catch (err) {
      // ignore and fall back to in-memory users
    }
  }

  return fallbackUsers.find((user) => user.email === email) || null;
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const storedHash: string = user.password_hash;
  let validPassword = false;

  if (storedHash.startsWith('PLAINTEXT:')) {
    validPassword = password === storedHash.slice('PLAINTEXT:'.length);
  } else {
    validPassword = await bcrypt.compare(password, storedHash);
  }

  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, jwtSecret, {
    expiresIn: '8h'
  });

  res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
});

export default router;
