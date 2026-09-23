import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { organizationSchema } from '@/lib/authors';
import { ContactModalProvider } from '@/components/ContactModal';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sudonex.com'),
  title: { default: 'Sudonex | iGaming Development Company', template: '%s' },
  description: 'iGaming development built for operators who take compliance seriously. Casino apps, slot games, sports exchanges, MVP-to-scale builds.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon-192x192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  openGraph: { type: 'website', siteName: 'Sudonex' },
  twitter: { card: 'summary_large_image' },
  verification: {
    google: 'pU6azMxrGi8f69yZzdu-MYeavxCeqMwRXj5P5naBgZA',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context':'https://schema.org','@type':'WebSite',
          name:'Sudonex', url:'https://www.sudonex.com',
          potentialAction:{ '@type':'SearchAction', target:'https://www.sudonex.com/?q={query}', 'query-input':'required name=query' }
        }) }} />
      </head>
      <body className="antialiased site-theme">
        <ContactModalProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </ContactModalProvider>
      </body>
      <GoogleAnalytics gaId="G-KRGSCC1P3Z" />
    </html>
  );
}
