import { useState, useEffect, useRef } from 'react';
import SearchBar from './SearchBar';
import Quagga from '@ericblade/quagga2';

function Inventory({ books, loading, onSearch, onAddBook, onUpdateBook, onDeleteBook }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showISBNCamera, setShowISBNCamera] = useState(false);
  const [scanFeedback, setScanFeedback] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '',
    buy_price: '', sell_price: '', quantity: ''
  });

  const cameraRef = useRef(null);
  const barcodeBuffer = useRef('');
  const barcodeTimer = useRef(null);

  // ── USB Scanner — fills ISBN field when modal is open ──
  useEffect(() => {
    if (!showAddModal) return;

    const handleUSBScan = (e) => {
      const tag = document.activeElement?.name;
      // Only intercept if user is NOT already typing in isbn field manually
      if (tag === 'isbn') return;

      if (e.key === 'Enter') {
        const isbn = barcodeBuffer.current.trim();
        barcodeBuffer.current = '';
        if (isbn.length >= 8) {
          setFormData(prev => ({ ...prev, isbn }));
          setScanFeedback({ type: 'success', message: `✅ ISBN scanned: ${isbn}` });
          setTimeout(() => setScanFeedback(null), 3000);
        }
      } else if (e.key.length === 1) {
        barcodeBuffer.current += e.key;
        clearTimeout(barcodeTimer.current);
        barcodeTimer.current = setTimeout(() => {
          barcodeBuffer.current = '';
        }, 100);
      }
    };

    window.addEventListener('keydown', handleUSBScan);
    return () => {
      window.removeEventListener('keydown', handleUSBScan);
      clearTimeout(barcodeTimer.current);
    };
  }, [showAddModal]);

  // ── Camera Scanner ──
  useEffect(() => {
    if (!showISBNCamera) return;

    const timer = setTimeout(() => {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: cameraRef.current,
          constraints: { facingMode: 'environment', width: 400, height: 220 }
        },
        decoder: {
          readers: ['ean_reader', 'ean_8_reader', 'code_128_reader', 'code_39_reader']
        },
        locate: true,
      }, (err) => {
        if (err) { console.error('Camera error:', err); return; }
        Quagga.start();
      });

      let lastCode = '';
      let lastTime = 0;

      Quagga.onDetected((result) => {
        const code = result?.codeResult?.code;
        const now = Date.now();
        if (code && (code !== lastCode || now - lastTime > 2000)) {
          lastCode = code;
          lastTime = now;
          setFormData(prev => ({ ...prev, isbn: code }));
          setScanFeedback({ type: 'success', message: `✅ ISBN scanned: ${code}` });
          setTimeout(() => setScanFeedback(null), 3000);
          setShowISBNCamera(false);
        }
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      try { Quagga.stop(); } catch (e) {}
    };
  }, [showISBNCamera]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    onSearch(term);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await onUpdateBook(editingBook.id, formData);
      } else {
        await onAddBook(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title, author: book.author || '',
      isbn: book.isbn || '', buy_price: book.buy_price,
      sell_price: book.sell_price, quantity: book.quantity
    });
    setShowAddModal(true);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await onDeleteBook(bookId);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', isbn: '', buy_price: '', sell_price: '', quantity: '' });
    setEditingBook(null);
    setShowAddModal(false);
    setShowISBNCamera(false);
    setScanFeedback(null);
  };

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div className="header-left">
          <h2>📦 Inventory Management</h2>
          <p className="subtitle">{books.length} books in stock</p>
        </div>
        <button className="add-book-btn" onClick={() => setShowAddModal(true)}>
          <span>➕</span> Add New Book
        </button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by title, author, or ISBN..."
      />

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading inventory...</p>
        </div>
      ) : (
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Buy Price</th>
                <th>Sell Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td className="book-title-cell">{book.title}</td>
                  <td>{book.author || 'N/A'}</td>
                  <td className="isbn-cell">{book.isbn || 'N/A'}</td>
                  <td>Rs. {book.buy_price}</td>
                  <td>Rs. {book.sell_price}</td>
                  <td className="quantity-cell">{book.quantity}</td>
                  <td>
                    <span className={`status-badge ${
                      book.quantity === 0 ? 'out-of-stock' :
                      book.quantity < 10 ? 'low-stock' : 'in-stock'
                    }`}>
                      {book.quantity === 0 ? 'Out of Stock' :
                       book.quantity < 10 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="edit-btn" onClick={() => handleEdit(book)} title="Edit">✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(book.id)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      {showAddModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px', width: '100%' }}>
            <div className="modal-header">
              <h2>{editingBook ? '✏️ Edit Book' : '➕ Add New Book'}</h2>
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>

            {/* Scan feedback */}
            {scanFeedback && (
              <div style={{
                margin: '0 0 14px 0', padding: '10px 14px',
                borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                background: scanFeedback.type === 'success'
                  ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${scanFeedback.type === 'success'
                  ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                color: scanFeedback.type === 'success' ? '#4ade80' : '#f87171',
              }}>
                {scanFeedback.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="book-form">
              <div className="form-group">
                <label>Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Author *</label>
                <input type="text" name="author" value={formData.author} onChange={handleInputChange} required />
              </div>

              {/* ISBN with scan buttons */}
              <div className="form-group">
                <label>ISBN</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    placeholder="Type, scan USB, or use camera"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowISBNCamera(prev => !prev)}
                    title="Scan ISBN with camera"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '9px 12px', flexShrink: 0,
                      background: showISBNCamera
                        ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.08)',
                      border: `1px solid ${showISBNCamera
                        ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.2)'}`,
                      borderRadius: '8px', color: '#60a5fa',
                      fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.2s', whiteSpace: 'nowrap'
                    }}
                  >
                    📷 {showISBNCamera ? 'Stop' : 'Scan'}
                  </button>
                </div>

                {/* Camera viewfinder */}
                {showISBNCamera && (
                  <div style={{
                    marginTop: '10px', borderRadius: '10px',
                    overflow: 'hidden', border: '2px solid rgba(59,130,246,0.4)',
                    background: '#000', position: 'relative'
                  }}>
                    <div ref={cameraRef} style={{ width: '100%', height: '220px' }} />
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '240px', height: '70px',
                      border: '2px solid #3b82f6', borderRadius: '6px',
                      boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
                      pointerEvents: 'none'
                    }} />
                    <div style={{
                      position: 'absolute', bottom: '8px', width: '100%',
                      textAlign: 'center', color: '#94a3b8', fontSize: '12px'
                    }}>
                      Point camera at barcode
                    </div>
                  </div>
                )}

                <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#64748b' }}>
                  💡 USB scanner: just scan while this modal is open
                </p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Buy Price *</label>
                  <input type="number" name="buy_price" value={formData.buy_price} onChange={handleInputChange} step="0.01" required />
                </div>
                <div className="form-group">
                  <label>Sell Price *</label>
                  <input type="number" name="sell_price" value={formData.sell_price} onChange={handleInputChange} step="0.01" required />
                </div>
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;