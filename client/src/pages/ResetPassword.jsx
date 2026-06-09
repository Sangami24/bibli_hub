import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
      await authAPI.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="page auth-page">
        <div className="auth-container">
          <div className="auth-visual">
            <div className="auth-visual-content">
              <div className="auth-visual-icon">⚠️</div>
              <h2>Invalid Link</h2>
              <p>This password reset link is invalid or has expired.</p>
            </div>
          </div>
          <div className="auth-form-section">
            <div className="auth-form-wrapper">
              <div className="auth-success">
                <div className="auth-success-icon">❌</div>
                <h2>Invalid Reset Link</h2>
                <p>The password reset link is missing or invalid. Please request a new one.</p>
                <Link to="/forgot-password" className="btn btn-primary btn-lg">Request New Link</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-visual-icon">🔐</div>
            <h2>Almost There!</h2>
            <p>Create a new password for your account. Make sure it's strong and memorable.</p>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {success ? (
              <div className="auth-success animate-scale-in">
                <div className="auth-success-icon">✅</div>
                <h2>Password Reset!</h2>
                <p>Your password has been reset successfully. You can now log in with your new password.</p>
                <Link to="/login" className="btn btn-primary btn-lg" id="reset-login-btn">Go to Login</Link>
              </div>
            ) : (
              <>
                <div className="auth-form-header">
                  <h1>New Password</h1>
                  <p>Enter your new password below</p>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" id="reset-password-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-password">New Password</label>
                    <input
                      type="password"
                      id="new-password"
                      className="form-input"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="confirm-new-password">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirm-new-password"
                      className="form-input"
                      placeholder="Re-enter your new password"
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
                    id="reset-submit-btn"
                  >
                    {loading ? (
                      <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> Resetting...</>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
