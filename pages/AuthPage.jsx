import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';

export default function AuthPage() {
  const [params]   = useSearchParams();
  const [tab,      setTab]      = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [role,     setRole]     = useState(params.get('role') || 'buyer');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
  }, [user]);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const u = tab === 'login'
        ? await login(email, password)
        : await register(name, email, password, role);
      navigate(u.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const demoLogin = async (demoEmail) => {
    setError(''); setLoading(true);
    try {
      const u = await login(demoEmail, 'demo123');
      navigate(u.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally { setLoading(false); }
  };

  const ROLES = [
    { id: 'buyer',  label: '🛒 Buyer',  desc: 'Post requirements' },
    { id: 'seller', label: '🏪 Seller', desc: 'Submit offers' },
    { id: 'both',   label: '🔄 Both',   desc: 'Buy & sell' },
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 104px)',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f5f3ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 60, height: 60,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
          }}>
            <ShoppingBag size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '.875rem', marginTop: '.4rem' }}>
            {tab === 'login'
              ? 'Sign in to your BidMe account'
              : 'Start saving with reverse shopping today'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: 12,
          padding: '.3rem',
          marginBottom: '1.5rem',
          gap: '.25rem',
        }}>
          {[['login', '🔐 Sign In'], ['register', '✨ Register']].map(([t, label]) => (
            <button key={t}
              onClick={() => { setTab(t); setError(''); }}
              style={{
                flex: 1,
                padding: '.65rem',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: '.875rem',
                transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#2563eb' : '#94a3b8',
                boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Demo logins */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
          border: '1.5px solid #bfdbfe',
          borderRadius: 14,
          padding: '1.1rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.75rem' }}>
            <Zap size={13} style={{ color: '#2563eb' }} />
            <span style={{ fontSize: '.75rem', color: '#2563eb', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Quick Demo — No Registration Needed
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.625rem' }}>
            {[
              ['ravi@demo.com',     '👤 Demo Buyer'],
              ['techzone@demo.com', '🏪 Demo Seller'],
            ].map(([e, label]) => (
              <button key={e} onClick={() => demoLogin(e)} disabled={loading}
                style={{
                  padding: '.55rem .75rem',
                  borderRadius: 9,
                  border: '1.5px solid #bfdbfe',
                  background: '#fff',
                  color: '#2563eb',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  fontSize: '.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#93c5fd'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div style={{
          background: '#fff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 20,
          padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit}>
            {tab === 'register' && (
              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Your full name"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: '1.1rem', position: 'relative' }}>
              <label className="form-label">Password</label>
              <input className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                required style={{ paddingRight: '3rem' }} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: '.875rem', bottom: '.75rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', display: 'flex',
                }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {tab === 'register' && (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">I am registering as…</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.625rem', marginTop: '.1rem' }}>
                  {ROLES.map(r => (
                    <button key={r.id} type="button" onClick={() => setRole(r.id)}
                      style={{
                        padding: '.625rem .5rem',
                        borderRadius: 10,
                        border: '2px solid',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontWeight: 700,
                        fontSize: '.78rem',
                        transition: 'all 0.18s ease',
                        textAlign: 'center',
                        borderColor: role === r.id ? '#2563eb' : '#e2e8f0',
                        background:  role === r.id ? '#eff6ff' : '#f8fafc',
                        color:       role === r.id ? '#2563eb' : '#64748b',
                      }}
                    >
                      <div>{r.label}</div>
                      <div style={{ fontSize: '.68rem', fontWeight: 500, marginTop: '.2rem', opacity: .8 }}>{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '.85rem', fontSize: '.95rem', borderRadius: 12, marginTop: tab === 'login' ? '1.25rem' : 0 }}
            >
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} />
                    Please wait…
                  </span>
                : tab === 'login'
                  ? <><ArrowRight size={16} /> Sign In</>
                  : <><ArrowRight size={16} /> Create Free Account</>
              }
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.82rem', color: '#94a3b8' }}>
            {tab === 'login' ? (
              <>Don't have an account? <button onClick={() => { setTab('register'); setError(''); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>Sign up free</button></>
            ) : (
              <>Already have an account? <button onClick={() => { setTab('login'); setError(''); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>Sign in</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
