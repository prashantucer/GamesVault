import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getFeaturedGames, getNewReleases, getDeals, mockGames } from '../api/mockData';
import { GameCard } from '../components/ui/GameCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, Mail, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const categories = [
  { name: 'Action', icon: 'ACT', image: '/assets/images/categories/action.jpg' },
  { name: 'RPG', icon: 'RPG', image: '/assets/images/categories/rpg.jpg' },
  { name: 'Strategy', icon: 'STR', image: '/assets/images/categories/strategy.jpg' },
  { name: 'Sports', icon: 'SPT', image: '/assets/images/categories/sports.jpg' },
  { name: 'Indie', icon: 'IND', image: '/assets/images/categories/indie.jpg' },
  { name: 'Horror', icon: 'HOR', image: '/assets/images/categories/horror.jpg' },
];

export default function Home() {
  const featured = getFeaturedGames();
  const newReleases = getNewReleases();
  const deals = getDeals();
  const { addItem, items } = useCartStore();

  const heroGame = mockGames[0];

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-[85vh] -mx-6 -mt-24 rounded-b-[3rem] overflow-hidden bg-black flex items-end pb-24 group">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full">
          <img src={heroGame.cover} alt="Hero" className="w-full h-full object-cover opacity-70 scale-105 group-hover:scale-110 transition-transform duration-[10s] ease-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSI1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] mix-blend-overlay pointer-events-none" />
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-end gap-8"
        >
          <div className="max-w-2xl">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex gap-3 mb-6"
            >
              {heroGame.genre.map(g => (
                <span key={g} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium border border-white/20">
                  {g}
                </span>
              ))}
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-display font-black text-white leading-tight mb-6 hover:text-accent transition-colors cursor-pointer"
            >
              <Link to={`/game/${heroGame.id}`}>{heroGame.title}</Link>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg text-white/70 max-w-lg mb-8 line-clamp-3"
            >
              {heroGame.desc}
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                variant="accent" 
                size="lg" 
                className="w-full sm:w-auto font-bold text-lg gap-2"
                onClick={() => addItem(heroGame)}
              >
                {items.some(i => i.id === heroGame.id) 
                  ? <>✓ In Cart</>
                  : <><ShoppingCart className="w-5 h-5" /> Get Now — ₹{heroGame.price}</>
                }
              </Button>
              <Link to={`/game/${heroGame.id}`} className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full font-bold text-lg bg-black/40 text-white border-white/20 hover:bg-white/10"
                >
                  View Details
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Row */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display font-bold">Featured Games</h2>
          <Button variant="ghost" className="gap-2">View All <ArrowRight className="w-4 h-4" /></Button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-8 -mx-6 px-6 snap-x scrollbar-hide py-4" style={{ scrollbarWidth: 'none' }}>
           {featured.map(game => (
             <div key={game.id} className="snap-start">
               <GameCard game={game} />
             </div>
           ))}
        </div>
      </section>

      {/* Bento Grid - New Releases */}
      <section className="space-y-8" id="new">
        <h2 className="text-3xl font-display font-bold">New Releases</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 rounded-3xl overflow-hidden relative group aspect-[16/10] lg:aspect-auto">
             <img src={newReleases[0].cover} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={newReleases[0].title} />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
             <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
               <div>
                  <span className="bg-accent text-black text-xs font-bold px-3 py-1 rounded-full uppercase mb-4 inline-block">Featured New</span>
                  <h3 className="text-3xl font-display font-bold text-white mb-2">{newReleases[0].title}</h3>
               </div>
               <Link to={`/game/${newReleases[0].id}`}>
                  <Button variant="accent">Buy ${newReleases[0].price}</Button>
               </Link>
             </div>
           </div>
           
           <div className="flex flex-col gap-6">
              {newReleases.slice(1, 4).map(game => (
                <GameCard key={game.id} game={game} variant="horizontal" />
              ))}
           </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-8">
         <h2 className="text-3xl font-display font-bold">Browse by Category</h2>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {categories.map(cat => (
              <Link to={`/genre/${cat.name.toLowerCase()}`} key={cat.name} className="block relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer bg-card">
                 <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-4xl mb-2 filter drop-shadow-lg">{cat.icon}</span>
                    <h3 className="text-white font-display font-bold tracking-wider text-xl">{cat.name}</h3>
                 </div>
              </Link>
            ))}
         </div>
      </section>

      {/* Deals Section */}
      <section className="bg-card -mx-6 px-6 py-16 rounded-3xl">
        <div className="flex flex-col md:flex-row gap-12 items-center text-center md:text-left mb-12">
           <div className="md:w-1/3 space-y-4">
             <div className="inline-flex items-center justify-center bg-red-500 text-white font-bold py-1 px-3 rounded-full animate-bounce mb-2">
               LIMITED TIME
             </div>
             <h2 className="text-5xl font-display font-black leading-tight">Massive <br/><span className="text-accent">Deals</span></h2>
             <p className="text-muted">Grab these top-tier titles at unbeatable prices before the timer runs out.</p>
             <div className="flex gap-4 justify-center md:justify-start pt-4">
               {['02', '14', '36', '45'].map((num, i) => (
                 <div key={i} className="flex flex-col items-center bg-background rounded-xl p-3 w-16 shadow-inner border border-text/5">
                   <span className="font-display font-bold text-xl">{num}</span>
                   <span className="text-[10px] text-muted uppercase font-bold">{['Days', 'Hrs', 'Min', 'Sec'][i]}</span>
                 </div>
               ))}
             </div>
           </div>
           
           <div className="md:w-2/3 flex gap-6 overflow-x-auto pb-4 snap-x scrollbar-hide py-4 w-full" style={{ scrollbarWidth: 'none' }}>
              {deals.map(game => (
                <div key={game.id} className="snap-start">
                  <GameCard game={game} />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-3xl mx-auto w-full text-center space-y-8 relative py-12">
         <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-accent/20 blur-[100px] rounded-full -z-10" />
         <Mail className="w-12 h-12 text-accent mx-auto" />
         <h2 className="text-4xl font-display font-black">Never miss a drop.</h2>
         <p className="text-muted">Join 100,000+ gamers getting exclusive deals and early access to new releases.</p>
         
         <form className="relative flex items-center w-full max-w-md mx-auto group">
           <div className="absolute -inset-1 bg-gradient-to-r from-accent via-purple-500 to-accent rounded-full opacity-30 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200"></div>
           <input 
              type="email" 
              placeholder="Enter your email" 
              className="relative w-full px-6 py-4 bg-surface border border-navBorder text-text rounded-full focus:outline-none placeholder:text-muted shadow-lg"
           />
           <Button variant="accent" className="absolute right-2 px-6 py-2">
              Subscribe
           </Button>
         </form>
      </section>
    </div>
  );
}
