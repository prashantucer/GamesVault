import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Sun, Moon, Compass, Rocket, Tag, Heart, LogIn, Home, Gamepad2 } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useCartStore } from '../../store/cartStore';
import { useSearchStore } from '../../store/searchStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Browse', path: '/browse', icon: Compass },
  { name: 'Deals', path: '/#deals', icon: Tag },
];


export const FloatingNav = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { items, openCart } = useCartStore();
  const { openSearch } = useSearchStore();
  const { items: wishItems, openWishlist } = useWishlistStore();
  const { user, isLoggedIn, logout } = useAuthStore();
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.8 }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-5xl"
    >
      <nav className="relative flex items-center justify-between px-6 py-3 bg-nav backdrop-blur-3xl border border-navBorder rounded-full shadow-lg dark:shadow-none transition-theme duration-300">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={() => { if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-accent rounded-xl rotate-12 group-hover:rotate-0 group-hover:scale-110 shadow-[0_0_15px_rgba(232,255,0,0.3)] group-hover:shadow-[0_0_25px_rgba(232,255,0,0.6)] transition-all duration-300 z-0"></div>
            <Gamepad2 className="w-6 h-6 text-black relative z-10 drop-shadow-sm" strokeWidth={2.5} />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter hidden sm:block">GameVault</span>
        </Link>

        {/* Desktop Links - Animated Logos */}
        <div className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (item.path === '/' && location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="relative px-4 py-2 text-sm font-medium hover:text-accent transition-colors rounded-full flex flex-col items-center gap-1 group"
              >
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-text/5 dark:bg-text/10 rounded-full -z-10"
                  />
                )}
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }} 
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                >
                  <Icon className="w-5 h-5 text-text group-hover:text-accent transition-colors" />
                </motion.div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 absolute -bottom-4 whitespace-nowrap transition-opacity">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={openSearch} className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Wishlist */}
          <button
            onClick={openWishlist}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
          >
            <Heart className={`w-5 h-5 transition-colors ${wishItems.length > 0 ? 'text-red-400 fill-red-400' : ''}`} />
            {wishItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
            )}
          </button>

          <button 
            onClick={openCart}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
            )}
          </button>
          
          <div className="w-[1px] h-6 bg-navBorder mx-1" />
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Avatar or Login */}
          {isLoggedIn ? (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-accent/60 hover:border-accent transition-colors">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-44 bg-surface border border-navBorder rounded-2xl shadow-2xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                <div className="px-3 py-2 border-b border-navBorder mb-1">
                  <p className="font-bold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted truncate">{user.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-2 bg-accent text-black font-bold text-sm rounded-full hover:bg-accent/90 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign In</span>
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
};
