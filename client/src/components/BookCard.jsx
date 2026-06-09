import { Link } from 'react-router-dom';
import { useState } from 'react';
import './BookCard.css';

const conditionLabels = {
  new: { label: 'New', color: 'success' },
  like_new: { label: 'Like New', color: 'info' },
  good: { label: 'Good', color: 'primary' },
  fair: { label: 'Fair', color: 'warning' },
};

const categoryIcons = {
  textbook: '📖',
  fiction: '📚',
  non_fiction: '📘',
  competitive: '🎯',
  reference: '🔍',
  children: '🧒',
  comics: '💥',
  other: '📦',
};

export default function BookCard({ book, onClaim }) {
  const cond = conditionLabels[book.condition] || { label: book.condition, color: 'primary' };
  const icon = categoryIcons[book.category] || '📦';
  const [imgError, setImgError] = useState(false);

  return (
    <div className="book-card" id={`book-card-${book.id}`}>
      <div className="book-card-cover">
        {book.cover_image && !imgError ? (
          <img src={book.cover_image} alt={book.title} onError={() => setImgError(true)} />
        ) : (
          <div className="book-card-cover-placeholder">
            <span className="cover-icon">{icon}</span>
            <span className="cover-category">{book.category}</span>
          </div>
        )}
        <div className="book-card-badge-wrap">
          <span className={`badge badge-${cond.color}`}>{cond.label}</span>
        </div>
      </div>
      <div className="book-card-body">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">by {book.author}</p>
        {book.grade && <p className="book-card-grade">Grade {book.grade}</p>}
        <div className="book-card-footer">
          <div className="book-card-points">
            <span className="points-star">⭐</span>
            <span>{book.points_value} pts</span>
          </div>
          {onClaim ? (
            <button className="btn btn-primary btn-sm" onClick={() => onClaim(book)} id={`claim-btn-${book.id}`}>
              Claim
            </button>
          ) : (
            <Link to={`/browse?book=${book.id}`} className="btn btn-secondary btn-sm">
              View
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
