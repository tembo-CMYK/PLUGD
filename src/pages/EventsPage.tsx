import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_EVENTS } from '../data';
import { EventItem } from '../types';
import { Search, MapPin, Calendar, Sparkles, Filter, Ticket, X, Check } from 'lucide-react';
import { downloadIcsFile, generateGoogleCalendarUrl } from '../utils/calendar';

interface EventsPageProps {
  onNavigate: (path: string) => void;
}

export default function EventsPage({ onNavigate }: EventsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>(INITIAL_EVENTS);

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

  // Filter Categories
  const categories = ['All', 'Concert', 'Festival', 'Sports', 'Arts', 'Lifestyle'];

  useEffect(() => {
    let result = INITIAL_EVENTS;

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(e => e.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      );
    }

    setFilteredEvents(result);
  }, [selectedCategory, searchQuery]);

  // Booking Modal State
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
    <div className="bg-[#131415] text-white min-h-screen py-12 md:py-16" id="events-directory-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PAGE HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.985, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 max-w-3xl mb-12" 
          id="events-header"
        >
          <h1 
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight"
            style={{ color: '#fff3f3' }}
          >
            Zambia’s Biggest Events, <br />All in One Place
          </h1>
          <p className="font-sans text-sm text-gray-400 max-w-xl">
            Find and book tickets for the best concerts, festival shows, sports, and cultural gatherings happening around the country.
          </p>
        </motion.div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="bg-[#18191b] border border-[#232426] p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between mb-12 shadow-md">
          
          {/* Text Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event title, venue, keywords..."
              className="w-full bg-[#1e2022] border border-[#2d2e30] hover:border-gray-600 focus:border-neon-green text-white text-xs outline-none rounded-xl pl-11 pr-4 py-3.5 placeholder-gray-500 transition-colors"
              id="search-input-field"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar pt-2 md:pt-0">
            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-sans text-[10px] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neon-green text-black font-bold border border-transparent'
                    : 'bg-[#1e2022] text-gray-400 hover:text-white border border-[#2a2c2e]'
                }`}
                id={`directory-filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* RESULTS SUMMARY */}
        <div className="flex justify-between items-center border-b border-[#212224]/70 pb-3 mb-8">
          <span className="font-mono text-[10px] tracking-widest text-[#7a7c80] uppercase">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </span>
          <span className="font-mono text-[9px] text-[#9afa5f] flex items-center gap-1">
            <span className="w-1 h-1 bg-neon-green rounded-full" />
            Active listings
          </span>
        </div>

        {/* EVENTS LIST GRID */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="events-grid-results">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((evt) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.97, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.97, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
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
                  
                  {/* Promo Banner */}
                  <div className="h-48 relative overflow-hidden bg-[#242528]/40">
                    <img 
                      src={evt.imageUrl} 
                      alt={evt.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category Tag */}
                    <div className="absolute top-4 left-4">
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

                    {/* Date badge */}
                    <div 
                      className="absolute bottom-4 right-4 border p-2 rounded-xl text-center min-w-12 backdrop-blur-md"
                      style={{ backgroundColor: 'var(--card-badge-bg)', borderColor: 'var(--card-border)' }}
                    >
                      <div className="font-mono text-[10px] tracking-wide text-gray-400">{evt.month}</div>
                      <div className="font-serif text-lg font-black leading-none mt-0.5" style={{ color: 'var(--card-accent)' }}>{evt.day}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h4 
                      className="font-serif text-lg font-light transition-colors"
                      style={{ color: 'var(--card-title-color)' }}
                    >
                      {evt.title}
                    </h4>
                    <p className="font-sans text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  </div>
                </div>

                {/* Action and Venue Row */}
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

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-[#18191b] border border-[#232426] rounded-3xl" id="no-events-results">
            <Search className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <h4 className="font-serif text-base text-white mb-2">No results match your query</h4>
            <p className="font-sans text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              We couldn't find any events that match "{searchQuery}" under "{selectedCategory}". Try adjusting your filters or checking back later!
            </p>
          </div>
        )}

      </div>

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
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/0 via-black/20 to-[#18191b]" />
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
                      <span className="font-mono text-[9px] uppercase tracking-widest text-neon-green">Reserve your spot</span>
                      <h4 className="font-serif text-xl font-bold text-white leading-tight">
                        {selectedEvent.title}
                      </h4>
                      <p className="font-sans text-xs text-gray-400 leading-relaxed">
                        Enter your details below to save your spot. Your free tickets will be sent right to your email inbox.
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
                      Confirm Spot Reservation
                    </button>
                  </form>
                ) : (
                  // REGISTRATION SUCCESS STATE
                  <div className="space-y-4 text-center py-2">
                    <div className="w-12 h-12 bg-neon-green/10 border border-neon-green/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-neon-green" />
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-neon-green">Saved your spot!</span>
                      <h4 className="font-serif text-lg font-bold text-white">Your spot is reserved</h4>
                      <p className="font-sans text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                        Hi <strong>{formData.name}</strong>, we've saved your spot! We've reserved your <strong>{formData.tickets} pass{formData.tickets > 1 ? 'es' : ''}</strong>. We just emailed a confirmation to <span className="text-neon-green">{formData.email}</span>.
                      </p>
                    </div>

                    {/* Dynamic Confirmation Receipt Block */}
                    <div className="bg-[#202123] p-3.5 rounded-2xl font-mono text-left space-y-2 text-[11px] border border-[#2d2e30]">
                      <div className="flex justify-between items-center border-b border-[#2d2e30] pb-1.5">
                        <span className="text-gray-500 uppercase tracking-widest text-[8px]">Ticket Details</span>
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
                        <span className="text-gray-500">WHEN:</span>
                        <span className="text-neon-green font-bold uppercase">{selectedEvent.month} {selectedEvent.day} @ {selectedEvent.location}</span>
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
