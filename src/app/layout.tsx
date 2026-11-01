import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Salman Sayyed — Full Stack Developer',
    template: '%s — Salman Sayyed',
  },
  description:
    'Full stack developer, frontend-heavy. 7.8+ years building enterprise web apps with React, Next.js and TypeScript, most recently as UI Lead.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-dvh flex-col overflow-x-clip">{children}</body>
    </html>
  );
}
