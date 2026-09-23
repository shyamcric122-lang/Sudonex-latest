'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NAV } from '@/lib/content';
import { Building2, Trophy, Rocket, Bitcoin, Layers, Briefcase } from 'lucide-react';

const ICONS: Record<string, any> = {
  '/industries/online-casino-operators/': Building2,
  '/industries/sports-betting-operators/': Trophy,
  '/industries/igaming-startups/': Rocket,
  '/industries/crypto-gambling-platforms/': Bitcoin,
  '/industries/game-aggregators/': Layers,
  '/industries/investors-enterprises/': Briefcase,
};

export default function IndustriesStrip() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">Who We Work With</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">Built for every <span className="accent-gradient-text">iGaming role</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {NAV.industries.map((it, i) => {
            const Icon = ICONS[it.path] || Building2;
            return (
              <motion.div key={it.path} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link href={it.path} className="glow-card flex flex-col items-center text-center p-6 h-full group">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/25 grid place-items-center mb-3 group-hover:bg-purple-500 group-hover:border-purple-500 transition-all">
                    <Icon size={20} className="text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-white">{it.label}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
