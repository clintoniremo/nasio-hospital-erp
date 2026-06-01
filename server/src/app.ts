import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import triageRoutes from './routes/triage';
import shaRoutes from './routes/sha';
import consultationRoutes from './routes/consultations';
import labRoutes from './routes/labs';
import financeRoutes from './routes/finance';
import pharmacyRoutes from './routes/pharmacy';
import reportRoutes from './routes/reports';
import inventoryRoutes from './routes/inventory';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/sha', shaRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
