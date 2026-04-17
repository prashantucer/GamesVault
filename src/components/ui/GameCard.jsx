import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export const GameCard = ({ game, variant = 'vertical' }) => {
  const { addItem, items } = useCartStore();
  const { addItem: addWish, removeItem: removeWish, items: wishItems } = useWishlistStore();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const inCart    = items.some(i => i.id === game.id);
  const inWish    = wishItems.some(i => i.id === game.id);

  const handleNavigate = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate(`/game/${game.id}`);
    }, 100);
  };

  const handleAddToCart = (e) => {
    // ✅ Stop bubbling so the parent <a> link doesn't navigate
    e.stopPropagation();
    e.preventDefault();
    addItem(game);
  };

  const handleToggleWish = (e) => {
    e.stopPropagation();
    e.preventDefault();
    inWish ? removeWish(game.id) : addWish(game);
  };

  if (variant === 'horizontal') {
    return (
      <motion.a 
        href={`/game/${game.id}`}
        onClick={handleNavigate}
        animate={isNavigating ? { scale: 0.95, opacity: 0.5 } : { scale: 1, opacity: 1 }}
        className="group relative flex gap-4 bg-card p-3 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      >
        <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 relative">
          <img src={game.cover} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
          {game.isNew && (
            <span className="absolute top-2 left-2 bg-accent text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              NEW
            </span>
          )}
        </div>
        <div className="py-2 flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-display font-bold text-lg text-text group-hover:text-accent transition-colors">{game.title}</h3>
            <p className="text-sm text-muted line-clamp-2 mt-1">{game.desc}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {game.salePrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-accent font-bold">₹{game.salePrice}</span>
                  <span className="text-muted text-sm line-through">₹{game.price}</span>
                </div>
              ) : (
                <span className="font-bold">₹{game.price}</span>
              )}
            </div>
            {/* Wishlist in horizontal variant */}
            <button
              onClick={handleToggleWish}
              className={`p-1.5 rounded-full transition-colors ${inWish ? 'text-red-500' : 'text-muted hover:text-red-400'}`}
              title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className="w-4 h-4" fill={inWish ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </motion.a>
    );
  }

  // ── Vertical card ──────────────────────────────────────────────────
  return (
    <motion.div 
      animate={isNavigating ? { scale: 0.9, opacity: 0.5 } : { scale: 1, opacity: 1 }}
      whileHover={!isNavigating ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col w-[260px] shrink-0"
    >
      <a href={`/game/${game.id}`} onClick={handleNavigate} className="block relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-card mb-4">
        <img 
          src={game.cover} 
          alt={game.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {game.salePrice && (
            <span className="bg-black/80 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full w-min">
              -{Math.round((1 - game.salePrice / game.price) * 100)}%
            </span>
          )}
          {game.isNew && (
            <span className="bg-accent text-black text-xs font-bold px-3 py-1 rounded-full w-min uppercase tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* ── Wishlist icon (top-right corner) ── */}
        <button
          onClick={handleToggleWish}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 z-10
            ${inWish
              ? 'bg-red-500/90 text-white scale-110'
              : 'bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-red-500/80 hover:text-white hover:scale-110'
            }`}
          title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className="w-4 h-4" fill={inWish ? 'currentColor' : 'none'} />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Add to Cart Button */}
        <div className="absolute bottom-4 left-0 w-full px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            disabled={inCart}
            className="w-full py-3 bg-white/10 hover:bg-accent hover:text-black backdrop-blur-md border border-white/20 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:bg-white/5 flex items-center justify-center gap-2"
          >
            {inCart ? '✓ In Cart' : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
          </button>
        </div>
      </a>

      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-display font-bold text-lg text-text truncate">{game.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex gap-1.5 opacity-60">
            {game.platform.map(p => (
              <span key={p} className="text-xs font-semibold">{p}</span>
            ))}
          </div>
          <div className="flex items-center gap-2">
             {game.salePrice ? (
               <>
                <span className="text-muted text-xs line-through">₹{game.price}</span>
                <span className="text-accent font-bold">₹{game.salePrice}</span>
               </>
             ) : (
                <span className="font-bold">₹{game.price}</span>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
