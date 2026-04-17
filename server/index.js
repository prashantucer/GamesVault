require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://gamevault.prashantpandey.me',
];
app.use(cors({
  origin: (origin, callback) => {
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
// Called by frontend before opening Razorpay popup
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // amount in paise (₹1 = 100 paise)

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount), // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,         // auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order.id);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('❌ Razorpay order creation failed:', err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// ── POST /api/verify-payment ───────────────────────────────────────
// Called after Razorpay returns success to verify the signature
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Missing payment fields' });
  }

  // HMAC SHA256 signature verification
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
app.get('/api/health', (_, res) => res.json({ status: 'ok', server: 'GameVault Backend' }));

// ── Start server ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 GameVault server running at http://localhost:${PORT}`);
  console.log(`   Razorpay Key: ${process.env.RAZORPAY_KEY_ID ? '✅ Loaded' : '❌ Missing — check .env'}\n`);
});
