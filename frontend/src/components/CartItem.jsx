import React from 'react';

function CartItem({ item, book, onUpdateQuantity, onRemove }) {
  const subtotal = book.sell_price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <div className="cart-item-title">{book.title}</div>
        <div className="cart-item-author">{book.author}</div>
        <div className="cart-item-price">Rs. {book.sell_price} × {item.quantity}</div>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button
            className="qty-btn"
            onClick={() => onUpdateQuantity(item.book_id, -1)}
          >
            −
          </button>
          <span className="quantity-display">{item.quantity}</span>
          <button
            className="qty-btn"
            onClick={() => onUpdateQuantity(item.book_id, 1)}
            disabled={item.quantity >= book.quantity}
          >
            +
          </button>
        </div>

        <div className="cart-item-subtotal">
          Rs. {subtotal.toFixed(2)}
        </div>

        <button
          className="remove-btn"
          onClick={() => onRemove(item.book_id)}
          title="Remove from cart"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default CartItem;
