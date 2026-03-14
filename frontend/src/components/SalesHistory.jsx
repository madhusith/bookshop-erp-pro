import { useEffect, useState } from "react";

function SalesHistory({ onOpenInvoice }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch("http://localhost:5050/api/sales")
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch sales data');
        return res.json();
      })
      .then(data => {
        setSales(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load sales:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter sales based on search and period
  const getFilteredSales = () => {
    let filtered = [...sales];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sale => 
        sale.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Period filter
    if (filterPeriod !== "all") {
      const now = new Date();
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.created_at);
        const daysDiff = (now - saleDate) / (1000 * 60 * 60 * 24);
        
        switch(filterPeriod) {
          case "today":
            return daysDiff < 1;
          case "week":
            return daysDiff < 7;
          case "month":
            return daysDiff < 30;
          case "year":
            return daysDiff < 365;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case "date-desc":
          return new Date(b.created_at) - new Date(a.created_at);
        case "date-asc":
          return new Date(a.created_at) - new Date(b.created_at);
        case "amount-desc":
          return parseFloat(b.total_amount) - parseFloat(a.total_amount);
        case "amount-asc":
          return parseFloat(a.total_amount) - parseFloat(b.total_amount);
        case "invoice":
          return a.invoice_number.localeCompare(b.invoice_number);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredSales = getFilteredSales();

  const totalRevenue = filteredSales.reduce((sum, sale) => 
    sum + parseFloat(sale.total_amount), 0
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading sales history...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: '12px'
          }}>Error Loading Sales</h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#1f2937',
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>📜</span> Sales History
              </h1>
              <p style={{
                color: '#6b7280',
                fontSize: '15px',
                margin: 0
              }}>
                Track and manage all your sales transactions
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '8px'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Total Revenue
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#059669',
                lineHeight: 1
              }}>
                Rs {formatCurrency(totalRevenue)}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280'
              }}>
                {filteredSales.length} transaction{filteredSales.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            
            {/* Search */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                🔍 Search
              </label>
              <input
                type="text"
                placeholder="Search by invoice or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Period Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                📅 Period
              </label>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                ⬇️ Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="amount-desc">Amount (Highest First)</option>
                <option value="amount-asc">Amount (Lowest First)</option>
                <option value="invoice">Invoice Number</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || filterPeriod !== "all" || sortBy !== "date-desc") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterPeriod("all");
                setSortBy("date-desc");
              }}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#6b7280',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
                e.target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#6b7280';
              }}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        {/* Sales Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '15px'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f9fafb',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  <th style={{
                    textAlign: 'left',
                    padding: '18px 24px',
                    fontWeight: '700',
                    fontSize: '13px',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Invoice #</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '18px 24px',
                    fontWeight: '700',
                    fontSize: '13px',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Customer</th>
                  <th style={{
                    textAlign: 'right',
                    padding: '18px 24px',
                    fontWeight: '700',
                    fontSize: '13px',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Amount</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '18px 24px',
                    fontWeight: '700',
                    fontSize: '13px',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Date & Time</th>
                  <th style={{
                    textAlign: 'center',
                    padding: '18px 24px',
                    fontWeight: '700',
                    fontSize: '13px',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    width: '150px'
                  }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{
                      textAlign: 'center',
                      padding: '60px 20px',
                      color: '#9ca3af',
                      fontSize: '16px'
                    }}>
                      {searchTerm || filterPeriod !== "all" 
                        ? "No sales found matching your filters" 
                        : "No sales recorded yet"}
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale, index) => (
                    <tr 
                      key={sale.id}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{
                        padding: '20px 24px',
                        fontWeight: '600',
                        color: '#1e3a8a'
                      }}>
                        #{sale.invoice_number}
                      </td>
                      <td style={{
                        padding: '20px 24px',
                        color: '#111827',
                        fontWeight: '500'
                      }}>
                        {sale.customer_name}
                      </td>
                      <td style={{
                        padding: '20px 24px',
                        textAlign: 'right',
                        fontWeight: '700',
                        color: '#059669',
                        fontSize: '16px'
                      }}>
                        Rs {formatCurrency(sale.total_amount)}
                      </td>
                      <td style={{
                        padding: '20px 24px',
                        color: '#374151'
                      }}>
                        <div style={{ fontWeight: '500' }}>
                          {formatDate(sale.created_at)}
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          marginTop: '2px'
                        }}>
                          {formatTime(sale.created_at)}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 24px',
                        textAlign: 'center'
                      }}>
                        <button
                          onClick={() => onOpenInvoice(sale.invoice_number)}
                          style={{
                            backgroundColor: '#1e3a8a',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(30, 58, 138, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1e40af';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#1e3a8a';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(30, 58, 138, 0.2)';
                          }}
                        >
                          📄 View Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        {filteredSales.length > 0 && (
          <div style={{
            marginTop: '30px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Total Transactions
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1f2937'
              }}>
                {filteredSales.length}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #059669'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Average Sale
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1f2937'
              }}>
                Rs {formatCurrency(totalRevenue / filteredSales.length)}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Highest Sale
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1f2937'
              }}>
                Rs {formatCurrency(Math.max(...filteredSales.map(s => parseFloat(s.total_amount))))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesHistory;