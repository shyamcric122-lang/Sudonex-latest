'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import { HomeHeroDecor, PageHeroDecor } from '@/components/home/CasinoDecor';
import CasinoGamesVisual from '@/components/home/CasinoGamesVisual';

export default function AnimatedHero({
  eyebrow, title, subtitle, primaryCta, secondaryCta,
  accentTheme = true, casinoTheme = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  accentTheme?: boolean;
  casinoTheme?: boolean;
}) {
  const words = title.split(' ');
  const highlightStart = Math.floor(words.length / 2);
  const themed = accentTheme || casinoTheme;

  const badge = eyebrow && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="home-hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium w-fit"
    >
      <Sparkles size={12} className="text-brand-500 shrink-0" />
      <span>{eyebrow}</span>
    </motion.div>
  );

  const heading = (
    <h1 className="font-display font-bold tracking-tight text-[2rem] leading-[1.12] sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] lg:leading-[1.08]">
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="inline-block mr-[0.25em]"
        >
          {i >= highlightStart ? (
            <span className={themed ? 'home-hero-gradient' : 'text-brand-500'}>{w}</span>
          ) : (
            <span className="text-white">{w}</span>
          )}
        </motion.span>
      ))}
    </h1>
  );

  const body = subtitle && (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="max-w-xl text-sm sm:text-base md:text-lg text-ink-muted leading-relaxed"
    >
      {subtitle}
    </motion.p>
  );

  const actions = (primaryCta || secondaryCta) && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className={`flex flex-col sm:flex-row gap-3 w-full sm:w-auto ${
        casinoTheme ? 'justify-start' : 'justify-center'
      }`}
    >
      {primaryCta && (
        <Link
          href={primaryCta.href}
          className={`w-full sm:w-auto justify-center ${themed ? 'btn-primary btn-hero-cta' : 'btn-primary'}`}
        >
          {primaryCta.label} <ArrowRight size={16} />
        </Link>
      )}
      {secondaryCta && (
        <Link href={secondaryCta.href} className="btn-secondary w-full sm:w-auto justify-center">
          {secondaryCta.label}
        </Link>
      )}
    </motion.div>
  );

  const trust = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
      className={
        casinoTheme
          ? 'flex flex-wrap gap-x-6 gap-y-2.5 text-xs text-ink-dim'
          : 'page-hero-trust text-xs text-white/55'
      }
    >
      <div className="flex items-center gap-2">
        <ShieldCheck size={14} className="text-brand-500 shrink-0" /> GLI-19 / iTech ready
      </div>
      <div className="flex items-center gap-2">
        <Cpu size={14} className="text-brand-500 shrink-0" /> Modern stack
      </div>
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-brand-500 shrink-0" /> MGA / UKGC fluent
      </div>
    </motion.div>
  );

  return (
    <section
      className={`relative overflow-x-hidden pt-6 sm:pt-8 lg:pt-12 pb-10 sm:pb-16 lg:pb-20 ${
        casinoTheme ? 'home-hero-section' : themed ? 'page-hero-section' : ''
      }`}
    >
      {casinoTheme ? (
        <HomeHeroDecor />
      ) : themed ? (
        <PageHeroDecor />
      ) : (
        <>
          <div className="hero-curve-orange w-[600px] h-[600px] -top-[200px] -right-[150px] opacity-80" style={{ borderRadius: '50% 0 50% 50%' }} />
          <div className="hero-curve-dark w-[500px] h-[500px] top-[100px] -right-[100px] opacity-90" style={{ borderRadius: '50% 50% 0 50%' }} />
          <div className="absolute top-0 right-0 w-1/2 h-full dot-grid opacity-40 pointer-events-none" />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {casinoTheme ? (
          <div className="home-hero-grid">
            <div className="home-hero-badge-area">{badge}</div>
            <div className="home-hero-content-area flex flex-col gap-5 sm:gap-6 text-left">
              {heading}
              {body}
              {actions}
            </div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="home-hero-visual-area"
            >
              <CasinoGamesVisual />
            </motion.div>
            <div className="home-hero-trust-area">{trust}</div>
          </div>
        ) : (
          <div className="page-hero-content">
            {badge}
            {heading}
            {body}
            {actions}
            {trust}
          </div>
        )}
      </div>
    </section>
  );
}
