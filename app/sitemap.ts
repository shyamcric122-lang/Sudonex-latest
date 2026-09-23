import type { MetadataRoute } from 'next';
import { getAllPaths, getPage } from '@/lib/content';

const BASE = 'https://www.sudonex.com';

const PRIORITY: Record<string, number> = {
  top: 1.0, service: 0.9, subservice: 0.8, solution: 0.8,
  industry: 0.7, casestudy: 0.7, resource: 0.7, geo: 0.6,
};
const FREQ: Record<string, MetadataRoute.Sitemap[0]['changeFrequency']> = {
  top: 'weekly', service: 'weekly', subservice: 'monthly', solution: 'monthly',
  industry: 'monthly', casestudy: 'monthly', resource: 'monthly', geo: 'monthly',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().slice(0, 10);
  return getAllPaths().map((p) => {
    const layer = getPage(p)?.layer || 'top';
    return {
      url: `${BASE}${p}`,
      lastModified: today,
      changeFrequency: FREQ[layer] ?? 'monthly',
      priority: PRIORITY[layer] ?? 0.5,
    };
  });
}
