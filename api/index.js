// ── Vercel Serverless Function ─────────────────────────────────────
// This replaces server/index.js for production on Vercel.
// Vercel handles the port/listening — we just export the Express app.

const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────
// Allow both local dev (localhost:5173/5174) and the live Vercel domain
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://gamevault.prashantpandey.me',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());

// ── Razorpay instance ──────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── POST /api/create-order ─────────────────────────────────────────
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount), // in paise (₹1 = 100 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order.id);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('❌ Order creation failed:', err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// ── POST /api/verify-payment ───────────────────────────────────────
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Missing payment fields' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    console.log('✅ Payment verified:', razorpay_payment_id);
    res.json({ success: true, paymentId: razorpay_payment_id });
  } else {
    console.warn('❌ Signature mismatch — possible tampered request');
    res.status(400).json({ success: false, error: 'Invalid payment signature' });
  }
});

// ── Health check ───────────────────────────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    server: 'GameVault Serverless API',
    razorpay: process.env.RAZORPAY_KEY_ID ? '✅ Key loaded' : '❌ Key missing',
  });
});

// ── Export for Vercel (no app.listen needed) ───────────────────────
module.exports = app;
