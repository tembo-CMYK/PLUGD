import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArtistItem, EventItem } from '../types';
import { 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  Tag, 
  Image as ImageIcon, 
  Sparkles, 
  Save, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  X, 
  Check, 
  ExternalLink,
  ShieldAlert,
  Loader,
  Trash2,
  Edit2,
  Percent,
  Sliders,
  DollarSign,
  Layers,
  CalendarClock
} from 'lucide-react';

interface AdminPageProps {
  artists: ArtistItem[];
  currentCreatorId: string | null;
  onUpdateArtist: (updated: ArtistItem) => void;
  onLogout: () => void;
  onNavigate: (path: string) => void;
  events: EventItem[];
  onAddEvent: (newEvent: EventItem) => void;
  onUpdateEvent: (updated: EventItem) => void;
  onDeleteEvent: (id: string) => void;
}

export default function AdminPage({ 
  artists, 
  currentCreatorId, 
  onUpdateArtist, 
  onLogout, 
  onNavigate,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}: AdminPageProps) {
  
  // Find current active creator's profile
  const profile = artists.find(a => a.id === currentCreatorId);
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<'profile' | 'events'>('profile');
  
  // State for form fields
  const [name, setName] = useState('');
  const [typeLabel, setTypeLabel] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [festivalDate, setFestivalDate] = useState('');
  const [festivalTime, setFestivalTime] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  
  // Success & Saving animations states
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // List of events for this specific creator
  const creatorEvents = events.filter(e => e.artistId === currentCreatorId);

  // Event editing or adding form state
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isAddingNewEvent, setIsAddingNewEvent] = useState(false);

  // Form fields for event
  const [eventTitle, setEventTitle] = useState('');
  const [eventMonth, setEventMonth] = useState('DEC');
  const [eventDay, setEventDay] = useState('10');
  const [eventDesc, setEventDesc] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState<'Concert' | 'Festival' | 'Sports' | 'Arts' | 'Lifestyle'>('Concert');
  const [eventImg, setEventImg] = useState('');
  const [eventTicketLink, setEventTicketLink] = useState('');
  const [eventTicketLimit, setEventTicketLimit] = useState(500);
  const [eventTicketsSold, setEventTicketsSold] = useState(120);
  const [eventHasEarlyBird, setEventHasEarlyBird] = useState(true);
  const [eventEarlyBirdPrice, setEventEarlyBirdPrice] = useState('K150');
  const [eventGeneralPrice, setEventGeneralPrice] = useState('K250');
  const [eventVipPrice, setEventVipPrice] = useState('K600');
  
  // Companion dates state
  const [eventAltDates, setEventAltDates] = useState<{ id: string; month: string; day: string; time: string; status: 'AVAILABLE' | 'STANDBY' | 'SOLD OUT' }[]>([]);
  const [newAltMonth, setNewAltMonth] = useState('DEC');
  const [newAltDay, setNewAltDay] = useState('11');
  const [newAltTime, setNewAltTime] = useState('Sun 6:00PM');
  const [newAltStatus, setNewAltStatus] = useState<'AVAILABLE' | 'STANDBY' | 'SOLD OUT'>('AVAILABLE');

  // Initialize form when profile changes
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setTypeLabel(profile.typeLabel);
      setBio(profile.bio);
      setLocation(profile.location);
      setFestivalDate(profile.festivalDate);
      setFestivalTime(profile.festivalTime);
      setAvatarUrl(profile.avatarUrl);
      setBannerUrl(profile.bannerUrl);
      setSpecialties(profile.specialties || []);
    }
  }, [profile]);

  const handleStartEditEvent = (ev: EventItem) => {
    setEditingEvent(ev);
    setIsAddingNewEvent(false);
    setEventTitle(ev.title);
    setEventMonth(ev.month);
    setEventDay(ev.day);
    setEventDesc(ev.description || '');
    setEventLocation(ev.location);
    setEventCategory(ev.category);
    setEventImg(ev.imageUrl || '');
    setEventTicketLink(ev.ticketLink || '');
    setEventTicketLimit(ev.ticketLimit || 500);
    setEventTicketsSold(ev.ticketsSold || 0);
    setEventHasEarlyBird(!!ev.hasEarlyBird);
    setEventEarlyBirdPrice(ev.earlyBirdPrice || 'K150');
    setEventGeneralPrice(ev.generalPrice || 'K250');
    setEventVipPrice(ev.vipPrice || 'K600');
    setEventAltDates(ev.alternativeDates || []);
  };

  const handleStartAddEvent = () => {
    setEditingEvent(null);
    setIsAddingNewEvent(true);
    setEventTitle('');
    setEventMonth('DEC');
    setEventDay('15');
    setEventDesc('');
    setEventLocation(profile?.location || 'Pinnacle Mall, Lusaka');
    setEventCategory('Concert');
    setEventImg('https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80');
    setEventTicketLink('');
    setEventTicketLimit(1000);
    setEventTicketsSold(0);
    setEventHasEarlyBird(true);
    setEventEarlyBirdPrice('K150');
    setEventGeneralPrice('K250');
    setEventVipPrice('K600');
    setEventAltDates([]);
  };

  const handleAddAltDate = () => {
    if (!newAltMonth || !newAltDay || !newAltTime) return;
    const newDate = {
      id: 'alt-' + Math.random().toString(36).substr(2, 5),
      month: newAltMonth.toUpperCase(),
      day: newAltDay,
      time: newAltTime,
      status: newAltStatus
    };
    setEventAltDates([...eventAltDates, newDate]);
    // Advance next test day easily
    setNewAltDay((prev) => {
      const parsed = parseInt(prev);
      return isNaN(parsed) ? '12' : String(parsed + 1).padStart(2, '0');
    });
  };

  const handleRemoveAltDate = (id: string) => {
    setEventAltDates(eventAltDates.filter(d => d.id !== id));
  };

  const handleSaveEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventLocation) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const eventData: EventItem = {
      id: editingEvent ? editingEvent.id : 'ev-' + Math.random().toString(36).substr(2, 9),
      title: eventTitle,
      month: eventMonth.toUpperCase(),
      day: eventDay,
      description: eventDesc,
      location: eventLocation,
      category: eventCategory,
      imageUrl: eventImg || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
      artistId: currentCreatorId || undefined,
      ticketLink: eventTicketLink || undefined,
      ticketLimit: eventTicketLimit,
      ticketsSold: eventTicketsSold,
      hasEarlyBird: eventHasEarlyBird,
      earlyBirdPrice: eventHasEarlyBird ? eventEarlyBirdPrice : undefined,
      generalPrice: eventGeneralPrice,
      vipPrice: eventVipPrice,
      alternativeDates: eventAltDates
    };

    if (editingEvent) {
      onUpdateEvent(eventData);
    } else {
      onAddEvent(eventData);
    }

    setEditingEvent(null);
    setIsAddingNewEvent(false);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput('');
    }
  };

  const handleRemoveSpecialty = (indexToRemove: number) => {
    setSpecialties(specialties.filter((_, i) => i !== indexToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    
    // Simulate high-fidelity system sync duration
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    const updatedProfile: ArtistItem = {
      ...profile,
      name,
      typeLabel,
      bio,
      location,
      festivalDate,
      festivalTime,
      avatarUrl,
      bannerUrl,
      specialties
    };

    onUpdateArtist(updatedProfile);
    setIsSaving(false);
    setShowSuccess(true);
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (!profile) {
    return (
      <div className="bg-[#131415] min-h-screen text-white py-24 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#18191b] border border-[#232426] p-8 rounded-3xl text-center space-y-6 shadow-2xl"
        >
          <div className="w-16 h-16 bg-[#211d1e] border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-red-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold">Unauthenticated Access</h2>
            <p className="font-sans text-xs text-gray-400 leading-relaxed">
              You must sign up or select a profile from the Creator Portal to access the administrative dashboard controls.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('/artist')}
            className="w-full bg-neon-green text-black font-sans font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#a9fd73] transition-colors cursor-pointer"
          >
            Go to Directory
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#131415] text-white min-h-screen py-16 md:py-24" id="creator-admin-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#212224] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] bg-neon-green/10 text-neon-green border border-neon-green/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                CONTROL PANEL ACTIVE
              </span>
            </div>
            <h1 className="font-serif text-3xl font-light tracking-tight mt-1.5">
              Creator Studio
            </h1>
            <p className="font-sans text-xs text-gray-400">
              Manage your profile identity, specialty catalogs, dates, and media.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(`/${profile.slug}`)}
              className="px-4 py-2.5 bg-[#1c1d1f] border border-[#2d2e30] rounded-xl hover:border-gray-500 text-xs font-sans font-bold tracking-wider uppercase text-gray-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 text-red-400 text-xs font-sans font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK PROMPTS */}
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-neon-green/15 border border-neon-green/30 rounded-2xl flex items-center gap-3 text-neon-green text-xs"
          >
            <div className="w-6 h-6 rounded-lg bg-neon-green/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-neon-green" />
            </div>
            <p className="font-sans">
              <strong>Database Synchronized!</strong> Your creator studio workspace has been successfully updated on the live directory.
            </p>
          </motion.div>
        )}

        {/* WORKSPACE SWITCHER TABS */}
        <div className="flex border-b border-[#212224] gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('profile'); setEditingEvent(null); setIsAddingNewEvent(false); }}
            className={`px-4 py-3 font-sans text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-neon-green text-neon-green'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Studio</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 font-sans text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'events'
                ? 'border-neon-green text-neon-green'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>Manage Shows & Tickets ({creatorEvents.length})</span>
          </button>
        </div>

        {/* CORE WORKSPACE DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PROFILE PREVIEW COLUMN (Left sticky column) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#18191b] border border-[#232426] p-6 rounded-3xl space-y-6 shadow-xl sticky top-24">
              <h3 className="font-serif text-lg font-bold border-b border-[#232426] pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-green" />
                <span>Live Card Preview</span>
              </h3>
              
              <div className="rounded-2xl border border-[#232426] overflow-hidden bg-[#131415]">
                {/* Simulated Thumbnail cover */}
                <div className="h-32 bg-[#202123] relative">
                  {bannerUrl ? (
                    <img src={bannerUrl} className="w-full h-full object-cover opacity-70" alt="Banner" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
                      <ImageIcon className="w-6 h-6 text-gray-700" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-neon-green/20 backdrop-blur border border-neon-green/30 text-neon-green font-mono text-[8px] px-2 py-0.5 rounded font-extrabold uppercase">
                    {profile.category}
                  </div>
                </div>

                <div className="px-5 pb-5 -mt-8 relative z-10">
                  <div className="w-16 h-16 rounded-xl border-2 border-[#18191b] overflow-hidden bg-gray-800 shadow-md">
                    {avatarUrl ? (
                      <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2.5">
                    <h4 className="font-serif font-bold text-white text-base leading-tight truncate">
                      {name || 'Mysterious Creator'}
                    </h4>
                    <span className="font-mono text-[9px] text-[#9afa5f] uppercase tracking-wider block mt-0.5 truncate">
                      {typeLabel || 'Zambian Performer'}
                    </span>
                  </div>

                  <p className="font-sans text-[11px] text-gray-400 line-clamp-3 mt-3.5 leading-relaxed">
                    {bio || 'Provide a beautiful narrative biography in the form to tell your story to booking fans across Zambia.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 border-t border-[#232426] mt-4 pt-3 text-[10px] text-gray-400">
                    <div className="space-y-0.5 truncate">
                      <span className="text-gray-500 text-[8px] font-mono uppercase block">DATES</span>
                      <span className="font-bold flex items-center gap-1 text-white truncate">
                        <Calendar className="w-3 h-3 text-neon-green" />
                        {festivalDate || 'Not set'}
                      </span>
                    </div>
                    <div className="space-y-0.5 truncate">
                      <span className="text-gray-500 text-[8px] font-mono uppercase block">VENUE</span>
                      <span className="font-bold flex items-center gap-1 text-white truncate">
                        <MapPin className="w-3 h-3 text-neon-green" />
                        {location || 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SPECIALTIES TAG WRAPPER */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest block">Active Specializations</span>
                <div className="flex flex-wrap gap-1">
                  {specialties.length > 0 ? (
                    specialties.map(tag => (
                      <span key={tag} className="font-mono text-[8.5px] bg-[#222325] text-gray-300 px-2 py-0.5 rounded-md border border-white/5">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">No specialty tags declared.</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT EDIT/MANAGE COLUMN */}
          <div className="lg:col-span-2">
            {activeTab === 'profile' ? (
              // EDIT PROFILE FORM
              <form onSubmit={handleSave} className="bg-[#18191b] border border-[#232426] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
                
                {/* SECTION: BASIC IDENTITY */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold border-b border-[#232426] pb-3 flex items-center gap-2 text-white">
                    <User className="w-4.5 h-4.5 text-neon-green" />
                    <span>Basic Identity</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Stage Name / Culinary Brand</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Cleo Ice Queen"
                        className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 placeholder-gray-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Descriptive Subtitle</label>
                      <input 
                        type="text" 
                        required
                        value={typeLabel}
                        onChange={(e) => setTypeLabel(e.target.value)}
                        placeholder="e.g. Traditional Pitmasters & Smokehouse"
                        className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 placeholder-gray-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-gray-400 tracking-wider block">Biography Narrative</label>
                    <textarea 
                      rows={4}
                      required
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Describe your origins, signature sets, or culinary secrets..."
                      className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 pb-4 placeholder-gray-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* SECTION: PROGRAM DATES & LOGISTICS */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-serif text-lg font-bold border-b border-[#232426] pb-3 flex items-center gap-2 text-white">
                    <Calendar className="w-4.5 h-4.5 text-neon-green" />
                    <span>Logistics & Main Roster Dates</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Next Showcase Date</label>
                      <input 
                        type="text" 
                        required
                        value={festivalDate}
                        onChange={(e) => setFestivalDate(e.target.value)}
                        placeholder="e.g. Saturday, April 12, 2025"
                        className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 placeholder-gray-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Showcase Time</label>
                      <input 
                        type="text" 
                        required
                        value={festivalTime}
                        onChange={(e) => setFestivalTime(e.target.value)}
                        placeholder="e.g. Sat 8:00PM"
                        className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 placeholder-gray-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Location Venue</label>
                      <input 
                        type="text" 
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Showgrounds, Lusaka"
                        className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 placeholder-gray-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION: ARTWORK & VISUAL COVERS */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-serif text-lg font-bold border-b border-[#232426] pb-3 flex items-center gap-2 text-white">
                    <ImageIcon className="w-4.5 h-4.5 text-neon-green" />
                    <span>Media Portrait & Banner Links</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Avatar portrait URL</label>
                      <input 
                        type="url" 
                        required
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 placeholder-gray-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">Cover banner image URL</label>
                      <input 
                        type="url" 
                        required
                        value={bannerUrl}
                        onChange={(e) => setBannerUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 placeholder-gray-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION: TAGS SPECIALTY EDITOR */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-serif text-lg font-bold border-b border-[#232426] pb-3 flex items-center gap-2 text-white">
                    <Tag className="w-4.5 h-4.5 text-neon-green" />
                    <span>Profile Specialization Badges</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={specialtyInput}
                        onChange={(e) => setSpecialtyInput(e.target.value)}
                        placeholder="Type a tag (e.g. Afro-Jazz, Fine Dining) and click Add"
                        className="flex-1 bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 placeholder-gray-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpecialty}
                        className="px-5 bg-neon-green hover:bg-[#a9fd73] text-black font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 bg-[#111213]/40 p-4 rounded-xl border border-[#232426]">
                      {specialties.length > 0 ? (
                        specialties.map((tag, idx) => (
                          <div 
                            key={tag} 
                            className="inline-flex items-center gap-1.5 bg-[#222325] hover:bg-red-500/10 text-gray-300 hover:text-red-400 px-3 py-1.5 rounded-xl text-xs border border-white/5 transition-all"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialty(idx)}
                              className="text-gray-500 hover:text-red-500 focus:outline-none cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 italic">No specialty tags configured. Add tags above to enhance search index discovery.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <div className="pt-6 border-t border-[#232426] flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-8 py-4 bg-neon-green text-black hover:bg-[#a9fd73] font-sans font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(154,250,95,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    id="save-profile-studio"
                  >
                    {isSaving ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Syncing profile across Arena...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Synchronize Profile</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            ) : (
              // MANAGE EVENTS TAB ACTIVE
              <div className="space-y-6">
                
                {/* Header listing control */}
                <div className="flex justify-between items-center bg-[#18191b] border border-[#232426] p-4 px-6 rounded-2xl">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-[#797b81] uppercase tracking-wider block font-bold">Catalog Events</span>
                    <h3 className="font-serif text-base font-bold text-white">Upcoming Events ({creatorEvents.length})</h3>
                  </div>
                  
                  {!editingEvent && !isAddingNewEvent && (
                    <button
                      type="button"
                      onClick={handleStartAddEvent}
                      className="px-4 py-2 bg-neon-green hover:bg-[#a9fd73] text-black font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Live Show</span>
                    </button>
                  )}
                </div>

                {/* EVENT FORM EDITOR BLOCK */}
                {(editingEvent || isAddingNewEvent) ? (
                  <form onSubmit={handleSaveEventSubmit} className="bg-[#18191b] border border-neon-green/35 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative">
                    
                    <button
                      type="button"
                      onClick={() => { setEditingEvent(null); setIsAddingNewEvent(false); }}
                      className="absolute top-4 right-4 p-1.5 bg-black/30 hover:bg-black/60 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-neon-green uppercase tracking-wider font-bold">
                        {editingEvent ? 'EDITING CATALOG ENTRY' : 'PUBLISH NEW EVENT SPECIFICATION'}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-white uppercase">
                        {editingEvent ? 'Modify Event Properties' : 'Create New Roster entry'}
                      </h4>
                      <p className="font-sans text-xs text-gray-400">
                        Fill in scheduling, pricing, capacity limits, and alternative dates below.
                      </p>
                    </div>

                    {/* FIELD SECTIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-gray-400">Event Title</label>
                        <input
                          type="text"
                          required
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          placeholder="e.g. Cleo Live at Pinnacle Concert"
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 placeholder-gray-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-gray-400">Main Category</label>
                        <select
                          value={eventCategory}
                          onChange={(e) => setEventCategory(e.target.value as any)}
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 transition-colors cursor-pointer"
                        >
                          <option value="Concert">Concert Performance</option>
                          <option value="Festival">Festival Atmosphere</option>
                          <option value="Sports">Sports Meetup</option>
                          <option value="Arts">Arts Exposition</option>
                          <option value="Lifestyle">Gastronomic & Lifestyle</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-gray-400">Month Code (3 char)</label>
                        <input
                          type="text"
                          required
                          maxLength={3}
                          value={eventMonth}
                          onChange={(e) => setEventMonth(e.target.value.toUpperCase())}
                          placeholder="e.g. DEC"
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 text-center font-bold tracking-wider transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-gray-400">Day (2 digits)</label>
                        <input
                          type="text"
                          required
                          maxLength={2}
                          value={eventDay}
                          onChange={(e) => setEventDay(e.target.value)}
                          placeholder="e.g. 09"
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 text-center font-bold transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-gray-400">Arena Location / Venue</label>
                        <input
                          type="text"
                          required
                          value={eventLocation}
                          onChange={(e) => setEventLocation(e.target.value)}
                          placeholder="e.g. East Park Mall, Lusaka"
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase text-gray-400 block">Short Description</label>
                      <textarea
                        rows={2}
                        value={eventDesc}
                        onChange={(e) => setEventDesc(e.target.value)}
                        placeholder="Provide details about amapiano sets, signature recipes, and headliners..."
                        className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 placeholder-gray-500 transition-colors resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-gray-400">Cover Banner Image URL</label>
                        <input
                          type="url"
                          required
                          value={eventImg}
                          onChange={(e) => setEventImg(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase text-gray-400">External ticketing URL (Optional)</label>
                        <input
                          type="url"
                          value={eventTicketLink}
                          onChange={(e) => setEventTicketLink(e.target.value)}
                          placeholder="e.g. https://www.quicket.co.zm/..."
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 transition-colors text-neon-green font-semibold"
                        />
                      </div>
                    </div>

                    {/* PRICING & TICKET LIMITS */}
                    <div className="border-t border-[#232426] pt-4 space-y-4">
                      <h5 className="font-serif text-sm font-bold text-white flex items-center justify-between">
                        <span>Ticket Inventories & Capacities Specs</span>
                        <Percent className="w-4 h-4 text-neon-green" />
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5 bg-[#151617] p-3.5 rounded-xl border border-white/5">
                          <label className="font-mono text-[10px] uppercase text-gray-400 block mb-1">Ticket Limit (Capacity)</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={eventTicketLimit}
                            onChange={(e) => setEventTicketLimit(parseInt(e.target.value) || 500)}
                            className="w-full bg-[#1c1e20] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-lg px-2.5 py-1.5 text-center font-mono"
                          />
                          <p className="font-mono text-[8px] text-gray-500 mt-1 block">Maximum allowed direct registrations</p>
                        </div>

                        <div className="space-y-1.5 bg-[#151617] p-3.5 rounded-xl border border-white/5">
                          <label className="font-mono text-[10px] uppercase text-gray-400 block mb-1">Tickets Sold Counter</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={eventTicketsSold}
                            onChange={(e) => setEventTicketsSold(parseInt(e.target.value) || 0)}
                            className="w-full bg-[#1c1e20] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-lg px-2.5 py-1.5 text-center font-mono"
                          />
                          <p className="font-mono text-[8px] text-gray-500 mt-1 block">Dynamic progress capacity tracker</p>
                        </div>

                        <div className="space-y-1.5 bg-[#151617] p-3.5 rounded-xl border border-white/5 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <label className="font-mono text-[10px] uppercase text-gray-400 block">Offer Early Bird?</label>
                            <input
                              type="checkbox"
                              checked={eventHasEarlyBird}
                              onChange={(e) => setEventHasEarlyBird(e.target.checked)}
                              className="w-4 h-4 rounded text-neon-green accent-neon-green border-gray-600 focus:ring-0 cursor-pointer"
                            />
                          </div>
                          <p className="font-mono text-[8px] text-gray-500 mt-1 block">Toggles early-discount tiers for bookings modal</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-gray-400">Early Bird Price (tier active)</label>
                          <input
                            type="text"
                            disabled={!eventHasEarlyBird}
                            value={eventEarlyBirdPrice}
                            onChange={(e) => setEventEarlyBirdPrice(e.target.value)}
                            placeholder="e.g. K150"
                            className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 font-mono text-center disabled:opacity-40"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-gray-400">General Admission Price</label>
                          <input
                            type="text"
                            required
                            value={eventGeneralPrice}
                            onChange={(e) => setEventGeneralPrice(e.target.value)}
                            placeholder="e.g. K250"
                            className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 font-mono text-center"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase text-gray-400">VIP Admission Price</label>
                          <input
                            type="text"
                            required
                            value={eventVipPrice}
                            onChange={(e) => setEventVipPrice(e.target.value)}
                            placeholder="e.g. K600"
                            className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3 font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>

                    {/* COMPANION ALTERNATIVE DATES CREATOR */}
                    <div className="border-t border-[#232426] pt-4 space-y-4">
                      <h5 className="font-serif text-sm font-bold text-white flex items-center justify-between">
                        <span>Alternate Performance dates slots</span>
                        <Sliders className="w-4 h-4 text-neon-green" />
                      </h5>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-[#151617] p-3 rounded-2xl border border-white/5 items-end">
                          <div>
                            <label className="font-mono text-[9px] uppercase text-gray-500 block mb-1">Month Code</label>
                            <input
                              type="text"
                              maxLength={3}
                              value={newAltMonth}
                              onChange={(e) => setNewAltMonth(e.target.value.toUpperCase())}
                              className="w-full bg-[#1c1e20] border border-[#2c2d30] text-xs shrink px-2.5 py-1.5 text-center font-bold tracking-wider text-white rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="font-mono text-[9px] uppercase text-gray-500 block mb-1">Day Tag</label>
                            <input
                              type="text"
                              maxLength={2}
                              value={newAltDay}
                              onChange={(e) => setNewAltDay(e.target.value)}
                              className="w-full bg-[#1c1e20] border border-[#2c2d30] text-xs shrink px-2.5 py-1.5 text-center font-bold text-white rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="font-mono text-[9px] uppercase text-gray-500 block mb-1">Time details</label>
                            <input
                              type="text"
                              value={newAltTime}
                              onChange={(e) => setNewAltTime(e.target.value)}
                              className="w-full bg-[#1c1e20] border border-[#2c2d30] text-xs shrink px-2.5 py-1.5 text-white rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="font-mono text-[9px] uppercase text-gray-500 block mb-1">Roster state</label>
                            <select
                              value={newAltStatus}
                              onChange={(e) => setNewAltStatus(e.target.value as any)}
                              className="w-full bg-[#1c1e20] border border-[#2c2d30] text-xs shrink px-2 py-1.5 text-white rounded-lg cursor-pointer"
                            >
                              <option value="AVAILABLE" className="bg-[#18191b]">AVAILABLE</option>
                              <option value="STANDBY" className="bg-[#18191b]">STANDBY</option>
                              <option value="SOLD OUT" className="bg-[#18191b]">SOLD OUT</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddAltDate}
                          className="w-full bg-[#202123] text-neon-green hover:bg-neon-green hover:text-black border border-neon-green/20 hover:border-transparent font-sans text-[10px] uppercase tracking-widest py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Alternative Event Date</span>
                        </button>

                        <div className="space-y-2 pt-2">
                          {eventAltDates.length > 0 ? (
                            eventAltDates.map((date) => (
                              <div key={date.id} className="flex justify-between items-center bg-[#151617]/50 border border-[#232426] p-2.5 rounded-xl px-4 text-xs">
                                <span className="font-mono text-[9px] text-[#787a7d] uppercase tracking-wider">Alt Date</span>
                                <span className="text-white font-bold">{date.month} {date.day} • {date.time}</span>
                                <div className="flex items-center gap-3">
                                  <span className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded ${
                                    date.status === 'AVAILABLE' ? 'text-neon-green bg-neon-green/10' : 'text-yellow-400 bg-yellow-500/10'
                                  }`}>
                                    {date.status}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAltDate(date.id)}
                                    className="text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] text-gray-500 block text-center py-2 italic bg-[#111213]/40 rounded-xl border border-white/5">
                              No alternative dates added yet. Add additional dates above if this event spans multiple days.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTION CTAS */}
                    <div className="pt-6 border-t border-[#232426] flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => { setEditingEvent(null); setIsAddingNewEvent(false); }}
                        className="px-5 py-3 bg-[#1d1e21] border border-[#2c2d30] text-xs font-sans font-bold tracking-wider uppercase text-gray-400 hover:text-white rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-3 bg-neon-green hover:bg-[#a9fd73] text-black font-sans font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <Loader className="w-3.5 h-3.5 animate-spin" />
                            <span>Updating specs...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Publish Event specs</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                ) : (
                  // EVENTS DIRECTORY LIST FOR CREATOR
                  <div className="space-y-4">
                    {creatorEvents.length > 0 ? (
                      creatorEvents.map((ev) => {
                        const occupancyRatio = ev.ticketLimit ? Math.round(((ev.ticketsSold || 0) / ev.ticketLimit) * 100) : 0;
                        const specSoldOut = ev.ticketLimit ? (ev.ticketsSold || 0) >= ev.ticketLimit : false;
                        
                        return (
                          <div key={ev.id} className="bg-[#18191b] border border-[#232426] p-5.5 sm:p-6 rounded-2xl space-y-4 shadow-lg hover:border-gray-700 transition-colors">
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div className="flex items-start gap-4">
                                <div className="text-center bg-[#212225] border border-[#2e3034] p-2 px-3 rounded-xl min-w-14 shrink-0">
                                  <span className="font-mono text-[9px] text-gray-500 block uppercase tracking-wider">{ev.month}</span>
                                  <span className="font-serif text-lg font-black text-neon-green leading-none block">{ev.day}</span>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-[#242528] text-gray-300 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase border border-white/5 font-semibold">
                                      {ev.category}
                                    </span>
                                    <span className="font-mono text-[9px] text-[#7c7e82]">
                                      • {ev.location}
                                    </span>
                                  </div>
                                  
                                  <h4 className="font-serif text-base font-bold text-white uppercase tracking-tight">
                                    {ev.title}
                                  </h4>
                                </div>
                              </div>

                              {/* ACTIONS */}
                              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditEvent(ev)}
                                  className="p-2 bg-[#212225] border border-white/5 rounded-xl hover:border-gray-500 text-neon-green hover:text-white transition-all cursor-pointer"
                                  title="Edit properties"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to purge event "${ev.title}"?`)) {
                                      onDeleteEvent(ev.id);
                                    }
                                  }}
                                  className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                                  title="Delete Event"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Limits progress bar & ticket metrics */}
                            <div className="bg-[#111213] border border-white/5 p-3.5 rounded-xl space-y-3">
                              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                                <span>TICKET TIERS SPECIFICATION:</span>
                                <div className="flex divide-x divide-gray-700 gap-x-2">
                                  {ev.hasEarlyBird && <span className="text-yellow-400 pr-2">Early: {ev.earlyBirdPrice}</span>}
                                  <span className="text-gray-300 px-2">General: {ev.generalPrice}</span>
                                  <span className="text-neon-green pl-2">VIP: {ev.vipPrice}</span>
                                </div>
                              </div>

                              <div className="h-px bg-white/5" />

                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-gray-400 uppercase tracking-wider">Capacity Reserved: <strong className="text-white">{ev.ticketsSold || 0} / {ev.ticketLimit || 'unlimited'}</strong> (Occupancy)</span>
                                  <span className={`${specSoldOut ? 'text-red-400 animate-pulse font-bold' : 'text-neon-green'}`}>
                                    {specSoldOut ? 'SOLD OUT' : `${occupancyRatio}% RESERVED`}
                                  </span>
                                </div>
                                <div className="w-full h-1 bg-[#202123] rounded-full overflow-hidden relative">
                                  <div 
                                    style={{ width: `${Math.min(100, occupancyRatio)}%` }}
                                    className={`h-full rounded-full ${specSoldOut ? 'bg-red-500' : 'bg-neon-green'}`} 
                                  />
                                </div>
                              </div>
                            </div>

                            {/* List of companion Dates */}
                            {ev.alternativeDates && ev.alternativeDates.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono text-gray-500">
                                <span>Alternative Dates ({ev.alternativeDates.length}):</span>
                                {ev.alternativeDates.map(date => (
                                  <span key={date.id} className="bg-[#111213] text-gray-300 border border-white/5 px-2 py-0.5 rounded">
                                    {date.month} {date.day} ({date.time}) • {date.status}
                                  </span>
                                ))}
                              </div>
                            )}

                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-[#18191b] border border-[#232426] rounded-2xl p-8 py-12 text-center space-y-3">
                        <Layers className="w-8 h-8 text-gray-600 mx-auto" />
                        <h4 className="font-serif text-base font-bold text-gray-300">No Scheduled Events</h4>
                        <p className="font-sans text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                          You haven't listed any shows yet. Click the "Add Live Show" button above to publish your first schedule with custom ticket pricing and dates!
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
