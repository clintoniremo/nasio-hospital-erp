import { Link, Routes, Route } from 'react-router-dom';
import { UserProfile } from '../types';
import Gate from './Gate';
import Triage from './Triage';
import SHAOffice from './SHAOffice';
import Consultations from './Consultations';
import Labs from './Labs';
import Finance from './Finance';
import Pharmacy from './Pharmacy';
import Reports from './Reports';
import Inventory from './Inventory';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div className="page-shell">
      <div className="header">
        <div>
          <h1>Hospital ERP Dashboard</h1>
          <div>Role: {user.role}</div>
        </div>
        <button className="primary" onClick={onLogout}>Logout</button>
      </div>
      <div className="main-grid">
        <aside className="sidebar">
          <Link to="gate">Gate</Link>
          <Link to="triage">Triage</Link>
          <Link to="sha">SHA Office</Link>
          <Link to="consultations">Consultations</Link>
          <Link to="labs">Lab</Link>
          <Link to="finance">Finance</Link>
          <Link to="pharmacy">Pharmacy</Link>
          <Link to="inventory">Inventory</Link>
          <Link to="reports">Reports</Link>
        </aside>
        <main className="content">
          <Routes>
            <Route path="gate" element={<Gate />} />
            <Route path="triage" element={<Triage />} />
            <Route path="sha" element={<SHAOffice />} />
            <Route path="consultations" element={<Consultations />} />
            <Route path="labs" element={<Labs />} />
            <Route path="finance" element={<Finance />} />
            <Route path="pharmacy" element={<Pharmacy />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<Gate />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
