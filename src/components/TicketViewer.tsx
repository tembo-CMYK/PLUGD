import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, MapPin, Calendar, Sparkles, Check, ArrowRight } from 'lucide-react';

import yoMapsImg from '../../assets/.aistudio/Yo Maps Ticker.jpeg';
import chefImg from '../../assets/.aistudio/Chef 187 Ticker.jpg';
import cleoImg from '../../assets/.aistudio/Cleo Ice Queen Ticker.jpg';
import pompiImg from '../../assets/.aistudio/Pompi Ticker.jpeg';

interface TicketData {
  id: string;
  artist: string;
  type: string;
  category: string;
  venue: string;
  location: string;
  date: string;
  month: string;
  day: string;
  serial: string;
  image: string;
  price: string;
  objectPosition?: string;
}

const TICKET_DECK: TicketData[] = [
  {
    id: 't1',
    artist: 'YO MAPS',
    type: 'VIP BACKSTAGE',
    category: 'INDIVIDUAL PASS',
    venue: 'HEROES STADIUM',
    location: 'LUSAKA, ZAMBIA',
    date: 'OCTOBER 24, 2026',
    month: 'OCT',
    day: '24',
    serial: 'YM-VIP-88402',
    image: yoMapsImg,
    price: 'K750',
    objectPosition: 'center 15%'
  },
  {
    id: 't2',
    artist: 'CHEF 187',
    type: 'VIP STAGE ACCESS',
    category: 'PREMIUM INDIVIDUAL',
    venue: 'LEVY STADIUM',
    location: 'NDOLA, ZAMBIA',
    date: 'NOVEMBER 12, 2026',
    month: 'NOV',
    day: '12',
    serial: 'CH187-VIP-90210',
    image: chefImg,
    price: 'K950',
    objectPosition: 'center top'
  },
  {
    id: 't3',
    artist: 'CLEO ICE QUEEN',
    type: 'PREMIUM SUITE',
    category: 'GOLD ADMISSION',
    venue: 'CIELA RESORT',
    location: 'LUSAKA, ZAMBIA',
    date: 'DECEMBER 05, 2026',
    month: 'DEC',
    day: '05',
    serial: 'CLEO-SU-11204',
    image: cleoImg,
    price: 'K1,200',
    objectPosition: 'center 8%'
  },
  {
    id: 't4',
    artist: 'POMPI LIVE',
    type: 'MAIN ENCLOSURE',
    category: 'GENERAL ADMISSION',
    venue: 'LUSAKA PLAYHOUSE',
    location: 'LUSAKA, ZAMBIA',
    date: 'OCTOBER 19, 2026',
    month: 'OCT',
    day: '19',
    serial: 'POMP-GEN-50419',
    image: pompiImg,
    price: 'K350',
    objectPosition: 'center 15%'
  }
];

export default function TicketViewer() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TICKET_DECK.length);
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.985, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-8 w-full max-w-5xl mx-auto" 
      id="ticket-viewer-wrapper"
    >
      
      {/* 3D Stack Container */}
      <div className="relative h-[530px] w-full max-w-[320px] sm:max-w-[450px] flex items-center justify-center mt-6" id="ticket-stack-container">
        {TICKET_DECK.map((ticket, index) => {
          // Calculate cyclic offset
          const diff = (index - activeIndex + TICKET_DECK.length) % TICKET_DECK.length;
          
          // Layout states for circular fan/stack animation
          let zIndex = 10;
          let rotate = 0;
          let scale = 0.8;
          let x = '0px';
          let y = '0px';
          let opacity = 0;
          let filter = 'blur(6px)';
          let isFront = false;

          if (diff === 0) {
            // Frontactive card
            zIndex = 40;
            rotate = 0;
            scale = 1.0;
            x = '0px';
            y = '0px';
            opacity = 1;
            filter = 'blur(0px)';
            isFront = true;
          } else if (diff === 1) {
            // Right-down stack card
            zIndex = 30;
            rotate = -8;
            scale = 0.93;
            x = '60px';
            y = '15px';
            opacity = 0.85;
            filter = 'blur(2px)';
          } else if (diff === 2) {
            // Further back and fanned right
            zIndex = 20;
            rotate = -16;
            scale = 0.86;
            x = '110px';
            y = '30px';
            opacity = 0.6;
            filter = 'blur(4px)';
          } else if (diff === TICKET_DECK.length - 1) {
            // Left cached card fanning back
            zIndex = 10;
            rotate = 10;
            scale = 0.88;
            x = '-70px';
            y = '10px';
            opacity = 0.45;
            filter = 'blur(4px)';
          }

          // Responsive adaptations of offsets
          const computedX = typeof window !== 'undefined' && window.innerWidth < 640 
            ? (parseFloat(x) * 0.4) + 'px' 
            : x;

          return (
            <motion.div
              key={ticket.id}
              style={{ zIndex }}
              animate={{
                x: computedX,
                y,
                scale,
                rotate,
                opacity,
                filter
              }}
              transition={{
                type: 'spring',
                bounce: 0.08,
                duration: 0.95
              }}
              onClick={() => handleCardClick(index)}
              className={`absolute cursor-pointer select-none origin-bottom-center ${
                isFront ? 'drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] z-40' : 'hover:brightness-110'
              }`}
              id={`framer-ticket-card-${ticket.id}`}
            >
              {/* Premium Ticket Card Body */}
              <div className="ticket-card group relative w-[240px] h-[500px] rounded-3xl bg-[#18191b] border border-white/10 overflow-hidden flex flex-col justify-between">
                
                {/* 1. Artist Photo on Top - Main focus taking up ~70% of the ticket */}
                <div className="ticket-top relative h-[345px] w-full overflow-hidden">
                  <img
                    src={ticket.image}
                    alt={ticket.artist}
                    className="w-full h-full object-cover brightness-[0.85] saturate-[1.1] hover:scale-105 transition-all duration-700"
                    style={{ objectPosition: ticket.objectPosition || 'center' }}
                    referrerPolicy="no-referrer"
                  />
                  {/* Neon Color Gradient Layer */}
                  <div className="ticket-gradient absolute inset-0 bg-gradient-to-t from-[#18191b] via-[#18191b]/30 to-transparent" />
                  
                  {/* Floating Luxe Info */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[9px] uppercase tracking-wider font-semibold font-mono text-white">
                      <Sparkles className="w-2.5 h-2.5 text-neon-green" />
                      {ticket.category}
                    </div>
                    <div className="font-mono text-[9px] text-[#2c2e30] bg-[#a8f965] font-extrabold px-2 py-0.5 rounded uppercase">
                      {ticket.price}
                    </div>
                  </div>

                  {/* Gig details overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-left">
                    <p className="font-mono text-[10px] uppercase text-neon-green tracking-widest leading-none mb-1">
                      ZAMBIA DIRECT
                    </p>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-none uppercase transition-transform duration-300 ease-out group-hover:scale-[1.02] origin-left">
                      {ticket.artist}
                    </h3>
                  </div>
                </div>

                {/* 2. Ticket Stub Separator Line with Left & Right Punch Notches */}
                <div className="ticket-separator relative w-full h-4 flex items-center justify-between pointer-events-none z-10 bg-[#18191b]">
                  {/* Punch Hole Notches */}
                  <div className="ticket-notch-l absolute -left-3.5 w-7 h-7 rounded-full bg-[#111213] border border-white/5 shadow-[inset_-3px_0_4px_rgba(0,0,0,0.6)]" />
                  <div className="ticket-notch-r absolute -right-3.5 w-7 h-7 rounded-full bg-[#111213] border border-white/5 shadow-[inset_3px_0_4px_rgba(0,0,0,0.6)]" />
                  
                  {/* Dash Cut Line */}
                  <div className="ticket-dash w-full border-t border-dashed border-[#2d2e30] mx-4 opacity-70" />
                </div>

                {/* 3. Ticket Bottom Half (Details & barcode stub) - Compact vertical ticket design */}
                <div className="ticket-bottom p-3.5 flex flex-col justify-between flex-grow text-left bg-[#18191b]">
                  <div className="space-y-1.5">
                    {/* Location & Venue */}
                    <div>
                      <span className="font-mono text-[7px] text-gray-500 uppercase tracking-widest block mb-0.5">LOCATION</span>
                      <div className="flex items-start gap-1 font-sans text-[11px] font-bold text-gray-200">
                        <MapPin className="w-3 h-3 text-neon-green flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="leading-tight uppercase truncate max-w-[190px]">{ticket.venue}</div>
                          <div className="text-[9px] text-gray-400 uppercase font-medium leading-none mt-0.5 truncate max-w-[190px]">{ticket.location}</div>
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div>
                      <span className="font-mono text-[7px] text-gray-500 uppercase tracking-widest block mb-0.5">DATE & TIME</span>
                      <div className="flex items-center gap-1.5 font-sans text-[11px] font-bold text-gray-200">
                        <Calendar className="w-3 h-3 text-neon-green flex-shrink-0" />
                        <span className="uppercase text-[10px]">{ticket.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. Barcode Stub */}
                  <div className="mt-2.5 pt-2 border-t border-[#232427]/50 flex items-end justify-between">
                    {/* Render elegant realistic barcode */}
                    <div className="flex flex-col gap-0.5 w-[140px]">
                      <div className="h-6 flex gap-[1px] items-stretch opacity-85">
                        {[1, 3, 1, 2, 4, 1, 3, 2, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 3, 1, 4].map((width, idx) => (
                          <div
                            key={idx}
                            style={{ width: `${width}px` }}
                            className="ticket-barcode-bar bg-gray-300 h-full rounded-[0.5px]"
                          />
                        ))}
                      </div>
                      <span className="ticket-barcode-text font-mono text-[6px] text-gray-500 tracking-wider">
                        {ticket.serial}
                      </span>
                    </div>

                    {/* Badge */}
                    <div className="text-right">
                      <span className="font-mono text-[7px] text-gray-600 block uppercase leading-none">PASS</span>
                      <span className="font-sans text-[9px] font-black text-neon-green uppercase leading-none block mt-0.5">
                        {ticket.type.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Controller Dots & Nav Hints */}
      <div className="flex items-center gap-8 mt-4 z-20" id="ticket-interactive-footer">
        {/* Previous Button */}
        <button
          onClick={() => setActiveIndex((prev) => (prev - 1 + TICKET_DECK.length) % TICKET_DECK.length)}
          className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-neon-green transition-colors cursor-pointer"
        >
          PREV
        </button>

        {/* Dynamic Dots indicators */}
        <div className="flex gap-2">
          {TICKET_DECK.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-6 bg-neon-green' : 'w-1.5 bg-[#2d2e30] hover:bg-gray-500'
              } cursor-pointer`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-neon-green transition-colors cursor-pointer"
        >
          NEXT
        </button>
      </div>

      <div className="mt-8 text-center text-[11px] text-gray-500 font-sans tracking-wide animate-pulse max-w-sm mx-auto pointer-events-none" id="ticket-click-hint">
        ← Click cards directly to browse through the stack →
      </div>
    </motion.div>
  );
}
