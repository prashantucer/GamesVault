import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingNav } from './components/layout/FloatingNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/ui/WishlistDrawer';
import { useThemeStore } from './store/themeStore';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Browse = React.lazy(() => import('./pages/Browse'));
const GameDetail = React.lazy(() => import('./pages/GameDetail'));
const Genre = React.lazy(() => import('./pages/Genre'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
import { SearchModal } from './components/ui/SearchModal';

const LoadingFallback = () => (
  <div className="fixed top-0 left-0 w-full h-1 bg-card overflow-hidden z-[99999]">
    <div className="h-full bg-accent w-1/3 animate-[slide_1.5s_ease-in-out_infinite]" />
  </div>
);

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // Wait for page transition
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-12 selection:bg-accent selection:text-black bg-background text-text overflow-x-hidden">
      <FloatingNav />
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <main className="flex-1 w-full px-6">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait" onExitComplete={() => {
            if (!window.location.hash) {
              window.scrollTo(0, 0);
            }
          }}>
            <motion.div
              key={location.pathname}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Beta Disclaimer Bar */}
      <div className="w-full border-t border-navBorder bg-background/80 backdrop-blur-md mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="bg-accent/20 text-accent border border-accent/30 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
              Beta
            </span>
            <p className="text-xs text-muted">
              <span className="text-text font-semibold">GameVault is currently in beta.</span>{' '}
              Some features may be incomplete or not fully functional yet.
            </p>
          </div>
          <p className="text-[11px] text-muted/60 whitespace-nowrap text-center sm:text-right">
            © 2025 GameVault · All rights reserved
            <span className="mx-1.5 opacity-40">·</span>
            Designed &amp; Built by{' '}
            <span className="text-accent font-semibold">Prashant Pandey</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
          <Route path="game/:id" element={<GameDetail />} />
          <Route path="genre/:id" element={<Genre />} />
          <Route path="deals" element={<Browse />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
        {/* Auth pages — full screen, no floating nav */}
        <Route path="/login" element={<Suspense fallback={<LoadingFallback />}><Login /></Suspense>} />
        <Route path="/signup" element={<Suspense fallback={<LoadingFallback />}><Signup /></Suspense>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
