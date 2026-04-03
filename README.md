# 🎮 GameVault

> A premium e-commerce platform for PC & Console games — built with an Apple-meets-Steam design philosophy.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white&style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-black?logo=framer&logoColor=white&style=flat-square)
![Status](https://img.shields.io/badge/Status-Beta-E8FF00?style=flat-square)

## ✨ Features

- 🖼️ **Cinematic Hero Section** with parallax scroll effect
- 🔍 **Spotlight Search** — real-time game search modal
- 🛒 **Cart System** with animated slide-in drawer & GST calculation  
- ❤️ **Wishlist** with persistent storage across sessions
- 🎭 **Genre Pages** — dedicated pages per game category with hero banners
- 🔐 **Auth System** — Sign up / Login (mock, no backend required)  
- 💳 **Checkout Page** — 2-step flow with live card preview & order confirmation
- 🌙 **Dark / Light Mode** toggle
- 📱 **Fully Responsive** across all screen sizes
- ⚡ **Sub-100ms page transitions** with Framer Motion animations

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + Custom Design Tokens |
| Animations | Framer Motion |
| State Management | Zustand (Cart, Wishlist, Auth, Search, Theme) |
| Routing | React Router DOM v6 |
| Icons | Lucide React |

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/gamevault.git
cd gamevault
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```
src/
├── api/            # Mock game data with system requirements
├── components/
│   ├── cart/       # Cart drawer component
│   ├── layout/     # Floating nav bar
│   └── ui/         # GameCard, SearchModal, WishlistDrawer, Button
├── pages/          # Home, GameDetail, Genre, Checkout, Login, Signup, Browse
├── store/          # Zustand stores — cart, wishlist, auth, search, theme
└── assets/         # Static assets
public/
└── assets/images/
    ├── games/      # Game cover art (local, no CDN latency)
    └── categories/ # Genre banner images
```

## 🌐 Deployment


```bash
npm run build     # Outputs to /dist
npm run preview   # Preview production build locally
```

Deploy the `/dist` folder to any static host:
- **Vercel** — `vercel deploy`
- **Netlify** — drag & drop `/dist`
- **GitHub Pages** — use `gh-pages` package

> **Note for SPA routing:** Add a `vercel.json` or `_redirects` file so all routes fall back to `index.html`.

## ⚠️ Disclaimer

> **This project is currently in Beta.** It is a frontend-only UI prototype. No real payments are processed. Built for educational purposes.

## 🔮 Roadmap

- [ ] Razorpay / Stripe real payment integration
- [ ] Node.js + Express + MongoDB backend
- [ ] User profiles & order history
- [ ] Game reviews & ratings system
- [ ] Admin dashboard

## 📄 License

MIT © 2025 GameVault 

by Prashant P
