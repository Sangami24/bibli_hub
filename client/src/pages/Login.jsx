import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed. Please try again.');
  };

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-visual-icon">📚</div>
            <h2>Welcome Back!</h2>
            <p>Log in to continue exchanging books and making a difference.</p>
            <div className="auth-visual-stats">
              <div className="auth-stat">
                <span className="auth-stat-icon">⭐</span>
                <span>Earn points for every book</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-icon">🌱</span>
                <span>Save the environment</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-icon">💰</span>
                <span>100% free to use</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <Link to="/" className="auth-back-link">← Back to Home</Link>
              <h1>Log In</h1>
              <p>Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" id="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <Link to="/forgot-password" className="form-link" id="forgot-password-link">Forgot password?</Link>
                </div>
                <div className="password-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg auth-submit-btn"
                disabled={loading}
                id="login-submit-btn"
              >
                {loading ? (
                  <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> Logging in...</>
                ) : (
                  'Log In'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, marginBottom: 16 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
              />
            </div>

            <p className="auth-switch">
              Don't have an account? <Link to="/register" id="switch-to-register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
