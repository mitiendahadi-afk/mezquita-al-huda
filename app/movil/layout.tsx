import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'أوقات الصلاة — مسجد الهدى',
  description: 'أوقات الصلاة في مسجد الهدى — كوستا كالما، فويرتيفينتورا',
};

export default function MovilLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      style={{
        height: '100%',
        backgroundColor: '#0A2E26',
        display: 'flex',
        flexDirection: 'column',
        color: '#FAF7F0',
        fontFamily: "'Cairo', 'Inter', sans-serif",
        WebkitFontSmoothing: 'antialiased',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
