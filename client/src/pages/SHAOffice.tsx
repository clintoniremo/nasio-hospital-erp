import { useState, type FormEvent } from 'react';
import api from '../api/client';

export default function SHAOffice() {
  const [form, setForm] = useState({ patient_id: '', status: 'Approved', details: '' });
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await api.post('/sha', form);
    setMessage('SHA approval recorded and patient advanced in the workflow.');
    setForm({ patient_id: '', status: 'Approved', details: '' });
  };

  return (
    <div>
      <div className="card">
        <h2>SHA Office</h2>
        <p>Verify and approve SHA integration before the patient moves to the consultation room.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Patient ID
            <input value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>
          <label>
            Notes
            <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={4} />
          </label>
          <button className="primary" type="submit">Submit SHA</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
