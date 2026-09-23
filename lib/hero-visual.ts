export type CasinoHeroScene =
  | 'slots'
  | 'cards'
  | 'roulette'
  | 'dice'
  | 'mobile'
  | 'chips'
  | 'poker';

const VARIED: CasinoHeroScene[] = ['slots', 'cards', 'roulette', 'dice', 'mobile', 'chips', 'poker'];

function varied(path: string): CasinoHeroScene {
  let h = 0;
  for (let i = 0; i < path.length; i++) h = (h * 31 + path.charCodeAt(i)) | 0;
  return VARIED[Math.abs(h) % VARIED.length];
}

export function getHeroVisual(path: string, layer: string): CasinoHeroScene {
  if (path === '/contact/') return 'mobile';
  if (path === '/about-us/') return 'cards';
  if (path === '/services/') return 'slots';
  if (layer === 'subservice') return varied(path);
  if (path === '/solutions/') return 'roulette';
  if (layer === 'solution') return varied(path);
  if (path === '/industries/') return 'chips';
  if (layer === 'industry') return varied(path);
  if (path === '/case-studies/') return 'poker';
  if (layer === 'casestudy') return 'poker';
  if (layer === 'geo') return 'roulette';
  if (layer === 'resource') return 'dice';
  if (layer === 'service') return varied(path);
  return varied(path);
}
