'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function Counter({ to, suffix = '', duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          const eased = 1 - Math.pow(1 - t, 3);
          setV(Math.round(to * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{v}{suffix}</span>;
}

const STAT_COLORS = ['gold', 'red', 'purple', 'cyan'] as const;

const STATS = [
  { value: 100, suffix: '+', label: 'iGaming pages launched' },
  { value: 7, suffix: '', label: 'Service verticals covered' },
  { value: 17, suffix: '', label: 'Licensed jurisdictions' },
  { value: 24, suffix: '/7', label: 'Engineering support' },
];

export default function HomeStats() {
  return (
    <section className="relative py-10 sm:py-16 border-y border-white/5 casino-stats-band">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className={`casino-stat-chip casino-stat-chip--${STAT_COLORS[i]} mb-2 sm:mb-3`}>
              <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
            </div>
            <p className="text-[11px] sm:text-sm text-ink-muted text-center max-w-[120px] sm:max-w-[140px] leading-snug">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
