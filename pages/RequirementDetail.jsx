import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import OfferCard from '../components/OfferCard';
import ChatWindow from '../components/ChatWindow';
import {
  ArrowLeft, Clock, Tag, IndianRupee, User, Send,
  ShieldCheck, Calendar, Package, AlertCircle,
} from 'lucide-react';

function daysLeft(d) {
  const days = Math.ceil((new Date(d) - Date.now()) / 86400000);
  return days < 0
    ? { label: 'Expired', urgent: true }
    : days === 0
    ? { label: 'Expires today', urgent: true }
    : { label: `${days} day${days > 1 ? 's' : ''} left`, urgent: days <= 2 };
}

const CAT_COLORS = {
  Electronics: '#3b82f6', Furniture: '#f97316', Services: '#22c55e',
  Clothing: '#a855f7', Groceries: '#f59e0b', Other: '#94a3b8',
};

export default function RequirementDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [req,          setReq]          = useState(null);
  const [offers,       setOffers]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [chatOffer,    setChatOffer]    = useState(null);
  const [offerForm,    setOfferForm]    = useState({ price: '', deliveryDays: '', warrantyMonths: '', note: '' });
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError,   setOfferError]   = useState('');
  const [offerSuccess, setOfferSuccess] = useState('');

  const isBuyer  = user?.role === 'buyer'  || user?.role === 'both';
  const isSeller = user?.role === 'seller' || user?.role === 'both';

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [rRes, oRes] = await Promise.all([
        api.get(`/requirements/${id}`),
        api.get(`/requirements/${id}/offers`),
      ]);
      setReq(rRes.data);
      setOffers(oRes.data);
    } catch { setError('Failed to load this requirement.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const isOwner = req && (req.buyerId?._id === user?.id || req.buyerId === user?.id);
  const myOffer = offers.find(o => o.sellerId?._id === user?.id || o.sellerId === user?.id);
  const dl      = req ? daysLeft(req.deadline) : null;
  const accentColor = CAT_COLORS[req?.category] || '#94a3b8';

  const acceptOffer = async (offerId) => {
    if (!window.confirm('Accept this offer? All other offers will be rejected.')) return;
    try { await api.post(`/offers/${offerId}/accept`); load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to accept offer'); }
  };

  const submitOffer = async (e) => {
    e.preventDefault(); setOfferError(''); setOfferSuccess(''); setOfferLoading(true);
    try {
      await api.post('/offers', {
        requirementId: id,
        price:         +offerForm.price,
        deliveryDays:  +offerForm.deliveryDays,
        warrantyMonths: +offerForm.warrantyMonths || 0,
        note: offerForm.note,
      });
      setOfferSuccess('Offer submitted successfully! The buyer will be notified.');
      setOfferForm({ price: '', deliveryDays: '', warrantyMonths: '', note: '' });
      load();
    } catch (err) { setOfferError(err.response?.data?.message || 'Failed to submit offer'); }
    finally { setOfferLoading(false); }
  };

  if (loading) return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 104px)' }}>
      <div className="spinner" />
    </div>
  );
  if (error) return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 104px)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="alert alert-error">{error}</div>
      </div>
    </div>
  );
  if (!req) return null;

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 104px)' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f4f8', padding: '.75rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.8rem', color: '#94a3b8' }}>
          <button onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '.25rem', fontFamily: 'inherit', fontSize: '.8rem', padding: '0' }}>
            <ArrowLeft size={13} /> Back
          </button>
          <span>›</span>
          <span style={{ color: '#64748b' }}>{req.category}</span>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 600, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div>
          {/* Requirement detail card */}
          <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            {/* Color top bar */}
            <div style={{ height: 4, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}40)` }} />
            <div style={{ padding: '1.75rem' }}>

              {/* Status + deadline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '.28rem .875rem', borderRadius: 999,
                  fontSize: '.7rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: req.status === 'open' ? '#dcfce7' : req.status === 'fulfilled' ? '#ede9fe' : '#f1f5f9',
                  color:      req.status === 'open' ? '#15803d' : req.status === 'fulfilled' ? '#6d28d9' : '#475569',
                }}>
                  {req.status.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '.8rem', color: dl?.urgent ? '#f97316' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '.3rem', fontWeight: dl?.urgent ? 700 : 500 }}>
                  <Clock size={13} /> {dl?.label}
                </span>
              </div>

              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3, color: '#0f172a', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {req.title}
              </h1>

              {req.description && (
                <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: 1.8, fontSize: '.9rem' }}>
                  {req.description}
                </p>
              )}

              {/* Meta pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.625rem' }}>
                {[
                  { icon: <IndianRupee size={12} />, label: `₹${req.budgetMin?.toLocaleString('en-IN')} – ₹${req.budgetMax?.toLocaleString('en-IN')}`, bg: '#eff6ff', color: '#2563eb' },
                  { icon: <Tag size={12} />,         label: req.category,           bg: '#f5f3ff', color: '#7c3aed' },
                  { icon: <User size={12} />,        label: req.buyerId?.name,      bg: '#f0fdf4', color: '#16a34a' },
                  { icon: <Package size={12} />,     label: `Qty: ${req.quantity}`, bg: '#f8fafc', color: '#64748b' },
                  { icon: <Calendar size={12} />,    label: new Date(req.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), bg: '#fefce8', color: '#92400e' },
                ].map(({ icon, label, bg, color }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: '.35rem',
                    padding: '.35rem .875rem', borderRadius: 999,
                    background: bg, color, fontSize: '.78rem', fontWeight: 600,
                  }}>
                    {icon}{label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BUYER: Offers list */}
          {isOwner && (
            <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="section-header">
                <div>
                  <h2 className="section-title">Received Offers</h2>
                  <p style={{ fontSize: '.78rem', color: '#94a3b8', marginTop: '.2rem' }}>Ranked by match score</p>
                </div>
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '.3rem .875rem', borderRadius: 999, fontSize: '.75rem', fontWeight: 700 }}>
                  {offers.length} total
                </span>
              </div>

              {offers.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">⏳</div>
                  <div className="empty-title">No offers yet</div>
                  <p>Sellers will bid on your request soon. Check back shortly!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="stagger">
                  {offers.map((offer, i) => (
                    <OfferCard key={offer._id} offer={offer} rank={i + 1}
                      isBuyer={isOwner && req.status === 'open'}
                      onAccept={acceptOffer} onChat={o => setChatOffer(o)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SELLER: Offer form or status */}
          {isSeller && !isOwner && (
            <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              {myOffer ? (
                <>
                  <div className="section-header">
                    <h2 className="section-title">Your Submitted Offer</h2>
                    <span className={`badge badge-${myOffer.status}`}>{myOffer.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                    {[['Your Price', `₹${myOffer.price?.toLocaleString('en-IN')}`], ['Delivery', `${myOffer.deliveryDays} days`], ['Warranty', myOffer.warrantyMonths ? `${myOffer.warrantyMonths} mo` : 'None']].map(([k, v]) => (
                      <div key={k} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '.72rem', color: '#94a3b8', marginBottom: '.375rem', fontWeight: 500 }}>{k}</div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '.95rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="score-bar" style={{ flex: 1 }}>
                      <div className="score-fill" style={{ width: `${Math.min(100, myOffer.score || 0)}%` }} />
                    </div>
                    <span style={{ fontWeight: 700, color: '#7c3aed', fontSize: '.82rem', whiteSpace: 'nowrap' }}>
                      {myOffer.score?.toFixed(1)}/100
                    </span>
                  </div>
                </>
              ) : req.status === 'open' ? (
                <>
                  <div className="section-header">
                    <h2 className="section-title">Submit Your Offer</h2>
                  </div>
                  {offerError   && <div className="alert alert-error">{offerError}</div>}
                  {offerSuccess && <div className="alert alert-success">✅ {offerSuccess}</div>}
                  <form onSubmit={submitOffer}>
                    <div className="form-row" style={{ marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Your Price (₹) *</label>
                        <input className="form-input" type="number" min={1}
                          placeholder={`Max: ₹${req.budgetMax?.toLocaleString('en-IN')}`}
                          value={offerForm.price}
                          onChange={e => setOfferForm(p => ({ ...p, price: e.target.value }))} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Delivery Days *</label>
                        <input className="form-input" type="number" min={1} max={90} placeholder="e.g. 3"
                          value={offerForm.deliveryDays}
                          onChange={e => setOfferForm(p => ({ ...p, deliveryDays: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Warranty (months)</label>
                      <input className="form-input" type="number" min={0} placeholder="e.g. 12"
                        value={offerForm.warrantyMonths}
                        onChange={e => setOfferForm(p => ({ ...p, warrantyMonths: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label">Note to Buyer</label>
                      <textarea className="form-input" rows={3}
                        placeholder="What makes your offer special? Any additional benefits?"
                        value={offerForm.note}
                        onChange={e => setOfferForm(p => ({ ...p, note: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={offerLoading}
                      style={{ width: '100%', justifyContent: 'center', padding: '.8rem', fontSize: '.95rem', borderRadius: 12 }}>
                      {offerLoading
                        ? <span style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} />
                            Submitting…
                          </span>
                        : <><Send size={15} /> Submit Offer</>
                      }
                    </button>
                  </form>
                </>
              ) : (
                <div className="empty">
                  <div className="empty-icon"><AlertCircle size={40} style={{ margin: '0 auto', opacity: .25, display: 'block' }} /></div>
                  <div className="empty-title">Closed</div>
                  <p>This request is no longer accepting offers.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
              Request Summary
            </h3>
            {[
              ['Category',   req.category],
              ['Quantity',   `${req.quantity} unit${req.quantity > 1 ? 's' : ''}`],
              ['Offers',     `${offers.length} received`],
              ['Deadline',   new Date(req.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
              ['Posted by',  req.buyerId?.name],
            ].map(([k, v]) => (
              <div key={k} className="info-row">
                <span className="info-key">{k}</span>
                <span className="info-val">{v}</span>
              </div>
            ))}
          </div>

          {/* Budget card */}
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
            border: '1.5px solid #bfdbfe',
            borderRadius: 16,
            padding: '1.25rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#7c3aed', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '.5rem' }}>
              Budget Range
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563eb', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ₹{req.budgetMin?.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '.75rem', color: '#94a3b8', margin: '.2rem 0' }}>to</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563eb', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ₹{req.budgetMax?.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {chatOffer && <ChatWindow offer={chatOffer} onClose={() => setChatOffer(null)} />}
    </div>
  );
}
