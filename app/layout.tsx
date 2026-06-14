import type { Metadata } from 'next';
import './globals.css';
import SafetyReload from '@/components/SafetyReload';

export const metadata: Metadata = {
  title: 'مسجد الهدى - كوستا كالما | Mezquita Al Huda Costa Calma',
  description: 'شاشة عرض مسجد الهدى - الرابطة الإسلامية الهدى كوستا كالما',
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=1366, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0A2E26" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <link rel="icon" type="image/png" href="/icons/logo.png" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;900&family=Reem+Kufi:wght@500;700&family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-deep text-text-primary overflow-hidden w-screen h-screen">
        <SafetyReload />
        {children}
      </body>
    </html>
  );
}
