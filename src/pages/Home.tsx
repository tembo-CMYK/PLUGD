import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_CONCERTS, INITIAL_EVENTS, ARTISTS } from '../data';
import { ConcertSlide, EventItem } from '../types';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Ticket, X, Check, Heart, Sparkles, Search } from 'lucide-react';
import TicketViewer from '../components/TicketViewer';
import { downloadIcsFile, generateGoogleCalendarUrl } from '../utils/calendar';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  // Category Color helper for PLUGD guidelines
  const getCategoryColors = (category: string) => {
    const cat = category?.toLowerCase();
    if (cat === 'concert' || cat === 'music') {
      return {
        name: 'Music',
        color: 'var(--cat-music)',
        bg: 'var(--cat-music-bg)',
        border: 'var(--cat-music-border)',
        badgeBg: 'var(--cat-music-badge-bg)',
        badgeText: 'var(--cat-music-badge-text)',
        titleColor: 'var(--cat-music-title)'
      };
    }
    if (cat === 'lifestyle' || cat === 'food') {
      return {
        name: 'Food',
        color: 'var(--cat-food)',
        bg: 'var(--cat-food-bg)',
        border: 'var(--cat-food-border)',
        badgeBg: 'var(--cat-food-badge-bg)',
        badgeText: 'var(--cat-food-badge-text)',
        titleColor: 'var(--cat-food-title)'
      };
    }
    if (cat === 'festival' || cat === 'festivals') {
      return {
        name: 'Festivals',
        color: 'var(--cat-festivals)',
        bg: 'var(--cat-festivals-bg)',
        border: 'var(--cat-festivals-border)',
        badgeBg: 'var(--cat-festivals-badge-bg)',
        badgeText: 'var(--cat-festivals-badge-text)',
        titleColor: 'var(--cat-festivals-title)'
      };
    }
    // Default to Arts (Electric Blue) for Arts, Sports, or any other categories
    return {
      name: category,
      color: 'var(--cat-arts)',
      bg: 'var(--cat-arts-bg)',
      border: 'var(--cat-arts-border)',
      badgeBg: 'var(--cat-arts-badge-bg)',
      badgeText: 'var(--cat-arts-badge-text)',
      titleColor: 'var(--cat-arts-title)'
    };
  };

  // Time and Date logic for LSK Lusaka Time (UTC+2)
  const [lusakaTime, setLusakaTime] = useState('');
  
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // UTC+2 calculations
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const lskTime = new Date(utc + 3600000 * 2);
      
      const hours = String(lskTime.getHours()).padStart(2, '0');
      const minutes = String(lskTime.getMinutes()).padStart(2, '0');
      const seconds = String(lskTime.getSeconds()).padStart(2, '0');
      setLusakaTime(`${hours}:${minutes}:${seconds}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Concert Carousel state and ref
  const [concerts] = useState<ConcertSlide[]>(INITIAL_CONCERTS);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340; // Card width + gap
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Interactive Calendar Filters
  const [categories] = useState<string[]>(['All', 'Concert', 'Festival', 'Sports', 'Arts', 'Lifestyle']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>(INITIAL_EVENTS);

  // Discovery Engine States (Search & Calendar)
  const [searchVal, setSearchVal] = useState('');
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState('APR');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  const MONTH_NAMES_LIST: Record<string, { name: string; days: number; offset: number }> = {
    JAN: { name: 'January', days: 31, offset: 2 },
    FEB: { name: 'February', days: 28, offset: 5 },
    MAR: { name: 'March', days: 31, offset: 5 },
    APR: { name: 'April', days: 30, offset: 1 },
    MAY: { name: 'May', days: 31, offset: 3 },
    JUN: { name: 'June', days: 30, offset: 6 },
    JUL: { name: 'July', days: 31, offset: 1 },
    AUG: { name: 'August', days: 31, offset: 4 },
    SEP: { name: 'September', days: 30, offset: 0 },
    OCT: { name: 'October', days: 31, offset: 2 },
    NOV: { name: 'November', days: 30, offset: 5 },
    DEC: { name: 'December', days: 31, offset: 0 }
  };

  const getEventsForDay = (monthAbbr: string, dayNum: number) => {
    return INITIAL_EVENTS.filter(e => e.month === monthAbbr && parseInt(e.day, 10) === dayNum);
  };

  const searchedEvents = INITIAL_EVENTS.filter((evt) => {
    // 1. Filter by calendar month if month is selected (and not 'ALL')
    if (selectedCalendarMonth !== 'ALL') {
      if (evt.month !== selectedCalendarMonth) return false;
    }

    // 2. Filter by calendar day if day is selected
    if (selectedCalendarDay !== null) {
      if (parseInt(evt.day, 10) !== selectedCalendarDay) return false;
    }

    // 3. Filter by search query text
    if (searchVal.trim() !== '') {
      const q = searchVal.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchDesc = evt.description.toLowerCase().includes(q);
      const matchLoc = evt.location.toLowerCase().includes(q);
      const matchCat = evt.category.toLowerCase().includes(q);
      const matchSub = evt.subcategories?.some(sub => sub.toLowerCase().includes(q)) ?? false;
      
      if (!matchTitle && !matchDesc && !matchLoc && !matchCat && !matchSub) {
        return false;
      }
    }

    return true;
  });

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredEvents(INITIAL_EVENTS);
    } else {
      setFilteredEvents(INITIAL_EVENTS.filter(e => e.category === selectedCategory));
    }
  }, [selectedCategory]);

  // Spot Reservation Modal State
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', tickets: 1 });
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleOpenBooking = (event: EventItem) => {
    setSelectedEvent(event);
    setIsBooked(false);
    setFormData({ name: '', email: '', tickets: 1 });
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    // Simulate premium booking reference creation
    const ref = 'LSK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setBookingRef(ref);
    setIsBooked(true);
  };

  return (
    <div className="bg-[#131415] text-white min-h-screen" id="home-page-container">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 border-b border-[#212224]" id="hero-section">
        {/* Immersive Concert Stage Background Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1920&q=80"
            alt="Concert Atmosphere Backstage Background"
            className="w-full h-full object-cover opacity-[0.24] scale-102 filter brightness-[0.75] saturate-[1.2]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Decorative Grid and Ambient Lights */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-neon-green/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-neon-green/5 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* HERO TEXT */}
          <motion.div 
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.25,
                }
              }
            }}
          >
            
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 35, scale: 0.98, filter: 'blur(12px)' },
                visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-white max-w-3xl mx-auto" 
              id="hero-heading"
            >
              Zambia’s <span className="text-[#7F3CF7] font-normal">Biggest</span> Events, <br />
              All in One Place
            </motion.h1>
 
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 35, scale: 0.98, filter: 'blur(12px)' },
                visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="font-sans text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto"
            >
              Welcome to your interactive gateway for Zambia's premier gatherings. Secure your entry for local concerts, sports tournaments, and culture festivals instantly.
            </motion.p>
 
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 35, scale: 0.98, filter: 'blur(12px)' },
                visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => onNavigate('/events')}
                className="w-full sm:w-auto font-sans text-xs tracking-wider uppercase bg-neon-green hover:bg-[#a9fd73] text-black font-extrabold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(154,250,95,0.2)] hover:shadow-[0_0_35px_rgba(154,250,95,0.35)] cursor-pointer"
                id="hero-explore-btn"
              >
                Explore Events
              </button>
              <a
                href="#upcoming-events-anchor"
                className="w-full sm:w-auto font-sans text-xs tracking-wider uppercase text-gray-300 hover:text-neon-green border border-[#232426] hover:border-neon-green/30 bg-[#161719]/40 hover:bg-[#161719] font-bold px-8 py-4 rounded-xl transition-all duration-300 text-center"
              >
                Scroll to explore ↓
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEARCH & CALENDAR DISCOVERY DECK */}
      <section className="py-20 border-b border-[#212224] bg-[#161719]" id="search-discovery-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center md:text-left mb-10 space-y-2">
            <span className="font-mono text-[9px] uppercase text-black font-black bg-neon-green px-3 py-1 rounded-full tracking-widest inline-block animate-pulse">
              Search Upcoming Events
            </span>
            <h2 className="font-serif text-3xl font-light tracking-tight text-white">
              Discover Upcoming Shows & Festivals
            </h2>
            <p className="font-sans text-xs text-gray-400">
              Find any event in Zambia instantly, or click on calendar months to browse by date.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: LIVE SEARCH & MATCHES (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Search input bar */}
              <div className="relative bg-[#1a1b1d] border border-[#2b2d30] rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search by name, location, category, subcategories..."
                    className="w-full bg-[#111213] text-xs text-gray-100 placeholder-gray-500 pl-11 pr-16 py-3 rounded-xl border border-[#25272a] focus:outline-none focus:border-neon-green/50 transition-colors"
                  />
                  {searchVal && (
                    <button 
                      type="button" 
                      onClick={() => setSearchVal('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-[#9afa5f] hover:text-white uppercase transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                {/* Search tags fast-pill */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {(searchVal || selectedCalendarDay || selectedCalendarMonth !== 'ALL') && (
                    <button
                      onClick={() => {
                        setSearchVal('');
                        setSelectedCalendarMonth('ALL');
                        setSelectedCalendarDay(null);
                      }}
                      className="whitespace-nowrap font-sans text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-2 rounded-xl transition-all cursor-pointer font-bold uppercase"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Tags row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Suggested Searches:</span>
                {['Ubuntu', 'Pinnacle', 'Festival', 'Sports', 'Lifestyle', 'Arts'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchVal(tag)}
                    className={`font-sans text-[10px] font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    searchVal.toLowerCase() === tag.toLowerCase()
                      ? 'bg-neon-green text-black border-transparent font-black shadow-[0_0_10px_rgba(154,250,95,0.15)]'
                      : 'text-gray-400 hover:text-neon-green bg-[#18191b] hover:bg-[#1f2123] border-[#232426] hover:border-neon-green/30'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* MATCHES CONTAINER */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-ping" />
                    {searchedEvents.length} event{searchedEvents.length !== 1 ? 's' : ''} found
                  </span>
                  
                  {selectedCalendarMonth !== 'ALL' && (
                    <span className="font-mono text-[9px] text-gray-500 uppercase">
                      IN {MONTH_NAMES_LIST[selectedCalendarMonth]?.name}
                    </span>
                  )}
                </div>

                <motion.div layout className="space-y-3.5 max-h-[480px] overflow-y-auto pr-2 no-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {searchedEvents.map((evt) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        key={evt.id}
                        className="rounded-2xl p-4 flex gap-4 hover:translate-x-1 transition-all duration-300 group shadow-lg border backdrop-blur-md"
                        style={{ 
                          '--card-bg': getCategoryColors(evt.category).bg,
                          '--card-border': getCategoryColors(evt.category).border,
                          '--card-accent': getCategoryColors(evt.category).color,
                          '--card-badge-bg': getCategoryColors(evt.category).badgeBg,
                          '--card-badge-text': getCategoryColors(evt.category).badgeText,
                          '--card-title-color': getCategoryColors(evt.category).titleColor,
                          backgroundColor: 'var(--card-bg)',
                          borderColor: 'var(--card-border)',
                          borderLeft: `4px solid var(--card-accent)`
                        } as React.CSSProperties}
                        id={`discover-card-${evt.id}`}
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#242528]/40 relative">
                          <img 
                            src={evt.imageUrl} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div 
                            style={{ 
                              color: 'var(--card-badge-text)',
                              backgroundColor: 'var(--card-badge-bg)',
                              borderColor: 'var(--card-border)'
                            }}
                            className="absolute top-1.5 left-1.5 font-mono text-[7px] font-semibold border px-1.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur"
                          >
                            {evt.category}
                          </div>
                        </div>

                        <div className="flex-grow flex flex-col justify-between py-0.5 min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-3">
                              <h4 
                                className="font-serif text-sm sm:text-base font-light transition-colors leading-tight truncate"
                                style={{ color: 'var(--card-title-color)' }}
                              >
                                {evt.title}
                              </h4>
                              <div 
                                className="border px-2 py-0.5 rounded-lg text-center min-w-10 flex-shrink-0"
                                style={{ backgroundColor: 'var(--card-badge-bg)', borderColor: 'var(--card-border)' }}
                              >
                                <span className="font-mono text-[7px] tracking-wide text-gray-400 block leading-tight">{evt.month}</span>
                                <span className="font-serif text-[11px] font-black block leading-tight mt-0.5" style={{ color: 'var(--card-accent)' }}>{evt.day}</span>
                              </div>
                            </div>
                            <p className="font-sans text-[11px] text-gray-400 mt-1 leading-normal line-clamp-2 pr-4">
                              {evt.description}
                            </p>
                          </div>

                          <div 
                            className="flex items-center justify-between gap-4 mt-2.5 pt-2 border-t"
                            style={{ borderColor: 'var(--card-border)' }}
                          >
                            <span className="font-sans text-[10px] text-gray-400 truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--card-accent)' }} />
                              {evt.location}
                            </span>
                            
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <button
                                onClick={() => {
                                  if (evt.title.includes('Kunkeyani')) {
                                    onNavigate('/artist-events-page-2');
                                  } else if (evt.id === 'e1' || evt.title.includes('Cleo')) {
                                    onNavigate('/artist-events-page');
                                  } else {
                                    handleOpenBooking(evt);
                                  }
                                }}
                                className="font-mono text-[9px] tracking-wider hover:underline font-bold uppercase cursor-pointer"
                                style={{ color: 'var(--card-accent)' }}
                              >
                                Tickets
                              </button>
                              <span className="w-1 h-1 bg-gray-600 rounded-full" />
                              <button
                                onClick={() => handleOpenBooking(evt)}
                                className="font-mono text-[9px] tracking-wider text-gray-300 font-bold uppercase cursor-pointer hover:text-[var(--card-accent)] transition-colors"
                              >
                                Reserve Spot
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {searchedEvents.length === 0 && (
                    <div className="text-center py-14 bg-[#111213] border border-[#232426]/70 rounded-2xl">
                      <Calendar className="w-7 h-7 text-gray-600 mx-auto mb-2" />
                      <p className="font-sans text-xs text-gray-400 mb-1">No matching live shows listed for this search combination.</p>
                      <button
                        onClick={() => {
                          setSearchVal('');
                          setSelectedCalendarMonth('ALL');
                          setSelectedCalendarDay(null);
                        }}
                        className="font-mono text-[9px] text-neon-green uppercase tracking-wider hover:underline"
                      >
                        Reset All Filters to see everything
                      </button>
                    </div>
                  )}
                </motion.div>

              </div>

            </div>

            {/* COLUMN 2: THE INTERACTIVE GRAPHICAL CALENDAR (5 cols) */}
            <div className="lg:col-span-5 bg-[#18191b] border border-[#2b2d30] rounded-3xl p-5 shadow-xl relative overflow-hidden" id="interactive-calendar-block">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neon-green/5 via-transparent to-transparent pointer-events-none" />
              
              {/* Calendar Widget Title / Month Selector Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-serif text-base font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-neon-green" />
                    Zambia Events Calendar
                  </h3>
                  <span className="font-sans text-[10px] text-gray-400 block mt-0.5">
                    Click a highlighted date to see show details
                  </span>
                </div>

                <div className="bg-[#111213] border border-[#232426] px-2 py-1 rounded-lg">
                  <span className="font-mono text-[8px] text-[#9afa5f] font-bold">2025 SEASON</span>
                </div>
              </div>

              {/* Scrollable Month Selector Bar */}
              <div className="flex gap-1 overflow-x-auto pb-2 mb-5 no-scrollbar border-b border-[#242528]">
                <button
                  onClick={() => {
                    setSelectedCalendarMonth('ALL');
                    setSelectedCalendarDay(null);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg font-mono text-[9px] tracking-wider transition-all duration-300 ${
                    selectedCalendarMonth === 'ALL' 
                      ? 'bg-neon-green text-black font-extrabold shadow-[0_0_10px_rgba(154,250,95,0.15)]'
                      : 'bg-[#111213] text-gray-400 hover:text-white hover:bg-[#1a1b1d] border border-[#242528]'
                  }`}
                >
                  ALL
                </button>
                {Object.keys(MONTH_NAMES_LIST).map((mKey) => {
                  const hasEventsInMonth = INITIAL_EVENTS.some(ev => ev.month === mKey);
                  return (
                    <button
                      key={mKey}
                      onClick={() => {
                        setSelectedCalendarMonth(mKey);
                        setSelectedCalendarDay(null); 
                      }}
                      className={`px-2.5 py-1.5 rounded-lg font-mono text-[9px] tracking-wider transition-all duration-300 relative ${
                        selectedCalendarMonth === mKey 
                          ? 'bg-neon-green text-black font-extrabold shadow-[0_0_10px_rgba(154,250,95,0.15)]'
                          : 'bg-[#111213] text-gray-400 hover:text-white hover:bg-[#1a1b1d] border border-[#242528]'
                      }`}
                    >
                      {mKey}
                      {hasEventsInMonth && selectedCalendarMonth !== mKey && (
                        <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-neon-green rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Grid representation (only if month !== ALL, otherwise show general stats/select calendar prompt) */}
              {selectedCalendarMonth === 'ALL' ? (
                <div className="py-14 text-center bg-[#111213] border border-[#232426] rounded-2xl flex flex-col items-center justify-center p-6 space-y-4">
                  <Sparkles className="w-8 h-8 text-neon-green animate-pulse" />
                  <div className="space-y-1.5">
                    <p className="font-serif text-sm font-bold text-white">Browse by Month</p>
                    <p className="font-sans text-[11px] text-gray-400 leading-normal max-w-[240px]">
                      Choose any month above to open its calendar. Celebrated music concerts, events, and festival dates are highlighted.
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-center">
                    {['APR', 'AUG', 'DEC'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedCalendarMonth(m)}
                        className="font-mono text-[9px] text-[#9afa5f] bg-neon-green/10 border border-neon-green/20 px-2 py-1 rounded-md hover:bg-neon-green hover:text-black transition-colors"
                      >
                        View {m} Calendar →
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Selected Month Name & Quick Info */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-serif text-xs font-bold text-gray-200">
                      {MONTH_NAMES_LIST[selectedCalendarMonth]?.name} 2025
                    </span>
                    
                    {selectedCalendarDay ? (
                      <button
                        onClick={() => setSelectedCalendarDay(null)}
                        className="font-mono text-[9px] text-[#9afa5f] hover:underline uppercase font-bold"
                      >
                        Show Month
                      </button>
                    ) : (
                      <span className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">
                        ★ Indicator highlights show dates
                      </span>
                    )}
                  </div>

                  {/* Day of Week Labels header Row */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1.5 border-b border-[#242528] pb-1">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayLabel, idx) => (
                      <span key={idx} className="font-mono text-[8px] font-bold text-gray-500 uppercase py-0.5">
                        {dayLabel}
                      </span>
                    ))}
                  </div>

                  {/* Grid of Days inside the Month */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {/* Blank offset spots */}
                    {Array.from({ length: MONTH_NAMES_LIST[selectedCalendarMonth]?.offset || 0 }).map((_, idx) => (
                      <div key={`blank-${idx}`} className="h-7 rounded opacity-0" />
                    ))}

                    {/* Days from 1 to daysOfMonth */}
                    {Array.from({ length: MONTH_NAMES_LIST[selectedCalendarMonth]?.days || 31 }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const dayEvents = getEventsForDay(selectedCalendarMonth, dayNum);
                      const hasEvents = dayEvents.length > 0;
                      const isSelected = selectedCalendarDay === dayNum;

                      return (
                        <button
                          key={`day-${dayNum}`}
                          onClick={() => {
                            if (hasEvents) {
                              setSelectedCalendarDay(isSelected ? null : dayNum);
                            } else {
                              setSelectedCalendarDay(null);
                            }
                          }}
                          className={`h-7 rounded-md flex flex-col items-center justify-center relative group transition-all duration-300 text-[11px] ${
                            isSelected
                              ? 'bg-neon-green text-black font-black scale-[1.03] shadow-[0_0_12px_rgba(154,250,95,0.4)] border border-neon-green'
                              : hasEvents
                                ? 'bg-neon-green/10 hover:bg-neon-green/20 text-[#9afa5f] font-bold border border-neon-green/30 cursor-pointer'
                                : 'bg-[#111213] text-gray-500 hover:text-gray-300 border border-transparent'
                          }`}
                          disabled={!hasEvents && !isSelected}
                        >
                          <span className="font-mono text-xs">{dayNum}</span>
                          
                          {hasEvents && !isSelected && (
                            <span className="absolute bottom-0.5 w-1 h-1 bg-neon-green rounded-full animate-ping" />
                          )}

                          {/* Hover Tooltip display */}
                          {hasEvents && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#111213] border border-[#2b2d30] text-white p-2 rounded-lg text-left shadow-2xl w-44 z-30 pointer-events-none">
                              <span className="font-mono text-[7px] text-[#9afa5f] uppercase tracking-wider block font-bold">SHOW SCHEDULED</span>
                              {dayEvents.map((e, evIdx) => (
                                <div key={evIdx} className="text-[10px] font-serif font-black text-gray-200 mt-0.5 leading-tight truncate">{e.title}</div>
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Bottom Card Summary of Events on active Month */}
              <div className="mt-5 pt-3.5 border-t border-[#242528] space-y-2.5">
                <span className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">
                  Selection Summary
                </span>
                
                {selectedCalendarDay && selectedCalendarMonth !== 'ALL' ? (
                  <div className="bg-[#111213] border border-neon-green/20 rounded-xl p-2.5 flex gap-2.5 items-center">
                    <span className="font-serif text-xl font-black text-neon-green">
                      {selectedCalendarDay}
                    </span>
                    <div className="min-w-0">
                      <span className="font-mono text-[7px] text-gray-400 uppercase tracking-wider">Happening on this date:</span>
                      <p className="font-sans text-[11px] font-bold text-gray-200 truncate">
                        {getEventsForDay(selectedCalendarMonth, selectedCalendarDay).map(e => e.title).join(', ')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#111213] border border-[#232426] rounded-xl p-3 text-left">
                    <p className="font-sans text-[10px] text-gray-400 leading-normal">
                      {selectedCalendarMonth === 'ALL' ? (
                        <span>Showing all 2025 events across Zambia. Use the search box or select a specific month to see more.</span>
                      ) : (
                        <span>There are <span className="font-mono font-bold text-[#9afa5f]">{INITIAL_EVENTS.filter(e => e.month === selectedCalendarMonth).length} live shows</span> in {MONTH_NAMES_LIST[selectedCalendarMonth]?.name}. Click any highlighted day to find ticket option details.</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* CONCERT CAROUSEL SECTION */}
      <section className="relative overflow-hidden py-24 border-b border-[#212224] bg-[#111213]" id="concerts-carousel-section">
        {/* Danny Howe Concert Background Image */}
        <div 
          className="absolute inset-0 select-none pointer-events-none z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1210&h=652&q=80')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.34,
          }}
        />
        {/* Subtle dark overlays to ensure maximum readability of carousel content */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111213] via-transparent to-[#111213] opacity-60 z-0" />
        <div className="absolute inset-0 bg-[#111213]/40 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Section Header */}
          <div className="max-w-2xl mx-auto space-y-4 mb-4">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white" id="concerts-heading">
              See your favorite artists in concert
            </h2>
            <p className="font-sans text-sm sm:text-base text-gray-400 leading-relaxed">
              Experience unforgettable nights. Browse premium pass structures, click cards directly to shift the deck, and secure tickets for Zambia's biggest performances.
            </p>
          </div>

          {/* Interactive Framer-Style Ticket Deck Carousel */}
          <TicketViewer />

        </div>
      </section>

      
      {/* FEATURED ARTIST SECTION */}
      <section className="py-24 border-b border-[#212224] relative overflow-hidden" id="featured-artist-section">
        {/* Background glow overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-neon-green/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="border-b border-[#282a2c]/60 pb-4 mb-12">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-white mb-2">
              Featured Artist
            </h3>
            <p className="font-sans text-xs tracking-widest text-neon-green uppercase font-bold">
              SPOTLIGHT PERFORMANCE
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#18191b] border border-[#2c2e30] rounded-3xl overflow-hidden shadow-2xl relative group"
          >
            
            {/* Banner Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* IMAGE FRAME */}
              <div className="lg:col-span-5 h-[320px] lg:h-auto min-h-[350px] relative overflow-hidden bg-[#1f2022]">
                <img 
                  src="https://framerusercontent.com/images/pftyzBB67d2TZSnCpKHzYnCg2k.png" 
                  alt="Kunkeyani Tha Jedi poster" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: 'center 20%' }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Avatar */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-[#111213]/80 backdrop-blur border border-[#303133] p-2.5 rounded-2xl">
                  <img 
                    src="https://framerusercontent.com/images/4KwGulfVE58DNM8WLf5NHvsQ.jpg"
                    alt="Kunkeyani portrait"
                    className="w-10 h-10 rounded-xl object-cover"
                    style={{ objectPosition: 'center 15%' }}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-sans text-xs font-bold text-white uppercase">Kunkeyani Tha Jedi</h5>
                    <span className="font-mono text-[9px] text-[#9afa5f]">COACHELLA 2025</span>
                  </div>
                </div>
              </div>

              {/* DETAILS FRAME */}
              <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8 bg-[#18191b]">
                
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-neon-green transition-colors" id="featured-artist-title">
                    Kunkeyani Tha Jedi Headlining Coachella
                  </h3>
                  
                  <p className="font-sans text-sm text-gray-400 leading-relaxed">
                    Zambia’s very own lyrical master takes center stage at one of the world’s biggest music festivals! Known for his razor-sharp wordplay, infectious energy, and unmatched stage presence, Kunkeyani is set to bring Zambian hip-hop to a global audience like never before.
                  </p>
                  
                  <p className="font-sans text-sm text-gray-400 leading-relaxed border-l-2 border-neon-green/50 pl-4 py-1 italic">
                    Catch him live at Coachella Main Stage, California for a historic performance that blends local rhythm with international flair. This is more than a concert — it’s a cultural moment you don’t want to miss.
                  </p>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#2b2d30] pt-6 font-sans">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 block">FESTIVAL DATE</span>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-neon-green" />
                      Saturday, April 12, 2025
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 block">LOCATION VENUE</span>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-neon-green" />
                      Indio, California
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => onNavigate('/artist-events-page-2')}
                    className="font-sans text-xs tracking-wider uppercase bg-neon-green hover:bg-[#a9fd73] text-black font-extrabold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(154,250,95,0.15)] cursor-pointer text-center"
                    id="find-tickets-btn"
                  >
                    Find Tickets
                  </button>
                  <button
                    onClick={() => handleOpenBooking({
                      id: 'kunkeyani-special',
                      title: 'Kunkeyani Tha Jedi Headlining Coachella',
                      month: 'APR',
                      day: '12',
                      description: 'Kunkeyani Tha Jedi Special Coachella Spotlight Spot Reservation.',
                      location: 'Empire Polo Grounds, Indio, California',
                      category: 'Concert',
                      imageUrl: 'https://framerusercontent.com/images/pftyzBB67d2TZSnCpKHzYnCg2k.png'
                    })}
                    className="font-sans text-xs tracking-wider uppercase text-white hover:text-neon-green border border-[#313336] hover:border-neon-green/30 px-8 py-3.5 rounded-xl bg-[#202123]/40 hover:bg-[#202123] transition-all duration-300 cursor-pointer"
                  >
                    Reserve Guest Spot 🎟️
                  </button>
                </div>

              </div>

            </div>

          </motion.div>

        </div>
      </section>


      {/* INTERACTIVE CALENDAR & UPCOMING EVENTS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#212224]" id="upcoming-events-anchor">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <h3 
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-tight mb-2" 
              id="upcoming-heading"
              style={{ color: '#ccff95' }}
            >
              Upcoming Events
            </h3>
            <p className="font-sans text-sm text-gray-400 leading-relaxed">
              Explore our interactive calendar to find and filter all upcoming events by category.
            </p>
          </div>

          {/* QUICK REFRESH / METADATA SUMMARY */}
          <span className="font-mono text-[10px] tracking-wide text-neon-green bg-[#18191b] border border-[#2d2e30] py-1.5 px-3 rounded-lg flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-neon-green uppercase animate-pulse" />
            {filteredEvents.length} CATEGORY MATCHES FOUND
          </span>
        </div>

        {/* Filter Categories Buttons */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar" id="calendar-category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl font-sans text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neon-green text-black font-extrabold shadow-[0_0_15px_rgba(154,250,95,0.2)]'
                  : 'bg-[#18191b] text-gray-400 hover:text-white border border-[#292a2c]'
              }`}
              id={`filter-btn-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="calendar-events-grid">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="border rounded-2xl overflow-hidden flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 shadow-xl group backdrop-blur-md"
              style={{ 
                '--card-bg': getCategoryColors(evt.category).bg,
                '--card-border': getCategoryColors(evt.category).border,
                '--card-accent': getCategoryColors(evt.category).color,
                '--card-badge-bg': getCategoryColors(evt.category).badgeBg,
                '--card-badge-text': getCategoryColors(evt.category).badgeText,
                '--card-title-color': getCategoryColors(evt.category).titleColor,
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                borderBottom: `4px solid var(--card-accent)`
              } as React.CSSProperties}
              id={`event-card-${evt.id}`}
            >
              <div>
                
                {/* Event Poster Card */}
                <div className="h-48 relative overflow-hidden bg-[#242528]/40">
                  <img 
                    src={evt.imageUrl} 
                    alt={evt.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    style={{ objectPosition: evt.imagePosition || 'center' }}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Calendar Badges */}
                  <div className="absolute top-4 left-4 flex gap-1.5 items-center">
                    <span 
                      style={{ 
                        color: 'var(--card-badge-text)',
                        backgroundColor: 'var(--card-badge-bg)',
                        borderColor: 'var(--card-border)'
                      }}
                      className="font-mono text-[9px] font-semibold border px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur"
                    >
                      {evt.category}
                    </span>
                  </div>

                  {/* Corner Calendar indicator */}
                  <div 
                    className="absolute bottom-4 right-4 border p-2 rounded-xl text-center min-w-12 backdrop-blur-md"
                    style={{ backgroundColor: 'var(--card-badge-bg)', borderColor: 'var(--card-border)' }}
                  >
                    <div className="font-mono text-[10px] tracking-wide text-gray-400">{evt.month}</div>
                    <div className="font-serif text-lg font-black leading-none mt-0.5" style={{ color: 'var(--card-accent)' }}>{evt.day}</div>
                  </div>
                </div>

                {/* Card details */}
                <div className="p-6 space-y-3">
                  <h4 
                    className="font-serif text-lg font-light transition-colors"
                    style={{ color: 'var(--card-title-color)' }}
                  >
                    {evt.title}
                  </h4>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {evt.description}
                  </p>
                </div>
              </div>

              {/* Bottom location and CTA button */}
              <div 
                className="px-6 pb-6 pt-3 border-t flex flex-col gap-4"
                style={{ borderColor: 'var(--card-border)' }}
              >
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--card-accent)' }} />
                  <span className="truncate">{evt.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenBooking(evt)}
                    className="font-sans font-bold text-[10px] tracking-widest uppercase py-2.5 rounded-lg border transition-all duration-300 cursor-pointer flex items-center justify-center gap-1 card-btn-primary"
                    id={`spot-${evt.id}`}
                  >
                    Save A Spot
                  </button>
                  <button
                    onClick={() => {
                      if (evt.title.includes('Kunkeyani')) {
                        onNavigate('/artist-events-page-2');
                      } else if (evt.id === 'e1' || evt.title.includes('Cleo')) {
                        onNavigate('/artist-events-page');
                      } else {
                        handleOpenBooking(evt);
                      }
                    }}
                    className="font-sans font-semibold text-[10px] tracking-widest uppercase py-2.5 rounded-lg border transition-all duration-300 cursor-pointer text-center card-btn-secondary"
                    id={`details-${evt.id}`}
                  >
                    Find Tickets
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-[#18191b] border border-[#232426] rounded-2xl" id="no-events">
            <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="font-sans text-sm text-gray-400 mb-1">No upcoming events listed for this category right now.</p>
            <p className="font-mono text-xs text-[#9afa5f] uppercase tracking-wider">Stay tuned for new releases!</p>
          </div>
        )}

      </section>

      {/* BOOKING SLIDE-OVER MODAL FEATURE */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" id="booking-modal">
          <div className="bg-[#18191b] border border-[#2d2e30] rounded-3xl w-full max-w-3xl h-[600px] md:h-[540px] overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
            
            {/* Left side cover image (half the modal) */}
            <div className="relative w-full md:w-1/2 h-[220px] md:h-full shrink-0 bg-[#202123] overflow-hidden">
              {selectedEvent.imageUrl && (
                <img 
                  src={selectedEvent.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover opacity-90" 
                  style={{ objectPosition: selectedEvent.imagePosition || 'center' }}
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Right side form block (half the modal, with scrollable content if needed) */}
            <div className="flex-1 h-[calc(100%-220px)] md:h-full overflow-y-auto p-6 relative flex flex-col justify-between bg-[#18191b]">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-1.5 bg-black/30 hover:bg-black/60 text-gray-400 hover:text-white rounded-xl z-20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex-grow flex flex-col justify-center min-h-0">
                {!isBooked ? (
                  // BOOKING REGISTRATION FORM
                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-neon-green">SPOT BOOKING REGISTER</span>
                      <h4 className="font-serif text-xl font-bold text-white leading-tight">
                        {selectedEvent.title}
                      </h4>
                      <p className="font-sans text-xs text-gray-400 leading-relaxed">
                        Fill out your registration info below to reserve your entry spot. Free tickets will be dispatched directly to your email.
                      </p>
                    </div>

                    {/* Add to Calendar Button Row */}
                    <div className="bg-[#1f2123] border border-[#2d2e30] p-3 rounded-2xl space-y-2">
                      <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block">Add Event To Calendar:</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => downloadIcsFile({
                            title: selectedEvent.title,
                            description: selectedEvent.description,
                            location: selectedEvent.location,
                            month: selectedEvent.month,
                            day: selectedEvent.day
                          })}
                          className="flex items-center justify-center gap-1.5 bg-[#18191b] hover:bg-[#252629] border border-[#2d2e30] hover:border-neon-green/30 text-gray-300 hover:text-white font-sans text-[10px] tracking-wider uppercase py-2 rounded-xl transition-all cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-neon-green" />
                          <span>iCal / .ics</span>
                        </button>
                        <a
                          href={generateGoogleCalendarUrl({
                            title: selectedEvent.title,
                            description: selectedEvent.description,
                            location: selectedEvent.location,
                            month: selectedEvent.month,
                            day: selectedEvent.day
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-[#18191b] hover:bg-[#252629] border border-[#2d2e30] hover:border-neon-green/30 text-gray-300 hover:text-white font-sans text-[10px] tracking-wider uppercase py-2 rounded-xl transition-all cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-neon-green" />
                          <span>Google Cal</span>
                        </a>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="font-sans text-[11px] text-gray-300 font-medium block">Your Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full bg-[#1e2022] border border-[#2c2e30] hover:border-gray-600 focus:border-neon-green text-white text-sm outline-none rounded-xl px-4 py-2.5 placeholder-gray-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-sans text-[11px] text-gray-300 font-medium block">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full bg-[#1e2022] border border-[#2c2e30] hover:border-gray-600 focus:border-neon-green text-white text-sm outline-none rounded-xl px-4 py-2.5 placeholder-gray-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-sans text-[11px] text-gray-300 font-medium block">Number of Spots</label>
                        <select
                          value={formData.tickets}
                          onChange={(e) => setFormData({ ...formData, tickets: parseInt(e.target.value) })}
                          className="w-full bg-[#1e2022] border border-[#2c2e30] focus:border-neon-green text-white text-sm outline-none rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n} className="bg-[#18191b]">{n} Ticket{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-neon-green text-black font-sans font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-[#a9fd73] transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                    >
                      Confirm Free Spot Reservation
                    </button>
                  </form>
                ) : (
                  // REGISTRATION SUCCESS STATE
                  <div className="space-y-4 text-center py-2">
                    <div className="w-12 h-12 bg-neon-green/10 border border-neon-green/30 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-bounce">
                      <Check className="w-6 h-6 text-neon-green" />
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-neon-green">BOOKING SUCCESSFUL</span>
                      <h4 className="font-serif text-lg font-bold text-white">Entry Ticket Confirmed</h4>
                      <p className="font-sans text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                        Hey <strong>{formData.name}</strong>, your spot is safe! We have reserved your <strong>{formData.tickets} entry pass{formData.tickets > 1 ? 'es' : ''}</strong>. Confirmation was emailed to <span className="text-neon-green">{formData.email}</span>.
                      </p>
                    </div>

                    {/* Dynamic Confirmation Receipt Block */}
                    <div className="bg-[#202123] p-3.5 rounded-2xl font-mono text-left space-y-2 text-[11px] border border-[#2d2e30]">
                      <div className="flex justify-between items-center border-b border-[#2d2e30] pb-1.5">
                        <span className="text-gray-500 uppercase tracking-widest text-[8px]">EVENT TICKET</span>
                        <span className="text-[#9afa5f]">{bookingRef}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">EVENT:</span>
                        <span className="text-white font-bold truncate max-w-[140px]">{selectedEvent.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">GUEST:</span>
                        <span className="text-white font-bold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">QUANTITY:</span>
                        <span className="text-white font-bold">{formData.tickets} Pass(es)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">TIME:</span>
                        <span className="text-neon-green font-bold uppercase">{selectedEvent.month} {selectedEvent.day} @ LUSAKA TIME</span>
                      </div>
                    </div>

                    {/* Success State Add to Calendar Option */}
                    <div className="grid grid-cols-2 gap-2 pt-1 pb-1">
                      <button
                        type="button"
                        onClick={() => downloadIcsFile({
                          title: selectedEvent.title,
                          description: selectedEvent.description,
                          location: selectedEvent.location,
                          month: selectedEvent.month,
                          day: selectedEvent.day
                        })}
                        className="flex items-center justify-center gap-1 bg-[#1e2022] hover:bg-[#2c2d30] border border-[#2d2e30] text-gray-300 font-sans text-[10px] tracking-wider uppercase py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-neon-green" />
                        <span>Add iCal</span>
                      </button>
                      <a
                        href={generateGoogleCalendarUrl({
                          title: selectedEvent.title,
                          description: selectedEvent.description,
                          location: selectedEvent.location,
                          month: selectedEvent.month,
                          day: selectedEvent.day
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 bg-[#1e2022] hover:bg-[#2c2d30] border border-[#2d2e30] text-gray-300 font-sans text-[10px] tracking-wider uppercase py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-neon-green" />
                        <span>Add Google</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedEvent(null)}
                      className="w-full bg-[#202123] text-gray-300 border border-[#2d2e30] font-sans font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Done & Close
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
