import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + (item.salePrice || item.price), 0);
  const total = subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-white/10 z-[99999] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-navBorder">
              <h2 className="font-display font-bold text-2xl flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-accent" />
                Cart <span className="text-muted text-lg font-normal">({items.length})</span>
              </h2>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-text/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                  <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-muted" />
                  </div>
                  <p className="font-medium text-lg">Your cart is empty</p>
                  <Button variant="outline" onClick={closeCart}>Browse Games</Button>
                </div>
              ) : (
                items.map(item => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id} 
                    className="flex gap-4 p-4 rounded-2xl bg-card border border-navBorder group"
                  >
                    <img src={item.cover} alt={item.title} className="w-20 h-28 object-cover rounded-xl" />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold font-display leading-tight pr-4">{item.title}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-muted hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted mt-1">{item.platform.join(' • ')}</p>
                      <div className="mt-auto flex justify-between items-center">
                        <div className="font-bold flex items-center gap-2">
                          {item.salePrice ? (
                             <>
                              <span className="text-accent">&#x20B9;{item.salePrice}</span>
                              <span className="text-xs text-muted line-through">&#x20B9;{item.price}</span>
                             </>
                          ) : (
                            <span>&#x20B9;{item.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-navBorder bg-surface">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>&#x20B9;{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl font-display pt-3 border-t border-navBorder">
                    <span>Total</span>
                    <span>&#x20B9;{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <Button variant="accent" className="w-full py-4 text-lg" onClick={() => { closeCart(); navigate('/checkout'); }}>
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
