import { useEffect, useState } from "react";

function InvoiceViewer({ invoiceNumber }) {
  const [items, setItems] = useState([]);
  const [sale, setSale] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPct, setDiscountPct] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [printFormat, setPrintFormat] = useState('a4');
  const [invoiceDate] = useState(new Date().toLocaleDateString('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  }));

  // ── Load business info from Settings ──
  const business = JSON.parse(localStorage.getItem('bookshop_business') || '{}');
  const shopName    = business.name    || 'TN Book Store';
  const shopAddress = business.address || '123 Book Street';
  const shopPhone   = business.phone   || '+94 77 000 0000';
  const shopEmail   = business.email   || 'info@bookshop.com';
  const shopTagline = business.tagline || '';

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5050/api/invoice/${invoiceNumber}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch invoice');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
          const sub = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
          setSubtotal(sub);
          setTotal(sub);
          setDiscountAmount(0);
          setDiscountPct(0);
          setSale(null);
        } else {
          setItems(data.items || []);
          setSubtotal(data.subtotal || 0);
          setDiscountAmount(data.discount_amount || 0);
          setDiscountPct(data.discount_pct || 0);
          setTotal(data.total || 0);
          setSale(data.sale || null);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [invoiceNumber]);

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handlePrint = (format) => {
    setPrintFormat(format);
    setTimeout(() => window.print(), 100);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px', height: '50px',
            border: '4px solid #e0e0e0', borderTop: '4px solid #2563eb',
            borderRadius: '50%', animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading invoice...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '40px',
          maxWidth: '500px', width: '100%', textAlign: 'center'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
            Error Loading Invoice
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── SCREEN VIEW ── */}
      <div className="screen-only" style={{
        minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto', backgroundColor: 'white',
          borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden'
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            padding: '40px', color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '30px' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 16px 0', letterSpacing: '1px' }}>INVOICE</h1>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', opacity: '0.95' }}>📚 {shopName}</div>
                {shopTagline && <div style={{ fontSize: '13px', opacity: '0.8', marginBottom: '8px', fontStyle: 'italic' }}>{shopTagline}</div>}
                <div style={{ fontSize: '14px', opacity: '0.85', lineHeight: '1.6' }}>
                  {shopAddress && <div>📍 {shopAddress}</div>}
                  {shopPhone   && <div>📞 {shopPhone}</div>}
                  {shopEmail   && <div>✉️ {shopEmail}</div>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  backgroundColor: 'white', color: '#1e3a8a', padding: '20px 30px',
                  borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '8px', textTransform: 'uppercase' }}>Invoice Number</div>
                  <div style={{ fontSize: '28px', fontWeight: '800' }}>{invoiceNumber}</div>
                </div>
                <div style={{ fontSize: '14px', opacity: '0.9' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Date Issued</div>
                  <div style={{ fontSize: '15px' }}>{invoiceDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div style={{ padding: '30px 40px', backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Bill To</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              {sale?.customer_name || 'Valued Customer'}
            </div>
          </div>

          {/* Items Table */}
          <div style={{ padding: '40px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '3px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '18px 16px', fontWeight: '700', fontSize: '13px', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
                  <th style={{ textAlign: 'center', padding: '18px 16px', fontWeight: '700', fontSize: '13px', color: '#374151', textTransform: 'uppercase', width: '100px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '18px 16px', fontWeight: '700', fontSize: '13px', color: '#374151', textTransform: 'uppercase', width: '140px' }}>Unit Price</th>
                  <th style={{ textAlign: 'right', padding: '18px 16px', fontWeight: '700', fontSize: '13px', color: '#374151', textTransform: 'uppercase', width: '140px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>No items found</td></tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '20px 16px', color: '#111827', fontWeight: '500' }}>{item.title}</td>
                      <td style={{ padding: '20px 16px', textAlign: 'center', color: '#374151', fontWeight: '600' }}>{item.quantity}</td>
                      <td style={{ padding: '20px 16px', textAlign: 'right', color: '#374151' }}>Rs {formatCurrency(item.price)}</td>
                      <td style={{ padding: '20px 16px', textAlign: 'right', color: '#111827', fontWeight: '600' }}>Rs {formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '15px', color: '#374151' }}>
                  <span style={{ fontWeight: '500' }}>Subtotal:</span>
                  <span style={{ fontWeight: '600' }}>Rs {formatCurrency(subtotal)}</span>
                </div>
                {discountPct > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '15px', color: '#16a34a', borderTop: '1px solid #e5e7eb' }}>
                    <span style={{ fontWeight: '500' }}>Discount ({discountPct}%):</span>
                    <span style={{ fontWeight: '600' }}>- Rs {formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', padding: '20px',
                  marginTop: '12px', borderTop: '3px solid #1e3a8a',
                  backgroundColor: '#eff6ff', borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: '#1e3a8a' }}>Total:</span>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a' }}>Rs {formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '50px', padding: '30px', backgroundColor: '#f9fafb', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.8' }}>
                <p style={{ margin: '0 0 12px 0' }}><strong style={{ color: '#1f2937' }}>Payment Terms:</strong> Payment is due within 30 days of invoice date.</p>
                <p style={{ margin: '0 0 12px 0' }}><strong style={{ color: '#1f2937' }}>Payment Methods:</strong> Bank Transfer, Cash, Credit/Debit Card</p>
                <p style={{ margin: '0', color: '#3b82f6', fontWeight: '600' }}>Thank you for your business! We appreciate your patronage.</p>
              </div>
            </div>
          </div>

          {/* Print Buttons */}
          <div style={{ padding: '30px 40px', backgroundColor: '#f9fafb', borderTop: '2px solid #e5e7eb' }} className="no-print">
            <div style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Choose Print Format:</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => handlePrint('a4')} style={{
                flex: '1', minWidth: '200px', backgroundColor: '#1e3a8a', color: 'white',
                border: 'none', padding: '16px 32px', fontSize: '16px', fontWeight: '600',
                borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(30,58,138,0.3)'
              }}>
                <span style={{ fontSize: '20px' }}>🖨️</span> Print A4 Format
              </button>
              <button onClick={() => handlePrint('thermal')} style={{
                flex: '1', minWidth: '200px', backgroundColor: '#059669', color: 'white',
                border: 'none', padding: '16px 32px', fontSize: '16px', fontWeight: '600',
                borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(5,150,105,0.3)'
              }}>
                <span style={{ fontSize: '20px' }}>🧾</span> Print Thermal (80mm)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── A4 PRINT VERSION ── */}
      <div className="print-a4" style={{ display: 'none' }}>
        <div style={{ width: '100%', backgroundColor: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)', padding: '40px 50px', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div>
                <h1 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 15px 0', letterSpacing: '2px' }}>INVOICE</h1>
                <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '8px 16px', borderRadius: '6px' }}>📚 {shopName}</div>
                {shopTagline && <div style={{ fontSize: '12px', opacity: '0.85', marginBottom: '8px', fontStyle: 'italic' }}>{shopTagline}</div>}
                <div style={{ fontSize: '13px', lineHeight: '1.8', opacity: '0.95' }}>
                  {shopAddress && <div>📍 {shopAddress}</div>}
                  {shopPhone   && <div>📞 {shopPhone}</div>}
                  {shopEmail   && <div>✉️ {shopEmail}</div>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ backgroundColor: 'white', color: '#1e3a8a', padding: '25px 35px', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.25)', marginBottom: '20px', border: '3px solid #60a5fa' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '10px', color: '#6b7280', textTransform: 'uppercase' }}>Invoice Number</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#1e3a8a' }}>{invoiceNumber}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px 20px', borderRadius: '10px', fontSize: '13px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '5px' }}>📅 Date Issued</div>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{invoiceDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div style={{ padding: '30px 50px', backgroundColor: '#f0f9ff', borderLeft: '6px solid #3b82f6' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#1e3a8a', marginBottom: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Bill To</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>{sale?.customer_name || 'Valued Customer'}</div>
          </div>

          {/* Items */}
          <div style={{ padding: '40px 50px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white' }}>
                  <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: '700', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Description</th>
                  <th style={{ textAlign: 'center', padding: '16px 20px', fontWeight: '700', fontSize: '12px', width: '100px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '16px 20px', fontWeight: '700', fontSize: '12px', width: '140px' }}>Unit Price</th>
                  <th style={{ textAlign: 'right', padding: '16px 20px', fontWeight: '700', fontSize: '12px', width: '140px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px 20px', color: '#111827', fontWeight: '600' }}>{item.title}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#374151', fontWeight: '700' }}>{item.quantity}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', color: '#374151' }}>Rs {formatCurrency(item.price)}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', color: '#1e3a8a', fontWeight: '700' }}>Rs {formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* A4 Totals */}
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px', fontSize: '14px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Subtotal:</span>
                  <span style={{ fontWeight: '700', color: '#111827' }}>Rs {formatCurrency(subtotal)}</span>
                </div>
                {discountPct > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px', fontSize: '14px', backgroundColor: '#dcfce7', borderRadius: '8px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '600', color: '#15803d' }}>Discount ({discountPct}%):</span>
                    <span style={{ fontWeight: '700', color: '#15803d' }}>- Rs {formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 25px', marginTop: '15px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', borderRadius: '12px', boxShadow: '0 8px 20px rgba(30,58,138,0.3)' }}>
                  <span style={{ fontSize: '18px', fontWeight: '700' }}>TOTAL:</span>
                  <span style={{ fontSize: '28px', fontWeight: '900' }}>Rs {formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '50px', padding: '25px 30px', background: 'linear-gradient(to right, #eff6ff 0%, #dbeafe 100%)', borderRadius: '12px', borderLeft: '6px solid #3b82f6', fontSize: '12px', lineHeight: '1.8', color: '#374151' }}>
              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#1e3a8a' }}>💳 Payment Terms:</strong> Payment is due within 30 days of invoice date.</p>
              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#1e3a8a' }}>💰 Payment Methods:</strong> Bank Transfer, Cash, Credit/Debit Card</p>
              <p style={{ margin: '15px 0 0 0', fontWeight: '700', color: '#3b82f6', fontSize: '13px', textAlign: 'center', padding: '12px', backgroundColor: 'white', borderRadius: '8px' }}>✨ Thank you for your business! We appreciate your patronage. ✨</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── THERMAL PRINT VERSION ── */}
      <div className="print-thermal" style={{ display: 'none' }}>
        <div style={{ width: '72mm', margin: '0 auto', padding: '8mm 4mm', backgroundColor: 'white', fontFamily: '"Courier New", Courier, monospace', fontSize: '11px', lineHeight: '1.4', color: '#000' }}>
          <div style={{ textAlign: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '2px solid #000' }}>
            <div style={{ fontSize: '16px', fontWeight: '900', marginBottom: '4px' }}>{shopName.toUpperCase()}</div>
            {shopTagline && <div style={{ fontSize: '9px', marginBottom: '4px', fontStyle: 'italic' }}>{shopTagline}</div>}
            <div style={{ fontSize: '9px', lineHeight: '1.3' }}>
              {shopAddress && <div>{shopAddress}</div>}
              {shopPhone   && <div>Tel: {shopPhone}</div>}
              {shopEmail   && <div>{shopEmail}</div>}
            </div>
          </div>

          <div style={{ marginBottom: '12px', fontSize: '10px', borderBottom: '1px dashed #000', paddingBottom: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingBottom: '4px' }}>Invoice #:</td>
                  <td style={{ textAlign: 'right', paddingBottom: '4px' }}>{invoiceNumber}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Customer:</td>
                  <td style={{ textAlign: 'right' }}>{sale?.customer_name || 'Walk-in'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Date:</td>
                  <td style={{ textAlign: 'right' }}>{invoiceDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: '12px', borderBottom: '1px dashed #000', paddingBottom: '8px' }}>
            {items.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '10px' }}>{item.title}</div>
                <table style={{ width: '100%', fontSize: '9px' }}>
                  <tbody>
                    <tr>
                      <td style={{ paddingLeft: '8px' }}>{item.quantity} x Rs {formatCurrency(item.price)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Rs {formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Thermal Totals */}
          <div style={{ marginBottom: '12px', fontSize: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ paddingBottom: '4px' }}>Subtotal:</td>
                  <td style={{ textAlign: 'right', paddingBottom: '4px' }}>Rs {formatCurrency(subtotal)}</td>
                </tr>
                {discountPct > 0 && (
                  <tr>
                    <td style={{ paddingBottom: '4px', color: '#16a34a' }}>Discount ({discountPct}%):</td>
                    <td style={{ textAlign: 'right', paddingBottom: '4px', color: '#16a34a' }}>- Rs {formatCurrency(discountAmount)}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div style={{ borderTop: '2px solid #000', paddingTop: '6px', marginTop: '6px' }}>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ fontSize: '13px', fontWeight: 'bold' }}>TOTAL:</td>
                    <td style={{ textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>Rs {formatCurrency(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '8px', lineHeight: '1.3', borderTop: '1px dashed #000', paddingTop: '10px', marginTop: '8px' }}>
            <div style={{ marginBottom: '4px' }}>Payment due within 30 days</div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '9px' }}>Thank you for your business!</div>
            {shopEmail && <div>{shopEmail}</div>}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; background: white !important; }
          body * { visibility: hidden; }
          .screen-only, .no-print, button { display: none !important; }
          ${printFormat === 'a4' ? `
            .print-a4, .print-a4 * { visibility: visible !important; }
            .print-a4 { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
            .print-thermal { display: none !important; }
            @page { size: A4 portrait; margin: 0; }
          ` : `
            .print-thermal, .print-thermal * { visibility: visible !important; }
            .print-thermal { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
            .print-a4 { display: none !important; }
            @page { size: 80mm auto; margin: 5mm 4mm; }
          `}
        }
        @media screen {
          .print-a4, .print-thermal { display: none !important; }
        }
      `}</style>
    </>
  );
}

export default InvoiceViewer;