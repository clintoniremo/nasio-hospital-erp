import { useState, useEffect, type FormEvent } from 'react';
import api from '../api/client';

export default function Gate() {
  const [form, setForm] = useState({ full_name: '', patient_code: '', contact: '', vehicle_plate: '', arrival_time: '' });
  const [patients, setPatients] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const response = await api.get('/patients');
    setPatients(response.data);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await api.post('/patients', form);
    setMessage(`Patient ${response.data.patient_code} checked in.`);
    setForm({ full_name: '', patient_code: '', contact: '', vehicle_plate: '', arrival_time: '' });
    loadPatients();
  };

  return (
    <div>
      <div className="card">
        <h2>Gate / Reception</h2>
        <p>Record patient arrival details, vehicle plate, and track entry into the patient flow.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Patient Code
            <input value={form.patient_code} onChange={(e) => setForm({ ...form, patient_code: e.target.value })} required />
          </label>
          <label>
            Full Name
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          </label>
          <label>
            Contact
            <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          </label>
          <label>
            Vehicle Plate
            <input value={form.vehicle_plate} onChange={(e) => setForm({ ...form, vehicle_plate: e.target.value })} />
          </label>
          <label>
            Arrival Time
            <input type="datetime-local" value={form.arrival_time} onChange={(e) => setForm({ ...form, arrival_time: e.target.value })} required />
          </label>
          <button className="primary" type="submit">Check In</button>
        </form>
        {message && <p style={{ color: '#d1d5db' }}>{message}</p>}
      </div>
      <div className="card">
        <h3>Recent Arrivals</h3>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Stage</th>
              <th>Arrival</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.patient_code}</td>
                <td>{patient.full_name}</td>
                <td>{patient.current_stage}</td>
                <td>{new Date(patient.arrival_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
