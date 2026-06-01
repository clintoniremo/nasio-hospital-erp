import { useState, type FormEvent } from 'react';
import api from '../api/client';

export default function Consultations() {
  const [form, setForm] = useState({ patient_id: '', stage: 'Initial', diagnosis: '', prescription: '', referred_lab: '', review_notes: '' });
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await api.post('/consultations', {
      patient_id: form.patient_id,
      stage: form.stage,
      diagnosis: form.diagnosis,
      prescription: form.prescription,
      referred_lab: form.referred_lab,
      review_notes: form.review_notes
    });
    setMessage('Consultation saved and workflow moved forward.');
    setForm({ patient_id: '', stage: 'Initial', diagnosis: '', prescription: '', referred_lab: '', review_notes: '' });
  };

  return (
    <div>
      <div className="card">
        <h2>Consultation</h2>
        <p>Create an initial consultation or review lab results after diagnostics.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Patient ID
            <input value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required />
          </label>
          <label>
            Stage
            <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
              <option value="Initial">Initial</option>
              <option value="Review">Review</option>
            </select>
          </label>
          <label>
            Diagnosis
            <textarea value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} rows={4} />
          </label>
          <label>
            Prescription
            <textarea value={form.prescription} onChange={(e) => setForm({ ...form, prescription: e.target.value })} rows={4} />
          </label>
          <label>
            Referred Lab
            <input value={form.referred_lab} onChange={(e) => setForm({ ...form, referred_lab: e.target.value })} />
          </label>
          <label>
            Review Notes
            <textarea value={form.review_notes} onChange={(e) => setForm({ ...form, review_notes: e.target.value })} rows={4} />
          </label>
          <button className="primary" type="submit">Save Consultation</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
