import React from 'react';

function BookCard({ book, onAdd, inCart, cartQuantity }) {
  const stockStatus = () => {
    if (book.quantity === 0) return 'out-of-stock';
    if (book.quantity < 10) return 'low-stock';
    return 'in-stock';
  };

  const stockLabel = () => {
    if (book.quantity === 0) return 'Out of Stock';
    if (book.quantity < 10) return `Low Stock (${book.quantity})`;
    return `${book.quantity} available`;
  };

  const isDisabled = book.quantity === 0 || cartQuantity >= book.quantity;

  return (
    <div className={`book-card ${stockStatus()}`}>
      <div className="book-card-header">
        <div className="book-icon">📖</div>
        {inCart && <div className="in-cart-badge">✓ In Cart</div>}
      </div>

      <div className="book-details">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author || 'Unknown Author'}</p>
        {book.isbn && <p className="book-isbn">ISBN: {book.isbn}</p>}
      </div>

      <div className="book-footer">
        <div className="book-pricing">
          <div className="book-price">Rs. {book.sell_price}</div>
          <div className={`stock-badge ${stockStatus()}`}>
            {stockLabel()}
          </div>
        </div>

        <button
          className="add-to-cart-btn"
          onClick={onAdd}
          disabled={isDisabled}
        >
          {cartQuantity >= book.quantity ? '🔒 Max' : inCart ? '➕ Add More' : '➕ Add'}
        </button>
      </div>

      {cartQuantity > 0 && (
        <div className="cart-quantity-indicator">
          {cartQuantity} in cart
        </div>
      )}
    </div>
  );
}

export default BookCard;
