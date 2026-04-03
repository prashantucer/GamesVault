import React, { useState, useEffect } from 'react';
import { mockGames } from '../api/mockData';
import { GameCard } from '../components/ui/GameCard';
import { Filter, SlidersHorizontal, Search, Star, Percent } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Browse() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [saleOnly, setSaleOnly] = useState(false);

  useEffect(() => {
    // Simulate API fetch delay
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = [...mockGames];
      
      if (searchTerm) {
        filtered = filtered.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      if (saleOnly) {
        filtered = filtered.filter(g => g.salePrice !== null);
      }
      if (genres.length > 0) {
        filtered = filtered.filter(g => g.genre.some(genre => genres.includes(genre)));
      }

      setGames(filtered);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm, saleOnly, genres]);

  const toggleGenre = (g) => {
    setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 w-full max-w-7xl mx-auto px-4 md:px-0">
      
      {/* Filters Sidebar */}
      <aside className="w-full lg:w-64 shrink-0 space-y-8 sticky top-28 h-max hidden md:block">
        <div className="flex items-center gap-2 font-display font-bold text-xl border-b border-navBorder pb-4">
          <Filter className="w-5 h-5 text-accent" /> Filters
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-muted uppercase tracking-wider">Search</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Find games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-navBorder rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-muted uppercase tracking-wider">Genres</label>
          <div className="space-y-2">
            {['Action', 'RPG', 'Strategy', 'Indie', 'Sports', 'Horror'].map(g => (
              <label key={g} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${genres.includes(g) ? 'bg-accent border-accent text-black' : 'border-muted group-hover:border-text'}`}>
                   {genres.includes(g) && <span className="text-[10px] pb-0.5 mt-0.5 font-bold">✓</span>}
                </div>
                <span className={`text-sm ${genres.includes(g) ? 'font-bold' : 'text-muted group-hover:text-text'}`} onClick={() => toggleGenre(g)}>{g}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 border-t border-navBorder pt-6">
           <label className="flex items-center gap-3 cursor-pointer group p-3 bg-card rounded-xl border border-navBorder hover:border-accent transition-colors">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${saleOnly ? 'bg-accent text-black' : 'bg-surface text-muted'}`}>
                <Percent className="w-3 h-3" />
              </div>
              <span className="font-bold flex-1" onClick={() => setSaleOnly(!saleOnly)}>On Sale Only</span>
           </label>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
           <div>
             <h1 className="text-4xl font-display font-black">All Games</h1>
             <p className="text-muted mt-2">Showing {games.length} results</p>
           </div>
           
           <div className="flex items-center gap-3 bg-surface border border-navBorder p-1.5 rounded-lg w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-muted ml-2" />
              <select className="bg-transparent text-sm focus:outline-none pr-4 py-1 w-full sm:w-auto font-medium appearance-none">
                 <option>Sort by: Relevance</option>
                 <option>Price: Low to High</option>
                 <option>Price: High to Low</option>
                 <option>Newest First</option>
              </select>
           </div>
        </div>

        {/* Active Filters Pills */}
        {(genres.length > 0 || saleOnly || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && <span className="bg-text/5 text-text px-3 py-1 rounded-full text-xs font-bold border border-text/10 flex items-center gap-1">"{searchTerm}" <button onClick={() => setSearchTerm('')}>×</button></span>}
            {saleOnly && <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold border border-accent/20 flex items-center gap-1">On Sale <button onClick={() => setSaleOnly(false)}>×</button></span>}
            {genres.map(g => (
              <span key={g} className="bg-text/5 text-text px-3 py-1 rounded-full text-xs font-bold border border-text/10 flex items-center gap-1">{g} <button onClick={() => toggleGenre(g)}>×</button></span>
            ))}
            <button onClick={() => { setGenres([]); setSaleOnly(false); setSearchTerm(''); }} className="text-xs text-muted hover:text-text font-bold uppercase underline">Clear all</button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 lg:gap-8">
           {loading ? (
             // Skeleton Loader
             Array.from({length: 8}).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[3/4] bg-card rounded-2xl w-full"></div>
                  <div className="h-4 bg-card rounded w-3/4"></div>
                  <div className="h-4 bg-card rounded w-1/2"></div>
                </div>
             ))
           ) : games.length > 0 ? (
             games.map(game => (
               <GameCard key={game.id} game={game} />
             ))
           ) : (
             <div className="col-span-full py-24 text-center space-y-4 bg-card rounded-3xl border border-dashed border-navBorder">
               <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto text-3xl">🏜️</div>
               <h3 className="text-2xl font-display font-bold">No games found</h3>
               <p className="text-muted max-w-sm mx-auto">Try adjusting your filters or search terms.</p>
               <Button variant="outline" onClick={() => { setGenres([]); setSaleOnly(false); setSearchTerm(''); }}>Reset Filters</Button>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
