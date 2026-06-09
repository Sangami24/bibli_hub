import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import './Dashboard.css';

const statusConfig = {
  processing: { label: 'Processing', color: 'warning', icon: '⏳' },
  shipped: { label: 'Shipped', color: 'info', icon: '🚚' },
  delivered: { label: 'Delivered', color: 'success', icon: '✅' },
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getOrders()
      .then(data => setOrders(data.orders))
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
          <h1>My Orders</h1>
          <p>Track the books you've claimed and their delivery status</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>No Orders Yet</h3>
            <p>You haven't claimed any books yet. Browse our collection and use your points!</p>
            <Link to="/browse" className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>Browse Books</Link>
          </div>
        ) : (
          <div className="dashboard-list">
            {orders.map(order => {
              const status = statusConfig[order.delivery_status] || statusConfig.processing;
              return (
                <div className="dashboard-item" key={order.id}>
                  <div className="dashboard-item-icon">📚</div>
                  <div className="dashboard-item-info">
                    <h3 className="dashboard-item-title">{order.title}</h3>
                    <p className="dashboard-item-sub">by {order.author} · Donated by {order.donor_name}</p>
                    <div className="dashboard-item-meta">
                      <span className={`badge badge-${status.color}`}>{status.icon} {status.label}</span>
                      <span className="dashboard-item-date">
                        Claimed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="dashboard-item-points">
                    <span className="points-spent-badge">⭐ -{order.points_spent}</span>
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
