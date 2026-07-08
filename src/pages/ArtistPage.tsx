import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArtistItem } from '../types';
import { 
  MapPin, 
  Calendar, 
  Heart, 
  Sparkles, 
  Star, 
  Search, 
  UtensilsCrossed, 
  Music2, 
  CalendarRange, 
  Tag, 
  X,
  Sparkle
} from 'lucide-react';

interface ArtistPageProps {
  artists: ArtistItem[];
  onNavigate: (path: string) => void;
}

export default function ArtistPage({ artists, onNavigate }: ArtistPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Music' | 'Food' | 'Festival'>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [favoritedIds, setFavoritedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favorited_profiles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem('favorited_profiles', JSON.stringify(favoritedIds));
  }, [favoritedIds]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoritedIds(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Extract all unique specialties for pills dynamically based on selectedCategory
  const availableSpecialties = useMemo(() => {
    const relevantProfiles = selectedCategory === 'All' 
      ? artists 
      : artists.filter(a => a.category === selectedCategory);
    const specialties = relevantProfiles.flatMap(a => a.specialties || []);
    return Array.from(new Set(specialties));
  }, [selectedCategory, artists]);

  // Reset specialty if it is no longer available under the newly selected category
  useEffect(() => {
    if (selectedSpecialty && !availableSpecialties.includes(selectedSpecialty)) {
      setSelectedSpecialty(null);
    }
  }, [selectedCategory, availableSpecialties, selectedSpecialty]);

  // Filtered profiles based on category, search, and active specialty
  const filteredProfiles = useMemo(() => {
    return artists.filter(profile => {
      // Category Match
      if (selectedCategory !== 'All' && profile.category !== selectedCategory) {
        return false;
      }
      
      // Specialty Match
      if (selectedSpecialty && (!profile.specialties || !profile.specialties.includes(selectedSpecialty))) {
        return false;
      }

      // Search Query Match (fuzzy name, bio, location, typeLabel, specialties)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = profile.name.toLowerCase().includes(query);
        const matchesBio = profile.bio.toLowerCase().includes(query);
        const matchesLocation = profile.location.toLowerCase().includes(query);
        const matchesLabel = profile.typeLabel.toLowerCase().includes(query);
        const matchesSpecialties = profile.specialties?.some(s => s.toLowerCase().includes(query));
        return matchesName || matchesBio || matchesLocation || matchesLabel || matchesSpecialties;
      }

      return true;
    });
  }, [selectedCategory, selectedSpecialty, searchQuery]);

  // Helper to retrieve category visual theme & icon list
  const getCategoryTheme = (category: 'Music' | 'Food' | 'Festival') => {
    switch (category) {
      case 'Music':
        return {
          icon: <Music2 className="w-3.5 h-3.5" style={{ color: 'var(--cat-music)' }} />,
          color: 'var(--cat-music)',
          bg: 'var(--cat-music-bg)',
          border: 'var(--cat-music-border)',
          badgeStyle: { color: 'var(--cat-music-badge-text)', backgroundColor: 'var(--cat-music-badge-bg)', borderColor: 'var(--cat-music-border)' },
          titleColor: 'var(--cat-music-title)',
          textHover: 'group-hover:text-[#7F3CF7] .light group-hover:text-[#6320D5]',
        };
      case 'Food':
        return {
          icon: <UtensilsCrossed className="w-3.5 h-3.5" style={{ color: 'var(--cat-food)' }} />,
          color: 'var(--cat-food)',
          bg: 'var(--cat-food-bg)',
          border: 'var(--cat-food-border)',
          badgeStyle: { color: 'var(--cat-food-badge-text)', backgroundColor: 'var(--cat-food-badge-bg)', borderColor: 'var(--cat-food-border)' },
          titleColor: 'var(--cat-food-title)',
          textHover: 'group-hover:text-[#E9733D] .light group-hover:text-[#C45422]',
        };
      case 'Festival':
        return {
          icon: <CalendarRange className="w-3.5 h-3.5" style={{ color: 'var(--cat-festivals)' }} />,
          color: 'var(--cat-festivals)',
          bg: 'var(--cat-festivals-bg)',
          border: 'var(--cat-festivals-border)',
          badgeStyle: { color: 'var(--cat-festivals-badge-text)', backgroundColor: 'var(--cat-festivals-badge-bg)', borderColor: 'var(--cat-festivals-border)' },
          titleColor: 'var(--cat-festivals-title)',
          textHover: 'group-hover:text-[#FFD220] .light group-hover:text-[#B38E00]',
        };
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSpecialty(null);
  };

  return (
    <div className="bg-[#131415] text-white min-h-screen py-16 md:py-24" id="artists-roster-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PAGE HEADER */}
        <div className="border-b border-[#212224] pb-8 mb-12 text-center sm:text-left space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight">
            Featured Lineup & Profile Directory
          </h1>
          <p className="font-sans text-sm text-gray-400 max-w-2xl leading-relaxed">
            Navigate through Zambia’s premium event creators. Discover headlining musicians, award-winning food vendors, traditional pitmasters, and cultural host organizers setting dates this season.
          </p>
        </div>

        {/* SEARCH AND FILTER CONSOLE MODULE */}
        <div className="bg-[#18191b] border border-[#232426] p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl mb-12 space-y-6">
          
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            
            {/* SEARCH INPUT */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5 text-gray-400" />
              </span>
              <input 
                type="text"
                placeholder="Search hosts, specialties, locations, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111213] text-white font-sans text-sm placeholder-gray-500 rounded-xl pl-12 pr-10 py-3.5 border border-[#2c2d30] focus:border-neon-green/60 hover:border-gray-700 focus:outline-none transition-all"
                id="profile-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center pr-1 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* CATEGORY NAV BUTTONS */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-[#111213] rounded-xl border border-[#232426]">
              {(['All', 'Music', 'Food', 'Festival'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-lg text-xs font-sans font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-neon-green text-black font-extrabold shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat === 'All' ? 'All Roles' : cat}
                </button>
              ))}
            </div>

          </div>

          {/* DYNAMIC PIPES/SPECIALTY FILTERS */}
          {availableSpecialties.length > 0 && (
            <div className="border-t border-[#232426]/50 pt-5 space-y-2">
              <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase block">Quick Tag Filters</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {availableSpecialties.map((spec) => {
                  const isActive = selectedSpecialty === spec;
                  return (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpecialty(isActive ? null : spec)}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-neon-green/20 border-neon-green text-neon-green font-bold'
                          : 'bg-[#111213] border-[#2c2d30] text-gray-400 hover:text-white hover:border-gray-600'
                      }`}
                    >
                      <Tag className={`w-3 h-3 ${isActive ? 'text-neon-green' : 'text-gray-500'}`} />
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FA VORITE & COUNTER SUMMARY STATE */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 pt-1 border-t border-[#232426]/30">
            <p className="font-mono text-[10px] uppercase">
              Showing <span className="text-white font-bold">{filteredProfiles.length}</span> verified profiles
            </p>
            {favoritedIds.length > 0 && (
              <p className="font-mono text-[10px] uppercase flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                <span>{favoritedIds.length} favorited items</span>
              </p>
            )}
          </div>

        </div>

        {/* PROFILES CARD GRID */}
        <AnimatePresence mode="popLayout">
          {filteredProfiles.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-8" 
              id="artists-cards-grid"
            >
              {filteredProfiles.map((art) => {
                const isFav = favoritedIds.includes(art.id);
                const themeInfo = getCategoryTheme(art.category);
                
                return (
                  <motion.div
                    layout
                    key={art.id}
                    initial={{ opacity: 0, y: 15, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="border rounded-3xl overflow-hidden shadow-2xl relative group hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between backdrop-blur-md"
                    style={{
                      '--card-bg': themeInfo?.bg,
                      '--card-border': themeInfo?.border,
                      '--card-accent': themeInfo?.color,
                      '--card-badge-bg': themeInfo?.badgeStyle?.backgroundColor,
                      '--card-badge-text': themeInfo?.badgeStyle?.color,
                      '--card-title-color': themeInfo?.titleColor,
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--card-border)',
                      borderBottom: `4px solid var(--card-accent)`
                    } as React.CSSProperties}
                    id={`artist-item-${art.id}`}
                  >
                    
                    <div>
                      {/* Image Banner Container */}
                      <div className="h-48 sm:h-56 relative bg-[#202123] overflow-hidden">
                        <img 
                          src={art.bannerUrl} 
                          alt={art.name} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          style={{ objectPosition: art.bannerPosition || 'center' }}
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Floating Favorite Heart Button */}
                        <div className="absolute top-4 right-4 z-10">
                          <button
                            onClick={(e) => toggleFavorite(art.id, e)}
                            className="bg-black/50 backdrop-blur border border-white/10 p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:scale-105 transition-all duration-300 cursor-pointer focus:outline-none"
                            aria-label="Add to bookmarks"
                          >
                            <Heart className={`w-4 h-4 transition-colors ${isFav ? 'text-red-500 fill-red-500' : 'text-transparent hover:text-red-500'}`} />
                          </button>
                        </div>

                        {/* Category Floating Tag */}
                        <div 
                          style={themeInfo?.badgeStyle}
                          className="absolute top-4 left-4 flex gap-1.5 items-center border backdrop-blur px-3 py-1.5 rounded-full"
                        >
                          {themeInfo?.icon}
                          <span className="font-mono text-[9px] font-semibold tracking-wider uppercase block">{art.category}</span>
                        </div>
                      </div>

                      {/* Headliner Portrait Badge & Title */}
                      <div className="px-6 sm:px-8 relative z-10 -mt-12 flex items-end gap-4">
                        <div 
                          className="w-20 h-20 rounded-2xl overflow-hidden border-4 shadow-xl flex-shrink-0 relative"
                          style={{ borderColor: 'var(--card-bg)', backgroundColor: 'var(--card-badge-bg)' }}
                        >
                          <img 
                            src={art.avatarUrl} 
                            alt={art.name} 
                            className="w-full h-full object-cover"
                            style={{ objectPosition: art.avatarPosition || 'center' }}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        
                        <div className="pb-1">
                          <h3 
                            className="font-serif text-xl sm:text-2xl font-light leading-none tracking-tight"
                            style={{ color: 'var(--card-title-color)' }}
                          >
                            {art.name}
                          </h3>
                          <span 
                            className="font-mono text-[9px] mt-1.5 inline-flex items-center gap-1 uppercase tracking-widest font-bold"
                            style={{ color: 'var(--card-accent)' }}
                          >
                            <Sparkle className="w-2.5 h-2.5 fill-current" style={{ color: 'var(--card-accent)' }} />
                            {art.typeLabel}
                          </span>
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="px-6 sm:px-8 pt-6 space-y-4">
                        <p className="font-sans text-xs text-gray-400 leading-relaxed line-clamp-3">
                           {art.bio}
                        </p>

                        {/* Specialties badges */}
                        {art.specialties && art.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {art.specialties.map(spec => (
                              <span 
                                key={spec} 
                                className="font-mono text-[9px] bg-white/5 text-gray-400 border border-white/5 py-0.5 px-2 rounded-lg"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Footer Button Link */}
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-6 mt-auto">
                      <div 
                        className="grid grid-cols-2 gap-4 border-t pt-5 pb-5 text-sans text-xs text-gray-300"
                        style={{ borderColor: 'var(--card-border)' }}
                      >
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 block">DATES / PROGRAM</span>
                          <p className="font-bold text-white flex items-center gap-1.5 truncate">
                            <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--card-accent)' }} />
                            {art.festivalDate}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 block">LOCATION VENUE</span>
                          <p className="font-bold text-white flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--card-accent)' }} />
                            {art.location}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate(`/${art.slug}`)}
                        className="w-full font-sans font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl border transition-all duration-300 cursor-pointer text-center block card-btn-primary"
                        id={`view-artist-tix-${art.id}`}
                      >
                        Explore Schedule & Tickets →
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* EMPTY SEARCH STATE */
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#18191b] border border-[#232426] rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4"
              id="empty-search-state"
            >
              <div className="w-12 h-12 bg-[#111213] border border-[#2a2b2d] text-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-2 text-lg">
                ❓
              </div>
              <h3 className="font-serif text-xl font-bold text-white">No Profiles Match Your Criteria</h3>
              <p className="font-sans text-xs text-gray-400 leading-relaxed">
                We couldn't find any Music acts, Artisanal vendors, or Festival hosts matching your current filters. Try rewriting keywords or clearing constraints.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex bg-neon-green text-black font-sans font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-[#a9fd73] transition-colors cursor-pointer"
              >
                Clear all active filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

