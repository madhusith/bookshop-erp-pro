import React, { useState, useEffect, useRef } from 'react';

const viewTitles = {
  dashboard: 'Dashboard Overview',
  billing: 'Point of Sale',
  inventory: 'Inventory Management',
  reports: 'Analytics & Reports',
  sales: 'Sales History',
  users: 'Staff Management',
  returns: 'Returns & Refunds',
  invoice: 'Invoice Viewer',
  settings: 'Settings',
};

function Topbar({ currentView, cartTotal, cartItems, user, onLogout, onViewChange }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [lowStockBooks, setLowStockBooks] = useState([]);
  const notifRef = useRef(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Load low stock books
  useEffect(() => {
    loadLowStock();
  }, []);

  const loadLowStock = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/books');
      const data = await res.json();
      const low = data.filter(b => b.quantity < 10);
      setLowStockBooks(low);
    } catch (err) {
      console.error('Failed to load low stock:', err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBackup = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/backup');
      if (!res.ok) throw new Error('Backup failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookshop-backup-${new Date().toISOString().slice(0, 10)}.sql`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Backup failed: ' + err.message);
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>{viewTitles[currentView] || 'Bookshop ERP'}</h1>
        <div className="topbar-subtitle">{currentDate}</div>
      </div>

      <div className="topbar-right">
        {currentView === 'billing' && (
          <div className="cart-summary">
            <div className="cart-badge">
              <span className="cart-icon">🛒</span>
              {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
            </div>
            <div className="cart-total">
              <div className="cart-total-label">Total</div>
              <div className="cart-total-amount">Rs. {cartTotal.toFixed(2)}</div>
            </div>
          </div>
        )}

        <div className="topbar-actions">

          {/* Backup — admin only */}
          {user?.role === 'admin' && (
            <button className="topbar-btn backup-btn" onClick={handleBackup} title="Backup Database">
              BU
            </button>
          )}

          {/* Settings — admin only */}
          {user?.role === 'admin' && (
            <button className="topbar-btn" onClick={() => onViewChange('settings')} title="Settings">
              <span>⚙️</span>
            </button>
          )}

          {/* Notification Bell */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="topbar-btn"
              onClick={() => { setShowNotifications(prev => !prev); loadLowStock(); }}
              title="Notifications"
              style={{ position: 'relative' }}
            >
              <span>🔔</span>
              {lowStockBooks.length > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#ef4444', color: 'white',
                  fontSize: '10px', fontWeight: '700',
                  width: '16px', height: '16px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #0f1117'
                }}>
                  {lowStockBooks.length}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div style={{
                position: 'absolute', top: '44px', right: '0',
                width: '300px',
                background: '#1c2233',
                border: '1px solid #2a3147',
                borderRadius: '12px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                zIndex: 1000,
                overflow: 'hidden',
                animation: 'slideDown 0.2s ease'
              }}>

                {/* Header */}
                <div style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #2a3147',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9' }}>
                    🔔 Notifications
                  </span>
                  {lowStockBooks.length > 0 && (
                    <span style={{
                      fontSize: '11px', fontWeight: '600',
                      background: 'rgba(239,68,68,0.12)',
                      color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.2)',
                      padding: '2px 8px', borderRadius: '20px'
                    }}>
                      {lowStockBooks.length} alerts
                    </span>
                  )}
                </div>

                {/* Notification list */}
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {lowStockBooks.length === 0 ? (
                    <div style={{
                      padding: '32px 16px', textAlign: 'center',
                      color: '#64748b', fontSize: '13px'
                    }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
                      All books are well stocked!
                    </div>
                  ) : (
                    <>
                      <div style={{
                        padding: '10px 16px',
                        fontSize: '11px', fontWeight: '600',
                        color: '#64748b', letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #1e2538'
                      }}>
                        ⚠️ Low Stock Alert
                      </div>
                      {lowStockBooks.map(book => (
                        <div
                          key={book.id}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #1e2538',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer', transition: 'background 0.15s'
                          }}
                          onClick={() => { onViewChange('inventory'); setShowNotifications(false); }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: '13px', fontWeight: '600',
                              color: '#f1f5f9', marginBottom: '2px',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                              📚 {book.title}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              {book.author}
                            </div>
                          </div>
                          <span style={{
                            flexShrink: 0, marginLeft: '12px',
                            padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                            background: book.quantity === 0
                              ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                            color: book.quantity === 0 ? '#f87171' : '#fbbf24',
                            border: `1px solid ${book.quantity === 0
                              ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`
                          }}>
                            {book.quantity === 0 ? 'Out' : `${book.quantity} left`}
                          </span>
                        </div>
                      ))}

                      {/* Footer */}
                      <div
                        style={{
                          padding: '12px 16px', textAlign: 'center',
                          fontSize: '12px', fontWeight: '600', color: '#3b82f6',
                          cursor: 'pointer', borderTop: '1px solid #2a3147',
                          transition: 'background 0.15s'
                        }}
                        onClick={() => { onViewChange('inventory'); setShowNotifications(false); }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        View Inventory →
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Topbar;