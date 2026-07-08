import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import ArtistPage from './pages/ArtistPage';
import ArtistDetail from './pages/ArtistDetail';
import AdminPage from './pages/AdminPage';
import CreatorGateModal from './components/CreatorGateModal';
import { INITIAL_EVENTS, ARTISTS } from './data';
import { EventItem, ArtistItem } from './types';
import logoImg from './assets/images/Logo.png';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  
  // Initial loading state
  const [initialLoading, setInitialLoading] = useState(true);

  // Simulating initial loading to show the animated logo briefly on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Dynamic persisted events state
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('lsk_events_database');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Premium dark mode by default
  });

  // Dynamic state for profiles
  const [artists, setArtists] = useState<ArtistItem[]>(() => {
    try {
      const saved = localStorage.getItem('lsk_artists_database');
      return saved ? JSON.parse(saved) : ARTISTS;
    } catch {
      return ARTISTS;
    }
  });

  // Authenticated Creator Session State
  const [currentCreatorId, setCurrentCreatorId] = useState<string | null>(() => {
    return localStorage.getItem('lsk_active_creator_id');
  });

  // Portal trigger overlays
  const [isGateOpen, setIsGateOpen] = useState(false);

  // Sync state database changes with localStorage
  useEffect(() => {
    localStorage.setItem('lsk_artists_database', JSON.stringify(artists));
  }, [artists]);

  // Sync events database changes with localStorage
  useEffect(() => {
    localStorage.setItem('lsk_events_database', JSON.stringify(events));
  }, [events]);

  // Sync active session identifier
  useEffect(() => {
    if (currentCreatorId) {
      localStorage.setItem('lsk_active_creator_id', currentCreatorId);
    } else {
      localStorage.removeItem('lsk_active_creator_id');
    }
  }, [currentCreatorId]);

  // Sync state path router with address bar using Hash-based routing for static host (GitHub Pages) compatibility
  useEffect(() => {
    const parseHashPath = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#' || hash === '#/') {
        return '/';
      }
      // Strip starting '#'
      let path = hash.substring(1);
      // Ensure it starts with '/'
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      return path;
    };

    // Initial path load from hash
    let initialPath = parseHashPath();
    
    // Fallback if no hash exists initially but pathname does
    if (!window.location.hash || window.location.hash === '' || window.location.hash === '#') {
      const pathname = window.location.pathname;
      const knownRoutes = ['/events', '/create-event', '/artist', '/admin'];
      const matchedRoute = knownRoutes.find(r => pathname.endsWith(r));
      if (matchedRoute) {
        initialPath = matchedRoute;
        window.location.hash = '#' + matchedRoute;
      } else {
        initialPath = '/';
        window.location.hash = '#/';
      }
    }

    setCurrentPath(initialPath);

    const handleHashChange = () => {
      setCurrentPath(parseHashPath());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync Theme with Root HTML element class list
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleNavigate = (path: string) => {
    const hashPath = path.startsWith('/') ? '#' + path : '#/' + path;
    window.location.hash = hashPath;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add customized client published event
  const handleAddEvent = (newEvent: EventItem) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleUpdateEvent = (updated: EventItem) => {
    setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  // Handle profile synchronization
  const handleUpdateArtist = (updated: ArtistItem) => {
    setArtists((prev) => prev.map((art) => (art.id === updated.id ? updated : art)));
  };

  const handleLoginSuccess = (artistId: string) => {
    setCurrentCreatorId(artistId);
    handleNavigate('/admin');
  };

  const handleSignUpSuccess = (newArtist: ArtistItem) => {
    setArtists((prev) => [newArtist, ...prev]);
    setCurrentCreatorId(newArtist.id);
    handleNavigate('/admin');
  };

  const handleLogout = () => {
    setCurrentCreatorId(null);
    handleNavigate('/artist');
  };


  // Select page content based on states
  const renderPage = () => {
    switch (currentPath) {
      case '/':
      case '/home':
        return <Home onNavigate={handleNavigate} />;
      case '/events':
        return <EventsPage onNavigate={handleNavigate} />;
      case '/create-event':
        return (
          <CreateEventPage 
            onAddEvent={handleAddEvent} 
            onNavigate={handleNavigate} 
          />
        );
      case '/artist':
        return <ArtistPage artists={artists} onNavigate={handleNavigate} />;
      case '/admin':
        return (
          <AdminPage 
            artists={artists}
            currentCreatorId={currentCreatorId}
            onUpdateArtist={handleUpdateArtist}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      default:
        // Check dynamic profiles route match
        const foundArtist = artists.find(a => `/${a.slug}` === currentPath);
        if (foundArtist) {
          return (
            <ArtistDetail 
              artists={artists}
              events={events}
              currentPath={currentPath} 
              onNavigate={handleNavigate} 
            />
          );
        }
        // General fallback back to home
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#131415] text-white selection:bg-neon-green selection:text-black">
      
      {/* INITIAL LAUNCH PRELOADER BRANDING SCREEN (LOGO ONLY, ANIMATED) */}
      <AnimatePresence>
        {initialLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(15px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#131415] flex flex-col items-center justify-center p-6 text-center select-none"
            id="initial-preloader-page"
          >
            <motion.img 
              src={logoImg} 
              alt="LSK Events Logo" 
              className="h-12 sm:h-16 w-auto object-contain"
              animate={{ 
                scale: [0.9, 1.05, 0.9],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE APP LAYOUT */}
      <Header 
        currentPath={currentPath} 
        onNavigate={handleNavigate} 
        theme={theme}
        onToggleTheme={toggleTheme}
        currentCreatorId={currentCreatorId}
        onOpenCreatorGate={() => setIsGateOpen(true)}
      />
      
      <main className="flex-grow flex flex-col relative">


        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, scale: 0.985, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.015, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-grow flex flex-col"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* GLOBAL GATEKEEPER INTEGRATION PORTAL MODAL */}
      <CreatorGateModal 
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        artists={artists}
        onLoginSuccess={handleLoginSuccess}
        onSignUpSuccess={handleSignUpSuccess}
      />

    </div>
  );
}

