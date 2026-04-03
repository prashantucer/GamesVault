import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import {
  ShoppingBag, CreditCard, Lock, ChevronRight,
  CheckCircle2, ArrowLeft, Shield, Zap, AlertCircle
} from 'lucide-react';

// ── Input field component ─────────────────────────────────────────
const Field = ({ label, id, type = 'text', placeholder, value, onChange, maxLength, required, hint }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-muted">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
      autoComplete="off"
      className="w-full bg-card border border-navBorder rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 placeholder:text-muted/50 transition-colors"
    />
    {hint && <p className="text-[11px] text-muted/60">{hint}</p>}
  </div>
);

// ── Format card number with spaces ───────────────────────────────
const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
};

// ── Order confirmation screen ─────────────────────────────────────
const SuccessScreen = ({ items, total, navigate }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center text-center py-20 gap-8 max-w-lg mx-auto"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
      className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center shadow-[0_0_40px_rgba(232,255,0,0.3)]"
    >
      <CheckCircle2 className="w-12 h-12 text-accent" />
    </motion.div>

    <div>
      <h1 className="text-3xl font-display font-black mb-2">Order Confirmed!</h1>
      <p className="text-muted">Your games are ready. Check your email for the download links.</p>
    </div>

    <div className="w-full bg-card border border-navBorder rounded-2xl p-5 space-y-3 text-left">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-3">
          <img src={item.cover} className="w-10 h-14 object-cover rounded-lg" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{item.title}</p>
            <p className="text-xs text-muted">{item.platform.join(' · ')}</p>
          </div>
          <span className="font-bold text-accent text-sm">&#x20B9;{item.salePrice ?? item.price}</span>
        </div>
      ))}
      <div className="pt-3 border-t border-navBorder flex justify-between font-display font-black text-lg">
        <span>Total Paid</span>
        <span>&#x20B9;{total.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Button variant="accent" className="flex-1" onClick={() => navigate('/')}>
        Back to Store
      </Button>
    </div>
  </motion.div>
);

// ── Main Checkout Page ────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();

  // Form state
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    card: '',
    expiry: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 = info, 2 = payment

  const subtotal = items.reduce((s, i) => s + (i.salePrice ?? i.price), 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const set_ = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    // Basic mock validation
    const rawCard = form.card.replace(/\s/g, '');
    if (rawCard.length !== 16) { setError('Please enter a valid 16-digit card number.'); return; }
    if (form.expiry.length < 5) { setError('Please enter a valid expiry date (MM/YY).'); return; }
    if (form.cvv.length < 3) { setError('Please enter a valid CVV.'); return; }

    setLoading(true);
    // ⚡ Simulated payment processing delay
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
    clearCart();
  };

  if (items.length === 0 && !success) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <ShoppingBag className="w-16 h-16 text-muted" />
        <h2 className="text-2xl font-display font-bold">Your cart is empty</h2>
        <Link to="/"><Button variant="accent">Browse Games</Button></Link>
      </div>
    );
  }

  if (success) return <SuccessScreen items={items.length > 0 ? items : []} total={total} navigate={navigate} />;

  return (
    <div className="pb-24 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link to="/" className="p-2 rounded-full hover:bg-card transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-black">Checkout</h1>
          <p className="text-muted text-sm">Secure payment — your data is encrypted</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Left: Forms ── */}
        <div className="flex-1 space-y-6">

          {/* Step indicators */}
          <div className="flex items-center gap-3 mb-2">
            {[{ n: 1, label: 'Your Info' }, { n: 2, label: 'Payment' }].map(({ n, label }) => (
              <React.Fragment key={n}>
                <button
                  onClick={() => step > n && setStep(n)}
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${step >= n ? 'text-accent' : 'text-muted'}`}
                >
                  <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${step >= n ? 'border-accent bg-accent text-black' : 'border-navBorder text-muted'}`}>{n}</span>
                  {label}
                </button>
                {n < 2 && <ChevronRight className="w-4 h-4 text-muted/40" />}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-surface border border-navBorder rounded-3xl p-6 space-y-5"
              >
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <span className="w-7 h-7 bg-accent rounded-full text-black text-xs font-black flex items-center justify-center">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" id="name" placeholder="John Doe" value={form.name} onChange={set_('name')} required />
                  <Field label="Email" id="email" type="email" placeholder="you@example.com" value={form.email} onChange={set_('email')} required />
                </div>
                <Button variant="accent" size="lg" className="w-full gap-2" onClick={() => {
                  if (!form.name || !form.email) { setError('Please fill in your name and email.'); return; }
                  setError('');
                  setStep(2);
                }}>
                  Continue to Payment <ChevronRight className="w-4 h-4" />
                </Button>
                {error && <p className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.form
                key="step2"
                onSubmit={handlePayment}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-surface border border-navBorder rounded-3xl p-6 space-y-5"
              >
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <span className="w-7 h-7 bg-accent rounded-full text-black text-xs font-black flex items-center justify-center">2</span>
                  Payment Details
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted font-normal">
                    <Lock className="w-3 h-3" /> 256-bit SSL
                  </span>
                </h2>

                {/* Mock card UI */}
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-2xl p-5 space-y-4 text-white font-mono shadow-xl">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-7 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-sm" />
                    <div className="flex gap-1">
                      <div className="w-7 h-7 rounded-full bg-red-500 opacity-90" />
                      <div className="w-7 h-7 rounded-full bg-orange-400 opacity-90 -ml-3" />
                    </div>
                  </div>
                  <div className="text-xl tracking-[0.2em] text-white/90 mt-2">
                    {form.card || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <div>
                      <p className="uppercase text-[10px] mb-0.5">Card Holder</p>
                      <p className="text-white/90">{form.name || 'YOUR NAME'}</p>
                    </div>
                    <div className="text-right">
                      <p className="uppercase text-[10px] mb-0.5">Expires</p>
                      <p className="text-white/90">{form.expiry || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>

                <Field
                  label="Card Number"
                  id="card"
                  placeholder="1234 5678 9012 3456"
                  value={form.card}
                  onChange={(e) => setForm(f => ({ ...f, card: formatCard(e.target.value) }))}
                  hint="Demo: try any 16-digit number"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Expiry Date"
                    id="expiry"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={(e) => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                    maxLength={5}
                  />
                  <Field
                    label="CVV"
                    id="cvv"
                    type="password"
                    placeholder="•••"
                    value={form.cvv}
                    onChange={set_('cvv')}
                    maxLength={4}
                    hint="3 or 4 digits on back of card"
                  />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </motion.div>
                )}

                <Button type="submit" variant="accent" size="lg" className="w-full gap-2 text-base font-bold" disabled={loading}>
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Processing payment...</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Pay &#x20B9;{total.toLocaleString('en-IN')}</>
                  )}
                </Button>

                <p className="text-center text-xs text-muted">
                  This is a <span className="text-accent font-bold">demo</span> — no real charge will be made.
                </p>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted pt-2">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-accent" /> SSL Secured</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-accent" /> Data Encrypted</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent" /> Instant Delivery</span>
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="w-full lg:w-[340px] shrink-0 space-y-4">
          <div className="bg-surface border border-navBorder rounded-3xl p-6 space-y-4 sticky top-28">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent" /> Order Summary
            </h3>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.cover} className="w-12 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.title}</p>
                    <p className="text-xs text-muted">{item.genre.join(', ')}</p>
                    {item.salePrice && (
                      <span className="text-[10px] bg-accent/20 text-accent font-bold px-1.5 py-0.5 rounded-full">
                        -{Math.round((1 - item.salePrice / item.price) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold shrink-0">&#x20B9;{item.salePrice ?? item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-navBorder pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>&#x20B9;{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>GST (18%)</span>
                <span>&#x20B9;{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-display font-black text-lg pt-2 border-t border-navBorder">
                <span>Total</span>
                <span className="text-accent">&#x20B9;{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="bg-card border border-navBorder rounded-xl p-3 text-xs text-muted flex gap-2">
              <CreditCard className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Digital games are delivered instantly to your account after payment is confirmed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
