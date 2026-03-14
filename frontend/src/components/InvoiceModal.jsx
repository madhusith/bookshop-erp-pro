import React from 'react';

function InvoiceModal({ invoice, onClose }) {
  const handlePrint = () => {
    window.open(`http://localhost:5050/api/sales/${invoice.saleId}/print`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✅ Invoice Created Successfully</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="invoice-success-icon">🎉</div>
          
          <div className="invoice-details">
            <div className="invoice-detail-row">
              <span className="label">Invoice Number:</span>
              <span className="value">{invoice.invoice}</span>
            </div>
            <div className="invoice-detail-row">
              <span className="label">Total Amount:</span>
              <span className="value amount">Rs. {invoice.total.toFixed(2)}</span>
            </div>
            <div className="invoice-detail-row">
              <span className="label">Date:</span>
              <span className="value">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            🖨️ Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;
