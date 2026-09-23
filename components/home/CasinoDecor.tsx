'use client';

const SUITS = [
  { char: '♠', color: '#a78bfa' },
  { char: '♥', color: '#f472b6' },
  { char: '♦', color: '#e879f9' },
  { char: '♣', color: '#c084fc' },
] as const;

/** Inner pages — centered hero with background image */
export function PageHeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="page-hero-image absolute inset-0" />
      <div className="page-hero-overlay absolute inset-0" />
      <div className="home-hero-topline" />
    </div>
  );
}

/** Home hero — clean dark left, soft green glow on right only */
export function HomeHeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="home-hero-bg absolute inset-0" />
      <div className="home-hero-topline" />
      <div className="home-hero-right-glow absolute top-[8%] bottom-[8%] right-0 w-[55%] hidden lg:block" />
    </div>
  );
}

/** Other pages — subtle purple backdrop */
export function CasinoHeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="casino-hero-bg absolute inset-0" />
      <div className="casino-neon-top" />
      <div className="casino-table-glow absolute top-[10%] bottom-[5%] right-0 w-[58%] hidden lg:block" />
    </div>
  );
}

export function CasinoSectionDivider() {
  return (
    <div className="casino-divider max-w-7xl mx-auto px-6" aria-hidden>
      <span className="casino-divider-line" />
      <span className="casino-divider-suits">
        {SUITS.map(s => (
          <span key={s.char} style={{ color: s.color }}>{s.char}</span>
        ))}
      </span>
      <span className="casino-divider-line" />
    </div>
  );
}
