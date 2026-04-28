import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, TrendingDown, MessageCircle, ShieldCheck, Zap, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    num: '01', icon: '📋',
    title: 'Post Your Requirement',
    desc: 'Describe exactly what you need — product, specs, budget and deadline. Takes under 60 seconds.',
    color: '#eff6ff', accent: '#2563eb',
  },
  {
    num: '02', icon: '⚔️',
    title: 'Sellers Compete',
    desc: 'Verified sellers receive your request and submit their best offers — completely blind to each other.',
    color: '#f5f3ff', accent: '#7c3aed',
  },
  {
    num: '03', icon: '🏆',
    title: 'Pick the Winner',
    desc: 'Review ranked offers, negotiate in real-time chat, then accept the best deal on your terms.',
    color: '#f0fdf4', accent: '#059669',
  },
];

const FEATURES = [
  {
    icon: <TrendingDown size={22} />, color: '#2563eb', bg: '#eff6ff',
    title: 'Smart Ranking Algorithm',
    desc: 'Offers are automatically scored by price, seller rating, and delivery speed. Best value always rises to the top.',
  },
  {
    icon: <Zap size={22} />, color: '#7c3aed', bg: '#f5f3ff',
    title: 'Blind Bidding System',
    desc: "Sellers can't see rivals' offers — guaranteeing genuine competition and the lowest possible prices for you.",
  },
  {
    icon: <MessageCircle size={22} />, color: '#059669', bg: '#f0fdf4',
    title: 'Real-Time Negotiation',
    desc: 'Private 1:1 live chat with each seller. Counter-offer, clarify, and close deals faster than ever.',
  },
  {
    icon: <ShieldCheck size={22} />, color: '#dc2626', bg: '#fef2f2',
    title: 'Verified Sellers Only',
    desc: 'Every seller on BidMe is KYC-verified with transparent ratings built from every completed transaction.',
  },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Home Buyer', text: 'Saved ₹18,000 on my TV purchase. Three sellers competed and I got a price I never would have found on my own!', avatar: 'P' },
  { name: 'Rahul M.', role: 'Small Business Owner', text: 'I post office furniture requirements every quarter now. The competition between sellers is incredible — quality has gone up, prices down.', avatar: 'R' },
  { name: 'TechZone', role: 'Verified Seller', text: 'BidMe brings serious buyers to us directly. No cold outreach. We just compete on merit and close more deals.', avatar: 'T' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #1d4ed8 100%)',
        color: '#fff',
        padding: '6rem 1.5rem 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,121,245,0.18), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999, padding: '.4rem 1.1rem',
            marginBottom: '1.75rem', fontSize: '.78rem', fontWeight: 700,
            backdropFilter: 'blur(12px)', letterSpacing: '0.06em', textTransform: 'uppercase',
            color: '#93c5fd',
          }}>
            🚀 The smarter way to shop
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            marginBottom: '1.5rem',
            color: '#fff',
            letterSpacing: '-0.035em',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Don't Search for Deals.<br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Let Deals Find You.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(.95rem, 2vw, 1.15rem)',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '2.5rem',
            lineHeight: 1.75,
            maxWidth: 560,
            margin: '0 auto 2.5rem',
          }}>
            Post what you need. Verified sellers compete with their best offers.
            You review, negotiate, and pick the winner — all in one place.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <>
                {(user.role === 'buyer' || user.role === 'both') && (
                  <button
                    onClick={() => navigate('/buyer/post')}
                    style={{
                      background: '#fff', color: '#1d4ed8',
                      border: 'none', borderRadius: 12,
                      padding: '.9rem 2rem', fontWeight: 800,
                      fontSize: '1rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '.5rem',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
                  >
                    Post a Requirement <ArrowRight size={18} />
                  </button>
                )}
                {(user.role === 'seller' || user.role === 'both') && (
                  <button
                    onClick={() => navigate('/seller/dashboard')}
                    style={{
                      background: 'transparent', color: '#fff',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderRadius: 12, padding: '.9rem 2rem',
                      fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                  >
                    Browse Requests
                  </button>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/auth?tab=register&role=buyer"
                  style={{
                    background: '#fff', color: '#1d4ed8',
                    borderRadius: 12, padding: '.9rem 2rem',
                    fontWeight: 800, fontSize: '1rem',
                    textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                >
                  I'm a Buyer <ArrowRight size={18} />
                </Link>
                <Link
                  to="/auth?tab=register&role=seller"
                  style={{
                    background: 'transparent', color: '#fff',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderRadius: 12, padding: '.9rem 2rem',
                    fontWeight: 700, fontSize: '1rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  I'm a Seller
                </Link>
              </>
            )}
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['✓ No credit card required', '✓ Free to post', '✓ 500+ verified sellers'].map(t => (
              <span key={t} style={{ fontSize: '.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div style={{
          maxWidth: 700,
          margin: '4rem auto 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: '1px',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          {[['10K+', 'Happy Buyers'], ['500+', 'Verified Sellers'], ['₹2Cr+', 'Deals Closed']].map(([n, l], i) => (
            <div key={l} style={{
              textAlign: 'center',
              padding: '1.25rem 1rem',
              background: 'rgba(255,255,255,0.05)',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none',
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{n}</div>
              <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '.25rem', fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{
              background: '#eff6ff', color: '#2563eb',
              padding: '.35rem 1rem', borderRadius: 999,
              fontSize: '.72rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase',
              marginBottom: '.875rem', display: 'inline-block',
            }}>
              How It Works
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#0f172a' }}>
              Three Steps to Your Best Deal
            </h2>
            <p style={{ color: '#64748b', marginTop: '.625rem', fontSize: '.95rem', maxWidth: 480, margin: '.625rem auto 0' }}>
              The entire process takes minutes. From posting to closing the deal.
            </p>
          </div>

          <div className="grid-3 stagger">
            {STEPS.map((s, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1.5px solid #e2e8f0',
                borderRadius: 20,
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.border = `1.5px solid ${s.accent}`; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.1)`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.border = '1.5px solid #e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = ''; }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: s.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontSize: '1.75rem',
                }}>
                  {s.icon}
                </div>
                <div style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  background: s.accent, color: '#fff',
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.72rem', fontWeight: 800,
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '.625rem', color: '#0f172a' }}>{s.title}</h3>
                <p style={{ color: '#64748b', fontSize: '.875rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '5rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{
              background: '#f5f3ff', color: '#7c3aed',
              padding: '.35rem 1rem', borderRadius: 999,
              fontSize: '.72rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase',
              marginBottom: '.875rem', display: 'inline-block',
            }}>
              Why BidMe
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#0f172a' }}>
              Built for Buyers. Powered by Competition.
            </h2>
            <p style={{ color: '#64748b', marginTop: '.625rem', fontSize: '.95rem', maxWidth: 480, margin: '.625rem auto 0' }}>
              Every feature is designed to put more money back in your pocket.
            </p>
          </div>

          <div className="grid-2 stagger">
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1.5px solid #e2e8f0',
                borderRadius: 20,
                padding: '1.75rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.09)'; e.currentTarget.style.border = `1.5px solid ${f.color}30`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.border = '1.5px solid #e2e8f0'; e.currentTarget.style.transform = ''; }}
              >
                <div style={{
                  width: 52, height: 52,
                  borderRadius: 14,
                  background: f.bg,
                  color: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.5rem', color: '#0f172a' }}>{f.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '.875rem', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              background: '#fefce8', color: '#92400e',
              padding: '.35rem 1rem', borderRadius: 999,
              fontSize: '.72rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase',
              marginBottom: '.875rem', display: 'inline-block',
            }}>
              Testimonials
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#0f172a' }}>
              Loved by Buyers & Sellers
            </h2>
          </div>
          <div className="grid-3 stagger">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: 20,
                padding: '1.75rem',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = ''; }}
              >
                <div style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '1rem', letterSpacing: '.05em' }}>★★★★★</div>
                <p style={{ color: '#334155', fontSize: '.9rem', lineHeight: 1.75, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '.9rem',
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.875rem', color: '#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize: '.75rem', color: '#94a3b8', fontWeight: 500 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#f8fafc' }}>
        <div style={{
          maxWidth: 700,
          margin: '0 auto',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)',
          borderRadius: 28,
          padding: '4rem 2.5rem',
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(29,78,216,0.35)',
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: '.875rem', color: '#fff', letterSpacing: '-0.02em' }}>
              Ready to Flip the Shopping Model?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.72)', marginBottom: '2rem', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 2rem', fontSize: '.95rem' }}>
              Join thousands of smart buyers saving time and money every day.
              Your best deal is one post away.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to={user ? '/buyer/post' : '/auth?tab=register'}
                style={{
                  background: 'linear-gradient(135deg,#fbbf24,#f97316)',
                  color: '#0f172a',
                  borderRadius: 12,
                  padding: '.9rem 2.25rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '.5rem',
                  fontSize: '1rem',
                  boxShadow: '0 4px 20px rgba(251,191,36,0.35)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(251,191,36,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(251,191,36,0.35)'; }}
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link
                to="/auth"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  borderRadius: 12,
                  padding: '.9rem 2rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#475569', padding: '2.5rem 1.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: '1rem' }}>🛍️</span>
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Bid<span style={{ color: '#60a5fa' }}>Me</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy', 'Terms', 'About', 'Contact'].map(l => (
                <a key={l} href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '.82rem', fontWeight: 500, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                >{l}</a>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '.78rem', color: '#334155' }}>
            © 2025 BidMe — Reverse Shopping Platform. Built with ❤️ for the future of e-commerce.
          </div>
        </div>
      </footer>
    </div>
  );
}
