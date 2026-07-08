import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Menu, X, Activity, Sun, Moon } from 'lucide-react';
import logoImg from '../assets/images/Logo.png';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  currentCreatorId: string | null;
  onOpenCreatorGate: () => void;
}

export default function Header({ 
  currentPath, 
  onNavigate, 
  theme, 
  onToggleTheme,
  currentCreatorId,
  onOpenCreatorGate
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Events', path: '/events' },
    { label: 'Create Event', path: '/create-event' },
    { label: 'Directory', path: '/artist' },
  ];

  // Dynamically include Admin Studio inside standard tabs if logged in
  if (currentCreatorId) {
    navItems.push({ label: 'Admin Studio', path: '/admin' });
  }

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 bg-[#131415]/90 backdrop-blur-md border-b border-[#2d2e30]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 cursor-pointer group transition-transform duration-300 active:scale-95 select-none"
          id="nav-logo"
        >
          <img 
            src={logoImg} 
            alt="LSK Events Logo" 
            className="h-6 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-1.5" id="desktop-nav">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`px-4 py-2 rounded-xl font-sans text-xs tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#1c1d1f] text-neon-green border border-[#2d2e30] font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-[#1c1d1f]/30'
                }`}
                id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* THEME TOGGLE & EXPLORE EVENTS ACTION */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2.5 bg-[#1c1d1f] hover:bg-[#25272a] text-neon-green border border-[#2d2e30] rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer relative overflow-hidden group"
            id="theme-toggle-desktop"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 0 : 180, scale: [0.9, 1.1, 1] }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5 text-neon-green" />
              )}
            </motion.div>
          </button>

          {currentCreatorId ? (
            <button
              onClick={() => handleNav('/admin')}
              className="font-sans text-xs tracking-wider uppercase bg-[#1c1d1f] hover:bg-[#25272a] hover:border-neon-green/30 text-neon-green border border-[#2d2e30] px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer font-bold"
              id="desktop-admin-btn"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
              </span>
              <span>Admin Studio</span>
            </button>
          ) : (
            <button
              onClick={onOpenCreatorGate}
              className="font-sans text-xs tracking-wider uppercase bg-[#1c1d1f] hover:bg-neon-green hover:text-black hover:border-transparent text-gray-300 border border-[#2d2e30] px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer font-bold"
              id="desktop-signup-btn"
            >
              Sign Up
            </button>
          )}

          <button
            onClick={() => handleNav('/events')}
            className="font-sans text-xs tracking-wider uppercase bg-neon-green hover:bg-[#a9fd73] text-black font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(154,250,95,0.25)] hover:shadow-[0_0_25px_rgba(154,250,95,0.4)] cursor-pointer"
            id="nav-action"
          >
            Explore Events
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1c1d1f] rounded-xl border border-transparent hover:border-[#2d2e30] transition-all"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131415] border-b border-[#2d2e30] animate-fade-in-down" id="mobile-nav-panel">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-sans text-xs tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-[#1c1d1f] text-neon-green border border-[#2d2e30] font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-[#1c1d1f]/40'
                  }`}
                  id={`mobile-nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={onToggleTheme}
                className="w-full text-center py-3 rounded-xl font-sans text-xs tracking-wider uppercase transition-all bg-[#1c1d1f] text-neon-green border border-[#2d2e30] font-semibold flex items-center justify-center gap-2 cursor-pointer"
                id="mobile-nav-theme-toggle"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {currentCreatorId ? (
                <button
                  onClick={() => handleNav('/admin')}
                  className="w-full text-center py-3 rounded-xl font-sans text-xs tracking-wider uppercase transition-all bg-[#1c1d1f] text-neon-green border border-neon-green/20 font-bold flex items-center justify-center gap-2 cursor-pointer"
                  id="mobile-nav-admin"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                  <span>Admin Studio</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCreatorGate();
                  }}
                  className="w-full text-center py-3 rounded-xl font-sans text-xs tracking-wider uppercase transition-all bg-[#1c1d1f] text-white border border-[#2d2e30] font-bold flex items-center justify-center gap-2 cursor-pointer"
                  id="mobile-nav-signup"
                >
                  <span>Sign Up</span>
                </button>
              )}
              
              <button
                onClick={() => handleNav('/events')}
                className="w-full text-center font-sans text-xs tracking-wider uppercase bg-neon-green text-black font-bold py-3.5 rounded-xl transition-all hover:bg-[#a9fd73] cursor-pointer"
                id="mobile-nav-action"
              >
                Explore Events
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
