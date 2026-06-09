import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import './Home.css';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalExchanges: 0, treesSaved: 0, moneySaved: 0 });
  const [countersVisible, setCountersVisible] = useState(false);

  useEffect(() => {
    usersAPI.getStats()
      .then(data => setStats(data.stats))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCountersVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge animate-fade-in-up">
              <span>🌱</span> Sustainable Book Exchange
            </div>
            <h1 className="hero-title animate-fade-in-up delay-1">
              Give a Book.<br />
              <span className="hero-title-accent">Get a Book.</span><br />
              Change a Life.
            </h1>
            <p className="hero-description animate-fade-in-up delay-2">
              Join thousands of readers who exchange books instead of buying new ones.
              Donate your old books, earn points, and claim books you need — all for free.
            </p>
            <div className="hero-actions animate-fade-in-up delay-3">
              {isAuthenticated ? (
                <>
                  <Link to="/donate" className="btn btn-primary btn-lg" id="hero-donate-btn">
                    📦 Donate a Book
                  </Link>
                  <Link to="/browse" className="btn btn-secondary btn-lg" id="hero-browse-btn">
                    Browse Books
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg" id="hero-signup-btn">
                    Get Started — It's Free
                  </Link>
                  <Link to="/why-exchange" className="btn btn-secondary btn-lg" id="hero-learn-btn">
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual animate-fade-in-up delay-2">
            <div className="hero-book-stack">
              <div className="hero-book book-1">📗</div>
              <div className="hero-book book-2">📕</div>
              <div className="hero-book book-3">📘</div>
              <div className="hero-book book-4">📙</div>
              <div className="hero-floating-badge">
                <span>⭐</span> +10 pts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to start exchanging books</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📦</div>
              <h3>Donate Your Books</h3>
              <p>List books you no longer need. We'll pick them up from your doorstep in 3-5 business days.</p>
            </div>
            <div className="step-connector">
              <svg viewBox="0 0 60 20"><path d="M0,10 L50,10 M45,5 L50,10 L45,15" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">⭐</div>
              <h3>Earn Points</h3>
              <p>Get 10 points for every book you donate. Points are credited instantly to your account.</p>
            </div>
            <div className="step-connector">
              <svg viewBox="0 0 60 20"><path d="M0,10 L50,10 M45,5 L50,10 L45,15" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">📚</div>
              <h3>Claim Books</h3>
              <p>Browse available books and use your points to claim any book you want. It's that simple!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section" id="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{countersVisible ? stats.totalExchanges : 0}+</div>
              <div className="stat-label">Books Exchanged</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{countersVisible ? stats.totalUsers : 0}+</div>
              <div className="stat-label">Happy Readers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{countersVisible ? stats.treesSaved : 0}</div>
              <div className="stat-label">Trees Saved 🌳</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">₹{countersVisible ? stats.moneySaved?.toLocaleString() : 0}</div>
              <div className="stat-label">Money Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Find books across all subjects and genres</p>
          <div className="categories-grid">
            {[
              { icon: '📖', label: 'Textbooks', cat: 'textbook' },
              { icon: '📚', label: 'Fiction', cat: 'fiction' },
              { icon: '📘', label: 'Non-Fiction', cat: 'non_fiction' },
              { icon: '🎯', label: 'Exam Prep', cat: 'competitive' },
              { icon: '🔍', label: 'Reference', cat: 'reference' },
              { icon: '🧒', label: "Children's", cat: 'children' },
              { icon: '💥', label: 'Comics', cat: 'comics' },
              { icon: '📦', label: 'Other', cat: 'other' },
            ].map(({ icon, label, cat }) => (
              <Link to={`/browse?category=${cat}`} className="category-card" key={cat} id={`cat-${cat}`}>
                <span className="category-icon">{icon}</span>
                <span className="category-label">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to make a difference?</h2>
            <p>Join Bibli Hub today and be part of the book exchange revolution. Every book shared is a step towards a greener planet.</p>
            <div className="cta-actions">
              {isAuthenticated ? (
                <Link to="/donate" className="btn btn-accent btn-lg" id="cta-donate-btn">Start Donating Today</Link>
              ) : (
                <Link to="/register" className="btn btn-accent btn-lg" id="cta-signup-btn">Join for Free</Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
