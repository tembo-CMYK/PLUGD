import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EventItem } from '../types';
import { PlusCircle, Info, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

// Sample curated background images for categories we dynamically map on submission
const CATEGORY_IMAGES: Record<string, string> = {
  Concert: 'https://framerusercontent.com/images/iphV9o4bjrDvIi3M9zX1WNrVI4.jpg?scale-down-to=1024',
  Festival: 'https://framerusercontent.com/images/x0JxuHIiPplVGFO6uYnTagZHrk.jpg',
  Sports: 'https://framerusercontent.com/images/9Jt8jKzYDoRNpB2U0PtgiytsJc.jpg?scale-down-to=1024',
  Arts: 'https://framerusercontent.com/images/JMvjL5ECoAhua4BsFsVNKZUwtc.jpg',
  Lifestyle: 'https://framerusercontent.com/images/0vAlMjrPgF7j1LZ4gA7p7nStaM.jpg?scale-down-to=1024'
};

interface CreateEventProps {
  onAddEvent: (newEvent: EventItem) => void;
  onNavigate: (path: string) => void;
}

export default function CreateEventPage({ onAddEvent, onNavigate }: CreateEventProps) {
  const [formData, setFormData] = useState({
    title: '',
    email: '',
    location: '',
    description: '',
    category: 'Concert' as EventItem['category'],
    subcategories: [] as string[]
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdEventId, setCreatedEventId] = useState('');

  const subcategoryOptions = ['Hip-Hop', 'Gospel', 'Kalindula', 'Food', 'Dance', 'Fashion'];

  const handleSubcategoryChange = (sub: string) => {
    if (formData.subcategories.includes(sub)) {
      setFormData({
        ...formData,
        subcategories: formData.subcategories.filter(s => s !== sub)
      });
    } else {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, sub]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.email || !formData.location) return;

    const randomId = 'custom-' + Math.random().toString(36).substr(2, 9);
    
    // Choose dynamic month/day for custom event
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    // Create item
    const customEvent: EventItem = {
      id: randomId,
      title: formData.title,
      month: randomMonth,
      day: randomDay,
      description: formData.description || 'Join us for this bespoke local gather featuring the best music acts, delicious gourmet and community experiences.',
      location: formData.location,
      category: formData.category,
      subcategories: formData.subcategories,
      imageUrl: CATEGORY_IMAGES[formData.category] || CATEGORY_IMAGES.Concert
    };

    onAddEvent(customEvent);
    setCreatedEventId(randomId);
    setIsSuccess(true);
  };

  return (
    <div className="bg-[#131415] text-white min-h-screen py-16 md:py-24" id="create-event-page-container">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* HEADER BAR */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.985, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-[#242528] pb-8 mb-12 text-center sm:text-left space-y-3"
        >
          <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-white leading-tight">
            Create Your Event in Minutes
          </h1>
          <p className="font-sans text-sm text-gray-400 max-w-xl">
            Fill in your details, select your category, and publish your event right away to Zambia's primary social events directory.
          </p>
        </motion.div>

        {!isSuccess ? (
          // FORM COMPONENT
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.98, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handleSubmit} className="bg-[#18191b] border border-[#232426] p-6 sm:p-10 rounded-3xl space-y-8 shadow-2xl">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Event Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-sans text-xs font-semibold text-gray-300 block uppercase tracking-wide">Event Title</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Lusaka Acoustic Sunset Concert"
                  className="w-full bg-[#1e2022] border border-[#2d2e30] hover:border-gray-600 focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3.5 placeholder-gray-500 transition-colors"
                />
              </div>

              {/* Publisher Email */}
              <div className="space-y-1.5">
                <label className="font-sans text-xs font-semibold text-gray-300 block uppercase tracking-wide">Email Address</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., info@mysite.com"
                  className="w-full bg-[#1e2022] border border-[#2d2e30] hover:border-gray-600 focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3.5 placeholder-gray-500 transition-colors"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="font-sans text-xs font-semibold text-gray-300 block uppercase tracking-wide">Location Venue</label>
                <input 
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Pinnacle Mall, Lusaka"
                  className="w-full bg-[#1e2022] border border-[#2d2e30] hover:border-gray-600 focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3.5 placeholder-gray-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex justify-between">
                  <label className="font-sans text-xs font-semibold text-gray-300 block uppercase tracking-wide">Short Description</label>
                  <span className="font-mono text-[9px] text-gray-500">OPTIONAL</span>
                </div>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize the theme, artists billing, age limits, and special guidelines..."
                  className="w-full bg-[#1e2022] border border-[#2d2e30] hover:border-gray-600 focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-3.5 placeholder-gray-500 transition-colors resize-none"
                />
              </div>

              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="font-sans text-xs font-semibold text-gray-300 block uppercase tracking-wide">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as EventItem['category'] })}
                  className="w-full bg-[#1e2022] border border-[#2d2e30] focus:border-neon-green text-white text-xs outline-none rounded-xl px-4 py-4 transition-colors cursor-pointer appearance-none uppercase tracking-wider font-semibold"
                >
                  <option value="Concert">Concert</option>
                  <option value="Festival">Festival</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts">Arts</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              {/* Info Indicator */}
              <div className="info-alert-box flex items-center gap-2.5 p-4 rounded-xl text-[11.5px] font-sans border" id="info-poster-pairing-alert">
                <Info className="info-alert-icon w-5 h-5 flex-shrink-0" />
                <span className="info-alert-text">
                  We will dynamically pair your event with a styled, high-definition catalog cover poster based on the selected category.
                </span>
              </div>

            </div>

            {/* Subcategories (Checkboxes) */}
            <div className="space-y-3.5 border-t border-[#232426]/60 pt-6">
              <label className="font-sans text-xs font-semibold text-gray-300 block uppercase tracking-wide">Subcategories</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subcategoryOptions.map((sub) => {
                  const isChecked = formData.subcategories.includes(sub);
                  return (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => handleSubcategoryChange(sub)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-sans text-xs uppercase tracking-wide cursor-pointer transition-all duration-300 ${
                        isChecked
                          ? 'bg-[#1f261d] border-neon-green/55 text-neon-green font-bold'
                          : 'bg-[#1c1d1f] border-[#2a2c2e] text-gray-400 hover:text-white'
                      }`}
                      id={`subcat-checkbox-${sub.toLowerCase()}`}
                    >
                      <div className={`w-4- h-4 border rounded flex items-center justify-center ${
                        isChecked ? 'bg-neon-green border-transparent text-black' : 'border-gray-600'
                      }`}>
                        {isChecked && <Check className="w-3- h-3 stroke-[3px]" />}
                      </div>
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#232426]/60">
              <button
                type="submit"
                className="w-full bg-neon-green text-black hover:bg-[#a9fd73] font-sans font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(154,250,95,0.15)] cursor-pointer text-center"
                id="submit-event-btn"
              >
                Publish Event
              </button>
            </div>

          </form>
          </motion.div>
        ) : (
          // SUCCESS STATE
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#18191b] border border-[#232426] p-8 md:p-12 rounded-3xl text-center space-y-6 shadow-2xl animate-fade-in"
          >
            <div className="w-16 h-16 bg-neon-green/10 border border-neon-green/20 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
              <Sparkles className="w-8 h-8 text-neon-green" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neon-green">PUBLICATION CONFIRMED</span>
              <h2 className="font-serif text-2xl font-bold text-white">Your Event is Live!</h2>
              <p className="font-sans text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                Congratulations! <strong>{formData.title}</strong> has been successfully published to the directory. People can now find it and save spots.
              </p>
            </div>

            <div className="bg-[#212224] p-5 rounded-2xl max-w-sm mx-auto border border-[#2d2e30] flex items-center gap-4">
              <div className="w-16 h-16 bg-[#18191b] rounded-xl overflow-hidden flex-shrink-0 relative">
                <img 
                  src={CATEGORY_IMAGES[formData.category]} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left font-sans">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#9afa5f]">{formData.category}</span>
                <h5 className="text-sm font-bold text-white truncate max-w-[200px]">{formData.title}</h5>
                <p className="text-xs text-gray-400 truncate max-w-[200px]">{formData.location}</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => onNavigate('/events')}
                className="bg-neon-green text-black font-sans font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-[#a9fd73] transition-colors cursor-pointer"
              >
                View Event in Catalog
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    title: '',
                    email: '',
                    location: '',
                    description: '',
                    category: 'Concert',
                    subcategories: []
                  });
                }}
                className="bg-transparent text-gray-300 hover:text-white font-sans font-medium text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl border border-[#2d2e30] hover:bg-[#202123] transition-all cursor-pointer"
              >
                Create Another Event
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
