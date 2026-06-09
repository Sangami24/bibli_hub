import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-visual-icon">🔑</div>
            <h2>Forgot Password?</h2>
            <p>No worries! We'll send you a link to reset your password and get you back to exchanging books.</p>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {sent ? (
              <div className="auth-success animate-scale-in">
                <div className="auth-success-icon">📧</div>
                <h2>Check Your Email!</h2>
                <p>
                  If an account with <strong>{email}</strong> exists, we've sent a password reset link.
                  Please check your inbox (and spam folder) and follow the instructions.
                </p>
                <Link to="/login" className="btn btn-primary btn-lg">Back to Login</Link>
              </div>
            ) : (
              <>
                <div className="auth-form-header">
                  <Link to="/login" className="auth-back-link">← Back to Login</Link>
                  <h1>Reset Password</h1>
                  <p>Enter your email and we'll send you a reset link</p>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" id="forgot-password-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="forgot-email">Email Address</label>
                    <input
                      type="email"
                      id="forgot-email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg auth-submit-btn"
                    disabled={loading}
                    id="forgot-submit-btn"
                  >
                    {loading ? (
                      <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> Sending...</>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                <p className="auth-switch">
                  Remember your password? <Link to="/login">Log in</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
