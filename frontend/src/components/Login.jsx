import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0f1117;
    --card: #1c2233;
    --border: #2a3147;
    --border-bright: #3a4560;
    --blue: #3b82f6;
    --blue-hover: #2563eb;
    --blue-glow: rgba(59,130,246,0.15);
    --green: #22c55e;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #4b5680;
    --input-bg: #111827;
    --error-bg: rgba(239,68,68,0.08);
  }

  body { background: var(--bg); font-family: 'Inter', sans-serif; }

  .wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
  }

  /* ── Top bar ── */
  .topbar {
    height: 64px;
    background: #161b27;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 32px;
    flex-shrink: 0;
  }

  .topbar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .topbar-icon {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(34,197,94,0.3);
    flex-shrink: 0;
  }

  .topbar-title { font-size: 16px; font-weight: 700; color: var(--text-primary); }
  .topbar-business {
    font-size: 11px;
    color: var(--green);
    font-weight: 600;
    margin-top: 1px;
    letter-spacing: 0.03em;
  }

  /* ── Login area ── */
  .login-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    position: relative;
  }

  .login-area::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 50% 50% at 60% 40%, rgba(59,130,246,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 30% 40% at 20% 80%, rgba(34,197,94,0.04) 0%, transparent 60%);
    pointer-events: none;
  }

  .login-card {
    width: 100%;
    max-width: 440px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px;
    position: relative;
    z-index: 1;
    box-shadow:
      0 4px 6px rgba(0,0,0,0.3),
      0 20px 60px rgba(0,0,0,0.4),
      0 0 0 1px rgba(255,255,255,0.03);
    animation: cardIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }

  .card-logo {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 4px 14px rgba(34,197,94,0.25);
  }

  .card-title { font-size: 16px; font-weight: 700; color: var(--text-primary); }
  .card-sub { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 6px;
    letter-spacing: -0.4px;
  }

  .section-desc {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 28px;
  }

  .error-msg {
    background: var(--error-bg);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px;
    color: #fca5a5;
    font-size: 12.5px;
    font-weight: 500;
    padding: 12px 14px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .field { margin-bottom: 18px; }

  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 8px;
    letter-spacing: 0.02em;
  }

  .input-wrap { position: relative; }

  input[type="email"],
  input[type="text"],
  input[type="password"] {
    width: 100%;
    background: var(--input-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    outline: none;
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;
    padding: 11px 40px 11px 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px var(--blue-glow);
  }

  input::placeholder { color: var(--text-muted); }

  .input-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
  }

  .input-icon:hover { color: var(--blue); }

  .options-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    margin-top: 4px;
  }

  .remember {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }

  .custom-cb {
    width: 16px; height: 16px;
    border: 1.5px solid var(--border-bright);
    border-radius: 4px;
    background: var(--input-bg);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .custom-cb.checked {
    border-color: var(--blue);
    background: var(--blue);
  }

  .remember-label {
    font-size: 12.5px;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .forgot {
    font-size: 12.5px;
    color: var(--blue);
    font-weight: 500;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'Inter', sans-serif;
    transition: color 0.2s;
  }

  .forgot:hover { color: #93c5fd; }

  .login-btn {
    width: 100%;
    padding: 13px;
    background: var(--blue);
    border: none;
    border-radius: 8px;
    color: white;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    margin-bottom: 20px;
    box-shadow: 0 4px 14px rgba(59,130,246,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .login-btn:hover:not(:disabled) {
    background: var(--blue-hover);
    box-shadow: 0 4px 20px rgba(59,130,246,0.45);
  }

  .login-btn:active:not(:disabled) { transform: scale(0.99); }

  .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .footer-note {
    font-size: 11.5px;
    color: var(--text-muted);
    text-align: center;
    line-height: 1.7;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your credentials."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5050/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) { onLogin(data.user); }
      else { setError("Invalid email or password. Please try again."); }
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <>
      <style>{styles}</style>
      <div className="wrapper">

        {/* Top bar only — no sidebar */}
        <div className="topbar">
          <div className="topbar-logo">
            <div className="topbar-icon">📚</div>
            <div>
              <div className="topbar-title">Bookshop ERP</div>
              <div className="topbar-business">TN Book Store</div>
            </div>
          </div>
        </div>

        {/* Centered login card */}
        <div className="login-area">
          <div className="login-card">
            <div className="card-header">
              <div className="card-logo">📚</div>
              <div>
                <div className="card-title">Bookshop ERP</div>
                <div className="card-sub">Point of Sale System · v2.0 Pro</div>
              </div>
            </div>

            <div className="section-title">Welcome back</div>
            <p className="section-desc">Sign in to your staff account to continue</p>

            {error && (
              <div className="error-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrap">
                <input
                  id="email" type="email"
                  placeholder="you@bookshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="email"
                />
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="current-password"
                />
                <span className="input-icon" onClick={() => setShowPass(!showPass)}>
                  {showPass ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="options-row">
              <div className="remember" onClick={() => setRemember(!remember)}>
                <div className={`custom-cb ${remember ? "checked" : ""}`}>
                  {remember && (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <polyline points="1,5 4,8 9,2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <span className="remember-label">Remember me</span>
              </div>
              <button className="forgot">Forgot password?</button>
            </div>

            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}>
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Sign In
                </>
              )}
            </button>

            <p className="footer-note">
              Secure access for authorized staff only.<br/>
              © {new Date().getFullYear()} Bookshop ERP · All rights reserved
            </p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Login;