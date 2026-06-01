import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Reports() {
  const [overview, setOverview] = useState<any>(null);
  const [audit, setAudit] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [overviewRes, auditRes] = await Promise.all([api.get('/reports/overview'), api.get('/reports/audit')]);
        setOverview(overviewRes.data);
        setAudit(auditRes.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div>
      <div className="card">
        <h2>Reports & Analytics</h2>
        <p>Review patient flow, finance performance, and audit trails across the ERP.</p>
        {overview ? (
          <div>
            <h3>Patient Flow</h3>
            <ul>
              {overview.patientFlow.map((item: any) => (
                <li key={item.current_stage}>{item.current_stage}: {item.count}</li>
              ))}
            </ul>
            <h3>Finance Summary</h3>
            <p>Total revenue: {overview.financeSummary.total_revenue || 0}</p>
            <p>SHA deductions: {overview.financeSummary.total_sha || 0}</p>
          </div>
        ) : (
          <p>Loading overview…</p>
        )}
      </div>
      <div className="card">
        <h3>Audit Trail</h3>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Module</th>
              <th>Details</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {audit.map((log) => (
              <tr key={log.id}>
                <td>{log.action}</td>
                <td>{log.module}</td>
                <td>{log.details}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
