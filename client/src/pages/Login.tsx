import { useState, type FormEvent } from 'react';
import api from '../api/client';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('erp_token', response.data.token);
      localStorage.setItem('erp_user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="left-panel">
          <div className="video-wrapper">
            <video className="hero-video" autoPlay muted loop playsInline>
              <source src="/login-video.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay" />
            <div className="overlay-content">
              <div className="brand">
                <div className="logo-mark">G</div>
                <div>
                  <h2>GMK.io</h2>
                  <p>Hospital ERP reimagined.</p>
                </div>
              </div>
              <div className="hero-copy">
                <h3>Fast admissions, lab, billing and pharmacy.</h3>
                <p>Use the video background to reinforce the modern patient flow experience.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-title">
              <h3>Sign in to GMK</h3>
              <p className="muted">Access patient flow and payment management.</p>
            </div>

            <label className="field">
              <div className="label">Email</div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@domain.com" />
            </label>

            <label className="field">
              <div className="label">Password</div>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Enter your password" />
            </label>

            {error && <div className="form-error">{error}</div>}

            <div className="form-footer">
              <label className="checkbox-field">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="muted">Forgot password?</a>
            </div>

            <button className="primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
