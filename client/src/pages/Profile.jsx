import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [stats, setStats] = useState({ booksDonated: 0, booksClaimed: 0, totalPointsEarned: 0 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    usersAPI.getProfile().then(data => {
      updateUser(data.user);
      setStats(data.stats);
      setForm(data.user);
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await usersAPI.updateProfile(form);
      updateUser(data.user);
      setSuccess(data.message);
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="page profile-page">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your account and see your exchange activity</p>
        </div>

        {success && <div className="alert alert-success"><span>✅</span> {success}</div>}
        {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

        <div className="profile-layout">
          {/* Profile Card */}
          <div className="profile-card-main">
            <div className="profile-avatar-section">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user?.name} className="profile-lg-avatar" />
              ) : (
                <div className="profile-lg-avatar-placeholder">{getInitials(user?.name)}</div>
              )}
              <div className="profile-name-section">
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
                <span className="badge badge-points">⭐ {user?.points || 0} points</span>
              </div>
            </div>

            <div className="profile-stats-grid">
              <div className="profile-stat">
                <span className="profile-stat-value">{stats.booksDonated}</span>
                <span className="profile-stat-label">Books Donated</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{stats.booksClaimed}</span>
                <span className="profile-stat-label">Books Claimed</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{stats.totalPointsEarned}</span>
                <span className="profile-stat-label">Points Earned</span>
              </div>
              <div className="profile-stat" style={{ backgroundColor: 'var(--success-color)', color: 'white' }}>
                <span className="profile-stat-value">₹{stats.moneySaved || 0}</span>
                <span className="profile-stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>Total Money Saved</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="profile-edit-card">
            <div className="profile-edit-header">
              <h3>Personal Information</h3>
              {!editing && (
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)} id="edit-profile-btn">
                  ✏️ Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSave}>
              <div className="profile-fields">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-input" value={form.name || ''} onChange={handleChange} disabled={!editing} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="text" name="phone" className="form-input" placeholder="Your phone number" value={form.phone || ''} onChange={handleChange} disabled={!editing} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 1</label>
                  <input type="text" name="address_line1" className="form-input" placeholder="House/Flat, Street" value={form.address_line1 || ''} onChange={handleChange} disabled={!editing} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 2</label>
                  <input type="text" name="address_line2" className="form-input" placeholder="Area, Landmark" value={form.address_line2 || ''} onChange={handleChange} disabled={!editing} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" name="city" className="form-input" placeholder="City" value={form.city || ''} onChange={handleChange} disabled={!editing} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input type="text" name="state" className="form-input" placeholder="State" value={form.state || ''} onChange={handleChange} disabled={!editing} />
                  </div>
                </div>
                <div className="form-group" style={{ maxWidth: '200px' }}>
                  <label className="form-label">Pincode</label>
                  <input type="text" name="pincode" className="form-input" placeholder="Pincode" value={form.pincode || ''} onChange={handleChange} disabled={!editing} />
                </div>
              </div>

              {editing && (
                <div className="profile-edit-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading} id="save-profile-btn">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => { setEditing(false); setForm(user); }}>Cancel</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
