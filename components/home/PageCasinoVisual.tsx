'use client';

import { motion } from 'framer-motion';
import type { JSX, ReactNode } from 'react';
import type { CasinoHeroScene } from '@/lib/hero-visual';
import {
  CasinoChip,
  Dice,
  HeroSlotMachine,
  PageCasinoFrame,
  PlayingCard,
} from '@/components/home/casino-shared';

const HOME_CARD = { spade: '#1a1a1a', heart: '#f43f5e' } as const;

function SceneStage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`casino-scene-stage ${className}`}>
      {children}
    </div>
  );
}

function CornerDecor() {
  return (
    <>
      <motion.div className="absolute top-[7%] left-[4%] z-20 hidden sm:block" animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <PlayingCard suit="♠" rank="A" color={HOME_CARD.spade} rotate={-14} className="casino-playing-card--corner" />
      </motion.div>
      <motion.div className="absolute top-[5%] right-[5%] z-20 hidden sm:block" animate={{ y: [0, -4, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}>
        <PlayingCard suit="♥" rank="K" color={HOME_CARD.heart} rotate={18} className="casino-playing-card--corner" />
      </motion.div>
      <motion.div className="absolute bottom-[11%] left-[4%] z-20 hidden sm:flex items-end">
        <motion.div className="origin-bottom-right" animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <Dice value={6} className="casino-dice--md" />
        </motion.div>
        <motion.div className="-ml-2 origin-bottom-left" animate={{ rotate: [0, -6, 6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
          <Dice value={3} className="casino-dice--md" />
        </motion.div>
      </motion.div>
      <motion.div className="absolute bottom-[9%] right-[5%] z-20 hidden sm:block" animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
        <CasinoChip color="casino-chip--gold" value="100" size={48} />
      </motion.div>
    </>
  );
}

function SlotsScene() {
  return (
    <PageCasinoFrame>
      <CornerDecor />
      <SceneStage>
        <HeroSlotMachine variant="home" />
      </SceneStage>
      <motion.div className="home-hero-roulette absolute -bottom-2 -left-2 z-10 hidden sm:block" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} aria-hidden />
    </PageCasinoFrame>
  );
}

function CardsScene() {
  const hand = [
    { suit: '♠', rank: 'A', color: HOME_CARD.spade, rotate: -32, x: -88 },
    { suit: '♥', rank: 'K', color: HOME_CARD.heart, rotate: -16, x: -44 },
    { suit: '♦', rank: 'Q', color: '#f43f5e', rotate: 0, x: 0 },
    { suit: '♣', rank: 'J', color: '#1a1a1a', rotate: 16, x: 44 },
    { suit: '♠', rank: '10', color: HOME_CARD.spade, rotate: 32, x: 88 },
  ];

  return (
    <PageCasinoFrame>
      <SceneStage>
        <motion.div
          className="relative flex items-center justify-center w-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {hand.map((card, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `calc(50% + ${card.x}px)`, transform: 'translateX(-50%)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <PlayingCard {...card} className="casino-playing-card--hero" />
            </motion.div>
          ))}
        </motion.div>
      </SceneStage>
      <motion.div className="absolute bottom-[9%] right-[5%] z-20" animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <CasinoChip color="casino-chip--gold" value="500" size={52} />
      </motion.div>
      <motion.div className="home-hero-roulette absolute -bottom-2 -left-2 z-10 hidden sm:block" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} aria-hidden />
    </PageCasinoFrame>
  );
}

function RouletteScene() {
  return (
    <PageCasinoFrame>
      <SceneStage>
        <motion.div
          className="home-hero-roulette home-hero-roulette--hero"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          aria-hidden
        />
      </SceneStage>
      <motion.div className="absolute top-[10%] left-[6%] z-20 hidden sm:block" animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <Dice value={5} className="casino-dice--md" />
      </motion.div>
      <motion.div className="absolute bottom-[10%] right-[6%] z-20 flex -space-x-2">
        <CasinoChip color="casino-chip--gold" value="25" size={46} />
        <CasinoChip color="casino-chip--red" value="50" size={46} />
        <CasinoChip color="casino-chip--orange" value="100" size={46} />
      </motion.div>
    </PageCasinoFrame>
  );
}

function DiceScene() {
  return (
    <PageCasinoFrame>
      <SceneStage>
        <div className="flex items-center justify-center gap-4 sm:gap-5">
          {[6, 1, 3].map((v, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -12, 0], rotate: [0, 12, -12, 0] }}
              transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            >
              <Dice value={v} className="casino-dice--hero" />
            </motion.div>
          ))}
        </div>
      </SceneStage>
      <motion.div className="absolute top-[8%] right-[6%] z-20 hidden sm:block" animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <PlayingCard suit="♥" rank="A" color={HOME_CARD.heart} rotate={12} className="casino-playing-card--corner" />
      </motion.div>
      <motion.div className="absolute bottom-[9%] right-[5%] z-20" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
        <CasinoChip color="casino-chip--gold" value="250" size={54} />
      </motion.div>
    </PageCasinoFrame>
  );
}

function MobileScene() {
  const symbols = ['7', '♦', '★'];
  return (
    <PageCasinoFrame>
      <SceneStage>
        <motion.div
          className="casino-mobile-device casino-mobile-device--hero"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="casino-mobile-notch" />
          <div className="casino-mobile-screen">
            <span className="casino-mobile-title">MOBILE SLOTS</span>
            <div className="casino-mobile-reels">
              {symbols.map((sym, i) => (
                <motion.div
                  key={i}
                  className="casino-mobile-reel"
                  animate={{ y: ['0%', '-200%'] }}
                  transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                >
                  {[sym, 'BAR', sym, '7', sym].map((s, j) => (
                    <span key={j} className="casino-mobile-symbol">{s}</span>
                  ))}
                </motion.div>
              ))}
            </div>
            <motion.div className="casino-mobile-spin" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>
              SPIN
            </motion.div>
          </div>
        </motion.div>
      </SceneStage>
      <motion.div className="absolute bottom-[10%] left-[6%] z-20 hidden sm:block" animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <CasinoChip color="casino-chip--gold" value="10" size={48} />
      </motion.div>
      <motion.div className="absolute top-[8%] right-[6%] z-20 hidden sm:block" animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
        <Dice value={3} className="casino-dice--md" />
      </motion.div>
    </PageCasinoFrame>
  );
}

function ChipsScene() {
  const stack = [
    { color: 'casino-chip--gold', value: '100' },
    { color: 'casino-chip--red', value: '50' },
    { color: 'casino-chip--orange', value: '25' },
    { color: 'casino-chip--green', value: '10' },
    { color: 'casino-chip--gold', value: '5' },
  ];

  return (
    <PageCasinoFrame>
      <SceneStage>
        <motion.div
          className="casino-chip-stack casino-chip-stack--hero"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {stack.map((chip, i) => (
            <motion.div
              key={i}
              className="casino-chip--stacked"
              animate={{ x: [0, i % 2 === 0 ? 4 : -4, 0] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
            >
              <CasinoChip color={chip.color} value={chip.value} size={60} />
            </motion.div>
          ))}
        </motion.div>
      </SceneStage>
      <motion.div className="absolute top-[8%] right-[6%] z-20 hidden sm:block" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
        <div className="casino-roulette-mini casino-roulette-mini--md" />
      </motion.div>
      <motion.div className="absolute bottom-[10%] left-[6%] z-20 hidden sm:block" animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
        <PlayingCard suit="♠" rank="K" color={HOME_CARD.spade} rotate={-10} className="casino-playing-card--corner" />
      </motion.div>
    </PageCasinoFrame>
  );
}

function PokerScene() {
  const community = [
    { suit: '♠', rank: 'A', color: HOME_CARD.spade },
    { suit: '♥', rank: 'K', color: HOME_CARD.heart },
    { suit: '♦', rank: 'Q', color: '#f43f5e' },
    { suit: '♣', rank: 'J', color: '#1a1a1a' },
    { suit: '♠', rank: '10', color: HOME_CARD.spade },
  ];

  return (
    <PageCasinoFrame>
      <SceneStage className="casino-scene-stage--tight">
        <motion.div
          className="casino-poker-felt casino-poker-felt--home"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex gap-2 sm:gap-2.5 justify-center">
            {community.map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}>
                <PlayingCard {...card} rotate={0} className="casino-playing-card--table" />
              </motion.div>
            ))}
          </div>
          <motion.p className="casino-poker-label" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
            ROYAL FLUSH
          </motion.p>
        </motion.div>
        <div className="flex gap-4 mt-3">
          <PlayingCard suit="♥" rank="A" color={HOME_CARD.heart} rotate={-8} className="casino-playing-card--table" />
          <PlayingCard suit="♠" rank="K" color={HOME_CARD.spade} rotate={8} className="casino-playing-card--table" />
        </div>
      </SceneStage>
      <motion.div className="absolute bottom-[8%] right-[6%] z-20" animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <CasinoChip color="casino-chip--gold" value="1K" size={54} />
      </motion.div>
    </PageCasinoFrame>
  );
}

const SCENES: Record<CasinoHeroScene, () => JSX.Element> = {
  slots: SlotsScene,
  cards: CardsScene,
  roulette: RouletteScene,
  dice: DiceScene,
  mobile: MobileScene,
  chips: ChipsScene,
  poker: PokerScene,
};

export default function PageCasinoVisual({ scene }: { scene: CasinoHeroScene }) {
  const Scene = SCENES[scene] ?? SCENES.slots;
  return <Scene />;
}
