import { useState, type FormEvent } from 'react';
import api from '../api/client';

export default function Finance() {
  const [form, setForm] = useState({ patient_id: '', service_total: '', sha_deduction: '0', patient_payment: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await api.post('/finance', {
      patient_id: form.patient_id,
      service_total: Number(form.service_total),
      sha_deduction: Number(form.sha_deduction),
      patient_payment: Number(form.patient_payment)
    });

    setReceipt(response.data);
    setMessage('Bill generated and patient advanced to pharmacy after clearance.');
    setForm({ patient_id: '', service_total: '', sha_deduction: '0', patient_payment: '' });
  };

  return (
    <div>
      <div className="card">
        <h2>Finance</h2>
        <p>Generate billing with SHA deductions and finalize payment receipt for pharmacy clearance.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Patient ID
            <input value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required />
          </label>
          <label>
            Service Total
            <input type="number" value={form.service_total} onChange={(e) => setForm({ ...form, service_total: e.target.value })} required />
          </label>
          <label>
            SHA / Insurance Deduction
            <input type="number" value={form.sha_deduction} onChange={(e) => setForm({ ...form, sha_deduction: e.target.value })} />
          </label>
          <label>
            Patient Payment
            <input type="number" value={form.patient_payment} onChange={(e) => setForm({ ...form, patient_payment: e.target.value })} required />
          </label>
          <button className="primary" type="submit">Generate Bill</button>
        </form>
      </div>
      {receipt && (
        <div className="card">
          <h3>Receipt</h3>
          <p>Receipt: {receipt.receipt_number}</p>
          <p>Balance: {receipt.balance}</p>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
