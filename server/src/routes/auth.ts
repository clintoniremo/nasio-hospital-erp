import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = Router();
const jwtSecret = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const result = await pool.query('SELECT id, full_name, email, password_hash, role FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

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
