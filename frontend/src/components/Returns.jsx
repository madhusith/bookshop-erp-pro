import { useEffect, useState } from "react";

const styles = `
  .returns-page {
    padding: 28px 32px;
    font-family: 'Inter', sans-serif;
    color: #f1f5f9;
    min-height: 100vh;
    background: #0f1117;
  }

  .returns-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .returns-header-left h1 {
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.3px;
    margin: 0 0 4px 0;
  }

  .returns-header-left p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  .tabs {
    display: flex;
    gap: 4px;
    background: #1c2233;
    border: 1px solid #2a3147;
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 28px;
    width: fit-content;
  }

  .tab {
    padding: 9px 20px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: transparent;
    color: #64748b;
    font-family: inherit;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .tab.active {
    background: #3b82f6;
    color: white;
    box-shadow: 0 2px 8px rgba(59,130,246,0.3);
  }

  .tab:not(.active):hover { color: #f1f5f9; background: #111827; }

  .search-card {
    background: #1c2233;
    border: 1px solid #2a3147;
    border-radius: 14px;
    padding: 28px;
    margin-bottom: 20px;
  }

  .search-card h2 {
    font-size: 16px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 6px;
  }

  .search-card p {
    font-size: 13px;
    color: #64748b;
    margin: 0 0 20px;
  }

  .invoice-search-row {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .invoice-input-wrap {
    position: relative;
    flex: 1;
    max-width: 400px;
  }

  .invoice-input-wrap input {
    width: 100%;
    background: #111827;
    border: 1px solid #2a3147;
    border-radius: 8px;
    padding: 11px 14px 11px 40px;
    color: #f1f5f9;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .invoice-input-wrap input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  .invoice-input-wrap input::placeholder {
    color: #4b5680;
    text-transform: none;
    letter-spacing: 0;
  }

  .invoice-input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #4b5680;
    pointer-events: none;
  }

  .search-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    background: #3b82f6;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 12px rgba(59,130,246,0.25);
    white-space: nowrap;
  }

  .search-btn:hover { background: #2563eb; }
  .search-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .msg-error {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px;
    color: #fca5a5;
    font-size: 13px;
    font-weight: 500;
    margin-top: 16px;
  }

  .invoice-result {
    background: #1c2233;
    border: 1px solid #2a3147;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .invoice-result-header {
    padding: 18px 24px;
    background: #161b27;
    border-bottom: 1px solid #2a3147;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .invoice-result-title {
    font-size: 15px;
    font-weight: 700;
    color: #f1f5f9;
  }

  .invoice-meta {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .invoice-meta-item {
    font-size: 12px;
    color: #64748b;
  }

  .invoice-meta-item span {
    color: #94a3b8;
    font-weight: 600;
    margin-left: 4px;
  }

  .items-table-wrap { overflow-x: auto; }

  .items-table {
    width: 100%;
    border-collapse: collapse;
  }

  .items-table thead th {
    padding: 11px 20px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: #161b27;
    border-bottom: 1px solid #2a3147;
  }

  .items-table tbody tr {
    border-bottom: 1px solid #1e2538;
    transition: background 0.15s;
  }

  .items-table tbody tr:last-child { border-bottom: none; }
  .items-table tbody tr:hover { background: rgba(59,130,246,0.03); }

  .items-table tbody td {
    padding: 13px 20px;
    font-size: 13.5px;
    color: #cbd5e1;
    vertical-align: middle;
  }

  .item-title { font-weight: 600; color: #f1f5f9; font-size: 14px; }
  .item-author { font-size: 12px; color: #64748b; margin-top: 2px; }

  .custom-checkbox {
    width: 18px; height: 18px;
    border: 1.5px solid #3a4560;
    border-radius: 4px;
    background: #111827;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .custom-checkbox.checked {
    background: #3b82f6;
    border-color: #3b82f6;
  }

  .qty-selector {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .qty-btn {
    width: 28px; height: 28px;
    border-radius: 6px;
    background: #111827;
    border: 1px solid #2a3147;
    color: #94a3b8;
    font-size: 16px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    line-height: 1;
  }

  .qty-btn:hover:not(:disabled) { background: #1c2233; color: #f1f5f9; border-color: #3a4560; }
  .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .qty-value {
    font-size: 14px;
    font-weight: 700;
    color: #f1f5f9;
    min-width: 24px;
    text-align: center;
  }

  .reason-card {
    background: #1c2233;
    border: 1px solid #2a3147;
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 20px;
  }

  .reason-card label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 10px;
    letter-spacing: 0.02em;
  }

  .reason-card select {
    width: 100%;
    background: #111827;
    border: 1px solid #2a3147;
    border-radius: 8px;
    padding: 11px 14px;
    color: #f1f5f9;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .reason-card select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  .reason-card select option { background: #1c2233; }

  .summary-bar {
    background: #1c2233;
    border: 1px solid #2a3147;
    border-radius: 14px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .summary-info {
    display: flex;
    gap: 28px;
    flex-wrap: wrap;
  }

  .summary-stat-label { font-size: 11px; color: #64748b; font-weight: 500; margin-bottom: 3px; }
  .summary-stat-value { font-size: 20px; font-weight: 700; color: #f1f5f9; }
  .summary-stat-value.green  { color: #22c55e; }
  .summary-stat-value.orange { color: #f59e0b; }

  .process-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #22c55e;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    box-shadow: 0 4px 14px rgba(34,197,94,0.3);
    white-space: nowrap;
  }

  .process-btn:hover { background: #16a34a; }
  .process-btn:active { transform: scale(0.98); }
  .process-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .success-card {
    background: #1c2233;
    border: 1px solid rgba(34,197,94,0.3);
    border-radius: 14px;
    padding: 48px 32px;
    text-align: center;
    animation: fadeUp 0.4s ease;
  }

  .success-icon-wrap {
    width: 64px; height: 64px;
    background: rgba(34,197,94,0.12);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }

  .success-card h2 {
    font-size: 20px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 8px;
  }

  .success-card p {
    font-size: 13px;
    color: #64748b;
    margin: 0 0 6px;
  }

  .success-return-num {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.2);
    border-radius: 20px;
    color: #4ade80;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin: 12px 0 20px;
  }

  .refund-amount {
    font-size: 32px;
    font-weight: 700;
    color: #22c55e;
    margin: 0 0 28px;
  }

  .new-return-btn {
    padding: 11px 24px;
    background: #3b82f6;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
    box-shadow: 0 4px 12px rgba(59,130,246,0.25);
  }

  .new-return-btn:hover { background: #2563eb; }

  .history-card {
    background: #1c2233;
    border: 1px solid #2a3147;
    border-radius: 14px;
    overflow: hidden;
  }

  .history-toolbar {
    padding: 16px 20px;
    border-bottom: 1px solid #2a3147;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .history-toolbar-title {
    font-size: 14px;
    font-weight: 600;
    color: #f1f5f9;
  }

  .history-search-wrap {
    position: relative;
    flex: 1;
    max-width: 260px;
  }

  .history-search-wrap input {
    width: 100%;
    background: #111827;
    border: 1px solid #2a3147;
    border-radius: 8px;
    padding: 8px 12px 8px 34px;
    color: #f1f5f9;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .history-search-wrap input:focus { border-color: #3b82f6; }
  .history-search-wrap input::placeholder { color: #4b5680; }

  .history-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #4b5680;
    pointer-events: none;
  }

  .history-table { width: 100%; border-collapse: collapse; }

  .history-table thead th {
    padding: 11px 20px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: #161b27;
    border-bottom: 1px solid #2a3147;
  }

  .history-table tbody tr {
    border-bottom: 1px solid #1e2538;
    transition: background 0.15s;
  }

  .history-table tbody tr:last-child { border-bottom: none; }
  .history-table tbody tr:hover { background: rgba(59,130,246,0.04); }

  .history-table tbody td {
    padding: 13px 20px;
    font-size: 13px;
    color: #cbd5e1;
    vertical-align: middle;
  }

  .return-number-badge {
    font-size: 12px;
    font-weight: 700;
    color: #f59e0b;
    background: rgba(245,158,11,0.1);
    border: 1px solid rgba(245,158,11,0.2);
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.04em;
  }

  .invoice-link {
    font-size: 12px;
    color: #60a5fa;
    font-weight: 600;
  }

  .refund-cell {
    font-weight: 700;
    color: #22c55e;
    font-size: 14px;
  }

  .reason-cell {
    font-size: 12px;
    color: #64748b;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #4b5680;
  }

  .empty-state p { font-size: 14px; margin: 10px 0 0; }

  .returns-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: white;
    z-index: 9999;
    animation: toastIn 0.3s cubic-bezier(0.16,1,0.3,1);
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  .returns-toast.success { background: #16a34a; }
  .returns-toast.error   { background: #dc2626; }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

const REASONS = [
  'Defective / Damaged item',
  'Wrong item delivered',
  'Customer changed mind',
  'Duplicate purchase',
  'Other',
];

function Returns() {
  const [tab, setTab] = useState('new');

  const [invoiceInput, setInvoiceInput] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [reason, setReason] = useState(REASONS[0]);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [history, setHistory] = useState([]);
  const [historySearch, setHistorySearch] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (tab === 'history') loadHistory();
  }, [tab]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('http://localhost:5050/api/returns');
      const data = await res.json();
      setHistory(data);
    } catch {
      showToast('Failed to load history', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  const searchInvoice = async () => {
    if (!invoiceInput.trim()) return;
    setSearchError('');
    setInvoiceData(null);
    setSelectedItems({});
    setSearching(true);
    try {
      const res = await fetch(`http://localhost:5050/api/returns/invoice/${invoiceInput.trim().toUpperCase()}`);
      const data = await res.json();
      if (!res.ok) { setSearchError(data.error || 'Invoice not found'); return; }
      setInvoiceData(data);
      const defaults = {};
      data.items.forEach(item => {
        defaults[item.book_id] = {
          selected: false,
          quantity: 1,
          max: item.quantity,
          price: item.price,
          book_id: item.book_id,
          title: item.title
        };
      });
      setSelectedItems(defaults);
    } catch {
      setSearchError('Failed to connect to server');
    } finally {
      setSearching(false);
    }
  };

  const toggleItem = (bookId) => {
    setSelectedItems(prev => ({
      ...prev,
      [bookId]: { ...prev[bookId], selected: !prev[bookId].selected }
    }));
  };

  const changeQty = (bookId, delta) => {
    setSelectedItems(prev => {
      const item = prev[bookId];
      const newQty = Math.min(Math.max(1, item.quantity + delta), item.max);
      return { ...prev, [bookId]: { ...item, quantity: newQty } };
    });
  };

  const selectedList = Object.values(selectedItems).filter(i => i.selected);
  const totalRefund = selectedList.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const processReturn = async () => {
    if (selectedList.length === 0) { showToast('Select at least one item to return', 'error'); return; }
    setProcessing(true);
    try {
      const res = await fetch('http://localhost:5050/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_invoice: invoiceData.sale.invoice_number,
          customer_name: invoiceData.sale.customer_name,
          reason,
          items: selectedList.map(i => ({ book_id: i.book_id, quantity: i.quantity, price: i.price })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Return failed');
      setSuccessData({ return_number: data.return_number, total_refund: data.total_refund });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setInvoiceInput('');
    setInvoiceData(null);
    setSelectedItems({});
    setReason(REASONS[0]);
    setSearchError('');
    setSuccessData(null);
  };

  const filteredHistory = history.filter(r =>
    r.return_number?.toLowerCase().includes(historySearch.toLowerCase()) ||
    r.original_invoice?.toLowerCase().includes(historySearch.toLowerCase()) ||
    r.customer_name?.toLowerCase().includes(historySearch.toLowerCase())
  );

  const formatDate = (dt) => new Date(dt).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <>
      <style>{styles}</style>
      <div className="returns-page">

        {/* Header */}
        <div className="returns-header">
          <div className="returns-header-left">
            <h1>Returns & Refunds</h1>
            <p>Process item returns and view return history</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${tab === 'new' ? 'active' : ''}`}
            onClick={() => { setTab('new'); resetForm(); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
            </svg>
            New Return
          </button>
          <button
            className={`tab ${tab === 'history' ? 'active' : ''}`}
            onClick={() => setTab('history')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Return History
          </button>
        </div>

        {/* ── NEW RETURN TAB ── */}
        {tab === 'new' && (
          <>
            {successData ? (
              <div className="success-card">
                <div className="success-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2>Return Processed Successfully!</h2>
                <p>Return number</p>
                <div className="success-return-num">{successData.return_number}</div>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Total Refund Amount</p>
                <div className="refund-amount">Rs. {Number(successData.total_refund).toFixed(2)}</div>
                <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '24px' }}>
                  Stock has been restored automatically.
                </p>
                <button className="new-return-btn" onClick={resetForm}>
                  Process Another Return
                </button>
              </div>
            ) : (
              <>
                {/* Search Invoice */}
                <div className="search-card">
                  <h2>Search Invoice</h2>
                  <p>Enter the invoice number to find the original sale</p>
                  <div className="invoice-search-row">
                    <div className="invoice-input-wrap">
                      <svg className="invoice-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                      <input
                        placeholder="e.g. INV1234567890"
                        value={invoiceInput}
                        onChange={e => setInvoiceInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && searchInvoice()}
                      />
                    </div>
                    <button
                      className="search-btn"
                      onClick={searchInvoice}
                      disabled={searching || !invoiceInput.trim()}
                    >
                      {searching ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                          </svg>
                          Searching...
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          </svg>
                          Find Invoice
                        </>
                      )}
                    </button>
                  </div>
                  {searchError && (
                    <div className="msg-error">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {searchError}
                    </div>
                  )}
                </div>

                {/* Invoice Items */}
                {invoiceData && (
                  <>
                    <div className="invoice-result">
                      <div className="invoice-result-header">
                        <div className="invoice-result-title">
                          📄 {invoiceData.sale.invoice_number}
                        </div>
                        <div className="invoice-meta">
                          <div className="invoice-meta-item">
                            Customer: <span>{invoiceData.sale.customer_name}</span>
                          </div>
                          <div className="invoice-meta-item">
                            Total: <span>Rs. {Number(invoiceData.sale.total_amount).toFixed(2)}</span>
                          </div>
                          <div className="invoice-meta-item">
                            Date: <span>{formatDate(invoiceData.sale.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="items-table-wrap">
                        <table className="items-table">
                          <thead>
                            <tr>
                              <th style={{ width: 40 }}>Select</th>
                              <th>Book</th>
                              <th>Unit Price</th>
                              <th>Purchased Qty</th>
                              <th>Return Qty</th>
                              <th>Refund</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceData.items.map(item => {
                              const sel = selectedItems[item.book_id];
                              if (!sel) return null;
                              return (
                                <tr key={item.book_id}>
                                  <td>
                                    <div
                                      className={`custom-checkbox ${sel.selected ? 'checked' : ''}`}
                                      onClick={() => toggleItem(item.book_id)}
                                    >
                                      {sel.selected && (
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                          <polyline points="1,5 4,8 9,2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                                        </svg>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="item-title">{item.title}</div>
                                    <div className="item-author">{item.author}</div>
                                  </td>
                                  <td>Rs. {Number(item.price).toFixed(2)}</td>
                                  <td>{item.quantity}</td>
                                  <td>
                                    {sel.selected ? (
                                      <div className="qty-selector">
                                        <button className="qty-btn" onClick={() => changeQty(item.book_id, -1)} disabled={sel.quantity <= 1}>−</button>
                                        <span className="qty-value">{sel.quantity}</span>
                                        <button className="qty-btn" onClick={() => changeQty(item.book_id, 1)} disabled={sel.quantity >= item.quantity}>+</button>
                                      </div>
                                    ) : (
                                      <span style={{ color: '#4b5680', fontSize: '13px' }}>—</span>
                                    )}
                                  </td>
                                  <td style={{ fontWeight: 600, color: sel.selected ? '#22c55e' : '#4b5680' }}>
                                    {sel.selected ? `Rs. ${(item.price * sel.quantity).toFixed(2)}` : '—'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="reason-card">
                      <label>Return Reason</label>
                      <select value={reason} onChange={e => setReason(e.target.value)}>
                        {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    {/* Summary + Process */}
                    <div className="summary-bar">
                      <div className="summary-info">
                        <div className="summary-stat">
                          <div className="summary-stat-label">Items Selected</div>
                          <div className="summary-stat-value orange">{selectedList.length}</div>
                        </div>
                        <div className="summary-stat">
                          <div className="summary-stat-label">Total Qty</div>
                          <div className="summary-stat-value">{selectedList.reduce((s, i) => s + i.quantity, 0)}</div>
                        </div>
                        <div className="summary-stat">
                          <div className="summary-stat-label">Total Refund</div>
                          <div className="summary-stat-value green">Rs. {totalRefund.toFixed(2)}</div>
                        </div>
                      </div>
                      <button
                        className="process-btn"
                        onClick={processReturn}
                        disabled={processing || selectedList.length === 0}
                      >
                        {processing ? (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                              <path d="M21 12a9 9 0 11-6.219-8.56"/>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="1 4 1 10 7 10"/>
                              <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                            </svg>
                            Process Return
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === 'history' && (
          <div className="history-card">
            <div className="history-toolbar">
              <span className="history-toolbar-title">Return History ({filteredHistory.length})</span>
              <div className="history-search-wrap">
                <svg className="history-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  placeholder="Search returns..."
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                />
              </div>
            </div>

            <table className="history-table">
              <thead>
                <tr>
                  <th>Return #</th>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Reason</th>
                  <th>Refund</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {historyLoading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      Loading...
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4b5680" strokeWidth="1.5">
                          <polyline points="1 4 1 10 7 10"/>
                          <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                        </svg>
                        <p>No return records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map(r => (
                    <tr key={r.id}>
                      <td><span className="return-number-badge">{r.return_number}</span></td>
                      <td><span className="invoice-link">{r.original_invoice}</span></td>
                      <td>{r.customer_name}</td>
                      <td><span className="reason-cell">{r.reason}</span></td>
                      <td><span className="refund-cell">Rs. {Number(r.total_refund).toFixed(2)}</span></td>
                      <td style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(r.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`returns-toast ${toast.type}`}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.message}
          </div>
        )}

      </div>
    </>
  );
}

export default Returns;