import { useState, useEffect, useRef } from 'react';
import BookCard from './BookCard';
import Cart from './Cart';
import SearchBar from './SearchBar';
import InvoiceModal from './InvoiceModal';
import Quagga from '@ericblade/quagga2';

function Billing({
  books,
  cart,
  loading,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCreateSale,
  onSearch,
  cartTotal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scanFeedback, setScanFeedback] = useState(null); // { type: 'success'|'error', message }

  // ── USB Scanner (keyboard input) ──
  const barcodeBuffer = useRef('');
  const barcodeTimer = useRef(null);

  useEffect(() => {
    const handleUSBScan = (e) => {
      // Ignore if user is typing in an input/textarea
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'Enter') {
        const isbn = barcodeBuffer.current.trim();
        barcodeBuffer.current = '';
        if (isbn.length >= 8) handleISBNScan(isbn);
      } else if (e.key.length === 1) {
        barcodeBuffer.current += e.key;
        clearTimeout(barcodeTimer.current);
        barcodeTimer.current = setTimeout(() => {
          barcodeBuffer.current = '';
        }, 100); // USB scanners type very fast — reset after 100ms gap
      }
    };

    window.addEventListener('keydown', handleUSBScan);
    return () => {
      window.removeEventListener('keydown', handleUSBScan);
      clearTimeout(barcodeTimer.current);
    };
  }, [books]);

  // ── Camera Scanner ──
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!showCamera) return;

    const timer = setTimeout(() => {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: cameraRef.current,
          constraints: { facingMode: 'environment', width: 400, height: 250 }
        },
        decoder: {
          readers: ['ean_reader', 'ean_8_reader', 'code_128_reader', 'code_39_reader']
        },
        locate: true,
      }, (err) => {
        if (err) { console.error('Quagga init error:', err); return; }
        Quagga.start();
      });

      let lastCode = '';
      let lastTime = 0;

      Quagga.onDetected((result) => {
        const code = result?.codeResult?.code;
        const now = Date.now();
        // Debounce — ignore same code within 2 seconds
        if (code && (code !== lastCode || now - lastTime > 2000)) {
          lastCode = code;
          lastTime = now;
          handleISBNScan(code);
        }
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      try { Quagga.stop(); } catch (e) {}
    };
  }, [showCamera, books]);

  // ── Handle scanned ISBN ──
  const handleISBNScan = (isbn) => {
    const book = books.find(b => b.isbn === isbn);
    if (book) {
      onAddToCart(book.id);
      setScanFeedback({ type: 'success', message: `✅ Added: ${book.title}` });
      if (showCamera) setShowCamera(false);
    } else {
      setScanFeedback({ type: 'error', message: `❌ No book found for ISBN: ${isbn}` });
    }
    setTimeout(() => setScanFeedback(null), 3000);
  };

  // ── Search debounce ──
  useEffect(() => {
    const debounce = setTimeout(() => { onSearch(searchTerm); }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // ── Ctrl+Enter to create sale ──
  const handleKeyPress = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleCreateSale(0);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [cart, customerName]);

  const handleCreateSale = async (discountPct = 0) => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const result = await onCreateSale(customerName, discountPct);
      setLastInvoice(result);
      setShowInvoiceModal(true);
      setCustomerName('');
    } catch (error) {
      console.error('Sale creation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="billing-container">
      <div className="inventory-section">
        <div className="section-header">
          <h2>📦 Available Books</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search books by title, author, or ISBN..."
            />
            {/* Camera scan button */}
            <button
              onClick={() => setShowCamera(prev => !prev)}
              title="Scan barcode with camera"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 14px',
                background: showCamera ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.08)',
                border: `1px solid ${showCamera ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.2)'}`,
                borderRadius: '8px',
                color: '#60a5fa',
                fontSize: '13px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              📷 {showCamera ? 'Stop Camera' : 'Scan ISBN'}
            </button>
          </div>
        </div>

        {/* Scan feedback toast */}
        {scanFeedback && (
          <div style={{
            margin: '0 0 12px 0',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '13px', fontWeight: '600',
            background: scanFeedback.type === 'success'
              ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${scanFeedback.type === 'success'
              ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: scanFeedback.type === 'success' ? '#4ade80' : '#f87171',
          }}>
            {scanFeedback.message}
          </div>
        )}

        {/* Camera viewfinder */}
        {showCamera && (
          <div style={{
            margin: '0 0 16px 0',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(59,130,246,0.4)',
            background: '#000',
            position: 'relative',
            maxWidth: '420px'
          }}>
            <div ref={cameraRef} style={{ width: '100%', height: '250px' }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '260px', height: '80px',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute', bottom: '10px', width: '100%',
              textAlign: 'center', color: '#94a3b8', fontSize: '12px'
            }}>
              Point camera at barcode
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading inventory...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No books found</h3>
            <p>Try adjusting your search or add new books to inventory</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onAdd={() => onAddToCart(book.id)}
                inCart={cart.some(item => item.book_id === book.id)}
                cartQuantity={cart.find(item => item.book_id === book.id)?.quantity || 0}
              />
            ))}
          </div>
        )}
      </div>

      <Cart
        cart={cart}
        books={books}
        cartTotal={cartTotal}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveFromCart={onRemoveFromCart}
        onClearCart={onClearCart}
        onCreateSale={handleCreateSale}
        isProcessing={isProcessing}
      />

      {showInvoiceModal && lastInvoice && (
        <InvoiceModal
          invoice={lastInvoice}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}

export default Billing;