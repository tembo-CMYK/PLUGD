import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArtistItem, EventItem } from '../types';
import { Calendar, MapPin, Share2, Ticket, Check, X, ShieldCheck, Tag, ArrowLeft, Layers, Globe } from 'lucide-react';
import { downloadIcsFile, generateGoogleCalendarUrl } from '../utils/calendar';

interface ArtistDetailProps {
  artists: ArtistItem[];
  events: EventItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function ArtistDetail({ artists, events, currentPath, onNavigate }: ArtistDetailProps) {
  const [artist, setArtist] = useState<ArtistItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Filter events belonging to current artist profile
  const artistEvents = useMemo(() => {
    if (!artist) return [];
    return events.filter(e => e.artistId === artist.id);
  }, [artist, events]);

  // Load correct artist based on path slug
  useEffect(() => {
    const slug = currentPath.replace('/', '');
    const found = artists.find(a => a.slug === slug);
    if (found) {
      setArtist(found);
    }
  }, [currentPath, artists]);

  // Handle sharing link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Ticket booking state
  const [showBooking, setShowBooking] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', tickets: 1, type: 'General' });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [successRef, setSuccessRef] = useState('');

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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    const ref = 'TIX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setSuccessRef(ref);
    setBookingSuccess(true);
  };

  if (!artist) {
    return (
      <div className="py-24 text-center bg-[#131415] text-white">
        <p className="font-sans text-sm text-gray-400">Loading artist tickets portfolio...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#131415] text-white min-h-screen" id="artist-tickets-detail-page">
      
      {/* HEADER BANNER COVER */}
      <div className="h-64 sm:h-80 md:h-[350px] relative bg-[#202123] overflow-hidden">
        <img 
          src={artist.bannerUrl} 
          alt={artist.name} 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ objectPosition: artist.bannerPosition || 'center' }}
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 -mt-24 sm:-mt-32 pb-24">
        
        {/* Sleek Floating Back button */}
        <button
          onClick={() => onNavigate('/artist')}
          className="mb-6 inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-neon-green bg-[#18191b]/95 backdrop-blur-md border border-[#2d2e30] py-2.5 px-4 rounded-xl cursor-pointer transition-all shadow-xl hover:translate-x-[-2px]"
          id="back-to-artists-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Directory
        </button>
        
        {/* CONTAINER CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 35, scale: 0.98, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          
          {/* PROFILE INTRO HEADER CARD */}
          <div className="bg-[#18191b]/95 backdrop-blur-md border border-[#2c2d30] p-6 sm:p-10 rounded-3xl shadow-2xl relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-[#18191b] shadow-lg flex-shrink-0 relative bg-[#222325]">
                  <img 
                    src={artist.avatarUrl} 
                    alt={artist.name} 
                    className="w-full h-full object-cover"
                    style={{ objectPosition: artist.avatarPosition || 'center' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neon-green/10 border border-neon-green/20 text-[#a3f769] font-mono text-[9px] uppercase tracking-wider">
                    Official Tickets
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white leading-tight">
                    {artist.name} Tickets
                  </h1>
                  <p className="font-mono text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neon-green" />
                    {artist.location}
                  </p>
                </div>
              </div>

              {/* Share Button Action */}
              <button
                onClick={handleShare}
                className="font-mono text-[10px] tracking-widest uppercase border border-[#2d2e30] py-2 px-4 rounded-xl bg-[#202123]/30 hover:bg-[#202123]/80 hover:text-neon-green transition-all duration-300 flex items-center gap-1.5 w-full sm:w-auto justify-center cursor-pointer"
                id="share-artist-page"
              >
                <Share2 className="w-3.5 h-3.5" />
                {isCopied ? 'Copied' : 'Share profile'}
              </button>

            </div>
          </div>

          {/* MAIN TICKET DIRECTORY PANEL */}
          <div className="space-y-6">
            
            <div className="border-b border-[#242528] pb-3 flex justify-between items-end">
              <h3 className="font-serif text-lg sm:text-xl font-light text-white">
                Upcoming Shows & Experiences
              </h3>
              <span className="font-mono text-[9px] tracking-widest text-[#797b81] uppercase font-bold">
                ACTIVE RESERVATION DIRECTORY 2025
              </span>
            </div>

            {artistEvents.length > 0 ? (
              artistEvents.map((event) => {
                const soldPercentage = event.ticketLimit ? Math.round(((event.ticketsSold || 0) / event.ticketLimit) * 100) : 0;
                const isSoldOut = event.ticketLimit ? (event.ticketsSold || 0) >= event.ticketLimit : false;
                
                return (
                  <div 
                    key={event.id} 
                    className="border rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg relative group transition-all backdrop-blur-md"
                    style={{
                      '--card-bg': getCategoryColors(event.category).bg,
                      '--card-border': getCategoryColors(event.category).border,
                      '--card-accent': getCategoryColors(event.category).color,
                      '--card-badge-bg': getCategoryColors(event.category).badgeBg,
                      '--card-badge-text': getCategoryColors(event.category).badgeText,
                      '--card-title-color': getCategoryColors(event.category).titleColor,
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--card-border)',
                      borderLeft: `4px solid var(--card-accent)`
                    } as React.CSSProperties}
                  >
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                      <div className="flex items-start gap-4 sm:gap-6">
                        
                        {/* Visual Calendar Block */}
                        <div 
                          className="text-center border p-3 rounded-2xl min-w-16"
                          style={{ backgroundColor: 'var(--card-badge-bg)', borderColor: 'var(--card-border)' }}
                        >
                          <span className="font-mono text-xs text-gray-400 block tracking-wider uppercase">{event.month}</span>
                          <span className="font-serif text-2xl font-black leading-none mt-0.5 block" style={{ color: 'var(--card-accent)' }}>{event.day}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span 
                              style={{ 
                                color: 'var(--card-badge-text)',
                                backgroundColor: 'var(--card-badge-bg)',
                                borderColor: 'var(--card-border)'
                              }}
                              className="font-mono text-[10px] border px-2 py-0.5 rounded uppercase font-semibold"
                            >
                              {event.category}
                            </span>
                            <span className="font-mono text-[10px] text-gray-400 uppercase">
                              • Live at {event.location}
                            </span>
                          </div>
                          
                          <h4 
                            className="font-serif text-lg font-bold uppercase tracking-tight"
                            style={{ color: 'var(--card-title-color)' }}
                          >
                            {event.title}
                          </h4>
                          
                          <p className="font-sans text-xs text-gray-400 leading-relaxed max-w-lg">
                            {event.description}
                          </p>

                          {/* Ticket Offer Badges */}
                          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[9px]">
                            {event.hasEarlyBird && event.earlyBirdPrice && (
                              <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded uppercase font-medium">
                                Early Bird: {event.earlyBirdPrice}
                              </span>
                            )}
                            {event.generalPrice && (
                              <span className="bg-[#242528] text-gray-300 border border-white/5 px-2 py-0.5 rounded">
                                General: {event.generalPrice}
                              </span>
                            )}
                            {event.vipPrice && (
                              <span 
                                className="border px-2 py-0.5 rounded"
                                style={{ 
                                  backgroundColor: 'var(--card-badge-bg)', 
                                  color: 'var(--card-accent)', 
                                  borderColor: 'var(--card-border)' 
                                }}
                              >
                                VIP: {event.vipPrice}
                              </span>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* CTAs */}
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        {event.ticketLink ? (
                          <a
                            href={event.ticketLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto flex-shrink-0 font-sans text-xs tracking-wider uppercase font-extrabold px-6 py-3.5 rounded-xl transition-all text-center flex items-center justify-center gap-2 card-btn-secondary"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Ticket Link</span>
                          </a>
                        ) : null}

                        <button
                          disabled={isSoldOut}
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowBooking(true);
                            setBookingSuccess(false);
                            setFormData({ name: '', email: '', tickets: 1, type: event.hasEarlyBird ? 'Early Bird' : 'General' });
                          }}
                          className={`w-full md:w-auto flex-shrink-0 font-sans text-xs tracking-wider uppercase font-extrabold px-6 py-3.5 rounded-xl transition-all text-center cursor-pointer ${
                            isSoldOut
                              ? 'bg-red-500/15 border border-red-500/30 text-red-400 cursor-not-allowed'
                              : 'card-btn-primary animate-pulse'
                          }`}
                        >
                          {isSoldOut ? 'Sold Out' : 'Direct Booking'}
                        </button>
                      </div>

                    </div>

                    {/* Ticket Limit Progress Indicators */}
                    {event.ticketLimit ? (
                      <div 
                        className="border-t pt-4 space-y-2"
                        style={{ borderColor: 'var(--card-border)' }}
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                          <span className="uppercase tracking-wider">Registration Capacity: <strong className="text-white">{event.ticketsSold || 0} / {event.ticketLimit}</strong> claimed</span>
                          <span 
                            style={{ color: isSoldOut ? undefined : 'var(--card-accent)' }}
                            className={`${soldPercentage > 85 ? 'text-red-400 animate-pulse font-bold' : ''}`}
                          >
                            {isSoldOut ? 'COMPLETELY FILLED' : `${soldPercentage}% CAPACITY RESERVED`}
                          </span>
                        </div>
                        <div 
                          className="w-full h-1 bg-[#151617]/40 rounded-full overflow-hidden border relative"
                          style={{ borderColor: 'var(--card-border)' }}
                        >
                          <div 
                            style={{ 
                              width: `${Math.min(100, soldPercentage)}%`,
                              backgroundColor: soldPercentage > 85 ? undefined : 'var(--card-accent)'
                            }}
                            className={`h-full rounded-full ${soldPercentage > 85 ? 'bg-red-500' : ''}`}
                          />
                        </div>
                      </div>
                    ) : null}

                    {/* Dynamic alternative dates */}
                    {event.alternativeDates && event.alternativeDates.length > 0 && (
                      <div className="border-t border-[#232426]/60 pt-4">
                        <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest block mb-2">Alternative Dates & Times</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {event.alternativeDates.map((slot) => (
                            <div key={slot.id} className="border border-[#232426] bg-[#111213] p-3 rounded-xl flex justify-between items-center text-xs">
                              <span className="font-mono text-gray-500 uppercase tracking-widest text-[8px]">ALTERNATIVE DATE</span>
                              <span className="text-gray-300 font-semibold uppercase">{slot.month} {slot.day} • {slot.time}</span>
                              <span className={`font-mono text-[8px] px-2 py-0.5 rounded ${
                                slot.status === 'SOLD OUT' 
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                  : slot.status === 'STANDBY' 
                                  ? 'bg-[#212225] text-yellow-400 border border-yellow-500/10'
                                  : 'bg-[#212225] text-neon-green border border-neon-green/15'
                              }`}>
                                {slot.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            ) : (
              <div className="bg-[#18191b] border border-[#232426] rounded-2xl p-8 py-12 text-center space-y-3">
                <Layers className="w-8 h-8 text-gray-600 mx-auto animate-pulse" />
                <h4 className="font-serif text-base font-bold text-gray-300">No Scheduled Live Sets</h4>
                <p className="font-sans text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  This creator is currently tuning their upcoming schedules or hasn't listed any alternative dates yet. Manage your roster entries if you own this studio!
                </p>
              </div>
            )}

          </div>

          {/* BIO SECTION */}
          <div className="space-y-6">
            <div className="border-b border-[#242528] pb-3">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                About {artist.name.split(' ')[0]}
              </h3>
            </div>

            <div className="bg-[#18191b] border border-[#232426] p-6 sm:p-8 rounded-2xl space-y-4">
              <p className="font-sans text-sm text-gray-400 leading-relaxed">
                {artist.bio}
              </p>
              
              {/* Additional facts to give complete high-quality feel to biography block */}
              <div className="pt-4 border-t border-[#232426]/60 flex flex-wrap gap-x-8 gap-y-4 font-sans text-xs text-gray-400">
                <div>
                  <span className="font-mono text-[9px] text-gray-500 block uppercase tracking-wider">REPRESENTATION LABEL</span>
                  <span className="font-bold text-white uppercase">Independent / LSK Collective</span>
                </div>
                <div>
                  <span className="font-mono text-[9px] text-gray-500 block uppercase tracking-wider">GENRES PREFERENCES</span>
                  <span className="font-bold text-neon-green uppercase">Afrobeats, Zamrock, Hip-Hop, Fusion</span>
                </div>
              </div>
            </div>
          </div>

        </motion.div>

      </div>

      {/* TICKET RESERVATION MODAL OVERLAY */}
      {showBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18191b] border border-[#2d2e30] rounded-3xl w-full max-w-3xl h-[600px] md:h-[540px] overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
            
            {/* Left side cover image (half the modal) */}
            <div className="relative w-full md:w-1/2 h-[220px] md:h-full shrink-0 bg-[#202123] overflow-hidden">
              {artist.bannerUrl && (
                <img 
                  src={artist.bannerUrl} 
                  alt="" 
                  className="w-full h-full object-cover opacity-90" 
                  style={{ objectPosition: artist.bannerPosition || 'center' }}
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/0 via-black/20 to-[#18191b]" />
            </div>

            {/* Right side form block (half the modal, with scrollable content if needed) */}
            <div className="flex-1 h-[calc(100%-220px)] md:h-full overflow-y-auto p-6 relative flex flex-col justify-between bg-[#18191b]">
              <button
                type="button"
                onClick={() => setShowBooking(false)}
                className="absolute top-4 right-4 p-1.5 bg-black/30 hover:bg-black/60 text-gray-400 hover:text-white rounded-xl z-20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex-grow flex flex-col justify-center min-h-0">
                {!bookingSuccess ? (
                  // RESERVATION REGISTER FORM
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-neon-green">Get your tickets</span>
                      <h4 className="font-serif text-xl font-bold text-white leading-tight">
                        {selectedEvent ? selectedEvent.title : `${artist.name} Concert Pass`}
                      </h4>
                      <p className="font-sans text-xs text-gray-400 leading-relaxed">
                        {selectedEvent 
                          ? `Claim tickets for ${selectedEvent.title} in ${selectedEvent.location}.`
                          : "Enter your details below to receive your free entry tickets or VIP backstage passes."}
                      </p>
                    </div>

                    {/* Add to Calendar Button Row */}
                    <div className="bg-[#1f2123] border border-[#2d2e30] p-3 rounded-2xl space-y-2">
                      <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block">Add Event To Calendar:</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => downloadIcsFile({
                            title: selectedEvent ? selectedEvent.title : `${artist.name} Live Set`,
                            description: selectedEvent ? selectedEvent.description : `Official show tickets for ${artist.name}`,
                            location: selectedEvent ? selectedEvent.location : artist.location,
                            month: selectedEvent ? selectedEvent.month : 'DEC',
                            day: selectedEvent ? selectedEvent.day : '09'
                          })}
                          className="flex items-center justify-center gap-1.5 bg-[#18191b] hover:bg-[#252629] border border-[#2d2e30] hover:border-neon-green/30 text-gray-300 hover:text-white font-sans text-[10px] tracking-wider uppercase py-2 rounded-xl transition-all cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-neon-green" />
                          <span>iCal / .ics</span>
                        </button>
                        <a
                          href={generateGoogleCalendarUrl({
                            title: selectedEvent ? selectedEvent.title : `${artist.name} Live Set`,
                            description: selectedEvent ? selectedEvent.description : `Official show tickets for ${artist.name}`,
                            location: selectedEvent ? selectedEvent.location : artist.location,
                            month: selectedEvent ? selectedEvent.month : 'DEC',
                            day: selectedEvent ? selectedEvent.day : '09'
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
                        <label className="font-sans text-[11px] text-gray-300 font-medium block">Guest Name</label>
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

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-sans text-[11px] text-gray-300 font-medium block">Admission Type</label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full bg-[#1e2022] border border-[#2c2e30] focus:border-neon-green text-white text-sm outline-none rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
                          >
                            {selectedEvent?.hasEarlyBird && selectedEvent?.earlyBirdPrice ? (
                              <option value="Early Bird" className="bg-[#18191b]">Early Bird ({selectedEvent.earlyBirdPrice})</option>
                            ) : null}
                            <option value="General" className="bg-[#18191b]">General Admission {selectedEvent?.generalPrice ? `(${selectedEvent.generalPrice})` : ''}</option>
                            <option value="VIP Space" className="bg-[#18191b]">VIP Backstage {selectedEvent?.vipPrice ? `(${selectedEvent.vipPrice})` : ''}</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-sans text-[11px] text-gray-300 font-medium block">Admissions Count</label>
                          <select
                            value={formData.tickets}
                            onChange={(e) => setFormData({ ...formData, tickets: parseInt(e.target.value) })}
                            className="w-full bg-[#1e2022] border border-[#2c2e30] focus:border-neon-green text-white text-sm outline-none rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
                          >
                            {[1, 2, 3, 4].map(n => (
                              <option key={n} value={n} className="bg-[#18191b]">{n} Ticket{n > 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-neon-green text-black font-sans font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-[#a9fd73] transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                    >
                      Confirm tickets reservation
                    </button>
                  </form>
                ) : (
                  // SUCCESS STATE
                  <div className="space-y-4 text-center py-2">
                    <div className="w-12 h-12 bg-neon-green/10 border border-neon-green/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-6 h-6 text-neon-green" />
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-neon-green">Tickets reserved!</span>
                      <h4 className="font-serif text-lg font-bold text-white">Your tickets are confirmed</h4>
                      <p className="font-sans text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                        All set, <strong>{formData.name}</strong>! Your <strong>{formData.tickets}x {formData.type}</strong> passes are reserved. We just sent your tickets to <span className="text-neon-green">{formData.email}</span>.
                      </p>
                    </div>

                    {/* Receipt code */}
                    <div className="bg-[#202123] p-3.5 rounded-2xl font-mono text-left space-y-2 text-[11px] border border-[#2d2e30]">
                      <div className="flex justify-between items-center border-b border-[#2d2e30] pb-1.5">
                        <span className="text-gray-500 uppercase tracking-widest text-[8px]">Ticket Details</span>
                        <span className="text-[#9afa5f]">{successRef}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">EXPERIENCE:</span>
                        <span className="text-white font-bold">{selectedEvent ? selectedEvent.title : artist.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">GUEST:</span>
                        <span className="text-white font-bold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">CATEGORY:</span>
                        <span className="text-white font-bold">{formData.type} PASS</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">DATE & VENUE:</span>
                        <span className="text-neon-green font-bold truncate max-w-[220px]">
                          {selectedEvent ? `${selectedEvent.month} ${selectedEvent.day} @ ${selectedEvent.location}` : 'December 9th @ Pinnacle Mall'}
                        </span>
                      </div>
                    </div>

                    {/* Success State Add to Calendar Option */}
                    <div className="grid grid-cols-2 gap-2 pt-1 pb-1">
                      <button
                        type="button"
                        onClick={() => downloadIcsFile({
                          title: selectedEvent ? selectedEvent.title : `${artist.name} Live Set`,
                          description: selectedEvent ? selectedEvent.description : `Official show tickets for ${artist.name}`,
                          location: selectedEvent ? selectedEvent.location : artist.location,
                          month: selectedEvent ? selectedEvent.month : 'DEC',
                          day: selectedEvent ? selectedEvent.day : '09'
                        })}
                        className="flex items-center justify-center gap-1 bg-[#1e2022] hover:bg-[#2c2d30] border border-[#2d2e30] text-gray-300 font-sans text-[10px] tracking-wider uppercase py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-neon-green" />
                        <span>Add iCal</span>
                      </button>
                      <a
                        href={generateGoogleCalendarUrl({
                          title: selectedEvent ? selectedEvent.title : `${artist.name} Live Set`,
                          description: selectedEvent ? selectedEvent.description : `Official show tickets for ${artist.name}`,
                          location: selectedEvent ? selectedEvent.location : artist.location,
                          month: selectedEvent ? selectedEvent.month : 'DEC',
                          day: selectedEvent ? selectedEvent.day : '09'
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
                      onClick={() => setShowBooking(false)}
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
