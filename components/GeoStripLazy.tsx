'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Globe2 } from 'lucide-react';

/**
 * Defers the heavy GeoStrip (which pulls in react-globe.gl / three via
 * InteractiveGlobe) until it scrolls near the viewport.
 *
 * We import GeoStrip imperatively inside an effect rather than via
 * next/dynamic. next/dynamic declarations are collected during SSR and their
 * chunks are preloaded as <script async> on initial load — that is exactly the
 * ~847KB three chunk we want to keep OUT of the first paint. A plain runtime
 * import() is only fetched when the effect runs (i.e. on scroll), so three is
 * never part of the initial page load. Until then we show a static, WebGL-free
 * placeholder that occupies the same space (no layout shift).
 */
export default function GeoStripLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [GeoStrip, setGeoStrip] = useState<ComponentType | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let mounted = true;
    const load = () => {
      import('@/components/GeoStrip').then(mod => {
        if (mounted) setGeoStrip(() => mod.default);
      });
    };

    if (typeof IntersectionObserver === 'undefined') {
      load();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => {
      mounted = false;
      io.disconnect();
    };
  }, []);

  return <div ref={ref}>{GeoStrip ? <GeoStrip /> : <GeoStripPlaceholder />}</div>;
}

/** Lightweight, dependency-free placeholder that mirrors GeoStrip's layout. */
function GeoStripPlaceholder() {
  return (
    <section className="py-12 overflow-hidden" aria-hidden>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs text-brand-400 mb-3">
            <Globe2 size={12} /> Global delivery
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-white">
            Where we build <span className="text-brand-500">iGaming</span>
          </h2>
          <p className="text-ink-muted text-sm">
            Licensed-jurisdiction expertise across 17 markets — hover a country to see it on the globe.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 max-w-3xl mx-auto">
          {/* Reserve top marquee row height */}
          <div className="h-10 w-full" />

          {/* Static globe — same box as InteractiveGlobe (no WebGL, no shift) */}
          <div className="relative w-full aspect-square mx-auto" style={{ maxWidth: 360 }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden>
              <defs>
                <pattern id="geostrip-dots" width="2.2" height="2.2" patternUnits="userSpaceOnUse">
                  <circle cx="0.55" cy="0.55" r="0.35" fill="rgba(255,255,255,0.22)" />
                </pattern>
              </defs>
              <circle cx="50" cy="50" r="48" fill="url(#geostrip-dots)" />
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.2" />
              <ellipse cx="50" cy="50" rx="48" ry="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.15" />
              <ellipse cx="50" cy="50" rx="48" ry="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.15" />
              <ellipse cx="50" cy="50" rx="15" ry="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.15" />
            </svg>
          </div>

          {/* Reserve bottom marquee row height */}
          <div className="h-10 w-full" />
        </div>
      </div>
    </section>
  );
}
