import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { booksAPI } from '../services/api';
import './DonateBook.css';

export default function DonateBook() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    title: '', author: '', category: '', grade: '', condition: '', description: '',
    pickup_address: user?.address_line1 || '', pickup_city: user?.city || '',
    pickup_state: user?.state || '', pickup_pincode: user?.pincode || '',
    pickup_phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await booksAPI.donate(form);
      setSuccess(data);
      updateUser({ ...user, points: data.newPoints });
      setForm({ title: '', author: '', category: '', grade: '', condition: '', description: '',
        pickup_address: user?.address_line1 || '', pickup_city: user?.city || '',
        pickup_state: user?.state || '', pickup_pincode: user?.pincode || '',
        pickup_phone: user?.phone || '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page donate-page">
        <div className="container">
          <div className="donate-success animate-scale-in">
            <div className="donate-success-icon">🎉</div>
            <h1>Book Donated Successfully!</h1>
            <p className="donate-success-msg">{success.message}</p>
            
            <div className="donate-success-card">
              <div className="success-detail">
                <span className="success-label">Book</span>
                <span className="success-value">{success.book.title}</span>
              </div>
              <div className="success-detail">
                <span className="success-label">Points Earned</span>
                <span className="success-value points-earned">⭐ +{success.donation.points_earned}</span>
              </div>
              <div className="success-detail">
                <span className="success-label">Pickup Estimate</span>
                <span className="success-value">📦 {success.donation.estimated_pickup}</span>
              </div>
              <div className="success-detail">
                <span className="success-label">Your Balance</span>
                <span className="success-value">⭐ {success.newPoints} points</span>
              </div>
            </div>
            
            <div className="donate-success-info">
              <p>📍 Our pickup team will collect the book from your address within <strong>{success.donation.estimated_pickup}</strong>.</p>
              <p>You can track the pickup status from your <a href="/my-donations">My Donations</a> page.</p>
            </div>

            <div className="donate-success-actions">
              <button className="btn btn-primary btn-lg" onClick={() => setSuccess(null)} id="donate-another-btn">
                📦 Donate Another Book
              </button>
              <a href="/my-donations" className="btn btn-secondary btn-lg">View My Donations</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page donate-page">
      <div className="container">
        <div className="page-header">
          <h1>Donate a Book</h1>
          <p>Share your books with someone who needs them and earn points</p>
        </div>

        <div className="donate-layout">
          <div className="donate-form-section">
            {error && (
              <div className="alert alert-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="donate-form" id="donate-form">
              <div className="donate-form-card">
                <h2 className="donate-section-title">📖 Book Details</h2>
                <div className="form-group">
                  <label className="form-label" htmlFor="donate-title">Book Title *</label>
                  <input type="text" id="donate-title" name="title" className="form-input" placeholder="e.g. NCERT Physics Class 12" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="donate-author">Author *</label>
                  <input type="text" id="donate-author" name="author" className="form-input" placeholder="e.g. H.C. Verma" value={form.author} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="donate-category">Category *</label>
                    <select id="donate-category" name="category" className="form-select" value={form.category} onChange={handleChange} required>
                      <option value="">Select category</option>
                      <option value="textbook">School Textbook</option>
                      <option value="fiction">Fiction</option>
                      <option value="non_fiction">Non-Fiction</option>
                      <option value="competitive">Competitive Exam Prep</option>
                      <option value="reference">Reference & GK</option>
                      <option value="children">Children's Books</option>
                      <option value="comics">Comics & Graphic Novels</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="donate-condition">Condition *</label>
                    <select id="donate-condition" name="condition" className="form-select" value={form.condition} onChange={handleChange} required>
                      <option value="">Select condition</option>
                      <option value="new">New</option>
                      <option value="like_new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                </div>
                {form.category === 'textbook' && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="donate-grade">Grade / Class</label>
                    <input type="text" id="donate-grade" name="grade" className="form-input" placeholder="e.g. 10, 12" value={form.grade} onChange={handleChange} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label" htmlFor="donate-description">Description</label>
                  <textarea id="donate-description" name="description" className="form-textarea" placeholder="Any additional details about the book..." value={form.description} onChange={handleChange}></textarea>
                </div>
              </div>

              <div className="donate-form-card">
                <h2 className="donate-section-title">📍 Pickup Address</h2>
                <p className="form-hint" style={{ marginBottom: 16 }}>We'll pick up the book from this address in 3-5 business days.</p>
                <div className="form-group">
                  <label className="form-label" htmlFor="donate-address">Address *</label>
                  <input type="text" id="donate-address" name="pickup_address" className="form-input" placeholder="House/Flat number, Street, Locality" value={form.pickup_address} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="donate-city">City</label>
                    <input type="text" id="donate-city" name="pickup_city" className="form-input" placeholder="City" value={form.pickup_city} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="donate-state">State</label>
                    <input type="text" id="donate-state" name="pickup_state" className="form-input" placeholder="State" value={form.pickup_state} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="donate-pincode">Pincode</label>
                    <input type="text" id="donate-pincode" name="pickup_pincode" className="form-input" placeholder="Pincode" value={form.pickup_pincode} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="donate-phone">Phone</label>
                    <input type="text" id="donate-phone" name="pickup_phone" className="form-input" placeholder="Contact number" value={form.pickup_phone} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg donate-submit" disabled={loading} id="donate-submit-btn">
                {loading ? 'Submitting...' : '📦 Donate & Earn 10 Points'}
              </button>
            </form>
          </div>

          <div className="donate-sidebar">
            <div className="donate-info-card">
              <h3>How Donation Works</h3>
              <div className="donate-info-step">
                <div className="info-step-num">1</div>
                <div>
                  <strong>Fill in book details</strong>
                  <p>Tell us about the book you'd like to donate.</p>
                </div>
              </div>
              <div className="donate-info-step">
                <div className="info-step-num">2</div>
                <div>
                  <strong>Provide pickup address</strong>
                  <p>We'll come to your doorstep to collect it.</p>
                </div>
              </div>
              <div className="donate-info-step">
                <div className="info-step-num">3</div>
                <div>
                  <strong>Earn points instantly</strong>
                  <p>Get 10 points credited right away!</p>
                </div>
              </div>
              <div className="donate-info-step">
                <div className="info-step-num">4</div>
                <div>
                  <strong>Book gets picked up</strong>
                  <p>Within 3-5 business days from your address.</p>
                </div>
              </div>
            </div>

            <div className="donate-points-card">
              <h3>Your Points</h3>
              <div className="current-points">
                <span className="current-points-value">⭐ {user?.points || 0}</span>
                <span className="current-points-label">Current Balance</span>
              </div>
              <p className="current-points-hint">After donation: ⭐ {(user?.points || 0) + 10} points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
