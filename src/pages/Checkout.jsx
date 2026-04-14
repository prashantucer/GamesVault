import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import {
  ShoppingBag, CreditCard, Lock, ChevronRight,
  CheckCircle2, ArrowLeft, Shield, Zap, AlertCircle, Smartphone
} from 'lucide-react';

// ── Load Razorpay SDK script dynamically ──────────────────────────
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ── Input field component ─────────────────────────────────────────
const Field = ({ label, id, type = 'text', placeholder, value, onChange, required }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-muted">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      className="w-full bg-card border border-navBorder rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 placeholder:text-muted/50 transition-colors"
    />
  </div>
);

// ── Order confirmation screen ─────────────────────────────────────
const SuccessScreen = ({ items, total, paymentId, navigate }) => (
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
      <h1 className="text-3xl font-display font-black mb-2">Payment Successful!</h1>
      <p className="text-muted">Your payment was captured by Razorpay. Games are in your library.</p>
      {paymentId && (
        <p className="text-xs text-muted/60 mt-2 font-mono bg-card border border-navBorder px-3 py-1.5 rounded-lg inline-block">
          Payment ID: {paymentId}
        </p>
      )}
    </div>

    <div className="w-full bg-card border border-navBorder rounded-2xl p-5 space-y-3 text-left">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-3">
          <img src={item.cover} className="w-10 h-14 object-cover rounded-lg" alt={item.title} />
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

    <Button variant="accent" className="w-full" onClick={() => navigate('/')}>
      Back to Store
    </Button>
  </motion.div>
);

// ── Main Checkout Page ────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [step, setStep] = useState(1);
  const [razorpayReady, setRazorpayReady] = useState(false);

  const subtotal = items.reduce((s, i) => s + (i.salePrice ?? i.price), 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;
  const totalInPaise = total * 100; // Razorpay works in paise

  // Pre-load Razorpay SDK in the background
  useEffect(() => {
    loadRazorpay().then(setRazorpayReady);
  }, []);

  const set_ = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handlePayment = async () => {
    setError('');

    if (!razorpayReady) {
      setError('Razorpay failed to load. Check your internet connection.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create order on your backend
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalInPaise }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || 'Failed to create order');
      }

      const { orderId, amount, currency } = await orderRes.json();

      // Step 2: Open Razorpay checkout popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'GameVault',
        description: `${items.length} Game${items.length > 1 ? 's' : ''}`,
        image: '', // optional logo URL
        order_id: orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#E8FF00',
          backdrop_color: '#0a0a0a',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment cancelled. You can try again.');
          },
        },
        handler: async (response) => {
          // Step 3: Verify on backend
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const result = await verifyRes.json();

            if (result.success) {
              setPaymentId(response.razorpay_payment_id);
              clearCart();
              setSuccess(true);
            } else {
              setError('Payment verification failed. Contact support with Payment ID: ' + response.razorpay_payment_id);
              setLoading(false);
            }
          } catch {
            setError('Verification error. Please contact support.');
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
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

  if (success) return <SuccessScreen items={items.length > 0 ? items : []} total={total} paymentId={paymentId} navigate={navigate} />;

  return (
    <div className="pb-24 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link to="/" className="p-2 rounded-full hover:bg-card transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-black">Checkout</h1>
          <p className="text-muted text-sm flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-accent" /> Powered by Razorpay — Secure & Encrypted
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Left: Forms ── */}
        <div className="flex-1 space-y-6">

          {/* Step indicators */}
          <div className="flex items-center gap-3 mb-2">
            {[{ n: 1, label: 'Your Info' }, { n: 2, label: 'Pay with Razorpay' }].map(({ n, label }) => (
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
                <Field label="Phone (for UPI / OTP)" id="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set_('phone')} />
                <p className="text-xs text-muted">Phone is used by Razorpay for UPI & OTP verification only.</p>

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

            {/* Step 2: Razorpay */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-surface border border-navBorder rounded-3xl p-6 space-y-6"
              >
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <span className="w-7 h-7 bg-accent rounded-full text-black text-xs font-black flex items-center justify-center">2</span>
                  Choose Payment Method
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted font-normal">
                    <Lock className="w-3 h-3" /> 256-bit SSL
                  </span>
                </h2>

                {/* Razorpay payment methods info */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                    { icon: '📱', label: 'UPI', sub: 'PhonePe, GPay, Paytm' },
                    { icon: '🏦', label: 'Net Banking', sub: 'All major banks' },
                    { icon: '👛', label: 'Wallets', sub: 'Paytm, Mobikwik & more' },
                  ].map(({ icon, label, sub }) => (
                    <div key={label} className="bg-card border border-navBorder rounded-2xl p-3.5 flex items-start gap-3">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <p className="text-sm font-bold">{label}</p>
                        <p className="text-xs text-muted">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Razorpay branding */}
                <div className="flex items-center gap-3 bg-card border border-navBorder rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-[#3395FF] flex items-center justify-center text-white font-black text-sm shrink-0">Rz</div>
                  <div>
                    <p className="text-sm font-bold">Secured by Razorpay</p>
                    <p className="text-xs text-muted">India's leading payment gateway. Your card data never touches our servers.</p>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </motion.div>
                )}

                <Button
                  variant="accent"
                  size="lg"
                  className="w-full gap-2 text-base font-bold"
                  disabled={loading || !razorpayReady}
                  onClick={handlePayment}
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Opening Razorpay...</>
                  ) : !razorpayReady ? (
                    <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Loading...</>
                  ) : (
                    <><Smartphone className="w-4 h-4" /> Pay &#x20B9;{total.toLocaleString('en-IN')} via Razorpay</>
                  )}
                </Button>

                <p className="text-center text-xs text-muted">
                  Running in <span className="text-accent font-bold">Test Mode</span> — use Razorpay test card{' '}
                  <code className="bg-card px-1.5 py-0.5 rounded text-text font-mono">4111 1111 1111 1111</code> with any CVV & future date.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted pt-2">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-accent" />SSL Secured</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-accent" />Data Encrypted</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent" />Instant Delivery</span>
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
                  <img src={item.cover} className="w-12 h-16 rounded-xl object-cover shrink-0" alt={item.title} />
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
              <span>Digital games delivered instantly after Razorpay confirms payment.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
