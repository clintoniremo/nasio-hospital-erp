import { useState, type FormEvent } from 'react';
import api from '../api/client';

export default function Labs() {
  const [request, setRequest] = useState({ patient_id: '', test_name: '', request_notes: '' });
  const [result, setResult] = useState({ test_id: '', results: '' });
  const [message, setMessage] = useState<string | null>(null);

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await api.post('/labs/request', request);
    setMessage('Lab test requested successfully.');
    setRequest({ patient_id: '', test_name: '', request_notes: '' });
  };

  const handleResults = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await api.post('/labs/results', result);
    setMessage('Lab results recorded and patient moved to consultation review.');
    setResult({ test_id: '', results: '' });
  };

  return (
    <div>
      <div className="card">
        <h2>Lab</h2>
        <p>Request tests and publish lab results into the patient workflow.</p>
        <form onSubmit={handleRequest}>
          <label>
            Patient ID
            <input value={request.patient_id} onChange={(e) => setRequest({ ...request, patient_id: e.target.value })} required />
          </label>
          <label>
            Test Name
            <input value={request.test_name} onChange={(e) => setRequest({ ...request, test_name: e.target.value })} required />
          </label>
          <label>
            Notes
            <textarea value={request.request_notes} onChange={(e) => setRequest({ ...request, request_notes: e.target.value })} rows={4} />
          </label>
          <button className="primary" type="submit">Request Test</button>
        </form>
      </div>
      <div className="card">
        <h3>Publish Results</h3>
        <form onSubmit={handleResults}>
          <label>
            Lab Test ID
            <input value={result.test_id} onChange={(e) => setResult({ ...result, test_id: e.target.value })} required />
          </label>
          <label>
            Results
            <textarea value={result.results} onChange={(e) => setResult({ ...result, results: e.target.value })} rows={4} required />
          </label>
          <button className="primary" type="submit">Submit Results</button>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
