import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://gethandled.com'),
  title: {
    default: 'Handled - Your Financial Copilot',
    template: '%s | Handled',
  },
  description: 'Stop feeling behind on your finances. Handled gives you personalized tasks, AI guidance, and document analysis to help you get organized and stay on track.',
  keywords: ['personal finance', 'financial planning', 'money management', 'AI assistant', 'financial tasks'],
  authors: [{ name: 'Handled' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gethandled.com',
    siteName: 'Handled',
    title: 'Handled - Your Financial Copilot',
    description: 'Stop feeling behind on your finances. Personalized tasks, AI guidance, and document analysis.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Handled - Your Financial Copilot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Handled - Your Financial Copilot',
    description: 'Stop feeling behind on your finances. Personalized tasks, AI guidance, and document analysis.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="min-h-screen bg-surface-cream font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
