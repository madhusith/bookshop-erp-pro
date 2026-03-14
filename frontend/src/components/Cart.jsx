import React, { useState } from 'react';
import CartItem from './CartItem';

function Cart({
  cart,
  books,
  cartTotal,
  customerName,
  onCustomerNameChange,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCreateSale,
  isProcessing
}) {
  const [discountPct, setDiscountPct] = useState(0);
  const isEmpty = cart.length === 0;

  const discountAmount = (cartTotal * Math.min(Math.max(discountPct, 0), 100)) / 100;
  const finalTotal = cartTotal - discountAmount;

  return (
    <div className="cart-panel">
      <div className="cart-header">
        <h2>🛒 Current Bill</h2>
        {!isEmpty && (
          <button className="clear-cart-btn" onClick={onClearCart}>
            Clear All
          </button>
        )}
      </div>

      <div className="customer-input">
        <input
          type="text"
          placeholder="Customer Name (Optional)"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          className="customer-name-input"
        />
      </div>

      <div className="cart-items">
        {isEmpty ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Cart is Empty</h3>
            <p>Add books to create an invoice</p>
          </div>
        ) : (
          <>
            {cart.map(item => {
              const book = books.find(b => b.id === item.book_id);
              return book ? (
                <CartItem
                  key={item.book_id}
                  item={item}
                  book={book}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveFromCart}
                />
              ) : null;
            })}
          </>
        )}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>Rs. {cartTotal.toFixed(2)}</span>
        </div>

        {/* Discount Row */}
        <div className="summary-row discount-row">
          <span>Discount</span>
          <div className="discount-input-wrap">
            <input
              type="number"
              min="0"
              max="100"
              value={discountPct === 0 ? '' : discountPct}
              placeholder="0"
              onChange={e => {
                const val = parseFloat(e.target.value);
                setDiscountPct(isNaN(val) ? 0 : Math.min(100, Math.max(0, val)));
              }}
              className="discount-input"
            />
            <span className="discount-pct-symbol">%</span>
          </div>
        </div>

        {discountPct > 0 && (
          <div className="summary-row discount-amount-row">
            <span style={{ color: '#22c55e', fontSize: '13px' }}>You save</span>
            <span style={{ color: '#22c55e', fontWeight: 600 }}>- Rs. {discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="summary-row">
          <span>Tax (0%)</span>
          <span>Rs. 0.00</span>
        </div>

        <div className="summary-row total-row">
          <span>Total</span>
          <span className="total-amount">Rs. {finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="cart-actions">
        <button
          className={`create-invoice-btn ${isEmpty ? 'disabled' : ''}`}
          onClick={() => onCreateSale(discountPct)}
          disabled={isEmpty || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="btn-spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span>🧾</span>
              Create Invoice
            </>
          )}
        </button>
        <div className="keyboard-hint">
          Press Ctrl+Enter to create invoice
        </div>
      </div>
    </div>
  );
}

export default Cart;