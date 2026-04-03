import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGameById, mockGames } from '../api/mockData';
import { Button } from '../components/ui/Button';
import { GameCard } from '../components/ui/GameCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Star, ShieldCheck, Trophy, Check, ExternalLink } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = getGameById(id);
  const { addItem, items } = useCartStore();
  const { addItem: wishAdd, removeItem: wishRemove, isWishlisted } = useWishlistStore();
  const [activeTab, setActiveTab] = useState('about');
  const [shareCopied, setShareCopied] = useState(false);

  // Mock comments/reviews for different games
  const mockReviews = {
    'g-1': { user: 'NightCityLegend', hours: 250, text: 'An incredible journey through a beautiful dystopia. After all the patches, this is a true masterpiece.' },
    'g-2': { user: 'TarnishedOne', hours: 300, text: 'The scope of this game is mind-boggling. Best exploration in any game ever made.' },
    'g-3': { user: 'SpaceExplorer', hours: 1500, text: 'The greatest comeback in gaming history. Endless planets and constant free updates.' },
    'g-4': { user: 'SpeedDemon', hours: 85, text: 'Love the cell-shaded effects and the deep customization. The racing feels punchy and fun.' },
    'g-5': { user: 'IsaacClarke', hours: 45, text: 'They kept what made the original great and elevated the horror tenfold. Incredible audio design.' },
    'g-6': { user: 'VeteranMedic', hours: 210, text: 'It had a rough start, but it finally feels like a true Battlefield game now. Lots of chaotic fun.' },
    'g-7': { user: 'SamuraiGhost', hours: 90, text: 'Visually gorgeous with combat that feels like a cinematic samurai movie. Highly immersive.' },
    'g-8': { user: 'PyramidHead', hours: 30, text: 'A faithful and terrifying remake that captures the dread of the original perfectly.' }
  };

  if (!game) return <div className="text-center py-32 text-2xl font-display font-bold">Game not found</div>;

  const currentReview = mockReviews[game.id] || { user: 'GamerX_99', hours: 120, text: 'Absolutely stunning. Highly recommend picking this up!' };

  const inCart = items.some(i => i.id === game.id);
  const wishlisted = isWishlisted(game.id);

  const handleWishlist = () => {
    if (wishlisted) { wishRemove(game.id); } else { wishAdd(game); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: game.title, text: `Check out ${game.title} on GameVault!`, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handlePlayTrailer = () => {
    const query = encodeURIComponent(`${game.title} official trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const sysReqs = game.sysReqs || {};

  return (
    <div className="pb-24">
      {/* Dynamic Header Image Overlay */}
      <div className="absolute top-0 left-0 w-full h-[60vh] -z-10 overflow-hidden">
        <img src={game.cover} alt="" className="w-full h-full object-cover opacity-[0.15] blur-3xl scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mt-8">
        {/* Left Col: Media & Info */}
        <div className="flex-1 space-y-12">
          
          {/* Main Media */}
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black relative group shadow-2xl ring-1 ring-white/10 cursor-pointer" onClick={handlePlayTrailer}>
              <img src={game.cover} alt="Gameplay" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-20 h-20 bg-accent/90 hover:bg-accent text-black rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(232,255,0,0.6)] hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 translate-x-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {/* Always-visible smaller play button */}
              <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                <div className="w-16 h-16 bg-accent/80 backdrop-blur-sm text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(232,255,0,0.5)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 translate-x-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white/80 font-semibold">
                Watch Trailer on YouTube
              </div>
            </div>

            {/* Thumbnails */}
            {game.screenshots && game.screenshots.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <div className="w-40 aspect-video rounded-xl overflow-hidden border-2 border-accent cursor-pointer shrink-0">
                  <img src={game.cover} className="w-full h-full object-cover" />
                </div>
                {game.screenshots.map((s, i) => (
                  <div key={i} className="w-40 aspect-video rounded-xl overflow-hidden border-2 border-transparent hover:border-text/30 transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100">
                    <img src={s} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Tabs */}
          <div className="space-y-6">
            <div className="flex gap-8 border-b border-navBorder scrollbar-hide overflow-x-auto">
              {['About', 'System Requirements', 'Reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                  className={`pb-4 font-bold text-lg whitespace-nowrap transition-colors relative ${activeTab === tab.toLowerCase().split(' ')[0] ? 'text-text' : 'text-muted hover:text-text'}`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase().split(' ')[0] && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-t-full shadow-[0_-2px_10px_rgba(232,255,0,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[200px]">
              {activeTab === 'about' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-muted leading-relaxed">{game.desc}</p>
                  <p className="text-lg text-muted leading-relaxed mt-4">
                    Experience the ultimate adrenaline rush in this critically acclaimed masterpiece. With next-generation graphics,
                    immersive storytelling, and groundbreaking gameplay mechanics, {game.title} sets a new standard for the {game.genre[0]} genre.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-card p-4 rounded-2xl border border-navBorder">
                      <ShieldCheck className="w-6 h-6 text-accent mb-2" />
                      <h4 className="font-bold">Anti-Cheat Enabled</h4>
                      <p className="text-sm text-muted">Fair play guaranteed.</p>
                    </div>
                    <div className="bg-card p-4 rounded-2xl border border-navBorder">
                      <Trophy className="w-6 h-6 text-accent mb-2" />
                      <h4 className="font-bold">Full Achievements</h4>
                      <p className="text-sm text-muted">100% completion tracking.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  <div className="space-y-4">
                    <h4 className="font-display font-bold text-accent uppercase tracking-wider">Minimum</h4>
                    <div className="space-y-3 text-muted">
                      <p><strong className="text-text block">OS:</strong> {sysReqs.min?.os || 'Windows 10 64-bit'}</p>
                      <p><strong className="text-text block">Processor:</strong> {sysReqs.min?.cpu || 'Intel Core i5-8400 / AMD Ryzen 3 3300X'}</p>
                      <p><strong className="text-text block">Memory:</strong> {sysReqs.min?.ram || '8 GB RAM'}</p>
                      <p><strong className="text-text block">Graphics:</strong> {sysReqs.min?.gpu || 'NVIDIA GTX 1060 / AMD RX 580'}</p>
                      <p><strong className="text-text block">Storage:</strong> {sysReqs.min?.storage || '50 GB available space'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-display font-bold text-accent uppercase tracking-wider">Recommended</h4>
                    <div className="space-y-3 text-muted">
                      <p><strong className="text-text block">OS:</strong> {sysReqs.rec?.os || 'Windows 10/11 64-bit'}</p>
                      <p><strong className="text-text block">Processor:</strong> {sysReqs.rec?.cpu || 'Intel Core i7-8700K / AMD Ryzen 5 3600'}</p>
                      <p><strong className="text-text block">Memory:</strong> {sysReqs.rec?.ram || '16 GB RAM'}</p>
                      <p><strong className="text-text block">Graphics:</strong> {sysReqs.rec?.gpu || 'NVIDIA RTX 2070 / AMD RX 5700 XT'}</p>
                      <p><strong className="text-text block">Storage:</strong> {sysReqs.rec?.storage || '50 GB SSD'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-card p-6 rounded-2xl border border-navBorder">
                    <div className="text-5xl font-display font-black text-accent">{game.rating}</div>
                    <div>
                      <div className="flex text-accent mb-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="font-bold">Overwhelmingly Positive</p>
                      <p className="text-sm text-muted">Based on 12,453 user reviews</p>
                    </div>
                  </div>
                  <div className="bg-surface p-6 rounded-2xl border border-navBorder space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-accent to-purple-500 rounded-full" />
                        <div>
                          <p className="font-bold text-sm">{currentReview.user}</p>
                          <p className="text-xs text-muted">{currentReview.hours} hrs on record</p>
                        </div>
                      </div>
                      <div className="text-accent flex"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
                    </div>
                    <p className="text-sm text-muted">{currentReview.text}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Sticky Actions */}
        <aside className="w-full lg:w-[360px] shrink-0">
          <div className="sticky top-28 bg-surface/50 backdrop-blur-xl border border-navBorder p-8 rounded-3xl space-y-6 shadow-2xl">
            <div className="space-y-2">
              <h1 className="text-4xl font-display font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-text to-text/60">
                {game.title}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm text-muted font-bold tracking-wider uppercase">
                {game.genre.map(g => <span key={g}>{g}</span>)}
              </div>
            </div>

            <div className="p-5 bg-card rounded-2xl border border-navBorder flex items-center justify-between">
              {game.salePrice ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="bg-accent text-black font-bold px-2 py-0.5 rounded text-sm">-{Math.round((1 - game.salePrice/game.price)*100)}%</span>
                    <span className="text-muted line-through">&#x20B9;{game.price}</span>
                  </div>
                  <span className="text-4xl font-display font-black text-text mt-1">&#x20B9;{game.salePrice}</span>
                </div>
              ) : (
                <div className="text-4xl font-display font-black text-text">&#x20B9;{game.price}</div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                variant="accent"
                size="lg"
                className={`w-full text-lg gap-3 shadow-[0_0_20px_rgba(232,255,0,0.2)] ${inCart ? 'bg-text text-bg shadow-none text-white' : ''}`}
                onClick={() => { if(!inCart) addItem(game); }}
              >
                {inCart ? <>In Cart</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`w-full gap-2 transition-all duration-300 ${wishlisted ? 'text-red-400 border-red-500/60 bg-red-500/10 hover:bg-red-500/20' : 'text-muted hover:text-red-400 hover:border-red-500/50'}`}
                onClick={handleWishlist}
              >
                <motion.div
                  animate={wishlisted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-5 h-5 transition-colors ${wishlisted ? 'fill-red-400 text-red-400' : ''}`} />
                </motion.div>
                {wishlisted ? 'Wishlisted \u2713' : 'Add to Wishlist'}
              </Button>
            </div>

            <div className="pt-6 border-t border-navBorder space-y-4 text-sm text-muted">
              <div className="flex justify-between"><span>Developer</span> <span className="text-text font-bold">{game.developer || 'CD Projekt RED'}</span></div>
              <div className="flex justify-between"><span>Publisher</span> <span className="text-text font-bold">{game.publisher || 'GameVault Inc.'}</span></div>
              <div className="flex justify-between"><span>Release Date</span> <span className="text-text font-bold">{game.releaseDate || '2024'}</span></div>
              <div className="flex justify-between"><span>Platforms</span> <span className="text-text font-bold">{game.platform.join(', ')}</span></div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="flex-1 bg-card border border-navBorder gap-2 text-muted hover:text-text hover:bg-accent/10 hover:border-accent/30 transition-all"
                onClick={handleShare}
                title="Share this game"
              >
                <AnimatePresence mode="wait">
                  {shareCopied ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2 text-accent font-bold text-sm">
                      <Check className="w-4 h-4" /> Copied!
                    </motion.span>
                  ) : (
                    <motion.span key="share" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2 text-sm">
                      <Share2 className="w-4 h-4" /> Share
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="flex-1 bg-card border border-navBorder gap-2 text-muted hover:text-accent hover:border-accent/30 transition-all text-sm"
                onClick={handlePlayTrailer}
                title="Watch trailer"
              >
                <ExternalLink className="w-4 h-4" /> Trailer
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Suggested Games */}
      <div className="mt-32 space-y-8">
        <h2 className="text-3xl font-display font-bold">You Might Also Like</h2>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
          {mockGames.filter(g => g.id !== game.id).slice(0,4).map(g => (
            <div key={g.id} className="snap-start shrink-0">
              <GameCard game={g} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
