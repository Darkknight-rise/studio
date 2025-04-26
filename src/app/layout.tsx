import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter font for a modern feel
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import { cn } from '@/lib/utils';
import SiteHeader from '@/components/site-header'; // Import SiteHeader

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'FoodConnect - Zero Waste Zero Hunger',
  description: 'Connecting food donors with receivers to reduce waste and fight hunger.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          {/* Add Footer component here if needed */}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
