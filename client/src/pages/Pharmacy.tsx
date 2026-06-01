import { useState, type FormEvent } from 'react';
import api from '../api/client';

export default function Pharmacy() {
  const [form, setForm] = useState({ patient_id: '', medication: '', quantity: '' });
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await api.post('/pharmacy', {
      patient_id: form.patient_id,
      medication: form.medication,
      quantity: Number(form.quantity)
    });
    setMessage('Medication dispensed and patient record updated to Completed.');
    setForm({ patient_id: '', medication: '', quantity: '' });
  };

  return (
    <div>
      <div className="card">
        <h2>Pharmacy</h2>
        <p>Dispense medication after finance clearance and log inventory movement.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Patient ID
            <input value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required />
          </label>
          <label>
            Medication
            <input value={form.medication} onChange={(e) => setForm({ ...form, medication: e.target.value })} required />
          </label>
          <label>
            Quantity
            <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
          </label>
          <button className="primary" type="submit">Dispense</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
