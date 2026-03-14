import React from 'react';

function Dashboard({ data, loading, onViewChange }) {

  if (loading || !data) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const revenue = Number(data?.today?.revenue || 0);
  const bills = Number(data?.today?.bills || 0);
  const booksSold = Number(data?.today?.books_sold || 0);
  const totalStock = Number(data?.inventory?.total_stock || 0);

  const stats = [
    {
      icon: '💰',
      label: "Today's Revenue",
      value: `Rs. ${revenue.toFixed(2)}`,
      change: '+12%',
      positive: true
    },
    {
      icon: '🧾',
      label: "Today's Bills",
      value: bills,
      change: '+8%',
      positive: true
    },
    {
      icon: '📚',
      label: 'Books Sold Today',
      value: booksSold,
      change: '+15%',
      positive: true
    },
    {
      icon: '📦',
      label: 'Total Stock',
      value: totalStock,
      change: '-5%',
      positive: false
    }
  ];

  return (
    <div className="dashboard">

      {/* ================= STATS ================= */}

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.change} from yesterday
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= GRID ================= */}

      <div className="dashboard-grid">

        {/* QUICK STATS */}
        <div className="dashboard-card">
          <h3>📊 Quick Stats</h3>
          <div className="quick-stats">

            <div className="quick-stat-item">
              <span className="label">Total Items in Inventory</span>
              <span className="value">{data.inventory.total_items}</span>
            </div>

            <div className="quick-stat-item">
              <span className="label">Low Stock Items</span>
              <span className="value alert">{data.inventory.low_stock}</span>
            </div>

            <div className="quick-stat-item">
              <span className="label">Total Stock Value</span>
              <span className="value">
                Rs. {(Number(data.inventory.total_stock) * 100).toFixed(2)}
              </span>
            </div>

          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="dashboard-card">
          <h3>🎯 Quick Actions</h3>
          <div className="quick-actions">

            <button className="action-btn" onClick={() => onViewChange('billing')}>
              <span>💳</span>
              New Sale
            </button>

            <button className="action-btn" onClick={() => onViewChange('inventory')}>
              <span>📚</span>
              Add Book
            </button>

            <button className="action-btn" onClick={() => onViewChange('reports')}>
              <span>📊</span>
              View Reports
            </button>

            <button className="action-btn" onClick={() => onViewChange('sales')}>
              <span>🔍</span>
              Search Invoice
            </button>

          </div>
        </div>

      </div>

      {/* ================= RECENT ACTIVITY ================= */}

      <div className="recent-activity">
        <h3>📋 Recent Activity</h3>
        <div className="activity-list">

          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <div className="activity-title">Invoice Created</div>
              <div className="activity-time">2 minutes ago</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">📚</div>
            <div className="activity-content">
              <div className="activity-title">New Book Added to Inventory</div>
              <div className="activity-time">15 minutes ago</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">💰</div>
            <div className="activity-content">
              <div className="activity-title">Payment Received</div>
              <div className="activity-time">1 hour ago</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;