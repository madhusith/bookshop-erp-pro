import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Billing from './components/Billing';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import Toast from './components/Toast';
import InvoiceViewer from "./components/InvoiceViewer";
import SalesHistory from "./components/SalesHistory";
import Login from "./components/Login";
import Users from "./components/Users";
import Returns from './components/Returns';
import Settings from './components/Settings';
import './styles/App.css';

function App() {
  const [currentView, setCurrentView] = useState('billing');
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bookshop_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    loadBooks();
    loadDashboardData();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('bookshop_user', JSON.stringify(userData));
    if (userData.role === 'cashier') {
      setCurrentView('billing');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setCurrentView('billing');
    localStorage.removeItem('bookshop_user');
  };

  const loadBooks = async (search = '') => {
    try {
      setLoading(true);
      const url = search
        ? `http://localhost:5050/api/books?search=${encodeURIComponent(search)}`
        : `http://localhost:5050/api/books`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Server error while searching books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Search error:", error);
      showToast("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/dashboard/summary');
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) { showToast('Book not found', 'error'); return; }
    if (book.quantity === 0) { showToast('Out of stock', 'error'); return; }
    setCart(prev => {
      const existingItem = prev.find(i => i.book_id === bookId);
      if (existingItem) {
        if (existingItem.quantity >= book.quantity) {
          showToast('Cannot exceed available stock', 'error');
          return prev;
        }
        showToast(`Added another ${book.title}`, 'success');
        return prev.map(i => i.book_id === bookId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      showToast(`Added ${book.title} to cart`, 'success');
      return [...prev, { book_id: bookId, quantity: 1 }];
    });
  };

  const updateQuantity = (bookId, change) => {
    const book = books.find(b => b.id === bookId);
    const cartItem = cart.find(i => i.book_id === bookId);
    if (change > 0 && cartItem.quantity >= book.quantity) {
      showToast('Cannot exceed available stock', 'error');
      return;
    }
    setCart(prev =>
      prev.map(item => item.book_id === bookId ? { ...item, quantity: item.quantity + change } : item)
          .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (bookId) => {
    setCart(prev => prev.filter(item => item.book_id !== bookId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    showToast('Cart cleared', 'info');
  };

  // ── CREATE SALE with discount ──
  const createSale = async (customerName = '', discountPct = 0) => {
    if (cart.length === 0) { showToast('Cart is empty', 'error'); return; }
    try {
      const res = await fetch('http://localhost:5050/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          items: cart,
          customer_name: customerName || 'Walk-in Customer',
          discount_pct: discountPct   // ← discount added here
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create sale');
      showToast(`✅ Invoice ${data.invoice} created successfully!`, 'success');
      window.open(`http://localhost:5050/api/invoice/${data.invoice}`, "_blank");
      setInvoiceNumber(data.invoice);
      setCurrentView("invoice");
      setCart([]);
      loadBooks();
      loadDashboardData();
      return data;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const addBook = async (bookData) => {
    try {
      const res = await fetch('http://localhost:5050/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add book');
      showToast('Book added successfully', 'success');
      loadBooks();
      return data;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const updateBook = async (bookId, bookData) => {
    try {
      const res = await fetch(`http://localhost:5050/api/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update book');
      showToast('Book updated successfully', 'success');
      loadBooks();
      return data;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:5050/api/books/${bookId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete book');
      showToast('Book deleted successfully', 'success');
      loadBooks();
      return data;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const book = books.find(b => b.id === item.book_id);
    return sum + (book?.sell_price || 0) * item.quantity;
  }, 0);

  // ── Show login if not authenticated ──
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // ── Role-based view guard ──
  const allowedViews = {
    admin:   ['dashboard', 'billing', 'inventory', 'sales', 'reports', 'users', 'returns', 'invoice','settings'],
    manager: ['dashboard', 'billing', 'inventory', 'sales', 'reports', 'returns', 'invoice'],
    cashier: ['billing', 'sales', 'returns', 'invoice'],
  };

  const safeView = allowedViews[user.role]?.includes(currentView)
    ? currentView
    : allowedViews[user.role]?.[0] ?? 'billing';

  const renderView = () => {
    switch (safeView) {
      case 'dashboard':
        return <Dashboard data={dashboardData} loading={loading} onViewChange={setCurrentView} />;
      case 'billing':
        return (
          <Billing
            books={books}
            cart={cart}
            loading={loading}
            onAddToCart={addToCart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
            onCreateSale={createSale}
            onSearch={loadBooks}
            cartTotal={cartTotal}
          />
        );
      case 'inventory':
        return (
          <Inventory
            books={books}
            loading={loading}
            onSearch={loadBooks}
            onAddBook={addBook}
            onUpdateBook={updateBook}
            onDeleteBook={deleteBook}
          />
        );
      case 'reports':
        return <Reports />;
      case 'users':
        return <Users currentUser={user} />;
      case 'returns':
        return <Returns />;
      case 'settings':
        return <Settings />;
      case 'invoice':
        return <InvoiceViewer invoiceNumber={invoiceNumber} />;
      case 'sales':
        return (
          <SalesHistory
            onOpenInvoice={(invoice) => {
              setInvoiceNumber(invoice);
              setCurrentView("invoice");
            }}
          />
        );
      default:
        return <Billing />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        currentView={safeView}
        onViewChange={setCurrentView}
        userRole={user.role}
        user={user}
        onLogout={handleLogout}
      />
      <div className="main-container">
        <Topbar
          currentView={safeView}
          cartTotal={cartTotal}
          cartItems={cart.length}
          user={user}
          onLogout={handleLogout}
          onViewChange={setCurrentView}
        />
        <div className="content">
          {renderView()}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;