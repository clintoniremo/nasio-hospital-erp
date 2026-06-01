import { useState, type FormEvent } from 'react';
import api from '../api/client';

export default function Triage() {
  const [form, setForm] = useState({ patient_id: '', temperature: '', height: '', weight: '', age: '', assessment: '' });
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await api.post('/triage', {
      patient_id: form.patient_id,
      temperature: Number(form.temperature),
      height: Number(form.height),
      weight: Number(form.weight),
      age: Number(form.age),
      assessment: form.assessment
    });
    setMessage('Triage submitted successfully.');
    setForm({ patient_id: '', temperature: '', height: '', weight: '', age: '', assessment: '' });
  };

  return (
    <div>
      <div className="card">
        <h2>Triage</h2>
        <p>Capture vitals and initial assessment before transferring the patient to the SHA office.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Patient ID
            <input value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required />
          </label>
          <label>
            Temperature
            <input type="number" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} required />
          </label>
          <label>
            Height
            <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} required />
          </label>
          <label>
            Weight
            <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required />
          </label>
          <label>
            Age
            <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
          </label>
          <label>
            Initial Assessment
            <textarea value={form.assessment} onChange={(e) => setForm({ ...form, assessment: e.target.value })} rows={4} />
          </label>
          <button className="primary" type="submit">Submit Triage</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
