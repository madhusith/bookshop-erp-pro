import { useEffect, useState } from "react";

const styles = `
  .users-page {
    padding: 28px 32px;
    font-family: 'Inter', sans-serif;
    color: #f1f5f9;
    min-height: 100vh;
    background: #0f1117;
  }

  .users-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .users-header-left h1 {
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.3px;
    margin: 0 0 4px 0;
  }

  .users-header-left p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  .add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: #3b82f6;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    box-shadow: 0 4px 12px rgba(59,130,246,0.3);
  }

  .add-btn:hover { background: #2563eb; }
  .add-btn:active { transform: scale(0.98); }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: #1c2233;
    border: 1px solid #2a3147;
    border-radius: 12px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .stat-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .stat-icon.blue   { background: rgba(59,130,246,0.12); }
  .stat-icon.green  { background: rgba(34,197,94,0.12); }
  .stat-icon.purple { background: rgba(168,85,247,0.12); }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #f1f5f9;
    line-height: 1;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal {
    background: #1c2233;
    border: 1px solid #2a3147;
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.5);
    animation: slideUp 0.25s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0;
  }

  .modal-close {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: #111827;
    border: 1px solid #2a3147;
    color: #64748b;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    font-size: 18px;
    line-height: 1;
  }

  .modal-close:hover {
    background: rgba(239,68,68,0.1);
    border-color: rgba(239,68,68,0.3);
    color: #f87171;
  }

  .form-field { margin-bottom: 16px; }

  .form-field label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 8px;
    letter-spacing: 0.02em;
  }

  .form-field input,
  .form-field select {
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

  .form-field input:focus,
  .form-field select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  .form-field input::placeholder { color: #4b5680; }
  .form-field select option { background: #1c2233; }

  .modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 24px;
  }

  .btn-cancel {
    flex: 1;
    padding: 11px;
    background: #111827;
    border: 1px solid #2a3147;
    border-radius: 8px;
    color: #94a3b8;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }

  .btn-cancel:hover { background: #1c2233; color: #f1f5f9; }

  .btn-submit {
    flex: 2;
    padding: 11px;
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
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .btn-submit:hover { background: #2563eb; }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .btn-submit.green {
    background: #16a34a;
    box-shadow: 0 4px 12px rgba(22,163,74,0.25);
  }
  .btn-submit.green:hover { background: #15803d; }

  .table-card {
    background: #1c2233;
    border: 1px solid #2a3147;
    border-radius: 14px;
    overflow: hidden;
  }

  .table-toolbar {
    padding: 16px 20px;
    border-bottom: 1px solid #2a3147;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .table-toolbar-title {
    font-size: 14px;
    font-weight: 600;
    color: #f1f5f9;
    white-space: nowrap;
  }

  .search-wrap {
    position: relative;
    flex: 1;
    max-width: 280px;
  }

  .search-wrap input {
    width: 100%;
    background: #111827;
    border: 1px solid #2a3147;
    border-radius: 8px;
    padding: 8px 12px 8px 36px;
    color: #f1f5f9;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .search-wrap input:focus { border-color: #3b82f6; }
  .search-wrap input::placeholder { color: #4b5680; }

  .search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: #4b5680;
    pointer-events: none;
  }

  table { width: 100%; border-collapse: collapse; }

  thead th {
    padding: 12px 20px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: #161b27;
    border-bottom: 1px solid #2a3147;
  }

  tbody tr {
    border-bottom: 1px solid #1e2538;
    transition: background 0.15s;
  }

  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(59,130,246,0.04); }

  tbody td {
    padding: 14px 20px;
    font-size: 13.5px;
    color: #cbd5e1;
    vertical-align: middle;
  }

  .user-cell { display: flex; align-items: center; gap: 12px; }

  .user-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: white; flex-shrink: 0;
  }

  .user-name  { font-size: 14px; font-weight: 600; color: #f1f5f9; }
  .user-email { font-size: 12px; color: #64748b; margin-top: 1px; }

  .role-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: capitalize;
  }

  .role-badge.admin   { background: rgba(59,130,246,0.12);  color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
  .role-badge.manager { background: rgba(168,85,247,0.12);  color: #c084fc; border: 1px solid rgba(168,85,247,0.2); }
  .role-badge.cashier { background: rgba(34,197,94,0.12);   color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }

  .action-btns { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

  .btn-password {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 12px;
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 7px;
    color: #60a5fa;
    font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: all 0.2s;
  }

  .btn-password:hover {
    background: rgba(59,130,246,0.15);
    border-color: rgba(59,130,246,0.4);
  }

  .btn-delete {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 12px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 7px;
    color: #f87171;
    font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: all 0.2s;
  }

  .btn-delete:hover {
    background: rgba(239,68,68,0.15);
    border-color: rgba(239,68,68,0.4);
  }

  .empty-state { text-align: center; padding: 60px 20px; color: #4b5680; }
  .empty-state p { font-size: 14px; margin: 8px 0 0; }

  .confirm-modal {
    background: #1c2233; border: 1px solid #2a3147; border-radius: 14px;
    padding: 28px; width: 100%; max-width: 360px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.5);
    animation: slideUp 0.25s cubic-bezier(0.16,1,0.3,1);
    text-align: center;
  }

  .confirm-icon {
    width: 52px; height: 52px; background: rgba(239,68,68,0.1);
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; margin: 0 auto 16px;
  }

  .confirm-title { font-size: 17px; font-weight: 700; color: #f1f5f9; margin: 0 0 8px; }
  .confirm-desc { font-size: 13px; color: #64748b; margin: 0 0 24px; line-height: 1.6; }
  .confirm-actions { display: flex; gap: 10px; }

  .btn-confirm-delete {
    flex: 1; padding: 11px; background: #ef4444; border: none;
    border-radius: 8px; color: white; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: inherit; transition: background 0.2s;
  }

  .btn-confirm-delete:hover { background: #dc2626; }

  .pw-user-info {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
    background: #111827;
    border: 1px solid #2a3147;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .users-toast {
    position: fixed; bottom: 24px; right: 24px;
    padding: 12px 18px; border-radius: 10px;
    font-size: 13px; font-weight: 600; color: white;
    z-index: 9999; animation: toastIn 0.3s cubic-bezier(0.16,1,0.3,1);
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  .users-toast.success { background: #16a34a; }
  .users-toast.error   { background: #dc2626; }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

const AVATAR_COLORS = [
  'linear-gradient(135deg, #3b82f6, #6366f1)',
  'linear-gradient(135deg, #22c55e, #16a34a)',
  'linear-gradient(135deg, #a855f7, #7c3aed)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ef4444, #dc2626)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Users({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pwTarget, setPwTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cashier' });
  const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' });

  // Only admin and manager can change passwords
  const canChangePassword = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/users');
      const data = await res.json();
      setUsers(data.users || data);
    } catch {
      showToast('Failed to load users', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      showToast('All fields are required', 'error'); return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5050/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      showToast(`✅ ${form.name} added successfully`);
      setForm({ name: '', email: '', password: '', role: 'cashier' });
      setShowModal(false);
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.newPassword || !pwForm.confirmPassword) {
      showToast('All fields are required', 'error'); return;
    }
    if (pwForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error'); return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast('Passwords do not match', 'error'); return;
    }
    setPwLoading(true);
    try {
      const res = await fetch(`http://localhost:5050/api/user/${pwTarget.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      showToast(`✅ Password updated for ${pwTarget.name}`);
      setPwTarget(null);
      setPwForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPwLoading(false);
    }
  };

  const confirmDelete = (user) => setDeleteTarget(user);

  const deleteUser = async () => {
    try {
      await fetch(`http://localhost:5050/api/user/${deleteTarget.id}`, { method: 'DELETE' });
      showToast(`${deleteTarget.name} removed`);
      setDeleteTarget(null);
      loadUsers();
    } catch {
      showToast('Failed to delete user', 'error');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total:   users.length,
    cashier: users.filter(u => u.role === 'cashier').length,
    admin:   users.filter(u => u.role === 'admin').length,
    manager: users.filter(u => u.role === 'manager').length,
  };

  return (
    <>
      <style>{styles}</style>
      <div className="users-page">

        {/* Header */}
        <div className="users-header">
          <div className="users-header-left">
            <h1>👥 Staff Management</h1>
            <p>Manage user accounts and access roles</p>
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Staff
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon blue">👥</div>
            <div><div className="stat-value">{counts.total}</div><div className="stat-label">Total Staff</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">🧾</div>
            <div><div className="stat-value">{counts.cashier}</div><div className="stat-label">Cashiers</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">⚙️</div>
            <div><div className="stat-value">{counts.admin + counts.manager}</div><div className="stat-label">Admins & Managers</div></div>
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-toolbar">
            <span className="table-toolbar-title">All Staff ({filtered.length})</span>
            <div className="search-wrap">
              <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                placeholder="Search by name, email or role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <div className="empty-state">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4b5680" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                      <p>No staff members found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: getAvatarColor(u.name || 'U') }}>
                          {(u.name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="user-name">{u.name}</div>
                          <div className="user-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${u.role}`}>
                        {u.role === 'admin'   && '🔑'}
                        {u.role === 'manager' && '📋'}
                        {u.role === 'cashier' && '🧾'}
                        {' '}{u.role}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        {/* Change Password — admin & manager only */}
                        {canChangePassword && (
                          <button className="btn-password" onClick={() => {
                            setPwTarget(u);
                            setPwForm({ newPassword: '', confirmPassword: '' });
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                              <path d="M7 11V7a5 5 0 0110 0v4"/>
                            </svg>
                            Change Password
                          </button>
                        )}
                        <button className="btn-delete" onClick={() => confirmDelete(u)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                          </svg>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── ADD STAFF MODAL ── */}
        {showModal && (
          <div className="modal-overlay" onClick={e => e.target.className === 'modal-overlay' && setShowModal(false)}>
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">Add New Staff</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={createUser}>
                <div className="form-field">
                  <label>Full Name</label>
                  <input placeholder="e.g. John Silva" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="e.g. john@bookshop.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Password</label>
                  <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="cashier">🧾 Cashier</option>
                    <option value="manager">📋 Manager</option>
                    <option value="admin">🔑 Admin</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                          <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Staff Member
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── CHANGE PASSWORD MODAL ── */}
        {pwTarget && (
          <div className="modal-overlay" onClick={e => e.target.className === 'modal-overlay' && setPwTarget(null)}>
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">🔑 Change Password</h3>
                <button className="modal-close" onClick={() => setPwTarget(null)}>×</button>
              </div>

              {/* Staff info bar */}
              <div className="pw-user-info">
                <div className="user-avatar" style={{
                  background: getAvatarColor(pwTarget.name || 'U'),
                  width: 38, height: 38, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0
                }}>
                  {(pwTarget.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <div className="user-name">{pwTarget.name}</div>
                  <div className="user-email">{pwTarget.email}</div>
                </div>
              </div>

              <form onSubmit={changePassword}>
                <div className="form-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={pwForm.newPassword}
                    onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    value={pwForm.confirmPassword}
                    onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setPwTarget(null)}>Cancel</button>
                  <button type="submit" className="btn-submit green" disabled={pwLoading}>
                    {pwLoading ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                          <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── DELETE CONFIRM MODAL ── */}
        {deleteTarget && (
          <div className="modal-overlay" onClick={e => e.target.className === 'modal-overlay' && setDeleteTarget(null)}>
            <div className="confirm-modal">
              <div className="confirm-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              </div>
              <h3 className="confirm-title">Remove Staff Member?</h3>
              <p className="confirm-desc">
                Are you sure you want to remove{' '}
                <strong style={{ color: '#f1f5f9' }}>{deleteTarget.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="confirm-actions">
                <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="btn-confirm-delete" onClick={deleteUser}>Yes, Remove</button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className={`users-toast ${toast.type}`}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.message}
          </div>
        )}

      </div>
    </>
  );
}

export default Users;