import type { Metadata } from 'next';
import './globals.css';
import { HostelProvider } from '@/context/HostelContext';

export const metadata: Metadata = {
  title: 'Mushia Hostel - KNUST Kumasi | Premium Student Living',
  description: 'Book your modern, air-conditioned hostel room at Mushia Hostel, KNUST Kumasi. Live inventory, flexible bed-space options, study lounges, and 24/7 power backup.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#F4EFE7] text-[#2A2827] antialiased">
        <HostelProvider>
          {children}
        </HostelProvider>
      </body>
    </html>
  );
}
