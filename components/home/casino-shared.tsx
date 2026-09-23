'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const REEL_SYMBOLS = ['★', 'BAR', '★', '7', '♦', '♣', 'BAR'];
const REEL_STRIPS = [
  [...REEL_SYMBOLS, ...REEL_SYMBOLS],
  [...REEL_SYMBOLS.slice(2), ...REEL_SYMBOLS, ...REEL_SYMBOLS.slice(0, 2)],
  [...REEL_SYMBOLS.slice(4), ...REEL_SYMBOLS, ...REEL_SYMBOLS.slice(0, 4)],
];

const BULB_COLORS = {
  home: ['#f43f5e', '#fbbf24', '#4ade80', '#22d3ee', '#a855f7', '#ff6600'],
  page: ['#c084fc', '#e879f9', '#f472b6', '#a855f7', '#ec4899', '#d946ef'],
} as const;

export function HeroSlotMachine({ variant }: { variant: 'home' | 'page' }) {
  const themed = variant === 'home' ? 'home' : 'page';
  return (
    <div className={`casino-hero-slot ${themed}-hero-slot`} aria-hidden>
      <div className="casino-hero-slot-top">
        <span className={`casino-hero-slot-jackpot ${themed}-hero-jackpot`}>JACKPOT</span>
        <div className="casino-hero-slot-bulbs">
          {BULB_COLORS[variant].map((c, i) => (
            <motion.span
              key={i}
              className="casino-hero-slot-bulb"
              style={{ background: c, boxShadow: `0 0 8px ${c}` }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}
        </div>
      </div>

      <div className={`casino-hero-slot-window ${themed}-hero-slot-window`}>
        <div className="casino-hero-slot-reels">
          {REEL_STRIPS.map((strip, i) => (
            <div key={i} className="casino-hero-slot-reel-wrap">
              <motion.div
                className="casino-hero-slot-reel-strip"
                animate={{ y: ['0%', '-50%'] }}
                transition={{
                  duration: 3 + i * 0.6,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.4,
                }}
              >
                {strip.map((sym, j) => (
                  <span
                    key={j}
                    className={`casino-hero-slot-symbol ${sym === '7' ? 'casino-hero-slot-symbol--seven' : sym === 'BAR' ? `${themed}-hero-bar` : ''}`}
                  >
                    {sym}
                  </span>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
        <div className={`casino-hero-slot-payline ${themed}-hero-payline`} />
      </div>

      <div className="casino-hero-slot-base">
        <span className={`casino-hero-slot-label ${themed}-hero-slot-brand`}>SUDONEX</span>
      </div>

      <motion.div
        className={`casino-hero-slot-lever ${themed}-hero-lever`}
        animate={{ rotate: [0, 22, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
      >
        <span className={`casino-hero-slot-lever-knob ${themed}-hero-lever-knob`} />
      </motion.div>
    </div>
  );
}

export function PlayingCard({ suit, rank, color, rotate, className = '' }: {
  suit: string; rank: string; color: string; rotate: number; className?: string;
}) {
  return (
    <div className={`casino-playing-card ${className}`} style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
      <span className="casino-card-rank" style={{ color }}>{rank}</span>
      <span className="casino-card-suit" style={{ color }}>{suit}</span>
    </div>
  );
}

export function Dice({ value, className = '' }: { value: number; className?: string }) {
  const dots: Record<number, number[][]> = {
    1: [[1, 1]],
    3: [[0, 0], [1, 1], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
  };
  return (
    <div className={`casino-dice ${className}`} aria-hidden>
      <div className="casino-dice-face">
        {(dots[value] ?? dots[3]).map(([r, c], i) => (
          <span key={i} className="casino-dice-dot" style={{ gridRow: r + 1, gridColumn: c + 1 }} />
        ))}
      </div>
    </div>
  );
}

export function CasinoChip({ color, value, size = 44 }: { color: string; value: string; size?: number }) {
  return (
    <div className={`casino-chip ${color}`} style={{ width: size, height: size }}>
      <span className="casino-chip-inner" />
      <span className="casino-chip-value">{value}</span>
    </div>
  );
}

export function PageCasinoFrame({ children }: { children: ReactNode }) {
  return (
    <div className="home-casino-visual">
      <div className="home-casino-table absolute inset-0 rounded-3xl" />
      {children}
    </div>
  );
}

export function DicePair({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end ${className}`}>
      <motion.div
        className="origin-bottom-right"
        animate={{ rotate: [0, 8, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Dice value={6} />
      </motion.div>
      <motion.div
        className="-ml-3 origin-bottom-left"
        animate={{ rotate: [0, -6, 6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        <Dice value={3} />
      </motion.div>
    </div>
  );
}
