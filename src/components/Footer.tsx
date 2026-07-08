import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import logoImg from '../assets/images/Logo.png';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const socials = [
    { label: 'FRAMER', href: 'https://www.framer.com' },
    { label: 'LINKEDIN', href: 'https://linkedin.com' },
    { label: 'X.COM', href: 'https://x.com' },
    { label: 'INSTAGRAM', href: 'https://instagram.com' },
    { label: 'DRIBBBLE', href: 'https://dribbble.com' },
  ];

  return (
    <footer className="bg-[#111213] border-t border-[#1f2022] py-12 px-4 sm:px-6 lg:px-8 mt-auto" id="app-footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* BRAND & COPYRIGHT */}
        <div className="flex flex-col gap-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start cursor-pointer group" onClick={() => onNavigate('/')}>
            <img 
              src={logoImg} 
              alt="LSK Events Logo" 
              className="h-6 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="font-sans text-[11px] uppercase tracking-widest text-[#727478]">
            © {new Date().getFullYear()} LSK EVENTS. REMADE PRECISELY IN REACT & TAILWIND.
          </p>
        </div>

        {/* SOCIAL LINKS */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {socials.map((soc) => (
            <a
              key={soc.label}
              href={soc.href}
              target="_blank"
              referrerPolicy="no-referrer"
              className="px-3 py-1.5 rounded-lg border border-[#232426] hover:border-neon-green/40 hover:bg-[#161719] font-mono text-[10px] tracking-widest text-gray-400 hover:text-neon-green uppercase transition-all duration-300 flex items-center gap-1"
              id={`footer-social-${soc.label.toLowerCase().replace(/\./g, '-')}`}
            >
              {soc.label}
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          ))}
        </div>

      </div>

      {/* FOOTER BOTTOM TEXT BANNER */}
      <div className="max-w-7xl mx-auto border-t border-[#1f2022]/40 mt-10 pt-6 text-center">
        <p className="font-sans text-[11px] text-[#5c5d60] leading-relaxed max-w-xl mx-auto">
          Recreating events website with 100% precision. Replicating typography pairings, layout hierarchies, electric neon green palettes, and custom responsive layouts.
        </p>
      </div>
    </footer>
  );
}
