import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import RequirementCard from '../components/RequirementCard';
import { RefreshCw, Search, TrendingUp, Package, IndianRupee } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Services', 'Clothing', 'Groceries', 'Other'];

export default function SellerDashboard() {
  const { user }       = useAuth();
  const [searchParams] = useSearchParams();
  const [reqs,         setReqs]     = useState([]);
  const [myOffers,     setMyOffers] = useState([]);
  const [cat,          setCat]      = useState('All');
  const [loading,      setLoading]  = useState(true);
  const [tab,          setTab]      = useState('feed');
  const [error,        setError]    = useState('');

  const loadFeed = async () => {
    setLoading(true); setError('');
    try {
      const params = cat !== 'All' ? `?category=${cat}` : '';
      const { data } = await api.get(`/requirements${params}`);
      setReqs(data);
    } catch { setError('Failed to load requirements'); }
    finally { setLoading(false); }
  };

  const loadMyOffers = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/offers/my');
      setMyOffers(data);
    } catch { setError('Failed to load your offers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { tab === 'feed' ? loadFeed() : loadMyOffers(); }, [tab, cat]);

  const offerStats = {
    total:    myOffers.length,
    pending:  myOffers.filter(o => o.status === 'pending').length,
    accepted: myOffers.filter(o => o.status === 'accepted').length,
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 104px)' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)',
        color: '#fff',
        borderRadius: '0 0 28px 28px',
        padding: '2.5rem 1.5rem 3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,121,245,0.2), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '.8rem', color: '#c4b5fd', fontWeight: 600, marginBottom: '.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Seller Hub
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '.375rem', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Welcome back, {user?.name?.split(' ')[0]}! 🏪
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '.875rem' }}>
                Browse live buyer requests and submit your best competitive offer
              </p>
            </div>

            {/* Tab switcher */}
            <div className="tab-bar" style={{ flexShrink: 0 }}>
              {[['feed', '📋 Open Requests'], ['offers', '📨 My Offers']].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className={`tab-btn ${tab === id ? 'active' : ''}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Mini stats if on offers tab */}
          {tab === 'offers' && !loading && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Offers', value: offerStats.total, color: '#c4b5fd' },
                { label: 'Pending', value: offerStats.pending, color: '#fbbf24' },
                { label: 'Accepted', value: offerStats.accepted, color: '#34d399' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '.75rem 1.25rem', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '.15rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem' }}>

        {/* Category filter for feed */}
        {tab === 'feed' && (
          <div style={{
            background: '#fff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 16,
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <span style={{ fontSize: '.78rem', fontWeight: 700, color: '#64748b', flexShrink: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Filter
            </span>
            <div className="cat-scroll" style={{ flex: 1 }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCat(c)} className={`cat-chip ${cat === c ? 'active' : ''}`}>{c}</button>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadFeed} disabled={loading}>
              <RefreshCw size={13} style={{ animation: loading ? 'spin .6s linear infinite' : 'none' }} />
            </button>
          </div>
        )}

        {loading && <div className="spinner" />}
        {error   && <div className="alert alert-error">{error}</div>}

        {/* Feed */}
        {!loading && tab === 'feed' && (
          reqs.length === 0
            ? (
              <div className="empty" style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="empty-icon"><Search size={44} style={{ margin: '0 auto', opacity: .25, display: 'block' }} /></div>
                <div className="empty-title">No open requests</div>
                <p>No buyer requests in this category right now. Check back soon!</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '.82rem', color: '#94a3b8', marginBottom: '1.25rem', fontWeight: 500 }}>
                  <strong style={{ color: '#334155' }}>{reqs.length}</strong> open request{reqs.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid-2 stagger">
                  {reqs.map(r => <RequirementCard key={r._id} req={r} />)}
                </div>
              </>
            )
        )}

        {/* My Offers */}
        {!loading && tab === 'offers' && (
          myOffers.length === 0
            ? (
              <div className="empty" style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="empty-icon">📭</div>
                <div className="empty-title">No offers yet</div>
                <p>Browse open requests and submit your first offer!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="stagger">
                {myOffers.map(offer => (
                  <div key={offer._id} style={{
                    background: '#fff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 16,
                    padding: '1.25rem 1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = ''; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '.875rem', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '.975rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35, marginBottom: '.25rem' }}>
                          {offer.requirementId?.title}
                        </h3>
                        <span style={{ fontSize: '.72rem', color: '#94a3b8', fontWeight: 500 }}>
                          {offer.requirementId?.category}
                        </span>
                      </div>
                      <span className={`badge badge-${offer.status}`}>{offer.status}</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '.8rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', color: '#2563eb', fontWeight: 700 }}>
                        💰 ₹{offer.price?.toLocaleString('en-IN')}
                      </span>
                      <span style={{ color: '#64748b' }}>🚚 {offer.deliveryDays}d delivery</span>
                      <span style={{ color: '#64748b' }}>🛡️ {offer.warrantyMonths ? `${offer.warrantyMonths}mo warranty` : 'No warranty'}</span>
                      <span style={{ marginLeft: 'auto', background: '#f5f3ff', color: '#7c3aed', padding: '.2rem .625rem', borderRadius: 999, fontWeight: 700 }}>
                        Score: {offer.score?.toFixed(1)}/100
                      </span>
                    </div>

                    {offer.score != null && (
                      <div className="score-bar" style={{ marginTop: '.875rem' }}>
                        <div className="score-fill" style={{ width: `${Math.min(100, offer.score)}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
        )}
      </div>
    </div>
  );
}
