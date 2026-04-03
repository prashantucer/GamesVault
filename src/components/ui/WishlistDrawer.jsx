import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { Button } from './Button';

export const WishlistDrawer = () => {
  const { items, isOpen, closeWishlist, removeItem } = useWishlistStore();
  const { addItem, items: cartItems } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99990]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-surface border-l border-navBorder z-[99999] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-navBorder shrink-0">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                <h2 className="text-xl font-display font-bold">Wishlist</h2>
                {items.length > 0 && (
                  <span className="bg-accent text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeWishlist}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full py-32 text-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-card border border-navBorder flex items-center justify-center">
                      <Heart className="w-9 h-9 text-muted" />
                    </div>
                    <p className="font-display font-bold text-lg">Your wishlist is empty</p>
                    <p className="text-muted text-sm max-w-[200px]">
                      Save games you love to find them easily later.
                    </p>
                    <Button variant="accent" size="sm" onClick={closeWishlist}>
                      Browse Games
                    </Button>
                  </motion.div>
                ) : (
                  items.map((game) => {
                    const inCart = cartItems.some(i => i.id === game.id);
                    return (
                      <motion.div
                        key={game.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0 }}
                        className="flex gap-4 bg-card border border-navBorder rounded-2xl p-3 group"
                      >
                        <Link to={`/game/${game.id}`} onClick={closeWishlist} className="shrink-0">
                          <img
                            src={game.cover}
                            alt={game.title}
                            className="w-16 h-20 object-cover rounded-xl"
                          />
                        </Link>
                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                          <div>
                            <Link
                              to={`/game/${game.id}`}
                              onClick={closeWishlist}
                              className="font-display font-bold text-sm leading-tight hover:text-accent transition-colors line-clamp-2"
                            >
                              {game.title}
                            </Link>
                            <div className="flex gap-1 mt-1">
                              {game.genre.map(g => (
                                <span key={g} className="text-[10px] text-muted font-bold uppercase">
                                  {g}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-display font-bold text-accent">
                              ₹{game.salePrice ?? game.price}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => addItem(game)}
                                disabled={inCart}
                                className="p-1.5 rounded-lg bg-accent/10 hover:bg-accent hover:text-black text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title={inCart ? 'Already in cart' : 'Add to cart'}
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeItem(game.id)}
                                className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-muted transition-colors"
                                title="Remove from wishlist"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-4 py-4 border-t border-navBorder shrink-0 space-y-2">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    items.forEach(g => addItem(g));
                    closeWishlist();
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add All to Cart
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
