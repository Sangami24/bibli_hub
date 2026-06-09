import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,40 C360,100 720,0 1080,60 C1260,80 1440,40 1440,40 L1440,100 L0,100 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span>📚</span>
                <span className="footer-logo-text">Bibli Hub</span>
              </div>
              <p className="footer-tagline">
                Give a book. Get a book.<br />Change a life.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
                <a href="#" className="social-link" aria-label="Instagram">📷</a>
                <a href="#" className="social-link" aria-label="Facebook">📘</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/browse">Browse Books</Link>
              <Link to="/donate">Donate a Book</Link>
              <Link to="/why-exchange">Why Exchange?</Link>
            </div>

            <div className="footer-section">
              <h4>Account</h4>
              <Link to="/profile">My Profile</Link>
              <Link to="/my-donations">My Donations</Link>
              <Link to="/my-orders">My Orders</Link>
            </div>

            <div className="footer-section">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Bibli Hub. Promoting book reuse, one exchange at a time. 🌱</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
