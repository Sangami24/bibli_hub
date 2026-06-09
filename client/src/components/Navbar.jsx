import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">📚</span>
          <span className="navbar-title">Bibli Hub</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/why-exchange" className={`nav-link ${location.pathname === '/why-exchange' ? 'active' : ''}`}>Why Exchange?</Link>
          <Link to="/browse" className={`nav-link ${location.pathname === '/browse' ? 'active' : ''}`}>Browse Books</Link>
          {isAuthenticated && (
            <Link to="/donate" className={`nav-link ${location.pathname === '/donate' ? 'active' : ''}`}>Donate a Book</Link>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/donate" className="btn btn-accent btn-sm navbar-donate-btn">
                <span>+</span> Donate
              </Link>
              <div className="navbar-points" title="Your points">
                <span className="points-icon">⭐</span>
                <span className="points-value">{user?.points || 0}</span>
              </div>
              <div className="navbar-profile" ref={profileRef}>
                <button
                  className="profile-trigger"
                  onClick={() => setProfileOpen(!profileOpen)}
                  id="profile-menu-trigger"
                >
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="profile-avatar" />
                  ) : (
                    <div className="profile-avatar-placeholder">{getInitials(user?.name)}</div>
                  )}
                </button>

                {profileOpen && (
                  <div className="profile-dropdown animate-scale-in">
                    <div className="profile-dropdown-header">
                      <p className="profile-dropdown-name">{user?.name}</p>
                      <p className="profile-dropdown-email">{user?.email}</p>
                      <div className="profile-dropdown-points">
                        <span>⭐</span> {user?.points || 0} points
                      </div>
                    </div>
                    <div className="profile-dropdown-divider"></div>
                    <Link to="/profile" className="profile-dropdown-item" id="nav-profile-link">
                      <span>👤</span> My Profile
                    </Link>
                    <Link to="/my-donations" className="profile-dropdown-item" id="nav-donations-link">
                      <span>📦</span> My Donations
                    </Link>
                    <Link to="/my-orders" className="profile-dropdown-item" id="nav-orders-link">
                      <span>🛒</span> My Orders
                    </Link>
                    <div className="profile-dropdown-divider"></div>
                    <button onClick={handleLogout} className="profile-dropdown-item profile-dropdown-logout" id="nav-logout-btn">
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="navbar-auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login-btn">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">Sign Up</Link>
            </div>
          )}

          <button
            className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="navbar-hamburger"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
