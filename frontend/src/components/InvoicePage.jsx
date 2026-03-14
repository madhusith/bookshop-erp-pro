import { useEffect, useState } from "react";

function InvoicePage({ invoiceNumber }) {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5050/api/invoice/${invoiceNumber}`)
      .then(res => res.json())
      .then(data => setInvoice(data));
  }, [invoiceNumber]);

  if (!invoice) return <p>Loading invoice...</p>;

  return (
    <div className="invoice-page">

      <h1>📄 Invoice</h1>

      <p><strong>Invoice #:</strong> {invoice.invoice_number}</p>
      <p><strong>Customer:</strong> {invoice.customer_name}</p>

      <table>
        <thead>
          <tr>
            <th>Book</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>Rs {item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Total: Rs {invoice.total_amount}</h2>

      <button onClick={() => window.print()}>
        🖨 Print Invoice
      </button>

    </div>
  );
}

export default InvoicePage;