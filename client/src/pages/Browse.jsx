import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import './Browse.css';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [claimModal, setClaimModal] = useState(null);
  const [claimAddress, setClaimAddress] = useState({ delivery_address: '', delivery_city: '', delivery_state: '', delivery_pincode: '', delivery_phone: '' });
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    booksAPI.getCategories().then(data => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory, selectedCondition, searchParams.get('page')]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = { page: searchParams.get('page') || 1, limit: 12 };
      if (selectedCategory) params.category = selectedCategory;
      if (selectedCondition) params.condition = selectedCondition;
      if (search) params.search = search;
      const data = await booksAPI.browse(params);
      setBooks(data.books);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat === selectedCategory ? '' : cat);
    setSearchParams(prev => {
      if (cat === selectedCategory) prev.delete('category');
      else prev.set('category', cat);
      prev.delete('page');
      return prev;
    });
  };

  const openClaimModal = (book) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setClaimModal(book);
    setClaimError('');
    setClaimSuccess('');
    if (user) {
      setClaimAddress({
        delivery_address: user.address_line1 || '',
        delivery_city: user.city || '',
        delivery_state: user.state || '',
        delivery_pincode: user.pincode || '',
        delivery_phone: user.phone || '',
      });
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!claimAddress.delivery_address) return setClaimError('Address is required.');
    setClaimLoading(true);
    setClaimError('');
    try {
      const data = await booksAPI.claim(claimModal.id, claimAddress);
      setClaimSuccess(data.message);
      updateUser({ ...user, points: data.newPoints });
      setBooks(prev => prev.filter(b => b.id !== claimModal.id));
      // Removed auto-close timeout so user can read the message
    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="page browse-page">
      <div className="container">
        <div className="page-header">
          <h1>Browse Books</h1>
          <p>Find your next read from our collection of donated books</p>
        </div>

        {/* Search & Filters */}
        <div className="browse-toolbar">
          <form className="browse-search" onSubmit={handleSearch} id="browse-search-form">
            <input
              type="text"
              className="form-input"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="browse-search-input"
            />
            <button type="submit" className="btn btn-primary" id="browse-search-btn">🔍 Search</button>
          </form>

          <div className="browse-filters">
            <select className="form-select" value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)} id="filter-condition">
              <option value="">All Conditions</option>
              <option value="new">New</option>
              <option value="like_new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="browse-categories">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
              id={`filter-cat-${cat.id}`}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-page" style={{ minHeight: '40vh' }}>
            <div className="spinner"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No Books Found</h3>
            <p>Try adjusting your search or filters, or check back later for new donations.</p>
          </div>
        ) : (
          <>
            <p className="browse-results-count">{pagination.total} book{pagination.total !== 1 ? 's' : ''} found</p>
            <div className="books-grid">
              {books.map(book => (
                <BookCard key={book.id} book={book} onClaim={openClaimModal} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="browse-pagination">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                    onClick={() => setSearchParams(prev => { prev.set('page', i + 1); return prev; })}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Claim Modal */}
      {claimModal && (
        <div className="modal-overlay" onClick={() => !claimLoading && setClaimModal(null)}>
          <div className="modal animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Claim Book</h2>
              <button className="modal-close" onClick={() => !claimLoading && setClaimModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              {claimSuccess ? (
                <div className="auth-success animate-scale-in">
                  <div className="auth-success-icon">🎉</div>
                  <h2>Book Claimed!</h2>
                  <p>{claimSuccess}</p>
                  <button className="btn btn-primary" onClick={() => { setClaimModal(null); setClaimSuccess(''); }} style={{ marginTop: '20px', width: '100%' }}>Okay</button>
                </div>
              ) : (
                <>
                  <div className="claim-book-info">
                    <h3>{claimModal.title}</h3>
                    <p>by {claimModal.author}</p>
                    <div className="claim-points-info">
                      <span>Cost: <strong>⭐ {claimModal.points_value} points</strong></span>
                      <span>Your balance: <strong>⭐ {user?.points || 0} points</strong></span>
                    </div>
                  </div>

                  {claimError && <div className="alert alert-error"><span>⚠️</span> {claimError}</div>}

                  <form onSubmit={handleClaim} className="claim-form">
                    <div className="form-group">
                      <label className="form-label">Delivery Address *</label>
                      <input className="form-input" placeholder="Full address" value={claimAddress.delivery_address} onChange={e => setClaimAddress(p => ({ ...p, delivery_address: e.target.value }))} required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input className="form-input" placeholder="City" value={claimAddress.delivery_city} onChange={e => setClaimAddress(p => ({ ...p, delivery_city: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input className="form-input" placeholder="State" value={claimAddress.delivery_state} onChange={e => setClaimAddress(p => ({ ...p, delivery_state: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Pincode</label>
                        <input className="form-input" placeholder="Pincode" value={claimAddress.delivery_pincode} onChange={e => setClaimAddress(p => ({ ...p, delivery_pincode: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input className="form-input" placeholder="Phone number" value={claimAddress.delivery_phone} onChange={e => setClaimAddress(p => ({ ...p, delivery_phone: e.target.value }))} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={claimLoading}>
                      {claimLoading ? 'Processing...' : `Claim for ⭐ ${claimModal.points_value} points`}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
