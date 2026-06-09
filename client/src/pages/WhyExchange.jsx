import { Link } from 'react-router-dom';
import './WhyExchange.css';

export default function WhyExchange() {
  return (
    <div className="page why-page">
      {/* Hero */}
      <section className="why-hero">
        <div className="container">
          <div className="why-hero-content animate-fade-in-up">
            <h1>Why Exchange Books?</h1>
            <p className="why-hero-subtitle">
              Every year, millions of textbooks end up in landfills. Together, we can change that.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section why-impact">
        <div className="container">
          <div className="impact-grid">
            <div className="impact-card animate-fade-in-up">
              <div className="impact-icon">🌳</div>
              <h3>24 Trees</h3>
              <p>Are needed to produce 1 ton of textbooks. Reusing books saves forests.</p>
            </div>
            <div className="impact-card animate-fade-in-up delay-1">
              <div className="impact-icon">💰</div>
              <h3>₹5,000+</h3>
              <p>Average annual spending on textbooks per student. Exchange for free instead!</p>
            </div>
            <div className="impact-card animate-fade-in-up delay-2">
              <div className="impact-icon">🗑️</div>
              <h3>320 Million</h3>
              <p>Textbooks discarded every year in India alone. Let's give them a second life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reasons */}
      <section className="section why-reasons">
        <div className="container">
          <h2 className="section-title">5 Reasons to Exchange, Not Buy</h2>

          <div className="reasons-list">
            <div className="reason-item">
              <div className="reason-number">01</div>
              <div className="reason-content">
                <h3>💸 Save Money</h3>
                <p>
                  Students spend thousands on textbooks each year. When you graduate to the next class,
                  those books sit collecting dust. Exchange them and get the books you need — at zero cost.
                </p>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-number">02</div>
              <div className="reason-content">
                <h3>🌍 Save the Planet</h3>
                <p>
                  Book production consumes trees, water, and energy. By reusing books, you directly reduce
                  deforestation and carbon emissions. Every book exchanged is a small step toward a greener future.
                </p>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-number">03</div>
              <div className="reason-content">
                <h3>🤝 Build Community</h3>
                <p>
                  When you donate a book, you're helping another student who can't afford to buy one.
                  Book exchange builds a chain of generosity that benefits everyone.
                </p>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-number">04</div>
              <div className="reason-content">
                <h3>📚 Access More Books</h3>
                <p>
                  Why limit yourself? With our points system, the more you give, the more you can get.
                  Explore fiction, reference books, competitive exam guides — all through exchange.
                </p>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-number">05</div>
              <div className="reason-content">
                <h3>♻️ Reduce Waste</h3>
                <p>
                  Textbooks are updated yearly, but the knowledge remains largely the same. Instead of
                  trashing perfectly usable books, pass them on to someone who needs them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Story */}
      <section className="section why-story">
        <div className="container">
          <div className="story-card">
            <div className="story-quote">"</div>
            <p className="story-text">
              When I graduated 10th grade, I had a pile of textbooks I no longer needed. My parents
              were about to throw them away. Then I discovered Bibli Hub — I donated all 12 books,
              earned 120 points, and got the books I needed for 11th grade. Completely free!
            </p>
            <div className="story-author">
              <div className="story-avatar">🎓</div>
              <div>
                <p className="story-name">Priya S.</p>
                <p className="story-role">Class 11 Student, Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section why-cta">
        <div className="container">
          <div className="why-cta-card">
            <h2>Start Your Exchange Journey</h2>
            <p>Join thousands of students who are saving money and saving the planet.</p>
            <div className="why-cta-actions">
              <Link to="/register" className="btn btn-accent btn-lg" id="why-signup-btn">Join Bibli Hub — Free</Link>
              <Link to="/browse" className="btn btn-secondary btn-lg" id="why-browse-btn">Browse Available Books</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
