// Pass userRole, user, onLogout as props from App.jsx
// Usage: <Sidebar currentView={...} onViewChange={...} userRole={user.role} user={user} onLogout={handleLogout} />

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',     icon: '📊', roles: ['admin', 'manager'] },
  { id: 'billing',    label: 'Billing',        icon: '🧾', roles: ['admin', 'manager', 'cashier'] },
  { id: 'inventory',  label: 'Inventory',      icon: '📦', roles: ['admin', 'manager'] },
  { id: 'sales',      label: 'Sales History',  icon: '📋', roles: ['admin', 'manager', 'cashier'] },
  { id: 'reports',    label: 'Reports',        icon: '📈', roles: ['admin'] },
  { id: 'returns', label: 'Returns', icon: '🔄', roles: ['admin', 'manager', 'cashier'] },
  { id: 'users', label: 'Staff', icon: '👥', roles: ['admin'] },
];

function Sidebar({ currentView, onViewChange, userRole, user, onLogout }) {
  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  const roleBadgeColor = {
    admin:   '#3b82f6',
    manager: '#a855f7',
    cashier: '#22c55e',
  }[userRole] || '#94a3b8';

  const roleLabel = {
    admin:   'Admin',
    manager: 'Manager',
    cashier: 'Cashier',
  }[userRole] || userRole;

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>📚</div>
        <div>
          <div style={styles.logoTitle}>Bookshop ERP</div>
          <div style={styles.logoBadge}>v2.0 Pro</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {visibleItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            style={{
              ...styles.navItem,
              ...(currentView === item.id ? styles.navItemActive : {}),
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User info + Logout */}
      <div style={styles.footer}>
        <div style={styles.userCard}>
          <div style={styles.avatar}>
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.name || 'User'}</div>
            <div style={{ ...styles.userRole, color: roleBadgeColor }}>
              {roleLabel}
            </div>
          </div>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    background: '#161b27',
    borderRight: '1px solid #2a3147',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  logo: {
    padding: '24px 20px 18px',
    borderBottom: '1px solid #2a3147',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '40px', height: '40px',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px',
    boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
    flexShrink: 0,
  },
  logoTitle: { fontSize: '15px', fontWeight: '700', color: '#f1f5f9' },
  logoBadge: { fontSize: '10px', fontWeight: '600', color: '#3b82f6', marginTop: '1px' },
  nav: {
    padding: '16px 10px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'transparent',
    border: 'none',
    color: '#4b5680',
    fontSize: '13.5px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: 'rgba(59,130,246,0.12)',
    color: '#3b82f6',
  },
  navIcon: { fontSize: '16px', flexShrink: 0 },
  footer: {
    padding: '12px',
    borderTop: '1px solid #2a3147',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    background: '#1c2233',
    border: '1px solid #2a3147',
    marginBottom: '8px',
  },
  avatar: {
    width: '32px', height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '700', color: 'white',
    flexShrink: 0,
  },
  userInfo: { overflow: 'hidden' },
  userName: { fontSize: '13px', fontWeight: '600', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { fontSize: '11px', marginTop: '1px', fontWeight: '600' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '9px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px',
    color: '#f87171',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
};

export default Sidebar;