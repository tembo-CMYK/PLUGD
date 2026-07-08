import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArtistItem } from '../types';
import { 
  X, 
  User, 
  Music, 
  UtensilsCrossed, 
  CalendarRange, 
  Plus, 
  KeyRound, 
  Sparkles, 
  LogIn, 
  PlusCircle, 
  ArrowRight,
  Loader
} from 'lucide-react';

interface CreatorGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  artists: ArtistItem[];
  onLoginSuccess: (artistId: string) => void;
  onSignUpSuccess: (newArtist: ArtistItem) => void;
}

export default function CreatorGateModal({
  isOpen,
  onClose,
  artists,
  onLoginSuccess,
  onSignUpSuccess
}: CreatorGateModalProps) {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  
  // Sign up fields
  const [newName, setNewName] = useState('');
  const [category, setCategory] = useState<'Music' | 'Food' | 'Festival'>('Music');
  const [typeLabel, setTypeLabel] = useState('');
  const [bio, setBio] = useState('');
  const [specialtyText, setSpecialtyText] = useState('');
  
  // Registration transition status
  const [isRegistering, setIsRegistering] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId) return;
    
    onLoginSuccess(selectedCreatorId);
    onClose();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !typeLabel.trim() || !bio.trim()) return;

    setIsRegistering(true);
    
    // Multi-phase humorous authentic feedback messages!
    const steps = [
      'Assembling talent profile parameters...',
      'Mapping Lusaka arena coordinate vectors...',
      'Securing digital identity certificates...',
      'Roster matrix synchronization completed!'
    ];

    for (const step of steps) {
      setProgressMsg(step);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Set high-quality Unsplash image URLs of professional acts based on their chosen category
    let randomAvatar = '';
    let randomBanner = '';

    if (category === 'Music') {
      randomAvatar = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80';
      randomBanner = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80';
    } else if (category === 'Food') {
      randomAvatar = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80';
      randomBanner = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';
    } else {
      randomAvatar = 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=300&q=80';
      randomBanner = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80';
    }

    // Prepare specialties array
    const specialtiesArray = specialtyText
      ? specialtyText.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [category === 'Music' ? 'Afrobeat' : category === 'Food' ? 'Grill Master' : 'Lifestyle'];

    const newCreator: ArtistItem = {
      id: 'c_' + Date.now(),
      name: newName.trim(),
      slug: 'artist-detail-' + newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      typeLabel: typeLabel.trim(),
      bio: bio.trim(),
      avatarUrl: randomAvatar,
      bannerUrl: randomBanner,
      location: 'Lusaka Exhibition Park, Zambia',
      festivalDate: 'Saturday, October 11, 2025',
      festivalTime: 'Sat 12:00PM',
      specialties: specialtiesArray
    };

    onSignUpSuccess(newCreator);
    setIsRegistering(false);
    onClose();
    
    // Reset Form fields
    setNewName('');
    setTypeLabel('');
    setBio('');
    setSpecialtyText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* BACKDROP SHIELD */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            id="gatekeeper-backdrop"
          />

          {/* INNER CARD CORES */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-lg bg-[#18191b] border border-[#2d2e30] rounded-3xl overflow-hidden shadow-2xl relative z-10 p-6 md:p-8 space-y-6"
            id="creator-gateway-modal"
          >
            {/* CLOSE BUTTON */}
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-[#111213] border border-white/5 hover:border-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* INTRO CONTENT */}
            <div className="space-y-1.5 pr-8">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neon-green/10 text-neon-green border border-neon-green/10 rounded font-mono text-[9px] uppercase tracking-wider font-semibold">
                <Sparkles className="w-3 h-3 text-neon-green" />
                <span>ZAMBIA CREATORS REALM</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
                Creator Integration Node
              </h2>
              <p className="font-sans text-xs text-gray-400">
                Join the headlining roster of LSK Events. Edit details, declare dates, and manage booking assets live.
              </p>
            </div>

            {/* TAB SELECTOR */}
            {!isRegistering && (
              <div className="flex p-0.5 bg-[#111213] rounded-xl border border-[#232426]">
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-sans font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    activeTab === 'signup'
                      ? 'bg-[#1c1d1f] text-neon-green border border-[#2d2e30] font-semibold shadow-md'
                      : 'text-gray-400 hover:text-light'
                  }`}
                >
                  Create New Profile
                </button>
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-sans font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-[#1c1d1f] text-neon-green border border-[#2d2e30] font-semibold shadow-md'
                      : 'text-gray-400 hover:text-light'
                  }`}
                >
                  Manage Existing
                </button>
              </div>
            )}

            {/* MODAL WORKFLOW BODY */}
            <div className="relative min-h-[290px]">
              
              {/* SYSTEM PRELOADER LOADER */}
              {isRegistering ? (
                <div className="absolute inset-x-0 top-12 flex flex-col items-center justify-center space-y-4 text-center animate-pulse">
                  <div className="w-12 h-12 rounded-full border-2 border-neon-green border-t-transparent animate-spin" />
                  <div className="space-y-1">
                    <h4 className="font-mono text-xs text-neon-green tracking-widest uppercase font-bold">Integrating Host System</h4>
                    <p className="font-sans text-[11px] text-gray-400 transition-all">{progressMsg}</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === 'login' ? (
                    
                    /* LOGIN TO EXISTING PROFILE */
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onSubmit={handleLogin}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-gray-500" />
                          <span>Choose Pre-Auth Identity Profile</span>
                        </label>
                        <select
                          required
                          value={selectedCreatorId}
                          onChange={(e) => setSelectedCreatorId(e.target.value)}
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-xs rounded-xl px-4 py-3 option:bg-[#18191b] option:text-white cursor-pointer select-element outline-none"
                        >
                          <option value="" disabled className="text-gray-500">Select an existing headliner profile...</option>
                          {artists.map(art => (
                            <option key={art.id} value={art.id} className="bg-[#18191b] py-2">
                              {art.name} ({art.category})
                            </option>
                          ))}
                        </select>
                        <p className="font-sans text-[10px] text-gray-500">
                          To make editing easy, choose any existing high-profile headliner, pitmaster, or festival from the database to log in and start editing.
                        </p>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={!selectedCreatorId}
                          className="w-full bg-neon-green hover:bg-[#a9fd73] text-black font-sans font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Authenticate Session</span>
                        </button>
                      </div>
                    </motion.form>

                  ) : (

                    /* SIGN UP NEW PROFILE */
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onSubmit={handleSignUp}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase text-gray-400 tracking-wider">Stage / Brand Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. DJ Mampi Zambia"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-2.5 placeholder-gray-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase text-gray-400 tracking-wider">Creator Category</label>
                          <div className="flex gap-1.5 p-1 bg-[#111213] rounded-xl border border-[#232426]">
                            {(['Music', 'Food', 'Festival'] as const).map(role => (
                              <button
                                key={role}
                                type="button"
                                onClick={() => setCategory(role)}
                                className={`flex-1 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase text-center cursor-pointer transition-colors ${
                                  category === role
                                    ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                                    : 'text-gray-500 hover:text-white'
                                }`}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase text-gray-400 tracking-wider">Role Subtitle</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Afro-Jazz Pianist / Organic Nshima Maker"
                          value={typeLabel}
                          onChange={(e) => setTypeLabel(e.target.value)}
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-2.5 placeholder-gray-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase text-gray-400 tracking-wider">Tag Specializations (comma separated)</label>
                        <input 
                          type="text" 
                          placeholder="Jazz, Bemba Vocals, Organic, Smoked"
                          value={specialtyText}
                          onChange={(e) => setSpecialtyText(e.target.value)}
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-2.5 placeholder-gray-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase text-gray-400 tracking-wider">Story Narrative</label>
                        <textarea 
                          rows={2.5}
                          required
                          placeholder="Write a brief intro bio. We'll automatically set beautiful cover art and portraits in our network catalog..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full bg-[#111213] border border-[#2c2d30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-2.5 placeholder-gray-500 resize-none"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full bg-neon-green hover:bg-[#a9fd73] text-black font-sans font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Register Profile</span>
                        </button>
                      </div>
                    </motion.form>

                  )}
                </AnimatePresence>
              )}

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
