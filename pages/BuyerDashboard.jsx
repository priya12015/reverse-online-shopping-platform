import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import RequirementCard from '../components/RequirementCard';
import { PlusCircle, RefreshCw, ShoppingBag, TrendingUp, Clock, CheckCircle, MessageSquare } from 'lucide-react';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reqs,    setReqs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/requirements/my');
      setReqs(data);
    } catch {
      setError('Failed to load your requirements. Please try again.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const stats = [
    {
      icon: '📋', label: 'Total Posted',
      value: reqs.length,
      color: '#eff6ff', textColor: '#2563eb', border: '#bfdbfe',
    },
    {
      icon: '🟢', label: 'Open',
      value: reqs.filter(r => r.status === 'open').length,
      color: '#f0fdf4', textColor: '#16a34a', border: '#bbf7d0',
    },
    {
      icon: '✅', label: 'Fulfilled',
      value: reqs.filter(r => r.status === 'fulfilled').length,
      color: '#f5f3ff', textColor: '#7c3aed', border: '#ddd6fe',
    },
    {
      icon: '💬', label: 'Total Offers',
      value: reqs.reduce((s, r) => s + (r.offerCount || 0), 0),
      color: '#fefce8', textColor: '#d97706', border: '#fde68a',
    },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 104px)' }}>

      {/* Dashboard hero */}
      <div className="dash-hero">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '.8rem', color: '#93c5fd', fontWeight: 600, marginBottom: '.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Buyer Dashboard
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '.375rem', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Hello, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '.875rem', fontWeight: 400 }}>
                Manage your requirements and review incoming offers
              </p>
            </div>
            <button
              className="btn btn-warning btn-lg"
              onClick={() => navigate('/buyer/post')}
              style={{ fontWeight: 800, flexShrink: 0 }}
            >
              <PlusCircle size={18} /> Post New Requirement
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem' }}>

        {/* Stats */}
        <div className="grid-4 stagger" style={{ marginBottom: '2rem', marginTop: '-1.75rem', position: 'relative', zIndex: 10 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: '#fff',
              border: `1.5px solid ${s.border}`,
              borderRadius: 16,
              padding: '1.25rem 1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'; }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: s.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', marginBottom: '.875rem',
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: s.textColor, lineHeight: 1, letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {s.value}
              </div>
              <div style={{ fontSize: '.78rem', color: '#94a3b8', marginTop: '.3rem', fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Requirements section */}
        <div style={{
          background: '#fff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 20,
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">My Requirements</h2>
              <p style={{ fontSize: '.8rem', color: '#94a3b8', marginTop: '.2rem' }}>
                {reqs.length} requirement{reqs.length !== 1 ? 's' : ''} posted
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={load} disabled={loading}>
              <RefreshCw size={13} style={{ animation: loading ? 'spin .6s linear infinite' : 'none' }} /> Refresh
            </button>
          </div>

          {loading && <div className="spinner" />}
          {error && <div className="alert alert-error">{error}</div>}

          {!loading && reqs.length === 0 && (
            <div className="empty">
              <div className="empty-icon">
                <ShoppingBag size={48} style={{ margin: '0 auto', opacity: .25, display: 'block' }} />
              </div>
              <div className="empty-title">No requirements yet</div>
              <p style={{ marginBottom: '1.5rem' }}>
                Post your first requirement and let verified sellers compete for your business!
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/buyer/post')}>
                <PlusCircle size={15} /> Post Your First Requirement
              </button>
            </div>
          )}

          {!loading && reqs.length > 0 && (
            <div className="grid-2 stagger">
              {reqs.map(r => <RequirementCard key={r._id} req={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
