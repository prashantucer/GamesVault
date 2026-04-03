import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockGames } from '../api/mockData';
import { GameCard } from '../components/ui/GameCard';
import { ArrowLeft } from 'lucide-react';

export default function Genre() {
  const { id } = useParams();
  
  // Format the genre name (e.g., 'rpg' -> 'RPG', 'action' -> 'Action')
  const genreName = id.toUpperCase() === 'RPG' ? 'RPG' : id.charAt(0).toUpperCase() + id.slice(1);
  
  // Filter games based on genre parameter
  const filteredGames = mockGames.filter(game => 
    game.genre.map(g => g.toLowerCase()).includes(id.toLowerCase())
  );
  
  const coverImage = `/assets/images/categories/${id.toLowerCase()}.jpg`;

  return (
    <div className="flex flex-col gap-12 pb-32">
      {/* Hero Header */}
      <section className="relative h-[40vh] min-h-[300px] -mx-6 -mt-24 rounded-b-[3rem] overflow-hidden bg-black flex items-end pb-12 group">
        <motion.div 
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 1 }}
           className="absolute inset-0 w-full h-full"
        >
          <img 
            src={coverImage} 
            alt={genreName} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-700"
            onError={(e) => { e.target.src = '/assets/images/categories/action.jpg' }} // fallback
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors w-max mb-2">
             <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-black text-white"
          >
            {genreName} Games
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted text-lg max-w-xl"
          >
            Explore our curated collection of the best {genreName.toLowerCase()} titles available right now.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section>
         <div className="flex items-center justify-between mb-8">
            <p className="text-muted">Showing {filteredGames.length} titles</p>
         </div>

         {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
               {filteredGames.map((game, i) => (
                 <motion.div 
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                 >
                    <GameCard game={game} />
                 </motion.div>
               ))}
            </div>
         ) : (
            <div className="text-center py-32 bg-card rounded-3xl border border-navBorder border-dashed">
               <h3 className="text-2xl font-display font-bold mb-2">No games found</h3>
               <p className="text-muted">We couldn't find any games matching the {genreName} genre.</p>
            </div>
         )}
      </section>
    </div>
  );
}
