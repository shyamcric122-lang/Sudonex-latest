'use client';

import { motion } from 'framer-motion';
import {
  CasinoChip,
  Dice,
  HeroSlotMachine,
  PlayingCard,
} from '@/components/home/casino-shared';

export default function CasinoGamesVisual() {
  return (
    <div className="home-casino-visual">
      <div className="home-casino-table absolute inset-0 rounded-3xl" />

      <motion.div
        className="absolute top-[8%] left-[4%] z-20 hidden sm:block"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <PlayingCard suit="♠" rank="A" color="#1a1a1a" rotate={-14} />
      </motion.div>
      <motion.div
        className="absolute top-[6%] left-[15%] z-10 hidden sm:block"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        <PlayingCard suit="♥" rank="K" color="#f43f5e" rotate={-22} />
      </motion.div>

      <div className="relative z-[5] flex h-full items-center justify-center px-4 py-6">
        <HeroSlotMachine variant="home" />
      </div>

      <motion.div
        className="absolute bottom-[12%] left-[4%] z-20 hidden sm:flex items-end"
        initial={false}
      >
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
      </motion.div>

      <motion.div
        className="absolute bottom-[9%] right-[5%] z-20 hidden sm:block"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <CasinoChip color="casino-chip--gold" value="100" />
      </motion.div>

      <motion.div
        className="home-hero-roulette absolute -bottom-2 -left-2 z-10 hidden sm:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        aria-hidden
      />
    </div>
  );
}
