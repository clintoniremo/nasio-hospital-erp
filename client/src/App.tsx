import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { getAuthUser } from './utils/auth';
import { UserProfile } from './types';

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<Login onLogin={(nextUser) => { setUser(nextUser); navigate('/dashboard'); }} />} />
        <Route
          path="/dashboard/*"
          element={user ? <Dashboard user={user} onLogout={() => { localStorage.clear(); setUser(null); navigate('/login'); }} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      </Routes>
    </div>
  );
}

export default App;
