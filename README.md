<div align="center">

# 🎮 GameVault

### Premium Game E-Commerce Platform

**Live → [gamevault.prashantpandey.me](https://gamevault.prashantpandey.me)**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white&style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-black?logo=framer&logoColor=white&style=flat-square)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white&style=flat-square)
![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-3395FF?logo=razorpay&logoColor=white&style=flat-square)
![Status](https://img.shields.io/badge/Status-Beta-E8FF00?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

> A full-stack gaming e-commerce platform with real-time Razorpay payment integration, cinematic UI, and a dark-first design philosophy — think Apple meets Steam.

---

## ✨ Features

### 🛍️ Shopping
- **Cinematic Hero** — Cyberpunk 2077 YouTube video as a full-HD autoplay background
- **Spotlight Search** — real-time search modal with instant results
- **Cart System** — animated slide-in drawer with 18% GST calculation in INR
- **Wishlist** — persistent across sessions
- **Browse & Filter** — full game catalog filterable by genre, price, and rating
- **Deals Section** — dedicated sale listings on the homepage

### 💳 Payments
- End-to-end **Razorpay integration** — order creation, payment popup, HMAC signature verification
- Supports **Card, UPI, Net Banking, and Wallets**
- Clickable payment method selector with context-aware test credentials
- Copy-to-clipboard test card / UPI details
- Real `payment_id` displayed on the success screen

### 🎨 Design & UX
- **Dark mode by default** with light mode toggle
- Sub-100ms page transitions via Framer Motion
- Cyberpunk scan-line overlay on the hero section
- Fully responsive — mobile, tablet, desktop
- Glassmorphic floating navigation with scroll-to-top

### 🔐 Auth
- Sign Up / Log In with Zustand-managed auth state
- Checkout auto-fills from the logged-in user's profile

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS + Custom Design Tokens |
| Animations | Framer Motion |
| State | Zustand — Cart, Wishlist, Auth, Search, Theme |
| Routing | React Router DOM v7 |
| Icons | Lucide React |
| Payments | Razorpay Checkout.js |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Payments | Razorpay SDK |
| Security | HMAC SHA256 Signature Verification |

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐     ┌──────────────────────────────┐
│       Frontend — Vercel         │     │      Backend — Render        │
│  gamevault.prashantpandey.me    │────▶│   gamesvault.onrender.com    │
│                                 │     │                              │
│  React + Vite + Tailwind        │     │  POST /api/create-order      │
│  Razorpay Checkout.js           │     │  POST /api/verify-payment    │
└─────────────────────────────────┘     │  GET  /api/health            │
                                        └──────────────────────────────┘
```

**Payment Flow:**
```
Click Pay ──▶ Create Razorpay Order (backend) ──▶ Open Popup
           ──▶ User completes payment
           ──▶ Verify HMAC Signature (backend) ──▶ ✅ Confirmed
```

---

## 🚀 Running Locally

```bash
git clone https://github.com/prashantucer/GamesVault.git
cd GamesVault
npm install
```

Create `.env` in root and `server/.env` with your Razorpay keys (see `.env.example`).

**Backend:**
```bash
cd server && node index.js
```

**Frontend:**
```bash
npm run dev
```

### Test Credentials (Razorpay Test Mode)

| Method | Details |
|---|---|
| Card | `4100 2800 0000 1007` · Expiry `12/26` · CVV `123` |
| UPI | `success@razorpay` |
| Net Banking | Select any bank → click **Success** on the mock page |

---

## 📁 Project Structure

```
GamesVault/
├── api/                        # Vercel Serverless Functions (ESM)
│   └── index.js                # Express app exported as default
├── server/                     # Render Backend (CommonJS)
│   ├── index.js                # Express server with Razorpay routes
│   └── package.json            # Separate CJS package config
├── src/
│   ├── components/
│   │   ├── cart/               # Cart drawer component
│   │   ├── layout/             # FloatingNav with scroll-to-top
│   │   └── ui/                 # GameCard, SearchModal, WishlistDrawer, Button
│   ├── pages/
│   │   ├── Home.jsx            # Video hero + featured / deals / new releases
│   │   ├── Browse.jsx          # Full game catalog with filters
│   │   ├── GameDetail.jsx      # Screenshots, system requirements, comments
│   │   ├── Genre.jsx           # Per-genre pages with hero banners
│   │   ├── Checkout.jsx        # 2-step Razorpay checkout
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── store/                  # Zustand — cart, wishlist, auth, search, theme
│   └── data/                   # mockGames with full metadata
├── .env.example
├── vercel.json
└── vite.config.js
```

---

## 🔮 Roadmap

- [x] Razorpay payment integration
- [x] HMAC signature verification
- [x] Render backend deployment
- [x] Custom domain on Vercel
- [x] YouTube cinematic hero
- [ ] Razorpay Live Mode
- [ ] Order history with MongoDB
- [ ] User profiles
- [x] Game reviews & ratings
- [ ] Admin dashboard
- [x] Post-payment email confirmation

---

## ⚠️ Disclaimer

> This project is in **Beta** and operates in **Razorpay Test Mode** — no real transactions occur. Game titles, artwork, and pricing are used for demonstration purposes only. All rights belong to their respective publishers.

---

## 📄 License

MIT © 2025 **Prashant Pandey**
