import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import './Dashboard.css';

const statusConfig = {
  pending: { label: 'Pending Pickup', color: 'warning', icon: '⏳' },
  scheduled: { label: 'Pickup Scheduled', color: 'info', icon: '📅' },
  picked_up: { label: 'Picked Up', color: 'success', icon: '✅' },
};

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getDonations()
      .then(data => setDonations(data.donations))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-page"><div className="spinner"></div></div>;
  }

  return (
    <div className="page dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1>My Donations</h1>
          <p>Track the books you've donated and their pickup status</p>
        </div>

        {donations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No Donations Yet</h3>
            <p>You haven't donated any books yet. Start by donating a book you no longer need!</p>
            <Link to="/donate" className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>Donate a Book</Link>
          </div>
        ) : (
          <div className="dashboard-list">
            {donations.map(donation => {
              const status = statusConfig[donation.pickup_status] || statusConfig.pending;
              return (
                <div className="dashboard-item" key={donation.id}>
                  <div className="dashboard-item-icon">📖</div>
                  <div className="dashboard-item-info">
                    <h3 className="dashboard-item-title">{donation.title}</h3>
                    <p className="dashboard-item-sub">by {donation.author} · {donation.category}</p>
                    <div className="dashboard-item-meta">
                      <span className={`badge badge-${status.color}`}>{status.icon} {status.label}</span>
                      <span className="dashboard-item-date">
                        Donated on {new Date(donation.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="dashboard-item-points">
                    <span className="points-earned-badge">⭐ +{donation.points_earned}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
