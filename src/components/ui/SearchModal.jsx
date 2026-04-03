import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useSearchStore } from '../../store/searchStore';
import { mockGames } from '../../api/mockData';

export const SearchModal = () => {
  const { isOpen, closeSearch } = useSearchStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeSearch();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, closeSearch]);

  const filteredGames = query.trim() === '' 
    ? [] 
    : mockGames.filter(g => g.title.toLowerCase().includes(query.toLowerCase()) || g.genre.some(gen => gen.toLowerCase().includes(query.toLowerCase())));

  const handleSelect = (id) => {
    closeSearch();
    navigate(`/game/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-start justify-center pt-[10vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeSearch}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="w-full max-w-2xl bg-surface border border-navBorder rounded-2xl shadow-2xl overflow-hidden relative z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-6 py-4 border-b border-navBorder/50">
               <Search className="w-6 h-6 text-muted" />
               <input 
                 ref={inputRef}
                 type="text"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 className="flex-1 bg-transparent border-none outline-none px-4 text-xl placeholder:text-muted"
                 placeholder="Search games, genres..."
               />
               <button onClick={closeSearch} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
                 <X className="w-5 h-5 text-muted hover:text-text" />
               </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
               {query.length > 0 && filteredGames.length === 0 ? (
                 <div className="p-8 text-center text-muted">
                    No results found for "{query}"
                 </div>
               ) : (
                 <div className="flex flex-col p-2">
                    {filteredGames.slice(0, 5).map(game => (
                      <div 
                        key={game.id} 
                        onClick={() => handleSelect(game.id)}
                        className="flex items-center gap-4 p-3 hover:bg-accent/10 hover:dark:bg-white/5 rounded-xl cursor-pointer group transition-colors"
                      >
                         <img src={game.cover} alt={game.title} className="w-12 h-16 object-cover rounded-md" />
                         <div className="flex-1">
                            <h4 className="font-display font-bold group-hover:text-accent transition-colors">{game.title}</h4>
                            <div className="flex gap-2 mt-1">
                               {game.genre.map(g => (
                                 <span key={g} className="text-[10px] text-muted uppercase font-bold">{g}</span>
                               ))}
                            </div>
                         </div>
                         <div className="font-bold font-display">
                            ₹{game.price}
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
            
            {/* Footer */}
            <div className="px-6 py-3 bg-card/50 border-t border-navBorder/50 flex justify-end items-center gap-4 text-xs text-muted">
               <span className="flex items-center gap-1"><kbd className="px-2 py-1 bg-background rounded-md border border-navBorder font-mono">ESC</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
