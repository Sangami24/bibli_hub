import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/', { replace: true });
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
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-Up failed. Please try again.');
  };

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-visual-icon">🌱</div>
            <h2>Join the Movement</h2>
            <p>Create your account and start exchanging books today. It's completely free!</p>
            <div className="auth-visual-stats">
              <div className="auth-stat">
                <span className="auth-stat-icon">📖</span>
                <span>Access thousands of books</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-icon">🚚</span>
                <span>Free doorstep pickup</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-icon">♻️</span>
                <span>Reduce, reuse, read</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <Link to="/" className="auth-back-link">← Back to Home</Link>
              <h1>Create Account</h1>
              <p>Join Bibli Hub and start exchanging books</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" id="register-form">
              <div className="form-group">
                <label className="form-label" htmlFor="register-name">Full Name</label>
                <input
                  type="text"
                  id="register-name"
                  className="form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-email">Email Address</label>
                <input
                  type="email"
                  id="register-email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-password">Password</label>
                <div className="password-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="register-password"
                    className="form-input"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
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

              <div className="form-group">
                <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="register-confirm-password"
                  className="form-input"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg auth-submit-btn"
                disabled={loading}
                id="register-submit-btn"
              >
                {loading ? (
                  <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> Creating Account...</>
                ) : (
                  'Create Account'
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
                text="signup_with"
                useOneTap
              />
            </div>

            <p className="auth-switch">
              Already have an account? <Link to="/login" id="switch-to-login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
