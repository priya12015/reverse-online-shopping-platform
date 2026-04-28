import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Send, IndianRupee, Calendar, ArrowLeft, Lightbulb } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Furniture', 'Services', 'Clothing', 'Groceries', 'Other'];

export default function PostRequirement() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ title: '', description: '', category: 'Electronics', budgetMin: '', budgetMax: '', quantity: 1, deadline: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const minDate = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

  const submit = async (e) => {
    e.preventDefault();
    if (+form.budgetMin >= +form.budgetMax) { setError('Minimum budget must be less than maximum budget.'); return; }
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/requirements', {
        ...form,
        budgetMin: +form.budgetMin,
        budgetMax: +form.budgetMax,
        quantity:  +form.quantity,
      });
      navigate(`/requirement/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post requirement. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 104px)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '1.5rem', color: '#64748b' }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '.375rem', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Post a Requirement
          </h1>
          <p style={{ color: '#64748b', fontSize: '.9rem' }}>
            Tell sellers exactly what you need — they'll come to you with their best offers.
          </p>
        </div>

        {/* Tips card */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
          border: '1.5px solid #bfdbfe',
          borderRadius: 14,
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          gap: '.875rem',
          alignItems: 'flex-start',
        }}>
          <Lightbulb size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '.1rem' }} />
          <div>
            <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#2563eb', marginBottom: '.25rem' }}>Pro Tip</div>
            <p style={{ fontSize: '.8rem', color: '#3730a3', lineHeight: 1.65 }}>
              More specific requirements attract better offers. Include brand, model, color, and any specific features you need.
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            {/* Title */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Product / Service Title *</label>
              <input className="form-input"
                placeholder='e.g. "Samsung 65-inch 4K OLED TV"'
                value={form.title}
                onChange={e => set('title', e.target.value)}
                required maxLength={200} />
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Description & Specifications</label>
              <textarea className="form-input" rows={4}
                placeholder="Be specific — brand, model, color, features, conditions, preferred delivery..."
                value={form.description}
                onChange={e => set('description', e.target.value)} />
            </div>

            {/* Category + Quantity */}
            <div className="form-row" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" min={1}
                  value={form.quantity} onChange={e => set('quantity', e.target.value)} />
              </div>
            </div>

            {/* Budget */}
            <div className="form-row" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Min Budget (₹) *</label>
                <input className="form-input" type="number" min={0} placeholder="e.g. 60000"
                  value={form.budgetMin} onChange={e => set('budgetMin', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Max Budget (₹) *</label>
                <input className="form-input" type="number" min={0} placeholder="e.g. 80000"
                  value={form.budgetMax} onChange={e => set('budgetMax', e.target.value)} required />
              </div>
            </div>

            {/* Budget preview */}
            {form.budgetMin && form.budgetMax && +form.budgetMin < +form.budgetMax && (
              <div style={{
                padding: '.875rem 1.125rem',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderLeft: '3px solid #2563eb',
                borderRadius: 12,
                marginBottom: '1.25rem',
                fontSize: '.82rem',
                color: '#64748b',
              }}>
                💡 Sellers will see your budget as:{' '}
                <strong style={{ color: '#0f172a' }}>
                  ₹{Number(form.budgetMin).toLocaleString('en-IN')} – ₹{Number(form.budgetMax).toLocaleString('en-IN')}
                </strong>
              </div>
            )}

            {/* Deadline */}
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Deadline *</label>
              <input className="form-input" type="datetime-local" min={minDate}
                value={form.deadline} onChange={e => set('deadline', e.target.value)} required />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} style={{ borderRadius: 12 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ flex: 1, justifyContent: 'center', padding: '.8rem', fontSize: '.95rem', borderRadius: 12 }}>
                {loading
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} />
                      Posting…
                    </span>
                  : <><Send size={15} /> Post Requirement</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
