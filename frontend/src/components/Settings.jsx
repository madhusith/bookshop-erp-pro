import { useState, useEffect } from 'react';

const styles = `
  .settings-page {
    padding: 28px 32px;
    font-family: 'Inter', sans-serif;
    color: #f1f5f9;
    min-height: 100vh;
    background: #0f1117;
  }

  .settings-header {
    margin-bottom: 32px;
  }

  .settings-header h1 {
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 4px 0;
  }

  .settings-header p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  @media (max-width: 900px) {
    .settings-grid { grid-template-columns: 1fr; }
  }

  .settings-card {
    background: #1c2233;
    border: 1px solid #2a3147;
    border-radius: 16px;
    padding: 28px;
  }

  .settings-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #2a3147;
  }

  .settings-card-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }

  .settings-card-icon.blue   { background: rgba(59,130,246,0.12); }
  .settings-card-icon.purple { background: rgba(168,85,247,0.12); }

  .settings-card-title {
    font-size: 16px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 3px;
  }

  .settings-card-subtitle {
    font-size: 12px;
    color: #64748b;
    margin: 0;
  }

  .settings-field {
    margin-bottom: 16px;
  }

  .settings-field label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 8px;
    letter-spacing: 0.02em;
  }

  .settings-field input,
  .settings-field textarea {
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
    resize: none;
  }

  .settings-field input:focus,
  .settings-field textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  .settings-field input::placeholder,
  .settings-field textarea::placeholder { color: #4b5680; }

  .settings-save-btn {
    width: 100%;
    padding: 12px;
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
    margin-top: 8px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .settings-save-btn:hover { background: #2563eb; }

  /* ── Theme Toggle ── */
  .theme-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .theme-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-radius: 10px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
  }

  .theme-option.dark-opt {
    background: #111827;
    border-color: #2a3147;
  }

  .theme-option.light-opt {
    background: #f8fafc;
    border-color: #e2e8f0;
  }

  .theme-option.active.dark-opt  { border-color: #3b82f6; }
  .theme-option.active.light-opt { border-color: #3b82f6; }

  .theme-option-left {
    display: flex; align-items: center; gap: 12px;
  }

  .theme-preview {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }

  .theme-preview.dark  { background: #1c2233; }
  .theme-preview.light { background: #e2e8f0; }

  .theme-name {
    font-size: 14px;
    font-weight: 600;
  }

  .theme-option.dark-opt  .theme-name { color: #f1f5f9; }
  .theme-option.light-opt .theme-name { color: #1e293b; }

  .theme-desc {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
  }

  .theme-option.light-opt .theme-desc { color: #94a3b8; }

  .theme-radio {
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 2px solid #2a3147;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
  }

  .theme-option.active .theme-radio {
    border-color: #3b82f6;
    background: #3b82f6;
  }

  .theme-radio-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: white;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .theme-option.active .theme-radio-dot { opacity: 1; }

  .theme-apply-btn {
    width: 100%;
    padding: 12px;
    background: rgba(168,85,247,0.12);
    border: 1px solid rgba(168,85,247,0.3);
    border-radius: 8px;
    color: #c084fc;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
    margin-top: 16px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .theme-apply-btn:hover {
    background: rgba(168,85,247,0.2);
    border-color: rgba(168,85,247,0.5);
  }

  /* ── Business Preview ── */
  .business-preview {
    margin-top: 20px;
    padding: 16px;
    background: #111827;
    border: 1px solid #2a3147;
    border-radius: 10px;
  }

  .business-preview-title {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .business-preview-name {
    font-size: 16px;
    font-weight: 700;
    color: #22c55e;
    margin-bottom: 4px;
  }

  .business-preview-detail {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 2px;
  }

  /* ── Toast ── */
  .settings-toast {
    position: fixed; bottom: 24px; right: 24px;
    padding: 12px 18px; border-radius: 10px;
    font-size: 13px; font-weight: 600; color: white;
    z-index: 9999; animation: toastIn 0.3s cubic-bezier(0.16,1,0.3,1);
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  .settings-toast.success { background: #16a34a; }
  .settings-toast.error   { background: #dc2626; }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Light theme overrides ── */
  body.light-theme {
    background: #f1f5f9 !important;
  }

  body.light-theme .app { background: #f1f5f9 !important; }
  body.light-theme .topbar { background: #ffffff !important; border-bottom: 1px solid #e2e8f0 !important; }
  body.light-theme .topbar h1 { color: #1e293b !important; }
  body.light-theme .topbar-subtitle { color: #64748b !important; }
  body.light-theme .sidebar { background: #ffffff !important; border-right: 1px solid #e2e8f0 !important; }
  body.light-theme .sidebar-item { color: #475569 !important; }
  body.light-theme .sidebar-item:hover { background: #f1f5f9 !important; color: #1e293b !important; }
  body.light-theme .sidebar-item.active { background: rgba(59,130,246,0.1) !important; color: #3b82f6 !important; }
  body.light-theme .settings-page { background: #f1f5f9 !important; }
  body.light-theme .settings-card { background: #ffffff !important; border-color: #e2e8f0 !important; }
  body.light-theme .settings-header h1 { color: #1e293b !important; }
  body.light-theme .settings-card-title { color: #1e293b !important; }
  body.light-theme .settings-field input,
  body.light-theme .settings-field textarea { background: #f8fafc !important; border-color: #e2e8f0 !important; color: #1e293b !important; }
  body.light-theme .business-preview { background: #f8fafc !important; border-color: #e2e8f0 !important; }
`;

const DEFAULT_BUSINESS = {
  name: 'TN Book Store',
  address: '',
  phone: '',
  email: '',
  tagline: ''
};

function Settings() {
  const [business, setBusiness] = useState(() => {
    const saved = localStorage.getItem('bookshop_business');
    return saved ? JSON.parse(saved) : DEFAULT_BUSINESS;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bookshop_theme') || 'dark';
  });

  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('bookshop_theme') || 'dark';
  });

  const [toast, setToast] = useState(null);

  // Apply saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('bookshop_theme') || 'dark';
    if (saved === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveBusiness = () => {
    if (!business.name.trim()) {
      showToast('Shop name is required', 'error'); return;
    }
    localStorage.setItem('bookshop_business', JSON.stringify(business));
    showToast('✅ Business info saved!');
  };

  const applyTheme = () => {
    setTheme(selectedTheme);
    localStorage.setItem('bookshop_theme', selectedTheme);
    if (selectedTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    showToast(`✅ ${selectedTheme === 'dark' ? 'Dark' : 'Light'} theme applied!`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="settings-page">

        <div className="settings-header">
          <h1>⚙️ Settings</h1>
          <p>Manage your business info and app preferences</p>
        </div>

        <div className="settings-grid">

          {/* ── Business Info ── */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon blue">🏪</div>
              <div>
                <p className="settings-card-title">Business Information</p>
                <p className="settings-card-subtitle">Your shop details shown on invoices</p>
              </div>
            </div>

            <div className="settings-field">
              <label>Shop Name *</label>
              <input
                type="text"
                placeholder="e.g. TN Book Store"
                value={business.name}
                onChange={e => setBusiness({ ...business, name: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label>Tagline</label>
              <input
                type="text"
                placeholder="e.g. Your favourite book destination"
                value={business.tagline}
                onChange={e => setBusiness({ ...business, tagline: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label>Address</label>
              <textarea
                rows={2}
                placeholder="e.g. 123 Main Street, Colombo"
                value={business.address}
                onChange={e => setBusiness({ ...business, address: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="e.g. +94 77 123 4567"
                value={business.phone}
                onChange={e => setBusiness({ ...business, phone: e.target.value })}
              />
            </div>
            <div className="settings-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="e.g. info@tnbookstore.com"
                value={business.email}
                onChange={e => setBusiness({ ...business, email: e.target.value })}
              />
            </div>

            {/* Live preview */}
            <div className="business-preview">
              <div className="business-preview-title">Preview</div>
              <div className="business-preview-name">{business.name || 'Shop Name'}</div>
              {business.tagline && <div className="business-preview-detail">{business.tagline}</div>}
              {business.address && <div className="business-preview-detail">📍 {business.address}</div>}
              {business.phone   && <div className="business-preview-detail">📞 {business.phone}</div>}
              {business.email   && <div className="business-preview-detail">✉️ {business.email}</div>}
            </div>

            <button className="settings-save-btn" onClick={saveBusiness}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Business Info
            </button>
          </div>

          {/* ── Theme ── */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon purple">🎨</div>
              <div>
                <p className="settings-card-title">Appearance</p>
                <p className="settings-card-subtitle">Choose your preferred theme</p>
              </div>
            </div>

            <div className="theme-options">
              {/* Dark */}
              <div
                className={`theme-option dark-opt ${selectedTheme === 'dark' ? 'active' : ''}`}
                onClick={() => setSelectedTheme('dark')}
              >
                <div className="theme-option-left">
                  <div className="theme-preview dark">🌙</div>
                  <div>
                    <div className="theme-name">Dark Mode</div>
                    <div className="theme-desc">Easy on the eyes, great for long shifts</div>
                  </div>
                </div>
                <div className="theme-radio">
                  <div className="theme-radio-dot" />
                </div>
              </div>

              {/* Light */}
              <div
                className={`theme-option light-opt ${selectedTheme === 'light' ? 'active' : ''}`}
                onClick={() => setSelectedTheme('light')}
              >
                <div className="theme-option-left">
                  <div className="theme-preview light">☀️</div>
                  <div>
                    <div className="theme-name">Light Mode</div>
                    <div className="theme-desc">Clean and bright for well-lit spaces</div>
                  </div>
                </div>
                <div className="theme-radio">
                  <div className="theme-radio-dot" />
                </div>
              </div>
            </div>

            <button className="theme-apply-btn" onClick={applyTheme}>
              🎨 Apply Theme
            </button>

            <div style={{
              marginTop: '20px', padding: '14px 16px',
              background: '#111827', borderRadius: '10px',
              border: '1px solid #2a3147'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Current Theme
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'} — Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {toast && (
        <div className={`settings-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}

export default Settings;